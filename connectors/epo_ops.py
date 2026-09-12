import os
import time
import requests
from typing import List, Optional
from connectors.base import BasePatentConnector
from schemas.retrieval import PriorArtCandidate


class EpoOpsConnector(BasePatentConnector):
    """EPO Open Patent Services (OPS) API connector for European patent searching."""

    def __init__(
        self,
        consumer_key: Optional[str] = None,
        consumer_secret: Optional[str] = None,
        timeout: int = 8
    ):
        self.consumer_key = consumer_key or os.getenv("EPO_CONSUMER_KEY")
        self.consumer_secret = consumer_secret or os.getenv("EPO_CONSUMER_SECRET")
        self.timeout = timeout
        self._token: Optional[str] = None
        self._token_expiry: float = 0.0

    @property
    def source_name(self) -> str:
        return "epo_ops"

    def _get_access_token(self) -> Optional[str]:
        """Fetch OAuth2 token from EPO OPS using free developer credentials."""
        if not self.consumer_key or not self.consumer_secret:
            return None

        if self._token and time.time() < self._token_expiry:
            return self._token

        auth_url = "https://ops.epo.org/3.2/auth/accesstoken.do"
        try:
            resp = requests.post(
                auth_url,
                data={"grant_type": "client_credentials"},
                auth=(self.consumer_key, self.consumer_secret),
                timeout=self.timeout
            )
            if resp.status_code == 200:
                data = resp.json()
                self._token = data.get("access_token")
                expires_in = int(data.get("expires_in", 1200))
                self._token_expiry = time.time() + expires_in - 60
                return self._token
        except Exception:
            pass
        return None

    def search(
        self,
        query: str,
        limit: int = 5,
        ipc_classes: Optional[List[str]] = None
    ) -> List[PriorArtCandidate]:
        token = self._get_access_token()
        if not token:
            return []

        search_url = "https://ops.epo.org/3.2/rest-services/published-data/search"
        cql_query = f'ta="{query}"'
        if ipc_classes:
            classes_cql = " or ".join([f'ic="{c}"' for c in ipc_classes[:2]])
            cql_query = f'({cql_query}) and ({classes_cql})'

        headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/json"
        }

        try:
            resp = requests.get(
                search_url,
                params={"q": cql_query, "Range": f"1-{limit}"},
                headers=headers,
                timeout=self.timeout
            )
            if resp.status_code != 200:
                return []

            data = resp.json()
            results: List[PriorArtCandidate] = []
            # Parse OPS JSON search response structure
            ops_results = (
                data.get("ops:world-patent-data", {})
                .get("ops:biblio-search", {})
                .get("ops:search-result", {})
                .get("ops:publication-reference", [])
            )
            if isinstance(ops_results, dict):
                ops_results = [ops_results]

            for pub in ops_results[:limit]:
                doc_num = pub.get("@doc-number", "EP-Unknown")
                country = pub.get("@country", "EP")
                full_id = f"{country}-{doc_num}"
                results.append(
                    PriorArtCandidate(
                        doc_id=full_id,
                        title=f"European Patent Publication {full_id}",
                        abstract="Abstract retrieved from EPO OPS bibliographic record.",
                        relevant_passage=f"Matched publication reference {full_id} under CQL query: {query}",
                        source="epo_ops",
                        publication_date=None,
                        url=f"https://worldwide.espacenet.com/patent/search/family/en/publication/{full_id}",
                        ipc_cpc_classes=ipc_classes or []
                    )
                )
            return results
        except Exception:
            return []
