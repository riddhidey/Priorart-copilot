from typing import List, Dict, Optional, Literal
from pydantic import BaseModel, Field


MANDATORY_LEGAL_DISCLAIMER = (
    "LEGAL & ETHICAL DISCLAIMER: This document is an automated preliminary prior-art "
    "and patentability screening report generated for research and educational purposes only. "
    "It does NOT constitute legal advice, a formal patentability opinion, or a substitute for "
    "consultation with a registered patent attorney or patent agent. No attorney-client "
    "relationship is formed by the generation or use of this report."
)


class Citation(BaseModel):
    """Traceable citation linking a specific report statement to a verified retrieved document."""
    citation_id: str = Field(
        ...,
        description="Inline citation identifier, e.g. '[Cit-1]'."
    )
    doc_id: str = Field(
        ...,
        description="ID of the cited patent or publication (must match a retrieved candidate)."
    )
    title: str = Field(
        ...,
        description="Title of the cited reference."
    )
    cited_passage: str = Field(
        ...,
        description="The exact verbatim passage/excerpt from the retrieved document."
    )
    source: str = Field(
        ...,
        description="Origin repository (e.g. Google Patents, EPO OPS, Semantic Scholar)."
    )
    url: Optional[str] = Field(
        None,
        description="Direct link to the cited publication."
    )


class ElementReportSection(BaseModel):
    """Section of the final report focusing on a single claim element."""
    element_id: str = Field(
        ...,
        description="Claim element identifier."
    )
    element_title: str = Field(
        ...,
        description="Element title."
    )
    element_description: str = Field(
        ...,
        description="Original claim element description."
    )
    risk_level: Literal["high", "moderate", "low"] = Field(
        ...,
        description="Assessed novelty threat level."
    )
    findings_analysis: str = Field(
        ...,
        description="Detailed analysis citing specific prior art via citation tags e.g. [Cit-1]."
    )
    distinguishing_features: str = Field(
        ...,
        description="Features in this element not fully anticipated by the cited prior art."
    )
    citations: List[Citation] = Field(
        default_factory=list,
        description="List of verified citations supporting this section."
    )


class PriorArtReport(BaseModel):
    """Final output of Agent 4 (Report-Writer Agent) and the full PriorArt Copilot pipeline."""
    title: str = Field(
        ...,
        description="Title of the invention screening report."
    )
    disclaimer: str = Field(
        default=MANDATORY_LEGAL_DISCLAIMER,
        description="Mandatory legal disclaimer required at the beginning of every report."
    )
    executive_summary: str = Field(
        ...,
        description="Executive summary of the preliminary patentability screening."
    )
    overall_novelty_risk: Literal["high", "moderate", "low"] = Field(
        ...,
        description="Overall screening risk assessment."
    )
    element_sections: List[ElementReportSection] = Field(
        ...,
        description="Element-by-element breakdown of prior art findings."
    )
    all_citations: List[Citation] = Field(
        ...,
        description="Master index of all verified citations used in the report."
    )
    recommended_refinements: List[str] = Field(
        default_factory=list,
        description="Strategic claim refinement recommendations to circumvent the discovered prior art."
    )
