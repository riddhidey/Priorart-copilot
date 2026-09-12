import os
import requests
from typing import List, Optional
from connectors.base import BasePatentConnector
from schemas.retrieval import PriorArtCandidate


class SemanticScholarConnector(BasePatentConnector):
    """Free Non-Patent Literature connector using Semantic Scholar Graph API."""

    def __init__(self, api_key: Optional[str] = None, timeout: int = 8):
        self.api_key = api_key or os.getenv("SEMANTIC_SCHOLAR_API_KEY")
        self.base_url = "https://api.semanticscholar.org/graph/v1/paper/search"
        self.timeout = timeout

    @property
    def source_name(self) -> str:
        return "semantic_scholar"

    def search(
        self,
        query: str,
        limit: int = 5,
        ipc_classes: Optional[List[str]] = None
    ) -> List[PriorArtCandidate]:
        headers = {}
        if self.api_key:
            headers["x-api-key"] = self.api_key

        params = {
            "query": query,
            "limit": limit,
            "fields": "paperId,title,abstract,year,url,tldr"
        }

        try:
            response = requests.get(
                self.base_url,
                params=params,
                headers=headers,
                timeout=self.timeout
            )
            if response.status_code != 200:
                return []

            data = response.json()
            papers = data.get("data", [])
            results: List[PriorArtCandidate] = []

            for p in papers:
                title = p.get("title") or "Untitled Publication"
                abstract = p.get("abstract") or ""
                tldr = p.get("tldr") or {}
                passage = tldr.get("text") or (abstract[:300] if abstract else "Abstract not available.")
                doc_id = f"S2-{p.get('paperId', 'unknown')[:10]}"
                year = str(p.get("year", "")) if p.get("year") else None

                results.append(
                    PriorArtCandidate(
                        doc_id=doc_id,
                        title=title,
                        abstract=abstract or passage,
                        relevant_passage=passage,
                        source="semantic_scholar",
                        publication_date=year,
                        url=p.get("url") or f"https://www.semanticscholar.org/paper/{p.get('paperId')}",
                        ipc_cpc_classes=[]
                    )
                )
            return results
        except Exception:
            return []
