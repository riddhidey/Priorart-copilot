# ==============================================================================
# PriorArt Copilot — Contrastive Patent Embedding Model Training Pipeline
# Implements InfoNCE / Contrastive learning using PyTorch to project patent texts
# into a dense metric space where valid prior art clusters with matching claim elements.
# ==============================================================================

# Standard library modules for OS, JSON parsing, math, and type hinting
import os
import json
import math
import numpy as np

# PyTorch deep learning modules: tensors, neural layers, and optimization algorithms
import torch
import torch.nn as nn
import torch.optim as optim
from pathlib import Path
from typing import List, Dict, Tuple

# Helper function to generate training triplets if dataset is not yet present
from train.prepare_dataset import prepare_datasets


# Lightweight Tokenizer: Generates deterministic bag-of-words and character n-gram vectors
class SimpleVocabularyTokenizer:
    """Lightweight character/subword n-gram & word tokenizer for deterministic vectorization."""
    
    # Initialize tokenizer with a fixed hashing vocabulary size (default 4096 dimensions)
    def __init__(self, vocab_size: int = 4096):
        self.vocab_size = vocab_size

    # Vectorize arbitrary patent text into an L2-normalized bag-of-ngrams PyTorch tensor
    def encode(self, text: str) -> torch.Tensor:
        # Pre-clean string: lowercase, replace hyphens and slashes with spaces, split words
        words = text.lower().replace("-", " ").replace("/", " ").split()
        indices = []
        
        # Hash each full word and subword 3-gram into vocabulary bucket indices
        for w in words:
            # Word-level feature hash
            h_word = abs(hash(w)) % self.vocab_size
            indices.append(h_word)
            
            # Subword 3-gram feature hashes to capture technical prefixes, roots, and suffixes
            if len(w) >= 3:
                for i in range(len(w) - 2):
                    h_sub = abs(hash(w[i:i+3])) % self.vocab_size
                    indices.append(h_sub)

        # Allocate zero tensor and increment term frequency for mapped feature buckets
        vec = torch.zeros(self.vocab_size, dtype=torch.float32)
        for idx in indices:
            vec[idx] += 1.0
            
        # Apply L2 Euclidean normalization so vector magnitudes equal 1.0
        norm = torch.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec


# Neural Network: Deep non-linear projection model projecting hashed tokens to dense 256-dim embedding space
class PatentEmbeddingModel(nn.Module):
    """Deep patent contrastive projection network."""
    
    # Model architecture definition: Multi-layer perceptron with LayerNorm and SiLU activation
    def __init__(self, input_dim: int = 4096, hidden_dim: int = 512, embed_dim: int = 256):
        super().__init__()
        # 2-layer projection head: 4096 -> 512 -> 256 dimensions
        self.encoder = nn.Sequential(
            # Input projection layer
            nn.Linear(input_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.SiLU(),
            nn.Dropout(0.1),
            # Final bottleneck embedding layer
            nn.Linear(hidden_dim, embed_dim),
            nn.LayerNorm(embed_dim)
        )

    # Forward propagation: passes input through encoder and normalizes onto unit hypersphere
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        raw_emb = self.encoder(x)
        # L2-normalize embeddings to unit hypersphere for fast cosine similarity dot-products
        return nn.functional.normalize(raw_emb, p=2, dim=-1)


# Main Training Loop: Executes InfoNCE contrastive optimization on patent triplets
def train_patent_embeddings(
    data_file: str = "train/data/patent_triplets_train.jsonl",
    output_model_path: str = "train/models/patent_embedder.pt",
    epochs: int = 35,
    lr: float = 3e-3,
    temperature: float = 0.07
):
    # Print training setup banner
    print("=" * 60)
    print("Patent Contrastive Embedding Training (InfoNCE / Contrastive)")
    print("=" * 60)

    # Ensure dataset exists; automatically prepare if missing
    if not Path(data_file).exists():
        prepare_datasets()

    # Load patent triplets from JSONL file
    samples = []
    with open(data_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                samples.append(json.loads(line))

    print(f"Loaded {len(samples)} augmented patent contrastive training triplets.")

    # Initialize tokenizer, neural projection model, AdamW optimizer, and Cross-Entropy loss
    tokenizer = SimpleVocabularyTokenizer()
    model = PatentEmbeddingModel()
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-3)
    cross_entropy = nn.CrossEntropyLoss()

    # Pre-encode all queries, positives, and negatives into tensor batches
    queries_tensor = torch.stack([tokenizer.encode(s["query"]) for s in samples])
    positives_tensor = torch.stack([tokenizer.encode(s["positive"]) for s in samples])
    negatives_tensor = torch.stack([tokenizer.encode(s["negative"]) for s in samples])

    # Put neural network in training mode
    model.train()
    print(f"\nTraining Patent Embedding Model for {epochs} epochs...")

    # Iterate through training epochs
    for epoch in range(1, epochs + 1):
        # Reset gradient accumulators
        optimizer.zero_grad()
        
        # Forward pass: compute unit embeddings for queries, positives, and negatives
        q_emb = model(queries_tensor)
        pos_emb = model(positives_tensor)
        neg_emb = model(negatives_tensor)

        # Compute cosine similarity scaled by temperature hyperparameter
        pos_sim = torch.sum(q_emb * pos_emb, dim=-1) / temperature
        neg_sim = torch.sum(q_emb * neg_emb, dim=-1) / temperature

        # Construct logits matrix where index 0 is positive target and index 1 is negative target
        logits = torch.stack([pos_sim, neg_sim], dim=-1)
        # Ground-truth targets: class 0 (positive prior art) is always the correct match
        targets = torch.zeros(len(samples), dtype=torch.long)

        # Compute InfoNCE loss and backpropagate gradients
        loss = cross_entropy(logits, targets)
        loss.backward()
        optimizer.step()

        # Compute average cosine similarities for tracking training margin progression
        mean_pos = torch.sum(q_emb * pos_emb, dim=-1).mean().item()
        mean_neg = torch.sum(q_emb * neg_emb, dim=-1).mean().item()

        # Log epoch progress every 7 epochs
        if epoch % 7 == 0 or epoch == 1:
            print(f"  Epoch [{epoch:02d}/{epochs:02d}] | Loss: {loss.item():.4f} | Pos CosSim: {mean_pos:.3f} | Neg CosSim: {mean_neg:.3f} | Margin: {(mean_pos - mean_neg):+.3f}")

    # Ensure output model directory exists
    out_dir = Path(output_model_path).parent
    out_dir.mkdir(parents=True, exist_ok=True)

    # Save fine-tuned model checkpoint state dictionary and architecture parameters
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


# CLI entrypoint to execute training directly from terminal
if __name__ == "__main__":
    train_patent_embeddings()
