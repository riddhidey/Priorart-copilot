# ==============================================================================
# PriorArt Copilot — Multi-Agent Sequential Pipeline Orchestration Graph
# Coordinates Agent 1 (Parser), Agent 2 (Retrieval), Agent 3 (Clustering),
# and Agent 4 (Report Writer) with strict Pydantic state validation at every step.
# ==============================================================================

# Standard library type annotations for optional dependencies and callable callbacks
from typing import Optional, Callable

# Shared memory state container passed across all agent boundaries
from pipeline.state import PipelineState

# Input data contract representing raw invention disclosure text and metadata
from schemas.disclosure import InventionDisclosure

# Agent 1: Analyzes raw description into structural claim elements and IPC codes
from agents.disclosure_parser import DisclosureParserAgent

# Agent 2: Searches patent offices and academic databases for each claim element
from agents.retrieval_agent import RetrievalAgent

# Agent 3: Evaluates 35 U.S.C. § 102 anticipation and § 103 obviousness threats
from agents.novelty_clustering import NoveltyClusteringAgent

# Agent 4: Synthesizes final legal memorandum with verified citations
from agents.report_writer import ReportWriterAgent


# Main pipeline orchestrator class connecting the 4 agents in sequential execution
class PriorArtPipeline:
    """Four-agent orchestrator implementing the exact multi-agent flow from GEMINI.md."""

    # Constructor: initializes or injects the 4 autonomous agents and an optional UI progress callback
    def __init__(
        self,
        parser_agent: Optional[DisclosureParserAgent] = None,
        retrieval_agent: Optional[RetrievalAgent] = None,
        clustering_agent: Optional[NoveltyClusteringAgent] = None,
        report_agent: Optional[ReportWriterAgent] = None,
        on_step_callback: Optional[Callable[[str, str], None]] = None
    ):
        # Initialize Agent 1: Disclosure Parser (or use injected mock/custom agent)
        self.parser = parser_agent or DisclosureParserAgent()
        
        # Initialize Agent 2: Retrieval Agent (or use injected search ensemble)
        self.retrieval = retrieval_agent or RetrievalAgent()
        
        # Initialize Agent 3: Novelty Clustering & Threat Scorer
        self.clustering = clustering_agent or NoveltyClusteringAgent()
        
        # Initialize Agent 4: Legal Screening Report Writer
        self.report_writer = report_agent or ReportWriterAgent()
        
        # Optional callback to stream live progress to frontend WebSocket / UI console
        self.on_step_callback = on_step_callback

    # Helper function: dispatches progress status updates to the registered listener callback
    def _notify(self, step_name: str, message: str):
        if self.on_step_callback:
            self.on_step_callback(step_name, message)

    # Core execution method: runs the full 4-agent graph sequentially from raw text to final report
    def run(self, raw_disclosure: InventionDisclosure, top_k_per_element: int = 5) -> PipelineState:
        """Executes the 4-agent graph with strict schema validation at every boundary."""
        # Initialize fresh PipelineState storing raw input disclosure and tracking execution steps
        state = PipelineState(raw_disclosure=raw_disclosure)

        # --------------------------------------------------------------------------
        # STEP 1: DISCLOSURE PARSER AGENT
        # Deconstructs plain text into discrete structural claim elements and IPC/CPC codes
        # --------------------------------------------------------------------------
        try:
            # Emit notification that claim deconstruction is beginning
            self._notify("Parser", "Deconstructing disclosure into claim elements and IPC/CPC classes...")
            
            # Execute Agent 1: parses raw text into structured ParsedDisclosure object
            state.parsed_disclosure = self.parser.parse(state.raw_disclosure)
            
            # Mark pipeline state step as successfully parsed
            state.current_step = "parsed"
            
            # Emit notification with total number of extracted claim elements
            self._notify("Parser", f"Successfully extracted {len(state.parsed_disclosure.claim_elements)} claim elements.")
        except Exception as e:
            # On failure: capture error message in state and halt execution gracefully
            state.errors.append(f"Disclosure Parser Agent failed: {str(e)}")
            state.current_step = "failed_at_parser"
            return state

        # --------------------------------------------------------------------------
        # STEP 2: RETRIEVAL AGENT
        # Conducts targeted parallel searches across patent and academic literature per element
        # --------------------------------------------------------------------------
        try:
            # Emit notification that multi-backend retrieval has started
            self._notify("Retrieval", f"Searching patent and academic databases across {len(state.parsed_disclosure.claim_elements)} elements...")
            
            # Execute Agent 2: queries connectors and returns element-specific candidates
            state.retrieval_output = self.retrieval.retrieve(state.parsed_disclosure, top_k_per_element=top_k_per_element)
            
            # Mark pipeline state step as retrieved
            state.current_step = "retrieved"
            
            # Emit notification with total candidate count found
            self._notify("Retrieval", f"Retrieved {state.retrieval_output.total_candidates} prior art candidates across all elements.")
        except Exception as e:
            # On failure: record retrieval failure and return current state
            state.errors.append(f"Retrieval Agent failed: {str(e)}")
            state.current_step = "failed_at_retrieval"
            return state

        # --------------------------------------------------------------------------
        # STEP 3: NOVELTY CLUSTERING AGENT
        # Aligns retrieved prior art against claim elements & computes 35 U.S.C. §§ 102/103 threats
        # --------------------------------------------------------------------------
        try:
            # Emit notification that novelty scoring and matrix building has started
            self._notify("Clustering", "Evaluating and scoring prior art threat per claim element...")
            
            # Execute Agent 3: scores overlap, identifies novelty gaps, and determines overall risk
            state.clustering_output = self.clustering.cluster_and_score(state.parsed_disclosure, state.retrieval_output)
            
            # Mark pipeline state step as clustered
            state.current_step = "clustered"
            
            # Emit notification with evaluated invention novelty risk level (HIGH, MOD, LOW)
            self._notify("Clustering", f"Calculated novelty risk profile: {state.clustering_output.overall_invention_risk.upper()}.")
        except Exception as e:
            # On failure: record clustering failure and return current state
            state.errors.append(f"Novelty Clustering Agent failed: {str(e)}")
            state.current_step = "failed_at_clustering"
            return state

        # --------------------------------------------------------------------------
        # STEP 4: REPORT WRITER AGENT
        # Synthesizes explainable screening report with 100% verified citation traceability
        # --------------------------------------------------------------------------
        try:
            # Emit notification that final memorandum drafting has begun
            self._notify("ReportWriter", "Drafting preliminary screening report with citation traceability...")
            
            # Execute Agent 4: generates final PriorArtReport with zero-hallucination citations
            state.final_report = self.report_writer.generate_report(
                state.parsed_disclosure,
                state.retrieval_output,
                state.clustering_output
            )
            
            # Mark pipeline execution as fully completed
            state.current_step = "completed"
            
            # Emit notification with count of verified citations attached to report
            self._notify("ReportWriter", f"Generated report with {len(state.final_report.all_citations)} verified citations.")
        except Exception as e:
            # On failure: record report writer error and return current state
            state.errors.append(f"Report Writer Agent failed: {str(e)}")
            state.current_step = "failed_at_report_writer"
            return state

        # Return completed state object containing data from all 4 agent steps
        return state
