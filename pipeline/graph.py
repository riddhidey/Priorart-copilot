from typing import Optional, Callable
from pipeline.state import PipelineState
from schemas.disclosure import InventionDisclosure
from agents.disclosure_parser import DisclosureParserAgent
from agents.retrieval_agent import RetrievalAgent
from agents.novelty_clustering import NoveltyClusteringAgent
from agents.report_writer import ReportWriterAgent


class PriorArtPipeline:
    """Four-agent orchestrator implementing the exact multi-agent flow from GEMINI.md."""

    def __init__(
        self,
        parser_agent: Optional[DisclosureParserAgent] = None,
        retrieval_agent: Optional[RetrievalAgent] = None,
        clustering_agent: Optional[NoveltyClusteringAgent] = None,
        report_agent: Optional[ReportWriterAgent] = None,
        on_step_callback: Optional[Callable[[str, str], None]] = None
    ):
        self.parser = parser_agent or DisclosureParserAgent()
        self.retrieval = retrieval_agent or RetrievalAgent()
        self.clustering = clustering_agent or NoveltyClusteringAgent()
        self.report_writer = report_agent or ReportWriterAgent()
        self.on_step_callback = on_step_callback

    def _notify(self, step_name: str, message: str):
        if self.on_step_callback:
            self.on_step_callback(step_name, message)

    def run(self, raw_disclosure: InventionDisclosure, top_k_per_element: int = 5) -> PipelineState:
        """Executes the 4-agent graph with strict schema validation at every boundary."""
        state = PipelineState(raw_disclosure=raw_disclosure)

        # Step 1: Disclosure Parser Agent
        try:
            self._notify("Parser", "Deconstructing disclosure into claim elements and IPC/CPC classes...")
            state.parsed_disclosure = self.parser.parse(state.raw_disclosure)
            state.current_step = "parsed"
            self._notify("Parser", f"Successfully extracted {len(state.parsed_disclosure.claim_elements)} claim elements.")
        except Exception as e:
            state.errors.append(f"Disclosure Parser Agent failed: {str(e)}")
            state.current_step = "failed_at_parser"
            return state

        # Step 2: Retrieval Agent (per claim element)
        try:
            self._notify("Retrieval", f"Searching patent and academic databases across {len(state.parsed_disclosure.claim_elements)} elements...")
            state.retrieval_output = self.retrieval.retrieve(state.parsed_disclosure, top_k_per_element=top_k_per_element)
            state.current_step = "retrieved"
            self._notify("Retrieval", f"Retrieved {state.retrieval_output.total_candidates} prior art candidates across all elements.")
        except Exception as e:
            state.errors.append(f"Retrieval Agent failed: {str(e)}")
            state.current_step = "failed_at_retrieval"
            return state

        # Step 3: Novelty-Clustering Agent
        try:
            self._notify("Clustering", "Evaluating and scoring prior art threat per claim element...")
            state.clustering_output = self.clustering.cluster_and_score(state.parsed_disclosure, state.retrieval_output)
            state.current_step = "clustered"
            self._notify("Clustering", f"Calculated novelty risk profile: {state.clustering_output.overall_invention_risk.upper()}.")
        except Exception as e:
            state.errors.append(f"Novelty Clustering Agent failed: {str(e)}")
            state.current_step = "failed_at_clustering"
            return state

        # Step 4: Report-Writer Agent
        try:
            self._notify("ReportWriter", "Drafting preliminary screening report with citation traceability...")
            state.final_report = self.report_writer.generate_report(
                state.parsed_disclosure,
                state.retrieval_output,
                state.clustering_output
            )
            state.current_step = "completed"
            self._notify("ReportWriter", f"Generated report with {len(state.final_report.all_citations)} verified citations.")
        except Exception as e:
            state.errors.append(f"Report Writer Agent failed: {str(e)}")
            state.current_step = "failed_at_report_writer"
            return state

        return state
