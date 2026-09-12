import urllib.parse
from typing import List, Optional
import requests
from connectors.base import BasePatentConnector
from schemas.retrieval import PriorArtCandidate


class GooglePatentsConnector(BasePatentConnector):
    """Connector for querying Google Patents public search endpoints."""

    def __init__(self, timeout: int = 8):
        self.timeout = timeout

    @property
    def source_name(self) -> str:
        return "google_patents"

    def search(
        self,
        query: str,
        limit: int = 5,
        ipc_classes: Optional[List[str]] = None
    ) -> List[PriorArtCandidate]:
        clean_q = urllib.parse.quote_plus(query)
        search_url = f"https://patents.google.com/xhr/query?url=q%3D{clean_q}&exp="
        
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PriorArtCopilot/1.0",
                "Accept": "application/json"
            }
            resp = requests.get(search_url, headers=headers, timeout=self.timeout)
            if resp.status_code == 200:
                data = resp.json()
                clusters = data.get("results", {}).get("cluster", [])
                results: List[PriorArtCandidate] = []
                for cluster in clusters:
                    for doc in cluster.get("result", []):
                        patent_id = doc.get("patent", {}).get("publication_number")
                        if not patent_id:
                            continue
                        title = doc.get("patent", {}).get("title") or f"Patent {patent_id}"
                        snippet = doc.get("patent", {}).get("snippet") or ""
                        pub_date = doc.get("patent", {}).get("filing_date")
                        results.append(
                            PriorArtCandidate(
                                doc_id=patent_id,
                                title=title,
                                abstract=snippet,
                                relevant_passage=snippet or f"Patent disclosure addressing {query}",
                                source="google_patents",
                                publication_date=pub_date,
                                url=f"https://patents.google.com/patent/{patent_id}/en",
                                ipc_cpc_classes=ipc_classes or []
                            )
                        )
                        if len(results) >= limit:
                            return results
                if results:
                    return results
        except Exception:
            pass

        return []
