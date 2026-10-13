# ==============================================================================
# PriorArt Copilot — Automated Evaluation and Benchmark Metrics Suite
# Measures three core quality dimensions:
# 1. Element Recall: Did Agent 1 extract all ground-truth claim elements?
# 2. Prior Art Coverage: Did Agent 2 find known historical invalidating prior art?
# 3. Citation Authenticity: Did Agent 4 hallucinate any fake patent numbers? (Must be 100%)
# ==============================================================================

# Standard library modules for JSON parsing and filesystem path operations
import json
import glob
from pathlib import Path

# Type hinting annotations for dictionaries, generic any types, and lists
from typing import Dict, Any, List

# Core pipeline schemas and multi-agent orchestrator imports
from schemas.disclosure import InventionDisclosure
from pipeline.graph import PriorArtPipeline


# Metric 1 Function: Evaluates Agent 1's claim extraction recall against ground-truth claims
def calculate_element_recall(extracted_elements: List[str], ground_truth: List[str]) -> float:
    """Calculate recall of extracted claim elements against ground truth patent claims."""
    # If no ground truth elements exist for this test case, return perfect recall score of 1.0
    if not ground_truth:
        return 1.0

    # Counter for ground-truth elements successfully covered by extracted elements
    matched = 0

    # Compare each ground-truth limitation against the list of extracted elements
    for gt in ground_truth:
        gt_lower = gt.lower()
        # Check bidirectional text substring overlap between ground truth and extracted claim element
        if any(gt_lower in ext.lower() or ext.lower() in gt_lower for ext in extracted_elements):
            matched += 1

    # Element Recall Formula: Matched Elements / Total Ground Truth Elements (Target >= 80%)
    return matched / len(ground_truth)


# Metric 2 Function: Evaluates Agent 2's ability to retrieve known invalidating prior art
def calculate_retrieval_coverage(retrieved_doc_ids: List[str], known_prior_art: List[str]) -> float:
    """Calculate coverage: percentage of known relevant prior art found by the retrieval layer."""
    # If benchmark case does not specify known historical prior art, return perfect coverage of 1.0
    if not known_prior_art:
        return 1.0

    # Convert retrieved publication numbers into a set for fast O(1) membership lookups
    retrieved_set = set(retrieved_doc_ids)

    # Count how many historical ground-truth prior art documents were successfully retrieved
    matched = sum(1 for pa in known_prior_art if pa in retrieved_set)

    # Prior Art Coverage Formula: Retrieved Known Patents / Total Known Patents (Target >= 75%)
    return matched / len(known_prior_art)


# Metric 3 Function: Anti-Hallucination Guard ensuring zero fabricated citations in the final memo
def verify_citation_authenticity(report, retrieval_output) -> Dict[str, Any]:
    """Verify that 100% of citations in the report originated from retrieved candidate docs (Anti-Hallucination Guard)."""
    # Build dictionary lookup of all documents legitimately retrieved and verified by Agent 2
    retrieved_lookup = {}
    for el_res in retrieval_output.element_results.values():
        for cand in el_res.candidates:
            retrieved_lookup[cand.doc_id] = cand

    # Total number of citations cited in Agent 4's final legal memorandum
    total_citations = len(report.all_citations)

    # If the report generated has zero citations, return default structure with 100% accuracy
    if total_citations == 0:
        return {"total_citations": 0, "valid_citations": 0, "accuracy": 1.0, "hallucinated": []}

    # Tracking counters for verified citations vs hallucinated/unverified document numbers
    valid = 0
    hallucinated = []

    # Verify each citation cited in the report against the verified retrieved candidate lookup
    for cit in report.all_citations:
        if cit.doc_id in retrieved_lookup:
            # Citation is authentic: document actually exists in retrieval search results
            valid += 1
        else:
            # Document was fabricated/hallucinated by LLM and was never returned by retrieval search engines
            hallucinated.append(cit.doc_id)

    # Return authenticity audit dictionary (Target Accuracy is strictly 100% / 1.0)
    return {
        "total_citations": total_citations,
        "valid_citations": valid,
        "accuracy": valid / total_citations,  # Target is strictly 1.0 (100% citation authenticity)
        "hallucinated": hallucinated
    }


# Benchmark Execution Engine: Runs full multi-agent pipeline against all ground-truth test cases
def run_benchmark():
    """Run full benchmark against all curated evaluation disclosures in eval/disclosures/."""
    # Print benchmark header banner
    print("=" * 60)
    print("PriorArt Copilot — Benchmark Evaluation Suite")
    print("=" * 60)

    # Discover all JSON benchmark test cases inside eval/disclosures/ directory
    eval_files = glob.glob("eval/disclosures/*.json")
    if not eval_files:
        print("No evaluation disclosure files found in eval/disclosures/.")
        return

    # Instantiate the standard 4-agent PriorArtPipeline orchestrator
    pipeline = PriorArtPipeline()
    results = []

    # Sequentially iterate through each benchmark test case disclosure file
    for file_path in eval_files:
        # Load test case JSON containing ground-truth claims and known prior art
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Wrap test case into InventionDisclosure input model
        disclosure = InventionDisclosure(
            title=data["title"],
            raw_text=data["raw_text"],
            technical_domain=data.get("technical_domain", "mechanical")
        )
        gt_elements = data.get("ground_truth_claim_elements", [])
        known_prior_art = data.get("known_prior_art", [])

        # Execute the complete 4-agent autonomous pipeline
        state = pipeline.run(disclosure)

        # 1. Compute Agent 1 Metric: Element Recall
        extracted_titles = [el.title for el in state.parsed_disclosure.claim_elements]
        elem_recall = calculate_element_recall(extracted_titles, gt_elements)

        # 2. Compute Agent 2 Metric: Prior Art Retrieval Coverage
        all_retrieved_ids = []
        for el_res in state.retrieval_output.element_results.values():
            all_retrieved_ids.extend([c.doc_id for c in el_res.candidates])
        coverage = calculate_retrieval_coverage(all_retrieved_ids, known_prior_art)

        # 3. Compute Agent 4 Metric: Citation Authenticity & Zero-Hallucination Rate
        cit_eval = verify_citation_authenticity(state.final_report, state.retrieval_output)

        # Store test case benchmark evaluation results
        res = {
            "id": data.get("id", Path(file_path).stem),
            "title": disclosure.title,
            "element_recall": elem_recall,
            "prior_art_coverage": coverage,
            "citation_authenticity": cit_eval["accuracy"],
            "total_citations": cit_eval["total_citations"]
        }
        results.append(res)

        # Display performance scorecard for this specific test case
        print(f"\n[Case] {res['id']}: {res['title'][:40]}...")
        print(f"  • Element Recall (Agent 1):      {elem_recall * 100:.1f}%")
        print(f"  • Prior Art Coverage (Agent 2):  {coverage * 100:.1f}%")
        print(f"  • Citation Accuracy (Agent 4):   {cit_eval['accuracy'] * 100:.1f}% (Valid: {cit_eval['valid_citations']}/{cit_eval['total_citations']})")

    # Calculate aggregate summary averages across all benchmark cases in the suite
    avg_recall = sum(r["element_recall"] for r in results) / len(results)
    avg_coverage = sum(r["prior_art_coverage"] for r in results) / len(results)
    avg_cit_acc = sum(r["citation_authenticity"] for r in results) / len(results)

    # Print final aggregate scorecard
    print("\n" + "=" * 60)
    print("Aggregate Benchmark Summary:")
    print(f"  Mean Element Recall (Target >= 80%):    {avg_recall * 100:.1f}%")
    print(f"  Mean Prior-Art Coverage:                {avg_coverage * 100:.1f}%")
    print(f"  Mean Citation Accuracy (Target = 100%): {avg_cit_acc * 100:.1f}%")
    print("=" * 60)


# CLI execution entrypoint: runs benchmark suite directly when executed as a script
if __name__ == "__main__":
    run_benchmark()
