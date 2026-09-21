import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Optional
from schemas.disclosure import ParsedDisclosure, ClaimElement
from schemas.retrieval import RetrievalOutput, ElementRetrievalResult, PriorArtCandidate
from connectors.base import BasePatentConnector
from connectors.google_patents import GooglePatentsConnector
from connectors.epo_ops import EpoOpsConnector
from connectors.semantic_scholar import SemanticScholarConnector
from connectors.mock_index import MockPatentIndexConnector


PATENT_LEXICON_SYNONYMS = {
    "motor": ["electromagnetic actuator", "rotary drive", "brushless stator"],
    "propeller": ["rotor blade assembly", "aerodynamic foil", "airfoil member"],
    "sensor": ["transducer", "sensing element", "detector array"],
    "bearing": ["rotational support", "anti-friction bearing", "journal assembly"],
    "comparator": ["differential voltage comparator", "threshold detector circuit"],
    "piezoelectric": ["piezo-transducer", "electro-mechanical transducer", "acoustic resonator"],
    "switch": ["gating transistor", "switching element", "semiconductor switch"],
    "linkage": ["articulated member", "coupling mechanism", "pushrod assembly"],
    "battery": ["energy storage cell", "electrochemical power source"],
}


class RetrievalAgent:
    """Agent 2: Retrieves patent & literature candidates per individual claim element with patent lexicon expansion."""

    def __init__(self, connectors: Optional[List[BasePatentConnector]] = None):
        if connectors is not None:
            self.connectors = connectors
        else:
            # Default ensemble of free & local connectors
            self.connectors = [
                GooglePatentsConnector(),
                SemanticScholarConnector(),
                EpoOpsConnector(),
                MockPatentIndexConnector()
            ]

    def retrieve(self, parsed_disclosure: ParsedDisclosure, top_k_per_element: int = 5) -> RetrievalOutput:
        """Search literature and patents in parallel for EACH claim element."""
        element_results: Dict[str, ElementRetrievalResult] = {}
        total_candidates = 0

        elements = parsed_disclosure.claim_elements
        if not elements:
            return RetrievalOutput(element_results={}, total_candidates=0)

        # Execute searches concurrently across claim elements for 3-5x lower latency
        max_workers = min(len(elements), 6)
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_elem = {
                executor.submit(self._retrieve_for_element, el, top_k_per_element): el.element_id
                for el in elements
            }
            for future in as_completed(future_to_elem):
                el_id = future_to_elem[future]
                try:
                    result = future.result()
                    element_results[el_id] = result
                    total_candidates += len(result.candidates)
                except Exception:
                    element_results[el_id] = ElementRetrievalResult(
                        element_id=el_id,
                        query_used="",
                        candidates=[]
                    )

        # Preserve original sequential order of claim elements
        sorted_results = {
            el.element_id: element_results.get(
                el.element_id,
                ElementRetrievalResult(element_id=el.element_id, query_used="", candidates=[])
            )
            for el in elements
        }

        return RetrievalOutput(
            element_results=sorted_results,
            total_candidates=total_candidates
        )

    def _expand_query(self, query_terms: List[str]) -> List[str]:
        """Expand terms with patent-specific legal and technical synonyms."""
        expanded = list(query_terms)
        for term in query_terms:
            t_lower = term.lower()
            for key, syns in PATENT_LEXICON_SYNONYMS.items():
                if key in t_lower:
                    expanded.extend(syns[0].split())
        return list(dict.fromkeys(expanded))

    def _retrieve_for_element(self, element: ClaimElement, limit: int = 5) -> ElementRetrievalResult:
        # Build comprehensive query terms from title and search keywords
        title_terms = [w.lower() for w in re.findall(r"\b[A-Za-z0-9\-]{3,}\b", element.title)]
        desc_terms = element.search_keywords if element.search_keywords else []
        base_terms = list(dict.fromkeys(title_terms + desc_terms))
        expanded_terms = self._expand_query(base_terms)
        query_str = " ".join(expanded_terms[:10])
        
        seen_doc_ids = set()
        candidates: List[PriorArtCandidate] = []

        for connector in self.connectors:
            try:
                found_docs = connector.search(
                    query=query_str,
                    limit=limit,
                    ipc_classes=element.ipc_cpc_classes
                )
                for doc in found_docs:
                    if doc.doc_id not in seen_doc_ids:
                        seen_doc_ids.add(doc.doc_id)
                        candidates.append(doc)
            except Exception:
                continue

            if len(candidates) >= limit:
                break

        # If candidates exceed limit, keep top limit
        return ElementRetrievalResult(
            element_id=element.element_id,
            query_used=query_str,
            candidates=candidates[:limit]
        )
