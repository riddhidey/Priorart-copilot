import pytest
from pydantic import ValidationError
from schemas.disclosure import ClaimElement, InventionDisclosure, ParsedDisclosure
from schemas.retrieval import PriorArtCandidate, ElementRetrievalResult, RetrievalOutput
from schemas.clustering import ScoredPriorArt, ElementNoveltyCluster, NoveltyClusteringOutput
from schemas.report import Citation, ElementReportSection, PriorArtReport, MANDATORY_LEGAL_DISCLAIMER


def test_disclosure_schemas():
    disc = InventionDisclosure(
        title="Compact Drone Propeller",
        raw_text="A variable pitch blade mechanism with stepper actuator.",
        technical_domain="mechanical"
    )
    assert disc.title == "Compact Drone Propeller"
    assert disc.technical_domain == "mechanical"

    elem = ClaimElement(
        element_id="elem_01",
        title="Blade Hub",
        description="A hub mounting multiple blades with pivot pins.",
        ipc_cpc_classes=["B64C 11/00"],
        search_keywords=["hub", "blade", "pivot"]
    )
    assert elem.element_id == "elem_01"

    parsed = ParsedDisclosure(
        title=disc.title,
        technical_domain="mechanical",
        summary="Variable pitch rotor invention",
        claim_elements=[elem]
    )
    assert len(parsed.claim_elements) == 1

    # Test failure on empty claim elements
    with pytest.raises(ValidationError):
        ParsedDisclosure(
            title=disc.title,
            technical_domain="mechanical",
            summary="Empty",
            claim_elements=[]
        )


def test_retrieval_and_clustering_schemas():
    candidate = PriorArtCandidate(
        doc_id="US-10457388-B2",
        title="Variable Pitch Propeller",
        abstract="Rotor assembly...",
        relevant_passage="Axial pushrod mechanism...",
        source="mock_patent_index"
    )
    assert candidate.doc_id == "US-10457388-B2"

    retrieval_res = ElementRetrievalResult(
        element_id="elem_01",
        query_used="hub blade pivot",
        candidates=[candidate]
    )
    output = RetrievalOutput(
        element_results={"elem_01": retrieval_res},
        total_candidates=1
    )
    assert output.total_candidates == 1

    scored = ScoredPriorArt(
        doc_id=candidate.doc_id,
        title=candidate.title,
        matched_passage=candidate.relevant_passage,
        threat_level="high",
        novelty_risk_score=0.85,
        rationale="Strong overlap",
        source="mock_patent_index"
    )
    assert scored.threat_level == "high"


def test_report_schema_and_disclaimer():
    cit = Citation(
        citation_id="[Cit-1]",
        doc_id="US-10457388-B2",
        title="Variable Pitch Propeller",
        cited_passage="Axial pushrod mechanism...",
        source="mock_patent_index"
    )
    sec = ElementReportSection(
        element_id="elem_01",
        element_title="Blade Hub",
        element_description="Hub description",
        risk_level="high",
        findings_analysis="Prior art anticipates this element.",
        distinguishing_features="Novel bearing arrangement",
        citations=[cit]
    )
    report = PriorArtReport(
        title="Screening Report: Drone Propeller",
        executive_summary="Summary of findings",
        overall_novelty_risk="high",
        element_sections=[sec],
        all_citations=[cit],
        recommended_refinements=["Add magnetic retention"]
    )
    assert report.disclaimer == MANDATORY_LEGAL_DISCLAIMER
    assert len(report.all_citations) == 1
