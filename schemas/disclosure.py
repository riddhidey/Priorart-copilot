from typing import List, Optional
from pydantic import BaseModel, Field


class ClaimElement(BaseModel):
    """A distinct structural or functional element extracted from the invention disclosure."""
    element_id: str = Field(
        ...,
        description="Unique identifier for the claim element, e.g. 'elem_01', 'elem_02'."
    )
    title: str = Field(
        ...,
        description="Short summary title of the element."
    )
    description: str = Field(
        ...,
        description="Detailed description of the structural or functional aspect of this element."
    )
    ipc_cpc_classes: List[str] = Field(
        default_factory=list,
        description="Candidate IPC/CPC classification codes relevant to this specific element, e.g. ['B64C 11/00', 'B64U 10/14']."
    )
    search_keywords: List[str] = Field(
        default_factory=list,
        description="Key terms and synonyms extracted specifically for retrieving prior art for this element."
    )


class InventionDisclosure(BaseModel):
    """Raw input invention disclosure submitted by the user."""
    title: str = Field(
        ...,
        description="Title of the invention."
    )
    raw_text: str = Field(
        ...,
        description="Full plain-language description of the invention."
    )
    technical_domain: str = Field(
        default="mechanical",
        description="Domain of the invention, e.g. 'mechanical' or 'electronics'."
    )


class ParsedDisclosure(BaseModel):
    """Output of Agent 1 (Disclosure Parser Agent)."""
    title: str = Field(
        ...,
        description="Invention title."
    )
    technical_domain: str = Field(
        ...,
        description="Validated domain ('mechanical' or 'electronics')."
    )
    summary: str = Field(
        ...,
        description="Core inventive concept distilled from the input."
    )
    claim_elements: List[ClaimElement] = Field(
        ...,
        min_length=1,
        description="Structured list of extracted claim elements."
    )
