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


# Agent 4: Synthesizes preliminary patentability screening report with verified citations
class ReportWriterAgent:
    """Agent 4: Synthesizes preliminary patentability screening report with verified citations."""

    def __init__(self, llm_client: Optional[LLMClient] = None):
        # Connects to the LLM client or instantiates a default client
        self.llm = llm_client or LLMClient()

    def generate_report(
        self,
        parsed_disclosure: ParsedDisclosure,
        retrieval_output: RetrievalOutput,
        clustering_output: NoveltyClusteringOutput
    ) -> PriorArtReport:
        """Produce the explainable memo enforcing citation traceability and statutory disclaimers."""
        
        # Step 1: Build candidate lookup dictionary for strict verification.
        # Rule: AI hallucinated citations are completely eliminated because every citation must exist in candidate_lookup.
        candidate_lookup: Dict[str, PriorArtCandidate] = {}
        for el_res in retrieval_output.element_results.values():
            for cand in el_res.candidates:
                candidate_lookup[cand.doc_id] = cand

        citation_counter = 1
        all_citations: List[Citation] = []
        element_sections: List[ElementReportSection] = []

        # Step 2: Iterate through each decomposed claim element in order
        for element in parsed_disclosure.claim_elements:
            cluster = clustering_output.element_clusters.get(element.element_id)
            if not cluster:
                continue

            section_citations: List[Citation] = []
            findings_parts: List[str] = []

            # Step 3: Analyze top 3 closest prior art candidates for this element
            for scored_art in cluster.ranked_prior_art[:3]:
                # Non-negotiable traceability rule: Ignore any document not verified by Retrieval Agent
                if scored_art.doc_id not in candidate_lookup:
                    continue

                cand = candidate_lookup[scored_art.doc_id]
                cit_id = f"[Cit-{citation_counter}]"
                citation_counter += 1

                # Construct Citation object with official URL and exact matched text passage
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

                # Format human-readable legal finding explaining the threat level and rationale
                findings_parts.append(
                    f"{cit_id} ({cand.doc_id} - '{cand.title}') poses {scored_art.threat_level.upper()} threat: "
                    f"{scored_art.rationale} "
                    f"Relevant passage disclosed: \"{citation_obj.cited_passage}\""
                )

            # If no prior art posed a threat, record positive novelty finding
            if not findings_parts:
                findings_parts.append("No directly conflicting prior art references were identified for this claim element in public databases.")

            # Create the ElementReportSection for this claim
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

        # Step 4: Generate strategic patent claim refinements and drafting recommendations
        refinements = []
        for sec in element_sections:
            if sec.risk_level in ["high", "moderate"]:
                refinements.append(
                    f"For Element '{sec.element_title}': Emphasize non-obvious limitations distinct from cited art ({', '.join([c.doc_id for c in sec.citations])})."
                )
        if not refinements:
            refinements.append("All claim elements show strong novelty gaps against searched databases.")

        # Step 5: Draft high-level Executive Summary
        exec_summary = (
            f"Preliminary prior-art screening for '{parsed_disclosure.title}' across {len(parsed_disclosure.claim_elements)} "
            f"decomposed claim elements indicates an overall novelty risk profile of {clustering_output.overall_invention_risk.upper()}. "
            f"A total of {len(all_citations)} relevant prior-art references were identified and analyzed against specific claim limitations."
        )

        # Step 6: Assemble final PriorArtReport object with mandatory legal disclaimers
        return PriorArtReport(
            title=f"Preliminary Patentability Screening Report: {parsed_disclosure.title}",
            disclaimer=MANDATORY_LEGAL_DISCLAIMER,
            executive_summary=exec_summary,
            overall_novelty_risk=clustering_output.overall_invention_risk,
            element_sections=element_sections,
            all_citations=all_citations,
            recommended_refinements=refinements
        )
