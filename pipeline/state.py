# ==============================================================================
# PriorArt Copilot — Pipeline State Container
# Encapsulates the shared memory state across all 4 autonomous agents.
# Tracks input data, intermediate agent outputs, diagnostic errors, and pipeline progression.
# ==============================================================================

# Standard library typing for optional fields, dictionaries, and generic types
from typing import Optional, Dict, Any

# Pydantic data modeling classes for schema enforcement and default factories
from pydantic import BaseModel, Field

# Input schema representing the user's raw invention disclosure
from schemas.disclosure import InventionDisclosure, ParsedDisclosure

# Agent 2 output schema containing all retrieved prior art documents
from schemas.retrieval import RetrievalOutput

# Agent 3 output schema containing element-level threat clusters and matrix data
from schemas.clustering import NoveltyClusteringOutput

# Agent 4 output schema containing final synthesized legal screening memorandum
from schemas.report import PriorArtReport


# Central Pydantic model representing state flowing through the 4-agent pipeline
class PipelineState(BaseModel):
    """Encapsulates the state across the 4-agent PriorArt Copilot pipeline."""

    # 1. Raw User Input: Stores original title, disclosure text, and technical domain
    raw_disclosure: InventionDisclosure

    # 2. Output of Agent 1 (Disclosure Parser): Stores extracted claim elements and IPC/CPC codes
    parsed_disclosure: Optional[ParsedDisclosure] = None

    # 3. Output of Agent 2 (Retrieval Agent): Stores candidate patents & papers retrieved per element
    retrieval_output: Optional[RetrievalOutput] = None

    # 4. Output of Agent 3 (Novelty Clustering): Stores threat ratings (§ 102/103) & similarity scores
    clustering_output: Optional[NoveltyClusteringOutput] = None

    # 5. Output of Agent 4 (Report Writer): Stores final screening report with verified citations
    final_report: Optional[PriorArtReport] = None

    # Diagnostic Error Tracking: Collects error messages if an agent encounters a failure
    errors: list[str] = Field(
        default_factory=list,
        description="List of diagnostic error strings encountered during pipeline execution."
    )

    # Current Step Indicator: Tracks current stage ('initialized', 'parsed', 'retrieved', 'clustered', 'completed')
    current_step: str = Field(
        default="initialized",
        description="Current lifecycle stage of the screening pipeline execution."
    )
