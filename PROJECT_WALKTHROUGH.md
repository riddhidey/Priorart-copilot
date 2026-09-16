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

1. **Industrial Milestone Preloader & Sequential Multi-Theme Calibration**:
   - `001%` to `100%` monospace progress counter with reticle corner brackets (`┌ ┐ └ ┘`) and custom ambient radial lighting.
   - **Sequential 4-Theme Color Calibration (Green -> Dark -> Light -> Amber)**:
     - As the counter increments from `001%` to `100%`, the preloader frame, counter, progress bar, reticles, and ambient lighting seamlessly cycle through all four project themes one by one:
       - **01% - 25% (Phase 01/04 · Green Matrix)**: Glowing **Phosphor Green** (`#86efac` / `#4ade80`).
       - **26% - 50% (Phase 02/04 · Obsidian Dark)**: High-contrast **Obsidian White & Cyber Cyan** (`#ffffff` / `#38bdf8`).
       - **51% - 75% (Phase 03/04 · Clean Light)**: Radiant **Electric Cobalt / Sky Blue** (`#38bdf8` / `#0284c7`).
       - **76% - 100% (Phase 04/04 · Amber CRT)**: Warm **Amber CRT Industrial Gold** (`#fbbf24` / `#facc15`).
     - Embedded **Interactive Theme Ticker Pill Bar** (`[● Green]  [● Dark]  [● Light]  [● Amber]`) mirroring the project header switcher, highlighting the active spectrum tier in real-time.
     - Synchronized live telemetry stream logs announcing each spectrum initialization phase.
     - On completion (or instant `[SKIP]` / `[ESC]`), the workbench smoothly restores the user's permanent theme preference.

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
     - **Clean Light**: High-contrast architectural slate navy & cobalt (`#0284c7`) with signature Sky Blue hover states and active glow (`#0284c7`), ensuring the Light key and active elements never render in black.
     - **Amber CRT**: Vintage warm industrial cathode styling (`#fbbf24`)
   - **Dedicated Theme Button Hover & Active States**: Each theme button in the header switcher (`Green`, `Dark`, `Light`, `Amber`) features dedicated hover and active states tuned to its respective palette color, ensuring the Light theme button glows in luminous sky blue (`#0284c7`) on hover rather than falling back to dark text colors.

5. **Live Reactive Typing Radar & 3D Ballistic Trajectory Arcs**:
   - As the user types an invention title or description (debounced ~200ms), the system extracts technical keywords and scans domain innovation databases.
   - Dynamically highlights **Official Patent Registries** (USPTO, EPO, WIPO, JPO, CNIPA) and **Assignee Innovation Clusters** (e.g., DJI in Shenzhen, Boeing in Chicago, Murata in Kyoto, Faulhaber in Germany, MIT Lincoln Lab, etc.) on the 3D globe.
   - Generates curved 3D Bézier radar ballistic arcs connecting the visitor node to each active prior-art hub with flying photon energy pulses.
   - Synchronizes the left HUD table to display live matching patent hit volumes and similarity percentages per patent jurisdiction.
   - Interactive hover raycasting reveals detailed reference patent metadata cards (`US11046432B2`, `EP3691954A1`, `CN108928501B`, etc.).

6. **Broadcast Theater Mode & High-Contrast Recognizable Continents**:
   - **Dynamic Theater Sizing (`clamp(620px, 80vh, 880px)`)**: In Broadcast presentation mode (`#btn-broadcast-mode` / `#btn-radar-broadcast`), the radar hero dynamically adapts between 620px and 80% viewport height, preventing lower-part clipping on 768p/900p displays while maximizing presentation presence on larger 1080p+ monitors.
   - **Fully Scrollable Telemetry HUD & Assignee Cards**: Added `overflow-y: auto` with custom ultra-slim themed scrollbars on `.radar-telemetry-hud` and `.assignees-pills-wrap`, ensuring all matched assignee cards (DJI, Boeing, Airbus, etc.) and bottom metrics (Orbital Axis, Radar Arcs) are 100% visible and accessible without being sliced off.
   - **Unclipped Zoom Slider Capsule & Layered Tactical HUD**: Positioned Three.js canvas as the base layer (`z-index: 1`) with elevated corner reticles, cardinal compass markers, and live telemetry badges (`z-index: 15-20`) with dedicated `right: 36px` clearance for the vertical zoom slider capsule.
   - **Deconflicted Drag Hint & Telemetry Badges**: Fixed horizontal overlapping between `.globe-drag-hint` and `.globe-telemetry-badge.bottom-right-badge` ("ORBITAL RELAYS") by explicitly anchoring the drag hint with `left: 50%; transform: translateX(-50%); bottom: 44px;` (elevated above bottom telemetry badges), eliminating collision while keeping both 100% visible.
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

10. **Fixed Continent Labels & Dynamic 3D Node Place Badges**:
    - **Fixed Continent Topology Names**: Embedded tactical billboard badges directly on the major world continents (`[ NORTH AMERICA ]`, `[ SOUTH AMERICA ]`, `[ EUROPE ]`, `[ AFRICA ]`, `[ ASIA ]`, `[ AUSTRALIA ]`) that rotate synchronously with the globe.
    - **Place & Organization Badges for All Active Nodes**:
      - Floating billboard text tags appear directly above each pin head specifying the geographic city and assignee/registry:
        - `CHICAGO · BOEING [MOD]` in Vivid Electric Yellow (`#facc15`).
        - `SHENZHEN · DJI [HIGH]` in Vivid Red (`#ef4444`).
        - `TOULOUSE · AIRBUS [LOW]` in Emerald Green (`#10b981`).
        - `ALEXANDRIA · USPTO`, `MUNICH · EPO`, `GENEVA · WIPO`, `TOKYO · JPO`, `BEIJING · CNIPA` in Cobalt Cyan (`#0ea5e9`).
        - `★ BHUBANESWAR · ORIGIN` in Radiant Neon Magenta (`#d946ef`).
11. **Guaranteed Multi-Tier Threat Spectrum (High, Mod, Low) During Patent Search**:
    - **Spectrum Guarantee for Any Query**:
      - Solved the issue where searching a patent would result in missing threat levels or all nodes collapsing into a single category.
      - During live typing, preset clicks, or full screening pipeline execution, the radar engine intelligently ranks candidate prior art and guarantees nodes across all 3 statutory risk tiers:
        - **HIGH THREAT (Red `#ef4444`, $\ge 90\%$)**: Direct prior-art collision (35 U.S.C. § 102).
        - **MOD THREAT (Vivid Electric Yellow `#facc15`, $80-89\%$)**: Obviousness / analogous domain combination (35 U.S.C. § 103).
        - **LOW THREAT (Emerald Green `#10b981`, $< 80\%$)**: Distant state-of-the-art reference / novelty clearance baseline.
    - **Billboard Threat Badges Floating Above Nodes**:
      - Explicit threat tag and similarity percentage rendered on every 3D pin billboard badge:
        - `SHENZHEN · DJI [HIGH 94%]`
        - `CHICAGO · BOEING [MOD 86%]`
        - `TOULOUSE · AIRBUS [LOW 76%]`
        - `ALEXANDRIA · USPTO [HIGH 92%]`
        - `MUNICH · EPO [MOD 85%]`
        - `GENEVA · WIPO [LOW 76%]`
    - **Interactive Legend Camera Focus**:
12. **Geographic Patent Origin Location & Direct Patent Number Name Tags**:
    - **Geographic Placement of Prior-Art Citations**:
      - When searching a patent, each prior-art patent is physically pinned to its real geographic origin, corporate assignee headquarters, or filing patent office (e.g. `US10457388B2` in Chicago, US; `US9878783B2` in Cambridge, US; `EP3205574A1` in Toulouse, FR; `US10892745B1` in Palo Alto, US; `US11201584B2` in Kyoto, JP; `EP3817208A1` in Munich, DE; `CN108928501B` in Shenzhen, CN).
      - On search, the 3D camera smoothly auto-rotates via GSAP to focus directly on the primary high-threat patent location.
    - **Two-Tier Structured 3D Billboard Name & Patent Number Tags**:
      - Floating labels rendered directly above each 3D node now display a structured two-tier military/intelligence HUD pill:
        - **Top Line**: Geographic City · Assignee/Registry · Threat Badge (e.g., `SHENZHEN · DJI  [HIGH 95%]`, `CHICAGO · BOEING  [HIGH 95%]`, `TOULOUSE · AIRBUS  [MOD 86%]`).
        - **Bottom Line**: High-contrast sky blue patent document number and title snippet (e.g., `PATENT NO. US10457388B2 · VARIABLE PITCH`, `PATENT NO. CN108928501B · ROTOR ACTUATION`).
    - **Hover Inspection & Assignee HUD Tags**:
      - Mouse raycasting hover cards and the left HUD assignee cluster list now prominently feature the verified `PATENT NO: [NUMBER]` and filing jurisdiction.

13. **Tactical Vertical Zoom Control Scrollbar (Beside Globe)**:
    - **Floating Tactical Zoom Slider Pill**:
      - Placed along the right edge of the 3D globe viewport (`#globe-zoom-controls`) in an elevated glassmorphic capsule with backdrop blur and theme borders.
    - **Interactive Controls**:
      - **Zoom In Button (`+`)**: Smoothly steps the Three.js camera distance closer (`0.16x` increments) via GSAP tweening.
      - **Draggable Vertical Range Track**: Real-time slider with glowing circular thumb that dynamically adjusts camera distance between closest inspection (`~2.0x`) and wide overview (`~0.45x`).
      - **Zoom Out Button (`-`)**: Smoothly steps the camera distance outward.
      - **Real-Time Multiplier & Reset Badge**: Displays real-time magnification (e.g., `1.0x`, `1.4x`, `2.0x`), and clicking it smoothly animates the camera back to normal fitted perspective (`1.0x`).
    - **Bidirectional Synchronization**:
      - Mouse wheel zooming directly on the canvas continuously updates the vertical slider thumb position and magnification badge.
14. **Direct Patent-to-Globe Location Mapping (2D Threat Matrix & Citations)**:
    - **Clickable Patent Document Headers in 2D Threat Matrix**:
      - Every patent column header (e.g., `JP7791759B2`, `JP5069743B2`, `JP5033174B2`, `US8714584B2`) is rendered as a tactile interactive button with `📍 [DOC_ID] GLOBE ↗`.
      - Clicking any patent header or its statutory threat cell badge (`HIGH`, `MOD`, `LOW`) automatically uncollapses the radar hero, smoothly scrolls up to the 3D globe, and smoothly flies the 3D camera directly to that patent's real geographic location.
    - **Geographic Tech Cluster Resolver**:
      - Patents are dynamically mapped to regional tech hubs across Japan (`Tokyo · JPO`, `Kyoto`, `Yokohama`, `Nagoya`, `Osaka`), United States (`Alexandria · USPTO`, `Chicago`, `Silicon Valley`, `Cambridge MIT`, `Seattle`), Europe (`Munich · EPO`, `Toulouse`, `London`, `Geneva · WIPO`), China (`Beijing · CNIPA`, `Shenzhen`, `Shanghai`), and South Korea (`Daejeon · KIPO`, `Seoul`).
    - **Real-Time 3D Focus & Visual Telemetry Toast**:
      - The 3D marker pulses its crystal pinhead and billboard tag, triggers the hover inspection card with patent details, and pops an industrial notification toast (e.g. `LOCATING PATENT [JP7791759B2] ON GLOBE · TOKYO, JAPAN (JPO)`).
    - **Master Index of Verified Citations Integration**:
      - Each citation card features a dedicated `[📍 DOC_ID  3D GLOBE ↗]` button for instantaneous one-click spatial inspection.

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
