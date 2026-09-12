from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from schemas.disclosure import InventionDisclosure, ParsedDisclosure
from schemas.retrieval import RetrievalOutput
from schemas.clustering import NoveltyClusteringOutput
from schemas.report import PriorArtReport


class PipelineState(BaseModel):
    """Encapsulates the state across the 4-agent PriorArt Copilot pipeline."""
    raw_disclosure: InventionDisclosure
    parsed_disclosure: Optional[ParsedDisclosure] = None
    retrieval_output: Optional[RetrievalOutput] = None
    clustering_output: Optional[NoveltyClusteringOutput] = None
    final_report: Optional[PriorArtReport] = None
    errors: list[str] = Field(default_factory=list)
    current_step: str = "initialized"
