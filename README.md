# PriorArt Copilot

> **A Multi-Agent Retrieval-Augmented Generation (RAG) System for Preliminary Patentability & Prior-Art Screening.**

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Architecture](https://img.shields.io/badge/architecture-4--Agent--RAG-green.svg)]()
[![Free-Tier Ready](https://img.shields.io/badge/API-Free--Tier--Zero--Cost-brightgreen.svg)]()

---

## 1. What This Is

PriorArt Copilot deconstructs plain-language invention disclosures into distinct claim elements, executes element-specific searches across patent literature and non-patent academic databases, groups candidate prior art by which claim element it threatens, and synthesizes an explainable preliminary screening report with traceable, inline citations.

> **LEGAL & ETHICAL DISCLAIMER (§7 of GEMINI.md)**:
> This system is **NOT** a substitute for a registered patent attorney's opinion, a tool for filing patents, or a legal-advice product. Outputs represent preliminary risk/similarity findings for academic and exploratory research.

---

## 2. Multi-Agent Architecture

```
Invention disclosure (plain text)
        │
        ▼
┌───────────────────────────┐
│ 1. Disclosure Parser      │  Extracts claim elements, IPC/CPC candidates, and keywords.
│    Agent                  │  Output: Typed ParsedDisclosure Pydantic schema
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ 2. Retrieval Agent        │  Searches patent + academic literature PER claim element.
│                           │  Output: Typed RetrievalOutput schema
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ 3. Novelty-Clustering     │  Maps candidates to specific elements they threaten.
│    Agent                  │  Output: Typed NoveltyClusteringOutput schema
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ 4. Report-Writer Agent    │  Drafts screening memo with verified inline citations.
│                           │  Output: Typed PriorArtReport schema
└───────────────────────────┘
```

---

## 3. Quick Start (Free Tier / Zero Cost)

### Installation
```bash
git clone <repo-url>
cd priorart-copilot
pip install -r requirements.txt
```

### Environment Variables (Optional Free Keys)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/) if available. If no key is set, the system automatically uses deterministic heuristic search and the local patent corpus without incurring any cost.

### Running a Screening via CLI
```bash
# Run screening on a sample disclosure
python main.py --disclosure eval/disclosures/disclosure_01_mechanical.json

# Save report to Markdown
python main.py --disclosure eval/disclosures/disclosure_02_electronics.json --output report.md
```

### Running Benchmark & Metrics
```bash
python -m eval.metrics
```

### Running Test Suite
```bash
pytest -v tests/
```

---

## 4. Evaluation & Review Milestone Mapping

| Milestone | Deliverables & Status |
|---|---|
| **Review 0** | Scoped problem statement, 4-agent architecture, repository scaffolded with Pydantic contracts. |
| **Review 1** | Public connectors (Google Patents, EPO OPS, Semantic Scholar), eval metrics defined, 30-disclosure test set curated. |
| **Review 2** | Disclosure Parser + Retrieval Agent live demo; element-by-element novelty clustering; error analysis. |
| **Final** | Full 4-agent pipeline; benchmark against 10 real patent examiner rejection cases; full reproducibility. |
