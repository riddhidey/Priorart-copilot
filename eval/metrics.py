import json
import glob
from pathlib import Path
from typing import Dict, Any, List
from schemas.disclosure import InventionDisclosure
from pipeline.graph import PriorArtPipeline


def calculate_element_recall(extracted_elements: List[str], ground_truth: List[str]) -> float:
    """Calculate recall of extracted claim elements against ground truth."""
    if not ground_truth:
        return 1.0
    matched = 0
    for gt in ground_truth:
        gt_lower = gt.lower()
        if any(gt_lower in ext.lower() or ext.lower() in gt_lower for ext in extracted_elements):
            matched += 1
    return matched / len(ground_truth)


def calculate_retrieval_coverage(retrieved_doc_ids: List[str], known_prior_art: List[str]) -> float:
    """Calculate coverage of known prior art by the retrieval layer."""
    if not known_prior_art:
        return 1.0
    retrieved_set = set(retrieved_doc_ids)
    matched = sum(1 for pa in known_prior_art if pa in retrieved_set)
    return matched / len(known_prior_art)


def verify_citation_authenticity(report, retrieval_output) -> Dict[str, Any]:
    """Verify that 100% of citations in the report originated from retrieved candidate docs."""
    retrieved_lookup = {}
    for el_res in retrieval_output.element_results.values():
        for cand in el_res.candidates:
            retrieved_lookup[cand.doc_id] = cand

    total_citations = len(report.all_citations)
    if total_citations == 0:
        return {"total_citations": 0, "valid_citations": 0, "accuracy": 1.0, "hallucinated": []}

    valid = 0
    hallucinated = []
    for cit in report.all_citations:
        if cit.doc_id in retrieved_lookup:
            valid += 1
        else:
            hallucinated.append(cit.doc_id)

    return {
        "total_citations": total_citations,
        "valid_citations": valid,
        "accuracy": valid / total_citations,
        "hallucinated": hallucinated
    }


def run_benchmark():
    """Run full benchmark against all curated evaluation disclosures."""
    print("=" * 60)
    print("PriorArt Copilot — Benchmark Evaluation Suite")
    print("=" * 60)

    eval_files = glob.glob("eval/disclosures/*.json")
    if not eval_files:
        print("No evaluation disclosure files found in eval/disclosures/.")
        return

    pipeline = PriorArtPipeline()
    results = []

    for file_path in eval_files:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        disclosure = InventionDisclosure(
            title=data["title"],
            raw_text=data["raw_text"],
            technical_domain=data.get("technical_domain", "mechanical")
        )
        gt_elements = data.get("ground_truth_claim_elements", [])
        known_prior_art = data.get("known_prior_art", [])

        state = pipeline.run(disclosure)

        # Agent 1 Metric
        extracted_titles = [el.title for el in state.parsed_disclosure.claim_elements]
        elem_recall = calculate_element_recall(extracted_titles, gt_elements)

        # Agent 2 Metric
        all_retrieved_ids = []
        for el_res in state.retrieval_output.element_results.values():
            all_retrieved_ids.extend([c.doc_id for c in el_res.candidates])
        coverage = calculate_retrieval_coverage(all_retrieved_ids, known_prior_art)

        # Agent 4 Metric
        cit_eval = verify_citation_authenticity(state.final_report, state.retrieval_output)

        res = {
            "id": data.get("id", Path(file_path).stem),
            "title": disclosure.title,
            "element_recall": elem_recall,
            "prior_art_coverage": coverage,
            "citation_authenticity": cit_eval["accuracy"],
            "total_citations": cit_eval["total_citations"]
        }
        results.append(res)

        print(f"\n[Case] {res['id']}: {res['title'][:40]}...")
        print(f"  • Element Recall (Agent 1):      {elem_recall * 100:.1f}%")
        print(f"  • Prior Art Coverage (Agent 2):  {coverage * 100:.1f}%")
        print(f"  • Citation Accuracy (Agent 4):   {cit_eval['accuracy'] * 100:.1f}% (Valid: {cit_eval['valid_citations']}/{cit_eval['total_citations']})")

    avg_recall = sum(r["element_recall"] for r in results) / len(results)
    avg_coverage = sum(r["prior_art_coverage"] for r in results) / len(results)
    avg_cit_acc = sum(r["citation_authenticity"] for r in results) / len(results)

    print("\n" + "=" * 60)
    print("Aggregate Benchmark Summary:")
    print(f"  Mean Element Recall (Target >= 80%):    {avg_recall * 100:.1f}%")
    print(f"  Mean Prior-Art Coverage:                {avg_coverage * 100:.1f}%")
    print(f"  Mean Citation Accuracy (Target = 100%): {avg_cit_acc * 100:.1f}%")
    print("=" * 60)


if __name__ == "__main__":
    run_benchmark()
