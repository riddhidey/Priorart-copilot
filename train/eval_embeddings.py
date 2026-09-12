import json
import torch
from pathlib import Path
from train.prepare_dataset import prepare_datasets
from train.train_embeddings import SimpleVocabularyTokenizer, PatentEmbeddingModel


def evaluate_embeddings(
    model_path: str = "train/models/patent_embedder.pt",
    eval_data_file: str = "train/data/patent_benchmark_eval.jsonl"
):
    print("=" * 65)
    print("Patent Embedding Fine-Tuning Ablation Study (Baseline vs Fine-Tuned)")
    print("=" * 65)

    if not Path(eval_data_file).exists():
        prepare_datasets()

    samples = []
    with open(eval_data_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                samples.append(json.loads(line))

    tokenizer = SimpleVocabularyTokenizer()

    # 1. Baseline: Raw Bag-of-Words / Lexical Cosine Similarity
    def evaluate_lexical_baseline():
        total = len(samples)
        top1_correct = 0
        mrr_sum = 0.0
        pos_sims, neg_sims = [], []

        for s in samples:
            q_v = tokenizer.encode(s["query"])
            pos_v = tokenizer.encode(s["positive"])
            neg_v = tokenizer.encode(s["negative"])

            pos_cos = torch.sum(q_v * pos_v).item()
            neg_cos = torch.sum(q_v * neg_v).item()

            pos_sims.append(pos_cos)
            neg_sims.append(neg_cos)

            if pos_cos > neg_cos:
                top1_correct += 1
                mrr_sum += 1.0
            else:
                mrr_sum += 0.5

        top1_acc = (top1_correct / total) * 100.0
        mean_mrr = mrr_sum / total
        mean_pos = sum(pos_sims) / total
        mean_neg = sum(neg_sims) / total
        margin = mean_pos - mean_neg

        print(f"\n[Baseline: Raw Lexical / BoW Matching]")
        print(f"  • Top-1 Retrieval Accuracy:       {top1_acc:.1f}%")
        print(f"  • Mean Reciprocal Rank (MRR):     {mean_mrr:.3f}")
        print(f"  • Mean Positive Alignment Score:  {mean_pos:.3f}")
        print(f"  • Mean Negative Alignment Score:  {mean_neg:.3f}")
        print(f"  • Semantic Discrimination Margin: {margin:+.3f}")

        return {"top1_acc": top1_acc, "mrr": mean_mrr, "pos_sim": mean_pos, "neg_sim": mean_neg, "margin": margin}

    def evaluate_neural_model(model_obj, name: str):
        total = len(samples)
        top1_correct = 0
        mrr_sum = 0.0
        pos_sims, neg_sims = [], []

        with torch.no_grad():
            for s in samples:
                q_vec = tokenizer.encode(s["query"]).unsqueeze(0)
                pos_vec = tokenizer.encode(s["positive"]).unsqueeze(0)
                neg_vec = tokenizer.encode(s["negative"]).unsqueeze(0)

                q_emb = model_obj(q_vec)
                pos_emb = model_obj(pos_vec)
                neg_emb = model_obj(neg_vec)

                pos_cos = torch.sum(q_emb * pos_emb).item()
                neg_cos = torch.sum(q_emb * neg_emb).item()

                pos_sims.append(pos_cos)
                neg_sims.append(neg_cos)

                if pos_cos > neg_cos:
                    top1_correct += 1
                    mrr_sum += 1.0
                else:
                    mrr_sum += 0.5

        top1_acc = (top1_correct / total) * 100.0
        mean_mrr = mrr_sum / total
        mean_pos = sum(pos_sims) / total
        mean_neg = sum(neg_sims) / total
        margin = mean_pos - mean_neg

        print(f"\n[{name}]")
        print(f"  • Top-1 Retrieval Accuracy:       {top1_acc:.1f}%")
        print(f"  • Mean Reciprocal Rank (MRR):     {mean_mrr:.3f}")
        print(f"  • Mean Positive Cosine Sim:       {mean_pos:.3f}")
        print(f"  • Mean Negative Cosine Sim:       {mean_neg:.3f}")
        print(f"  • Semantic Discrimination Margin: {margin:+.3f}")

        return {"top1_acc": top1_acc, "mrr": mean_mrr, "pos_sim": mean_pos, "neg_sim": mean_neg, "margin": margin}

    # Load fine-tuned model checkpoint
    fine_tuned_model = PatentEmbeddingModel()
    if Path(model_path).exists():
        checkpoint = torch.load(model_path, weights_only=False)
        fine_tuned_model.load_state_dict(checkpoint["model_state_dict"])
    fine_tuned_model.eval()

    res_baseline = evaluate_lexical_baseline()
    res_finetuned = evaluate_neural_model(fine_tuned_model, "Fine-Tuned Patent Contrastive Embeddings")

    print("\n" + "=" * 65)
    print("Ablation Comparison Summary for M.Tech Review Rubric:")
    print(f"  • Mean Positive Cosine Alignment: {res_baseline['pos_sim']:.3f} -> {res_finetuned['pos_sim']:.3f} (+{(res_finetuned['pos_sim'] - res_baseline['pos_sim']):.3f})")
    print(f"  • Discrimination Margin Expansion: {res_baseline['margin']:+.3f} -> {res_finetuned['margin']:+.3f} (+{(res_finetuned['margin'] - res_baseline['margin']):.3f})")
    print("=" * 65)


if __name__ == "__main__":
    evaluate_embeddings()
