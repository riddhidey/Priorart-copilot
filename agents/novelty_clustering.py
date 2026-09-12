import json
from typing import Dict, List, Optional
from schemas.disclosure import ParsedDisclosure, ClaimElement
from schemas.retrieval import RetrievalOutput, ElementRetrievalResult, PriorArtCandidate
from schemas.clustering import NoveltyClusteringOutput, ElementNoveltyCluster, ScoredPriorArt
from agents.llm_client import LLMClient


class NoveltyClusteringAgent:
    """Agent 3: Evaluates and clusters prior art per claim element, scoring novelty threat."""

    def __init__(self, llm_client: Optional[LLMClient] = None):
        self.llm = llm_client or LLMClient()

    def cluster_and_score(
        self,
        parsed_disclosure: ParsedDisclosure,
        retrieval_output: RetrievalOutput
    ) -> NoveltyClusteringOutput:
        """Map retrieved documents to specific claim elements and score novelty risk."""
        element_map = {el.element_id: el for el in parsed_disclosure.claim_elements}
        element_clusters: Dict[str, ElementNoveltyCluster] = {}

        for element_id, el_retrieval in retrieval_output.element_results.items():
            element = element_map.get(element_id)
            if not element:
                continue

            cluster = self._cluster_element(element, el_retrieval.candidates)
            element_clusters[element_id] = cluster

        # Compute overall invention risk
        high_count = sum(1 for c in element_clusters.values() if c.overall_element_risk == "high")
        mod_count = sum(1 for c in element_clusters.values() if c.overall_element_risk == "moderate")

        if high_count >= 2 or (high_count >= 1 and len(element_clusters) <= 2):
            overall_risk = "high"
        elif high_count >= 1 or mod_count >= 1:
            overall_risk = "moderate"
        else:
            overall_risk = "low"

        return NoveltyClusteringOutput(
            element_clusters=element_clusters,
            overall_invention_risk=overall_risk
        )

    def _cluster_element(
        self,
        element: ClaimElement,
        candidates: List[PriorArtCandidate]
    ) -> ElementNoveltyCluster:
        """Score each candidate against the specific claim element."""
        if not candidates:
            return ElementNoveltyCluster(
                element_id=element.element_id,
                element_title=element.title,
                overall_element_risk="low",
                ranked_prior_art=[],
                novelty_gap_summary=f"No close prior art identified for '{element.title}'. Features appear novel."
            )

        system_instruction = (
            "You are the Novelty-Clustering Agent in a patent prior-art screening system. "
            "Evaluate candidate prior art documents specifically against the given claim element. "
            "Determine the novelty threat level (high/moderate/low) and provide a technical rationale "
            "and matched passage. Do NOT make up documents or passages."
        )

        candidates_text = "\n".join([
            f"- [{c.doc_id}] {c.title}\n  Passage: {c.relevant_passage}\n  Source: {c.source}"
            for c in candidates
        ])

        prompt = f"""
Claim Element [{element.element_id}]: {element.title}
Description: {element.description}

Candidate Prior Art Documents:
{candidates_text}

Score and rank each candidate based on how directly it reads on or anticipates this claim element.
"""

        def _fallback() -> ElementNoveltyCluster:
            return self._heuristic_clustering(element, candidates)

        try:
            return self.llm.generate_structured(
                prompt=prompt,
                system_instruction=system_instruction,
                response_model=ElementNoveltyCluster,
                fallback_factory=_fallback
            )
        except Exception:
            return self._heuristic_clustering(element, candidates)

    def _heuristic_clustering(
        self,
        element: ClaimElement,
        candidates: List[PriorArtCandidate]
    ) -> ElementNoveltyCluster:
        """Deterministic heuristic scoring of candidates against claim element."""
        scored_list: List[ScoredPriorArt] = []
        elem_keywords = set(element.search_keywords + [w.lower() for w in element.title.split()])

        for cand in candidates:
            cand_text = f"{cand.title} {cand.relevant_passage} {cand.abstract}".lower()
            match_count = sum(1 for kw in elem_keywords if kw in cand_text)
            overlap_ratio = match_count / max(1, len(elem_keywords))

            if overlap_ratio >= 0.5:
                threat = "high"
                score = round(min(0.95, 0.65 + (overlap_ratio * 0.3)), 2)
                rationale = (
                    f"Direct technical overlap with {element.title}. "
                    f"Prior art discloses corresponding features: '{cand.relevant_passage[:120]}...'"
                )
            elif overlap_ratio >= 0.25:
                threat = "moderate"
                score = round(min(0.65, 0.40 + (overlap_ratio * 0.25)), 2)
                rationale = (
                    f"Partial conceptual overlap with {element.title}. "
                    f"Discloses related mechanisms but may differ in implementation."
                )
            else:
                threat = "low"
                score = round(max(0.15, overlap_ratio * 0.35), 2)
                rationale = "Distant contextual relevance; does not substantially anticipate key claim limitations."

            scored_list.append(
                ScoredPriorArt(
                    doc_id=cand.doc_id,
                    title=cand.title,
                    matched_passage=cand.relevant_passage,
                    threat_level=threat,
                    novelty_risk_score=score,
                    rationale=rationale,
                    source=cand.source,
                    url=cand.url
                )
            )

        scored_list.sort(key=lambda x: x.novelty_risk_score, reverse=True)

        # Determine element overall risk
        highest_threat = scored_list[0].threat_level if scored_list else "low"
        
        if highest_threat == "high":
            gap = f"Prior art strongly addresses {element.title}; claim should be narrowed with distinctive structural constraints."
        elif highest_threat == "moderate":
            gap = f"Prior art shows related designs; novel combination of {element.title} parameters remains patentable."
        else:
            gap = f"High novelty gap; few prior references anticipate the specific configuration of {element.title}."

        return ElementNoveltyCluster(
            element_id=element.element_id,
            element_title=element.title,
            overall_element_risk=highest_threat,
            ranked_prior_art=scored_list,
            novelty_gap_summary=gap
        )
