# ==============================================================================
# PriorArt Copilot — Retrieval Agent Schemas & Data Contracts
# Defines the typed data models for prior-art candidates, element-specific results,
# and the aggregated output produced by Agent 2 (Retrieval Agent).
# ==============================================================================

# Standard library typing for lists, dictionaries, optional values, and literal choices
from typing import List, Dict, Optional, Literal

# Pydantic BaseModel and Field for runtime validation and metadata descriptions
from pydantic import BaseModel, Field


# Model representing a single candidate patent or non-patent publication found by retrieval
class PriorArtCandidate(BaseModel):
    """A single retrieved patent or academic publication candidate."""
    
    # Official patent publication number or paper citation ID (e.g. 'US-10457388-B2', 'EP-3205574-A1')
    doc_id: str = Field(
        ...,
        description="Unique publication or patent number (e.g. 'US-10293845-B2', 'EP-3489120-A1', 'arXiv:2305.12345')."
    )
    
    # Title of the patent publication or scientific paper
    title: str = Field(
        ...,
        description="Title of the patent document or research publication."
    )
    
    # Abstract summary describing the prior art document's core invention
    abstract: str = Field(
        ...,
        description="Abstract or summary of the retrieved document."
    )
    
    # Specific matched text excerpt from the document that addresses the searched claim element
    relevant_passage: str = Field(
        ...,
        description="Specific excerpt or passage that matches the claim element."
    )
    
    # Source repository or API where this document originated
    source: Literal["google_patents", "epo_ops", "semantic_scholar", "mock_patent_index"] = Field(
        ...,
        description="Source dataset or API from which this document was retrieved."
    )
    
    # Date when the patent or research paper was formally published
    publication_date: Optional[str] = Field(
        None,
        description="Publication date (YYYY-MM-DD or YYYY)."
    )
    
    # Clickable official URL linking directly to the document (e.g. Google Patents URL)
    url: Optional[str] = Field(
        None,
        description="Public URL to access the original document."
    )
    
    # International Patent Classification (IPC) or CPC codes listed on this patent
    ipc_cpc_classes: List[str] = Field(
        default_factory=list,
        description="Classification codes associated with this prior art."
    )
    
    # Initial lexical / vector similarity score computed during candidate retrieval (0.0 to 1.0)
    similarity_score: Optional[float] = Field(
        None,
        description="Initial retrieval relevance score (0.0 to 1.0)."
    )


# Model grouping all prior art documents retrieved specifically for ONE claim element
class ElementRetrievalResult(BaseModel):
    """Retrieval results specific to one claim element."""
    
    # Identifier of the claim element this search query targeted (e.g. 'elem_01', 'elem_02')
    element_id: str = Field(
        ...,
        description="The claim element ID this retrieval was executed for."
    )
    
    # Expanded search query string executed across search engines for this element
    query_used: str = Field(
        ...,
        description="The specific search query executed for this element."
    )
    
    # List of candidate prior art documents found matching this specific claim element
    candidates: List[PriorArtCandidate] = Field(
        default_factory=list,
        description="List of prior art documents retrieved for this specific element."
    )


# Master output contract emitted by Agent 2 (Retrieval Agent)
class RetrievalOutput(BaseModel):
    """Output of Agent 2 (Retrieval Agent)."""
    
    # Dictionary mapping each element_id (e.g. 'elem_01') to its ElementRetrievalResult container
    element_results: Dict[str, ElementRetrievalResult] = Field(
        ...,
        description="Mapping from element_id to ElementRetrievalResult."
    )
    
    # Total count of candidate documents aggregated across all elements in the invention
    total_candidates: int = Field(
        ...,
        description="Total number of candidates retrieved across all claim elements."
    )
