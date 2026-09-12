from typing import List, Dict, Optional, Literal
from pydantic import BaseModel, Field


class ScoredPriorArt(BaseModel):
    """A prior art document scored and mapped to a specific claim element."""
    doc_id: str = Field(
        ...,
        description="ID of the cited document."
    )
    title: str = Field(
        ...,
        description="Document title."
    )
    matched_passage: str = Field(
        ...,
        description="The exact text snippet from the document that reads on the claim element."
    )
    threat_level: Literal["high", "moderate", "low"] = Field(
        ...,
        description="Assessed degree of anticipation or obviousness risk for this element."
    )
    novelty_risk_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Quantified novelty threat score (0.0 = low risk/novel, 1.0 = high overlap/anticipated)."
    )
    rationale: str = Field(
        ...,
        description="Technical justification for why this document threatens this element."
    )
    source: str = Field(
        ...,
        description="Source repository of the document."
    )
    url: Optional[str] = Field(
        None,
        description="Link to original document."
    )


class ElementNoveltyCluster(BaseModel):
    """Cluster of prior art threatening a single claim element."""
    element_id: str = Field(
        ...,
        description="Claim element identifier."
    )
    element_title: str = Field(
        ...,
        description="Claim element title."
    )
    overall_element_risk: Literal["high", "moderate", "low"] = Field(
        ...,
        description="Aggregated risk level across all mapped prior art for this element."
    )
    ranked_prior_art: List[ScoredPriorArt] = Field(
        default_factory=list,
        description="Prior art candidates ranked by descending novelty risk score."
    )
    novelty_gap_summary: str = Field(
        ...,
        description="Summary of what distinguishing features remain novel for this element."
    )


class NoveltyClusteringOutput(BaseModel):
    """Output of Agent 3 (Novelty-Clustering Agent)."""
    element_clusters: Dict[str, ElementNoveltyCluster] = Field(
        ...,
        description="Mapping of element_id to ElementNoveltyCluster."
    )
    overall_invention_risk: Literal["high", "moderate", "low"] = Field(
        ...,
        description="Overall screening risk assessment across all elements."
    )
