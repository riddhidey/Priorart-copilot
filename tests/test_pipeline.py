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

    from server import _build_threat_matrix
    threat_matrix = _build_threat_matrix(
        state.parsed_disclosure.claim_elements,
        state.retrieval_output,
        state.clustering_output
    )
    assert "documents" in threat_matrix and len(threat_matrix["documents"]) > 0
    assert "rows" in threat_matrix and len(threat_matrix["rows"]) == 3
    for doc in threat_matrix["documents"]:
        assert doc["threat_level"] in ("HIGH", "MOD", "LOW")
        assert 60 <= doc["similarity"] <= 98
        assert doc["match_count"] >= 1
        if doc["threat_level"] == "HIGH":
            assert doc["similarity"] >= 90
        elif doc["threat_level"] == "MOD":
            assert 80 <= doc["similarity"] <= 89
        elif doc["threat_level"] == "LOW":
            assert doc["similarity"] < 80


def test_risk_classification_consistency_across_surfaces():
    """Verify that Python backend and UI data contracts guarantee 100% risk consistency."""
    from schemas.risk import classify_risk_score, normalize_threat_level
    from server import _build_threat_matrix

    # 1. Statutory Threshold Verification
    assert classify_risk_score(0.95)[0] == "HIGH"
    assert classify_risk_score(0.90)[0] == "HIGH"
    assert classify_risk_score(0.89)[0] == "MOD"
    assert classify_risk_score(0.80)[0] == "MOD"
    assert classify_risk_score(0.79)[0] == "LOW"
    assert classify_risk_score(0.65)[0] == "LOW"

    # 2. String Normalization Verification
    assert normalize_threat_level("HIGH") == "HIGH"
    assert normalize_threat_level("high threat") == "HIGH"
    assert normalize_threat_level("moderate") == "MOD"
    assert normalize_threat_level("medium") == "MOD"
    assert normalize_threat_level("mod") == "MOD"
    assert normalize_threat_level("low") == "LOW"
    assert normalize_threat_level("low threat") == "LOW"

    # 3. Explicit Threat Priority Verification
    threat_h, sim_h = classify_risk_score(0.50, raw_threat_level="high")
    assert threat_h == "HIGH"
    assert sim_h >= 90
    threat_l, sim_l = classify_risk_score(0.95, raw_threat_level="low")
    assert threat_l == "LOW"
    assert sim_l < 80

    # 4. End-to-End Threat Matrix Cross-Surface Consistency
    from schemas.disclosure import ClaimElement
    from schemas.retrieval import PriorArtCandidate, ElementRetrievalResult, RetrievalOutput
    from schemas.clustering import ScoredPriorArt, ElementNoveltyCluster, NoveltyClusteringOutput

    elements = [
        ClaimElement(element_id="EL-1", title="Rotor Blade Pitch", description="Active blade pitch", keywords=["rotor"]),
        ClaimElement(element_id="EL-2", title="Swashplate Mechanism", description="Variable pitch mechanism", keywords=["swashplate"])
    ]
    boeing_cand = PriorArtCandidate(
        doc_id="US9840321B2",
        title="Active Rotor Blade Pitch Control System",
        abstract="Rotor blade pitch actuator with feedback linkage.",
        relevant_passage="Rotor blade pitch mechanism with swashplate.",
        source="google_patents",
        similarity_score=0.72
    )
    high_cand = PriorArtCandidate(
        doc_id="US10457388B2",
        title="Variable Pitch Propeller Mechanism",
        abstract="Variable pitch propeller.",
        relevant_passage="Variable pitch propeller.",
        source="google_patents",
        similarity_score=0.94
    )
    retrieval = RetrievalOutput(
        element_results={
            "EL-1": ElementRetrievalResult(
                element_id="EL-1",
                query_used="rotor",
                candidates=[boeing_cand, high_cand]
            ),
            "EL-2": ElementRetrievalResult(
                element_id="EL-2",
                query_used="swashplate",
                candidates=[boeing_cand, high_cand]
            )
        },
        total_candidates=4
    )

    clustering = NoveltyClusteringOutput(
        element_clusters={
            "EL-1": ElementNoveltyCluster(
                element_id="EL-1",
                element_title="Rotor Blade Pitch",
                overall_element_risk="high",
                ranked_prior_art=[
                    ScoredPriorArt(
                        doc_id="US9840321B2",
                        title="Active Rotor Blade Pitch Control System",
                        matched_passage="Rotor blade pitch actuator with feedback linkage.",
                        threat_level="low",
                        novelty_risk_score=0.25,
                        rationale="Distant baseline reference",
                        source="google_patents"
                    ),
                    ScoredPriorArt(
                        doc_id="US10457388B2",
                        title="Variable Pitch Propeller Mechanism",
                        matched_passage="Variable pitch propeller.",
                        threat_level="high",
                        novelty_risk_score=0.95,
                        rationale="Direct novelty collision",
                        source="google_patents"
                    )
                ],
                novelty_gap_summary="Novelty gap exists"
            ),
            "EL-2": ElementNoveltyCluster(
                element_id="EL-2",
                element_title="Swashplate Mechanism",
                overall_element_risk="high",
                ranked_prior_art=[
                    ScoredPriorArt(
                        doc_id="US9840321B2",
                        title="Active Rotor Blade Pitch Control System",
                        matched_passage="Rotor blade pitch actuator with feedback linkage.",
                        threat_level="low",
                        novelty_risk_score=0.22,
                        rationale="Distant baseline reference",
                        source="google_patents"
                    ),
                    ScoredPriorArt(
                        doc_id="US10457388B2",
                        title="Variable Pitch Propeller Mechanism",
                        matched_passage="Variable pitch propeller.",
                        threat_level="high",
                        novelty_risk_score=0.94,
                        rationale="Direct novelty collision",
                        source="google_patents"
                    )
                ],
                novelty_gap_summary="Novelty gap exists"
            )
        },
        overall_invention_risk="high"
    )

    matrix = _build_threat_matrix(elements, retrieval, clustering)
    doc_map = {d["doc_id"]: d for d in matrix["documents"]}

    # Verify US9840321B2 (the Boeing patent mentioned in the bug report)
    boeing_doc = doc_map["US9840321B2"]
    assert boeing_doc["threat_level"] == "LOW"
    assert boeing_doc["similarity"] < 80, f"Expected Low (<80%), got {boeing_doc['similarity']}%"

    # Cross-reference with rows to ensure row cells never disagree with doc level
    for row in matrix["rows"]:
        cell_threat = row["threats"].get("US9840321B2")
        assert cell_threat == "LOW", f"Row cell threat mismatch: expected LOW, got {cell_threat}"

    # Verify high threat document
    high_doc = doc_map["US10457388B2"]
    assert high_doc["threat_level"] == "HIGH"
    assert high_doc["similarity"] >= 90
    for row in matrix["rows"]:
        cell_threat = row["threats"].get("US10457388B2")
        assert cell_threat == "HIGH"

