from typing import List, Dict, Optional, Literal
from pydantic import BaseModel, Field


class PriorArtCandidate(BaseModel):
    """A single retrieved patent or academic publication candidate."""
    doc_id: str = Field(
        ...,
        description="Unique publication or patent number (e.g. 'US-10293845-B2', 'EP-3489120-A1', 'arXiv:2305.12345')."
    )
    title: str = Field(
        ...,
        description="Title of the patent document or research publication."
    )
    abstract: str = Field(
        ...,
        description="Abstract or summary of the retrieved document."
    )
    relevant_passage: str = Field(
        ...,
        description="Specific excerpt or passage that matches the claim element."
    )
    source: Literal["google_patents", "epo_ops", "semantic_scholar", "mock_patent_index"] = Field(
        ...,
        description="Source dataset or API from which this document was retrieved."
    )
    publication_date: Optional[str] = Field(
        None,
        description="Publication date (YYYY-MM-DD or YYYY)."
    )
    url: Optional[str] = Field(
        None,
        description="Public URL to access the original document."
    )
    ipc_cpc_classes: List[str] = Field(
        default_factory=list,
        description="Classification codes associated with this prior art."
    )
    similarity_score: Optional[float] = Field(
        None,
        description="Initial retrieval relevance score (0.0 to 1.0)."
    )


class ElementRetrievalResult(BaseModel):
    """Retrieval results specific to one claim element."""
    element_id: str = Field(
        ...,
        description="The claim element ID this retrieval was executed for."
    )
    query_used: str = Field(
        ...,
        description="The specific search query executed for this element."
    )
    candidates: List[PriorArtCandidate] = Field(
        default_factory=list,
        description="List of prior art documents retrieved for this specific element."
    )


class RetrievalOutput(BaseModel):
    """Output of Agent 2 (Retrieval Agent)."""
    element_results: Dict[str, ElementRetrievalResult] = Field(
        ...,
        description="Mapping from element_id to ElementRetrievalResult."
    )
    total_candidates: int = Field(
        ...,
        description="Total number of candidates retrieved across all claim elements."
    )
