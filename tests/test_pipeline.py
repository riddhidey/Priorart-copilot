from schemas.disclosure import InventionDisclosure
from pipeline.graph import PriorArtPipeline
from eval.metrics import verify_citation_authenticity


def test_pipeline_end_to_end():
    disclosure = InventionDisclosure(
        title="Sub-Nanowatt Acoustic Trigger with Energy Harvesting Rectifier",
        technical_domain="electronics",
        raw_text="""1. Piezoelectric Acoustic Harvester: A MEMS piezoelectric cantilever diaphragm tuned to ultrasonic frequencies to harvest acoustic wave energy.
2. Sub-Threshold Comparator Wake-Up Circuit: A dynamic threshold differential comparator operating in weak inversion CMOS regime consuming under 1 nanowatt in standby.
3. Power-Gating Switch: High-side PMOS switch isolating the main microcontroller until a validated threshold voltage burst triggers system power."""
    )

    pipeline = PriorArtPipeline()
    state = pipeline.run(disclosure)

    assert state.current_step == "completed"
    assert state.errors == []
    assert state.parsed_disclosure is not None
    assert len(state.parsed_disclosure.claim_elements) == 3
    assert state.final_report is not None

    # Verify Non-negotiable Traceability Rule (§2 of GEMINI.md)
    cit_audit = verify_citation_authenticity(state.final_report, state.retrieval_output)
    assert cit_audit["accuracy"] == 1.0, f"Found hallucinated citations: {cit_audit['hallucinated']}"
    assert cit_audit["valid_citations"] > 0
