# GEMINI.md — PriorArt Copilot

Persistent project context for the AI agent. Read this in full before writing any code.
Treat it the way you'd treat a senior engineer's design doc: follow it, but flag anything
that looks wrong or underspecified instead of silently improvising around it.

---

## 1. What this project is

**PriorArt Copilot** — a multi-agent Retrieval-Augmented Generation (RAG) system that takes
a plain-language invention disclosure and produces a preliminary patentability / prior-art
screening report: what already exists that's close to this invention, broken down by which
specific part of the invention each piece of prior art threatens.

**Who it's for:** solo inventors, pre-seed startups, university tech-transfer offices, and
small IP law firms who can't justify a $3,000–5,000 professional attorney search for an
early-stage idea.

**What it is explicitly NOT:** a substitute for a registered patent attorney's opinion, a
tool for filing patents, or a legal-advice product. Every surface of the product — UI copy,
report headers, API responses — must make this disclaimer unmissable. See §7.

**Academic framing:** this is being built as an M.Tech AIML capstone project, evaluated
across four review milestones (Review 0 → Final). See §8 for the milestone-to-deliverable
mapping. Build in a way that produces demonstrable, working artifacts at each checkpoint —
not a big-bang delivery at the end.

---

## 2. System architecture — four agents, not one model

Do not build this as a single LLM call with a big prompt. The architecture is the
contribution — build it as four distinct, independently testable agents that hand off
structured data to each other.

```
Invention disclosure (plain text)
        │
        ▼
┌───────────────────────┐
│ 1. Disclosure Parser   │  Extracts claim elements from plain-language input.
│    Agent               │  Output: structured list of {element_id, description,
│                        │  IPC/CPC-candidate classification}
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ 2. Retrieval Agent     │  Searches patent literature + non-patent literature
│                        │  PER claim element (not one combined query).
│                        │  Output: {element_id → [candidate documents]}
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ 3. Novelty-Clustering  │  Groups retrieved documents by WHICH claim element
│    Agent               │  they threaten, not by raw document similarity.
│                        │  Output: {element_id → [ranked, scored prior art]}
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ 4. Report-Writer Agent │  Drafts the explainable memo. Every sentence must
│                        │  cite back to a specific retrieved document + passage.
└───────────────────────┘
```

**Non-negotiable design rule:** every agent's output must be structured (typed
JSON/Pydantic model), not free text passed as a blob to the next agent. If an agent's
output can't be validated against a schema, the pipeline should fail loudly at that step,
not silently degrade.

**Traceability rule:** the Report-Writer Agent may never assert a claim without a citation
to a specific document ID + passage that the Retrieval Agent actually returned. If you're
tempted to let the model "fill in" a plausible-sounding citation, don't — that's exactly
the hallucination failure mode this whole category of tool needs to avoid.

---

## 3. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Agent orchestration | LangGraph (preferred) or CrewAI | LangGraph gives explicit state/graph control, which suits the strict handoff schema above |
| LLM | Open-weight model (Llama or Mistral family) | No large-scale training needed — inference-only for v1. Confirm current recommended model with the user before hardcoding a version. |
| Embeddings | Domain-general sentence embedding model to start; revisit if patent-vocabulary mismatch shows up in eval | |
| Patent data | Google Patents Public Datasets (BigQuery) + EPO OPS API | Do NOT build against the USPTO Open Data Portal for v1 — it requires a registered, MFA-secured USPTO.gov account (effective June 2026), which adds friction the other two sources don't have |
| Non-patent literature | Semantic Scholar API | |
| Backend | Python | FastAPI if a service layer is needed |
| Schema validation | Pydantic | Enforces the structured-handoff rule in §2 |

Do not add new infra (a managed vector DB, a hosted orchestration platform, etc.) without
checking in — v1 should run on a single GPU or modest cloud credits, no training pipeline.

---

## 4. Scope boundaries — v1

**In scope:**
- Text-based invention disclosures only
- Two technical domains: mechanical & electronics
- English-language input and sources
- Output: a preliminary screening report with inline citations

**Explicitly out of scope for v1 — do not build these unless asked:**
- Formal legal opinion generation or anything implying attorney sign-off
- Drawing/figure-based (image) novelty search
- Jurisdictions beyond US and EP filings
- Real-time monitoring of new filings
- Any UI beyond what's needed to demo the pipeline

If a task seems to require stepping outside this scope, stop and ask rather than expanding
scope silently.

---

## 5. Repository structure

```
priorart-copilot/
├── GEMINI.md                  # this file
├── README.md                  # setup + how to run
├── agents/
│   ├── disclosure_parser.py
│   ├── retrieval_agent.py
│   ├── novelty_clustering.py
│   └── report_writer.py
├── schemas/                   # Pydantic models for every inter-agent handoff
├── connectors/
│   ├── google_patents.py
│   ├── epo_ops.py
│   └── semantic_scholar.py
├── pipeline/
│   └── graph.py                # LangGraph wiring of the 4 agents
├── eval/
│   ├── disclosures/             # the 30 hand-curated test disclosures (see §6)
│   └── metrics.py
├── tests/
└── notebooks/                   # exploratory only — nothing load-bearing lives here
```

---

## 6. Evaluation — build this alongside the pipeline, not after

- **Test set:** 30 manually curated invention disclosures with known prior art, built by
  the project team. This is the backbone of every review's "preliminary results" — start
  curating it in parallel with Review 0, don't leave it for Review 2.
- **Metrics per agent:**
  - Disclosure Parser: element-recall against hand-annotated ground truth (target ≥80%)
  - Retrieval Agent: top-20 candidate coverage per claim element
  - Novelty-Clustering Agent: precision/recall of claim-element-to-document assignment
  - Report-Writer Agent: citation accuracy (does every cited passage actually exist and
    actually support the claim made about it?) — this is the most important metric in the
    whole system and the easiest one to fake, so don't skip it
- **End-to-end benchmark:** compare system output against 10 real, public patent-office
  rejections (i.e., cases where we know what prior art the examiner actually cited) to
  measure real-world precision/recall.

---

## 7. Ethical & legal guardrails — bake these into the product, not just the docs

- Every report the Report-Writer Agent produces must open with an explicit, unmissable
  disclaimer: preliminary screening only, not a formal patentability opinion, not a
  substitute for a registered patent attorney.
- Store only what the user submits (the invention disclosure text) and only with explicit
  consent, solely for the purpose of running the search. No secondary use.
- All retrieval sources are public/openly licensed — never add a scraper for paywalled
  content, even if it would improve coverage.
- Don't let report language drift toward certainty ("this is patentable") — outputs should
  always be phrased as risk/similarity findings, not verdicts.

---

## 8. Milestone map

| Review | Date | What must exist and work |
|---|---|---|
| Review 0 | Aug 18 | Scoped problem statement, 15–20 papers surveyed, feasibility confirmed, this repo scaffolded |
| Review 1 | Sep 17 | Architecture finalized, connectors to Google Patents / EPO OPS / Semantic Scholar working end-to-end on at least dummy queries, eval metrics defined, 30-disclosure test set drafted |
| Review 2 | Oct 13 | Disclosure Parser + Retrieval Agent fully working and demoed live (not screenshots); Novelty-Clustering Agent at least partially working; preliminary numbers against the test set, including failure cases |
| Final | Nov 3 | All 4 agents working end-to-end; benchmark against the 10 real rejection cases; full report + reproducible repo (requirements.txt / environment.yml, README with run instructions) |

At every review, prioritize a working demo over polished slides. If something isn't
working, say so and show the failure case — the rubric explicitly rewards honest error
analysis over overclaiming.

---

## 9. Working agreements for the agent

- Prefer small, testable commits per agent module over one large change touching the whole
  pipeline.
- When a connector (Google Patents / EPO OPS / Semantic Scholar) is unavailable or rate
  limited during development, fail with a clear error — don't silently substitute mock
  data into a real run without flagging it.
- Every new agent module needs at least one test that exercises it against a real (small)
  input, not just a schema-validation test.
- If you're about to fabricate a citation, a paper reference, or an API response shape you
  haven't actually verified, stop and say so instead of guessing — this project's entire
  value proposition is not hallucinating citations, so the codebase can't either.
