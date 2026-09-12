from typing import List, Dict, Optional
from schemas.disclosure import ParsedDisclosure
from schemas.retrieval import RetrievalOutput, PriorArtCandidate
from schemas.clustering import NoveltyClusteringOutput, ElementNoveltyCluster
from schemas.report import (
    PriorArtReport,
    ElementReportSection,
    Citation,
    MANDATORY_LEGAL_DISCLAIMER
)
from agents.llm_client import LLMClient


class ReportWriterAgent:
    """Agent 4: Synthesizes preliminary patentability screening report with verified citations."""

    def __init__(self, llm_client: Optional[LLMClient] = None):
        self.llm = llm_client or LLMClient()

    def generate_report(
        self,
        parsed_disclosure: ParsedDisclosure,
        retrieval_output: RetrievalOutput,
        clustering_output: NoveltyClusteringOutput
    ) -> PriorArtReport:
        """Produce the explainable memo enforcing citation traceability and disclaimers."""
        
        # Build candidate lookup for strict verification
        candidate_lookup: Dict[str, PriorArtCandidate] = {}
        for el_res in retrieval_output.element_results.values():
            for cand in el_res.candidates:
                candidate_lookup[cand.doc_id] = cand

        citation_counter = 1
        all_citations: List[Citation] = []
        element_sections: List[ElementReportSection] = []

        for element in parsed_disclosure.claim_elements:
            cluster = clustering_output.element_clusters.get(element.element_id)
            if not cluster:
                continue

            section_citations: List[Citation] = []
            findings_parts: List[str] = []

            for scored_art in cluster.ranked_prior_art[:3]:
                # Verify existence in retrieval results (non-negotiable traceability rule)
                if scored_art.doc_id not in candidate_lookup:
                    continue

                cand = candidate_lookup[scored_art.doc_id]
                cit_id = f"[Cit-{citation_counter}]"
                citation_counter += 1

                citation_obj = Citation(
                    citation_id=cit_id,
                    doc_id=cand.doc_id,
                    title=cand.title,
                    cited_passage=scored_art.matched_passage or cand.relevant_passage,
                    source=cand.source,
                    url=cand.url
                )
                section_citations.append(citation_obj)
                all_citations.append(citation_obj)

                findings_parts.append(
                    f"{cit_id} ({cand.doc_id} - '{cand.title}') poses {scored_art.threat_level.upper()} threat: "
                    f"{scored_art.rationale} "
                    f"Relevant passage disclosed: \"{citation_obj.cited_passage}\""
                )

            if not findings_parts:
                findings_parts.append("No directly conflicting prior art references were identified for this claim element in public databases.")

            element_sections.append(
                ElementReportSection(
                    element_id=element.element_id,
                    element_title=element.title,
                    element_description=element.description,
                    risk_level=cluster.overall_element_risk,
                    findings_analysis="\n\n".join(findings_parts),
                    distinguishing_features=cluster.novelty_gap_summary,
                    citations=section_citations
                )
            )

        # Strategic recommendations
        refinements = []
        for sec in element_sections:
            if sec.risk_level in ["high", "moderate"]:
                refinements.append(
                    f"For Element '{sec.element_title}': Emphasize non-obvious limitations distinct from cited art ({', '.join([c.doc_id for c in sec.citations])})."
                )
        if not refinements:
            refinements.append("All claim elements show strong novelty gaps against searched databases.")

        # Executive summary
        exec_summary = (
            f"Preliminary prior-art screening for '{parsed_disclosure.title}' across {len(parsed_disclosure.claim_elements)} "
            f"decomposed claim elements indicates an overall novelty risk profile of {clustering_output.overall_invention_risk.upper()}. "
            f"A total of {len(all_citations)} relevant prior-art references were identified and analyzed against specific claim limitations."
        )

        return PriorArtReport(
            title=f"Preliminary Patentability Screening Report: {parsed_disclosure.title}",
            disclaimer=MANDATORY_LEGAL_DISCLAIMER,
            executive_summary=exec_summary,
            overall_novelty_risk=clustering_output.overall_invention_risk,
            element_sections=element_sections,
            all_citations=all_citations,
            recommended_refinements=refinements
        )
