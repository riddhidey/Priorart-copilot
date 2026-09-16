# PriorArt Copilot — Complete Project Walkthrough

> **Autonomous 4-Agent Retrieval-Augmented Generation (RAG) System for Preliminary Patentability & Prior-Art Screening.**

---

## 1. Executive Summary & Core Value Proposition

### The Problem
Filing a patent without prior-art screening leads to costly examiner rejections under **35 U.S.C. § 102 (Anticipation / Lack of Novelty)** and **35 U.S.C. § 103 (Obviousness / Lack of Inventive Step)**. Professional patent clearance searches cost thousands of dollars, while generic LLMs hallucinate non-existent patent numbers, misquote prior art, and fail to map claims to legal statutory thresholds.

### The Solution
**PriorArt Copilot** automates preliminary patent screening with rigorous technical and legal traceability:
1. **Claims Decomposition**: Breaks plain-language invention disclosures into discrete, testable structural claim elements.
2. **Element-Specific Retrieval**: Conducts targeted searches per claim element across global patent registries and academic literature.
3. **Novelty Threat Clustering**: Maps discovered prior art to the specific claim elements it threatens, classifying risks according to statutory patent law criteria.
4. **Explainable Synthesis**: Generates a 2D Threat Matrix Heatmap, a claim-by-claim gap analysis, and 100% verified inline citations linking to official patent office records.

---

## 2. Multi-Agent Architecture

```
                  Raw Invention Disclosure (Plain Language Text)
                                       │
                                       ▼
    ┌──────────────────────────────────────────────────────────────────────┐
    │  AGENT 1: DISCLOSURE PARSER (agents/disclosure_parser.py)            │
    │  • Deconstructs disclosure into discrete structural claim elements   │
    │  • Assigns IPC / CPC candidate patent classification codes           │
    │  • Generates technical keywords per element                          │
    │  Output: Typed ParsedDisclosure schema                               │
    └──────────────────────────────────┬───────────────────────────────────┘
                                       │
                                       ▼
    ┌──────────────────────────────────────────────────────────────────────┐
    │  AGENT 2: RETRIEVAL AGENT (agents/retrieval_agent.py)                │
    │  • Performs domain-specific patent lexicon expansion (synonyms)      │
    │  • Queries Google Patents, EPO OPS, Semantic Scholar, & local corpus │
    │  • Conducts targeted queries for each claim element individually     │
    │  Output: Typed RetrievalOutput schema                                │
    └──────────────────────────────────┬───────────────────────────────────┘
                                       │
                                       ▼
    ┌──────────────────────────────────────────────────────────────────────┐
    │  AGENT 3: NOVELTY CLUSTERING AGENT (agents/novelty_clustering.py)    │
    │  • Aligns candidate document text against specific claim elements    │
    │  • Computes overlap scores and assigns threat levels:                │
    │    - HIGH: Direct overlap (35 U.S.C. § 102 Anticipation)             │
    │    - MODERATE: Analogous art (35 U.S.C. § 103 Obviousness)           │
    │    - LOW / NONE: Safe differentiation ("Novelty Gap")                │
    │  Output: Typed NoveltyClusteringOutput schema                        │
    └──────────────────────────────────┬───────────────────────────────────┘
                                       │
                                       ▼
    ┌──────────────────────────────────────────────────────────────────────┐
    │  AGENT 4: REPORT SYNTHESIZER AGENT (agents/report_writer.py)         │
    │  • Synthesizes executive assessment and claim-by-claim breakdown     │
    │  • Builds the 2D Threat Matrix Heatmap                               │
    │  • Validates citation authenticity (verifies cited quotes exist)     │
    │  • Formulates strategic claim drafting recommendations               │
    │  Output: Typed PriorArtReport schema                                 │
    └──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Agent Specifications & Data Contracts

### Agent 1: Disclosure Parser (`agents/disclosure_parser.py`)
- **Role**: Parses raw text into discrete functional claim elements and infers technical domain and IPC codes.
- **Input Contract**: `InventionDisclosure` (title, raw text, technical domain).
- **Output Contract**: `ParsedDisclosure` containing a list of `ClaimElement` models:
  ```json
  {
    "element_id": "elem_01",
    "title": "Rotor Hub Assembly with Dual Bearings",
    "description": "Central hub having four blade grips seated on pre-loaded dual angular ball bearings.",
    "keywords": ["rotor hub", "ball bearing", "angular contact", "grip assembly"],
    "ipc_classes": ["B64C 27/00", "B64C 27/32"]
  }
  ```
- **Interactive Review**: Powers **Claim Review Mode**, enabling inventors to review, tweak, or add claim elements before initiating search operations.

### Agent 2: Retrieval Agent (`agents/retrieval_agent.py`)
- **Role**: Expands technical keywords into patent lexicons and queries multiple data backends on a per-element basis.
- **Connectors**:
  - `GooglePatentsConnector`: Global patent search across US, EP, WO, CN, JP publications.
  - `EpoOpsConnector`: European Patent Office Open Patent Services API.
  - `SemanticScholarConnector`: Peer-reviewed academic papers and non-patent literature (NPL).
  - `MockPatentCorpus`: Deterministic offline patent corpus for zero-cost, instant local testing.
- **Output Contract**: `RetrievalOutput` containing mapped `ElementRetrievalResult` objects.

### Agent 3: Novelty Clustering Agent (`agents/novelty_clustering.py`)
- **Role**: Evaluates overlap between retrieved candidate text and each individual claim element.
- **Classification Categories**:
  - **HIGH RISK** (35 U.S.C. § 102): Direct technical overlap with an existing patent.
  - **MODERATE RISK** (35 U.S.C. § 103): Substantially similar or analogous concept.
  - **LOW / SAFE**: Negligible overlap, indicating the inventor's **Novelty Gap**.
- **Output Contract**: `NoveltyClusteringOutput` with ranked `PriorArtThreat` ratings per document.

### Agent 4: Report Synthesizer Agent (`agents/report_writer.py`)
- **Role**: Generates an audit-ready legal screening memorandum.
- **Key Deliverables**:
  - Executive Novelty Risk Score (`HIGH`, `MEDIUM`, `LOW`).
  - 2D Prior-Art Threat Matrix Heatmap.
  - Claim-by-claim technical gap breakdown.
  - Master index of verified citations with active Google Patents links.
  - Actionable claim refinement recommendations.

---

## 4. The 2D Prior-Art Threat Matrix

```
                      Existing Patents (Prior Art Documents)
                             ┌────────────────┬────────────────┐
                             │ US-10457388-B2 │ EP-3205574-A1  │
┌────────────────────────────┼────────────────┼────────────────┤
│ [elem_01] Rotor Hub        │    🔴 HIGH     │    🟡 MOD      │
│ [elem_02] Pushrod Actuator │    🔴 HIGH     │      —         │
│ [elem_03] Magnetic Sensor  │    🟢 LOW      │      —         │
└────────────────────────────┴────────────────┴────────────────┘
▲
Your Invention's Claim Elements
```

### Strategic Value to Inventors
- **Red Overlaps (HIGH)**: Features that an examiner will reject under § 102 if claimed broadly in an independent claim.
- **Green / Empty Cells (LOW / Safe)**: The **Novelty Gap**—the defensible, innovative core of your invention. Patent claims should tie broad features directly to this novel mechanism.

---

## 5. Web Interface & User Experience System

The user interface (`web/index.html`, `web/style.css`, `web/app.js`) is engineered to modern SaaS standards:

1. **Four Synchronized Color Themes**:
   - 🟢 **Phosphor Green**: Modern dark phosphor theme with subtle accent glows.
   - ⚪ **Obsidian Dark**: Pure monochrome dark mode for minimal distraction.
   - ☀️ **Clean Light**: High-contrast slate theme designed for print and daytime viewing.
   - 🟡 **Amber CRT**: Retro amber terminal aesthetic.
2. **Subtle Technical Animated Background**:
   - Multi-layer technical background featuring traveling grid lines, luminous ambient orbs, a sweeping scan-beam, and an interactive constellation canvas.
3. **Dual Execution Modes**:
   - **Full Auto (4 Agents)**: Instant end-to-end execution.
   - **Claim Review Mode**: Interactive pause after Agent 1 to review and edit claim elements before search.
4. **Convenience Utilities**:
   - **Instant Presets**: Pre-loaded disclosures (*Drone Rotor*, *Acoustic Harvester*, *Micro-Stepper*) with zero-latency local fallback.
   - **Broadcast Mode**: Fullscreen, presentation-ready layout for screen sharing and demos.
   - **Export Tools**: **Copy Markdown** for documentation and **Print / PDF** for report export.
   - **Author Attribution**: Clean footer with author attribution (*Riddhi Dey*) and GitHub repository link.

---

## 6. Evaluation, Benchmarking & Ground Truth

The project includes an automated evaluation suite (`eval/metrics.py`) benchmarked against curated test cases (`eval/disclosures/`):

| KPI Metric | Benchmark Target | Description |
|---|---|---|
| **Claim Element Recall** | $\ge 80.0\%$ | Measures the agent's ability to deconstruct all independent limitations from a raw disclosure. |
| **Prior-Art Coverage** | $\ge 75.0\%$ | Measures whether known prior art cited in examiner rejections is successfully retrieved. |
| **Citation Authenticity** | **$100.0\%$** | Zero-hallucination verification ensuring every cited quote exists verbatim in retrieved documents. |

Users can trigger this evaluation suite directly from the **Benchmark Suite** tab in the UI.

---

## 7. Directory Structure & Key Files

```
Priorart-copilot/
├── agents/                       # Autonomous Agent Modules
│   ├── disclosure_parser.py      # Agent 1: Claim decomposition & IPC tagging
│   ├── retrieval_agent.py        # Agent 2: Lexicon expansion & multi-connector search
│   ├── novelty_clustering.py     # Agent 3: Threat scoring (§ 102 vs § 103)
│   ├── report_writer.py          # Agent 4: Report synthesis & citation verification
│   └── llm_client.py             # Dual engine: Gemini API + deterministic fallback
├── connectors/                   # External Data Connectors
│   ├── base.py                   # Abstract connector interface
│   ├── google_patents.py         # Google Patents search connector
│   ├── epo_ops.py                # European Patent Office OPS API connector
│   ├── semantic_scholar.py       # Non-patent academic literature connector
│   └── mock_index.py             # Deterministic local patent index
├── schemas/                      # Typed Pydantic Data Contracts
│   ├── disclosure.py             # Input & parsed disclosure models
│   ├── retrieval.py              # Retrieved document & candidate models
│   ├── clustering.py             # Threat levels & cluster models
│   └── report.py                 # Final screening memo models
├── pipeline/                     # Pipeline Orchestration
│   ├── state.py                  # PipelineState tracking execution & errors
│   └── graph.py                  # PriorArtPipeline sequential execution engine
├── eval/                         # Evaluation & Benchmarks
│   ├── metrics.py                # Recall, coverage, and citation accuracy calculators
│   └── disclosures/              # Curated ground-truth test cases (.json)
├── web/                          # Frontend User Interface
│   ├── index.html                # Semantic HTML5 layout & components
│   ├── style.css                 # Vanilla CSS design system (4 themes, animations)
│   └── app.js                    # Resilient client logic & event handling
├── server.py                     # FastAPI backend application
├── main.py                       # CLI entrypoint for running screenings
├── api/index.py                  # Vercel serverless function entrypoint
├── vercel.json                   # Vercel deployment configuration
├── requirements.txt              # Python dependencies
├── PATENT_SCREENING_GUIDE.md     # In-depth guide on interpreting reports & patent codes
└── PROJECT_WALKTHROUGH.md        # Comprehensive project walkthrough (this file)
```

---

## 8. Industrial Preloader & 3D Interactive Point-Cloud Globe

Inspired by precision industrial telemetry and the WeEvolveIT landing experience, PriorArt Copilot features a real-time 3D hero visualization and loading sequence:

1. **Industrial Milestone Preloader**:
   - `001%` to `100%` monospace progress counter with reticle corner brackets (`┌ ┐ └ ┘`).
   - 4 discrete milestone phases:
     - **Phase 01/04**: Initializing Claim Decomposition Matrix
     - **Phase 02/04**: Synchronizing Global Registries (USPTO, EPO, WIPO, CNIPA, JPO)
     - **Phase 03/04**: Compiling Fibonacci 3D Point Cloud & Geolocation
     - **Phase 04/04**: System Armed — Disclosure Radar Online
   - Segmented technical progress track with instant `[SKIP]` / `[ESC]` escape hatch.

2. **3D Fibonacci Point-Cloud Globe (Three.js)**:
   - High-density spherical lattice (~4,200 points) sampling Earth's continental landmasses from offline Natural Earth vector boundaries via an offscreen 2D canvas sampler.
   - Landmass vertices render with vibrant theme accents and larger particle sizes, while ocean coordinates render with subdued secondary tones.
   - Atmospheric orbital rings, equatorial latitude circles, and polar meridian wireframes aligned at Earth's ~23.44° axial tilt.

3. **Visitor Geolocation Triangulation & 3D Beacon**:
   - Real-time client IP/geolocation lookup via `geojs.io` (latitude, longitude, city, country, and ping latency).
   - Projects client coordinates to 3D Cartesian space on the sphere surface ($R = 86$).
   - Renders an active 3D beacon pin with continuous expanding radar wave rings.
   - Interactive camera auto-rotation smoothly rotates the globe to bring the visitor's node directly to the center perspective.

4. **Multi-Theme Synchronization (`Green`, `Dark`, `Light`, `Amber`)**:
   - The preloader, 3D globe particle vertices, beacon pin, and HUD telemetry cards dynamically adapt in real-time when switching between any of the 4 themes:
     - **Phosphor Green**: Classic CRT terminal styling (`#86efac`)
     - **Obsidian Dark**: Precision monochromatic aesthetic (`#ffffff`)
     - **Clean Light**: High-contrast architectural slate navy & cobalt (`#0284c7`)
     - **Amber CRT**: Vintage warm industrial cathode styling (`#fbbf24`)

5. **Live Reactive Typing Radar & 3D Ballistic Trajectory Arcs**:
   - As the user types an invention title or description (debounced ~200ms), the system extracts technical keywords and scans domain innovation databases.
   - Dynamically highlights **Official Patent Registries** (USPTO, EPO, WIPO, JPO, CNIPA) and **Assignee Innovation Clusters** (e.g., DJI in Shenzhen, Boeing in Chicago, Murata in Kyoto, Faulhaber in Germany, MIT Lincoln Lab, etc.) on the 3D globe.
   - Generates curved 3D Bézier radar ballistic arcs connecting the visitor node to each active prior-art hub with flying photon energy pulses.
   - Synchronizes the left HUD table to display live matching patent hit volumes and similarity percentages per patent jurisdiction.
   - Interactive hover raycasting reveals detailed reference patent metadata cards (`US11046432B2`, `EP3691954A1`, `CN108928501B`, etc.).

6. **Broadcast Theater Mode & High-Contrast Recognizable Continents**:
   - **Full-Viewport Sizing (`74vh`)**: In Broadcast presentation mode (`#btn-broadcast-mode` / `#btn-radar-broadcast`), the 3D globe expands to 74% of the viewport height with wide-screen projection, making telemetry arcs, radar pings, and continents immediately prominent.
   - **High-Contrast Landmask Rendering**: Resolved alpha sampler bug so continental landmasses (Americas, Eurasia, Africa, Australasia) contrast sharply against the dark ocean point matrix across all four color themes.
   - **Responsive Aspect-Ratio Fitting**: Dynamic camera FOV and distance fitting prevents horizontal clipping on narrow screens or split windows, automatically centering the 3D globe at the top on smaller viewports.

7. **Rich Tactical Sphere Topology & Orbital Surveillance Elements**:
   - **Tactical Latitude/Longitude Graticule Lattice**: Parallels every 20° and meridians every 45° wrap the entire sphere, eliminating visual voids across open oceans.
   - **3D Polar Radar Surveillance Sweep Beam**: Rotating 360° leading sweep line with decaying triangular phosphor fan beam (`24 RPM`) simulating real-time radar interrogation.
   - **Atmospheric Curvature Inner Core Sphere**: Translucent volumetric inner sphere giving solid physical depth and planetary presence behind the Fibonacci matrix lattice.
   - **Orbital Surveillance Satellites**: 3 active satellite crafts (`SAT-USPTO`, `SAT-EPO`, `SAT-WIPO`) with solar panels and pulsing radio beacon waves orbiting on inclined tracks.
   - **Concentric Radar Range Rings & Tactical Corner Badges**: Fixed range rings (`5,000`–`20,000 KM`) and live telemetry status indicators in the stage corners.

8. **Threat-Level Node Coloring & Distinct Main Telemetry Origin Node**:
   - **Distinct Main Telemetry Node (Client Origin)**:
     - Styled in **Radiant Neon Magenta / Violet (`#d946ef` / `#e879f9`)** to distinctly separate it from all threat levels and theme palettes.
     - Elevated beacon stem (`12` units) with a prominent crystal tip (`2.0` radius) and dual concentric pulsing radar wave rings (`waveMesh` + `wave2Mesh`).
     - Persistent branding across HUD badges (`★ MAIN TELEMETRY NODE`), 3D tooltip overlay, and left control panel status cards.
   - **Dynamic Threat-Level Coloring for Target Nodes & Arcs**:
     - **High Threat / Direct Overlap (≥90%)**: Vivid Neon Red (`#ef4444`) with spherical head, matching ballistic trajectory arc, and flying photon particle.
     - **Moderate Threat / Analogous Art (80%–89%)**: Electric Amber (`#f59e0b`) indicating potential obviousness under 35 U.S.C. § 103.
     - **Low Threat / Distant Art (<80%)**: Emerald Mint Green (`#10b981`) highlighting safe differentiation zones.
     - **Official Patent Registries (USPTO, EPO, WIPO, JPO, CNIPA)**: Cobalt Cyan Blue (`#0ea5e9`) with an Octahedron diamond head geometry (`1.8` radius) and 8.5-unit elevation stem.
   - **Interactive Threat Legend & Assignee Badges**:
     - Updated legend with real-time indicators for Main Node, High (≥90%), Mod (80-89%), Low (<80%), and Registry.
     - Assignee cards in the left HUD display color-coded glowing dots, colored left borders, and exact threat level pills corresponding to their globe nodes.

9. **High-Definition Continental Landmass Highlighting & 3D Topographic Relief**:
   - **Fixed Longitude Sampling Normalization**: Fixed latitude/longitude inverse formula so that points on the Eastern Hemisphere (Eurasia, Africa, India, China, Japan, Australia) sample the SVG landmask canvas at their exact geographic longitude instead of being clamped to zero.
   - **Dual Point Cloud Architecture**: Separated the globe into two specialized point systems:
     - **Continental Landmasses (`landPointsMesh`)**: Dense `3.6px` luminous points elevated radially to `R + 0.7` with `1.0` solid opacity, creating distinct physical topographic relief.
     - **Ocean Reference Matrix (`oceanPointsMesh`)**: Subtle `1.7px` points at base radius `R` with muted `0.28` opacity, letting continental coastlines boldly stand out.
   - **Ultra-High Resolution (`8,400` Points)**: Increased Fibonacci sampling density from 5,400 to 8,400 points for razor-sharp continental coastlines and island arcs across all 4 themes.

---

## 10. How to Run and Test

### Local Execution
```bash
# 1. Start the FastAPI backend server
python server.py

# 2. Access the UI
# Open http://127.0.0.1:8000 in your browser
```

### CLI Execution
```bash
# Run a screening from the terminal
python main.py --disclosure eval/disclosures/disclosure_01_mechanical.json --output report.md
```

### Run Benchmark Suite
```bash
# Execute the benchmark suite across all evaluation disclosures
python -m eval.metrics
```

### Run Unit Tests
```bash
# Run pytest test suite
pytest -v tests/
```

---

## 10. Legal & Ethical Disclaimer

> **IMPORTANT NOTICE**: PriorArt Copilot is an AI-assisted research and exploration workstation. Its outputs represent preliminary risk and similarity assessments and do **not** constitute legal advice or a formal patentability opinion. Users must consult a registered patent attorney or patent agent prior to making filing decisions or taking legal actions before the USPTO, EPO, or other national patent offices.
