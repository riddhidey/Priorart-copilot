import os
import json
import math
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from pathlib import Path
from typing import List, Dict, Tuple
from train.prepare_dataset import prepare_datasets


class SimpleVocabularyTokenizer:
    """Lightweight character/subword n-gram & word tokenizer for deterministic vectorization."""
    def __init__(self, vocab_size: int = 4096):
        self.vocab_size = vocab_size

    def encode(self, text: str) -> torch.Tensor:
        words = text.lower().replace("-", " ").replace("/", " ").split()
        indices = []
        for w in words:
            # Word hash
            h_word = abs(hash(w)) % self.vocab_size
            indices.append(h_word)
            # Subword 3-gram hashes
            if len(w) >= 3:
                for i in range(len(w) - 2):
                    h_sub = abs(hash(w[i:i+3])) % self.vocab_size
                    indices.append(h_sub)

        vec = torch.zeros(self.vocab_size, dtype=torch.float32)
        for idx in indices:
            vec[idx] += 1.0
        # L2 normalize bag-of-ngrams
        norm = torch.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec


class PatentEmbeddingModel(nn.Module):
    """Deep patent contrastive projection network."""
    def __init__(self, input_dim: int = 4096, hidden_dim: int = 512, embed_dim: int = 256):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.SiLU(),
            nn.Dropout(0.1),
            nn.Linear(hidden_dim, embed_dim),
            nn.LayerNorm(embed_dim)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        raw_emb = self.encoder(x)
        # Normalize to unit sphere for cosine similarity
        return nn.functional.normalize(raw_emb, p=2, dim=-1)


def train_patent_embeddings(
    data_file: str = "train/data/patent_triplets_train.jsonl",
    output_model_path: str = "train/models/patent_embedder.pt",
    epochs: int = 35,
    lr: float = 3e-3,
    temperature: float = 0.07
):
    print("=" * 60)
    print("Patent Contrastive Embedding Training (InfoNCE / Contrastive)")
    print("=" * 60)

    # Ensure dataset exists
    if not Path(data_file).exists():
        prepare_datasets()

    samples = []
    with open(data_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                samples.append(json.loads(line))

    print(f"Loaded {len(samples)} augmented patent contrastive training triplets.")

    tokenizer = SimpleVocabularyTokenizer()
    model = PatentEmbeddingModel()
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-3)
    cross_entropy = nn.CrossEntropyLoss()

    # Pre-encode data
    queries_tensor = torch.stack([tokenizer.encode(s["query"]) for s in samples])
    positives_tensor = torch.stack([tokenizer.encode(s["positive"]) for s in samples])
    negatives_tensor = torch.stack([tokenizer.encode(s["negative"]) for s in samples])

    model.train()
    print(f"\nTraining Patent Embedding Model for {epochs} epochs...")

    for epoch in range(1, epochs + 1):
        optimizer.zero_grad()
        
        q_emb = model(queries_tensor)
        pos_emb = model(positives_tensor)
        neg_emb = model(negatives_tensor)

        pos_sim = torch.sum(q_emb * pos_emb, dim=-1) / temperature
        neg_sim = torch.sum(q_emb * neg_emb, dim=-1) / temperature

        logits = torch.stack([pos_sim, neg_sim], dim=-1)
        targets = torch.zeros(len(samples), dtype=torch.long)

        loss = cross_entropy(logits, targets)
        loss.backward()
        optimizer.step()

        mean_pos = torch.sum(q_emb * pos_emb, dim=-1).mean().item()
        mean_neg = torch.sum(q_emb * neg_emb, dim=-1).mean().item()

        if epoch % 7 == 0 or epoch == 1:
            print(f"  Epoch [{epoch:02d}/{epochs:02d}] | Loss: {loss.item():.4f} | Pos CosSim: {mean_pos:.3f} | Neg CosSim: {mean_neg:.3f} | Margin: {(mean_pos - mean_neg):+.3f}")

    # Save model weights and configuration
    out_dir = Path(output_model_path).parent
    out_dir.mkdir(parents=True, exist_ok=True)

    torch.save({
        "model_state_dict": model.state_dict(),
        "input_dim": 4096,
        "hidden_dim": 512,
        "embed_dim": 256,
        "epochs": epochs,
        "final_loss": loss.item()
    }, output_model_path)

    print(f"\n[Training Complete] Fine-tuned model checkpoint saved to: {output_model_path}")
    return model, tokenizer


if __name__ == "__main__":
    train_patent_embeddings()
