import re
from typing import List, Optional
from schemas.disclosure import InventionDisclosure, ParsedDisclosure, ClaimElement
from agents.llm_client import LLMClient


class DisclosureParserAgent:
    """Agent 1: Extracts claim elements and IPC/CPC classifications from plain-language input."""

    def __init__(self, llm_client: Optional[LLMClient] = None):
        self.llm = llm_client or LLMClient()

    def parse(self, disclosure: InventionDisclosure) -> ParsedDisclosure:
        """Parse raw disclosure into structured ClaimElements."""
        system_instruction = (
            "You are the Disclosure Parser Agent in a patent prior-art screening system. "
            "Your task is to analyze plain-language invention disclosures in mechanical and electronics domains, "
            "decompose the invention into distinct, non-overlapping claim elements (structural and functional components), "
            "and identify relevant candidate IPC/CPC classification codes and targeted search keywords for each element."
        )

        prompt = f"""
Invention Title: {disclosure.title}
Technical Domain: {disclosure.technical_domain}
Full Disclosure Text:
{disclosure.raw_text}

Extract each core claim element with a unique ID (e.g. elem_01, elem_02), a concise title,
a detailed technical description, candidate IPC/CPC classification codes, and search keywords.
"""

        def _fallback() -> ParsedDisclosure:
            return self._heuristic_parse(disclosure)

        return self.llm.generate_structured(
            prompt=prompt,
            system_instruction=system_instruction,
            response_model=ParsedDisclosure,
            fallback_factory=_fallback
        )

    def _heuristic_parse(self, disclosure: InventionDisclosure) -> ParsedDisclosure:
        """Deterministic heuristic extractor when LLM is offline."""
        text = disclosure.raw_text.strip()
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        
        domain = disclosure.technical_domain.lower()
        default_classes = (
            ["B64C 11/00", "B64U 10/14"] if "mechanic" in domain or "drone" in text.lower() or "propeller" in text.lower()
            else ["H03K 17/94", "H04W 52/02", "G06F 1/32"]
        )

        elements: List[ClaimElement] = []
        
        # Look for bullet points or numbered elements or paragraphs
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        element_lines = [l for l in lines if re.match(r"^(\d+[\.\)]|[-*•])\s+", l)]

        if element_lines:
            for idx, el_text in enumerate(element_lines, 1):
                clean_text = re.sub(r"^(\d+[\.\)]|[-*•])\s+", "", el_text)
                title_match = re.match(r"^([^:\-—]+)[:\-—](.+)$", clean_text)
                if title_match:
                    title = title_match.group(1).strip()
                    desc = title_match.group(2).strip()
                else:
                    words = clean_text.split()
                    title = " ".join(words[:4])
                    desc = clean_text

                # Extract key terms
                keywords = [w.lower() for w in re.findall(r"\b[A-Za-z0-9\-]{4,}\b", desc)][:6]

                elements.append(
                    ClaimElement(
                        element_id=f"elem_{idx:02d}",
                        title=title,
                        description=desc,
                        ipc_cpc_classes=default_classes,
                        search_keywords=keywords or [title.lower()]
                    )
                )
        else:
            # Fallback to paragraph splitting or sentence splitting
            chunks = paragraphs if len(paragraphs) > 1 else [s.strip() for s in text.split(". ") if len(s.strip()) > 20]
            if not chunks:
                chunks = [text]

            for idx, chunk in enumerate(chunks[:4], 1):
                words = chunk.split()
                title = " ".join(words[:4]).rstrip(".:,")
                keywords = [w.lower() for w in re.findall(r"\b[A-Za-z0-9\-]{4,}\b", chunk)][:6]
                elements.append(
                    ClaimElement(
                        element_id=f"elem_{idx:02d}",
                        title=f"{title} Element",
                        description=chunk,
                        ipc_cpc_classes=default_classes,
                        search_keywords=keywords
                    )
                )

        return ParsedDisclosure(
            title=disclosure.title,
            technical_domain=disclosure.technical_domain,
            summary=f"Invention regarding {disclosure.title} comprising {len(elements)} distinct claim elements.",
            claim_elements=elements
        )
