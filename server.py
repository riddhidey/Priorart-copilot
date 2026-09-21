import os
import sys
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from schemas.disclosure import InventionDisclosure
from schemas.report import PriorArtReport
from pipeline.graph import PriorArtPipeline
from eval.metrics import run_benchmark, verify_citation_authenticity

app = FastAPI(title="PriorArt Copilot", description="Multi-Agent Patentability & Prior-Art Screening")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_no_cache_headers(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

class ScreenRequest(BaseModel):
    title: str
    raw_text: str
    technical_domain: str = "mechanical"


class ScreenElementsRequest(BaseModel):
    title: str
    technical_domain: str
    summary: str
    claim_elements: list[dict]


@app.get("/api/visitor-geo")
async def get_visitor_geo(request: Request):
    """
    Zero-permission server-side IP geolocation resolver.
    Extracts the visitor's public IP from proxy headers (Cloudflare, Vercel, Render, Nginx)
    and resolves geographic coordinates without requesting any browser permissions.
    """
    forwarded = request.headers.get("x-forwarded-for")
    cf_ip = request.headers.get("cf-connecting-ip")
    real_ip = request.headers.get("x-real-ip")

    client_ip = None
    if cf_ip:
        client_ip = cf_ip.strip()
    elif forwarded:
        client_ip = forwarded.split(",")[0].strip()
    elif real_ip:
        client_ip = real_ip.strip()
    elif request.client and request.client.host:
        client_ip = request.client.host

    is_local = (
        not client_ip or
        client_ip in ("127.0.0.1", "localhost", "::1") or
        client_ip.startswith("192.168.") or
        client_ip.startswith("10.") or
        client_ip.startswith("172.16.")
    )

    import urllib.request
    import json

    if not is_local and client_ip:
        geo_urls = [
            f"https://ipwho.is/{client_ip}",
            f"https://freeipapi.com/api/json/{client_ip}",
            f"https://get.geojs.io/v1/ip/geo/{client_ip}.json"
        ]
    else:
        geo_urls = [
            "https://ipwho.is/",
            "https://freeipapi.com/api/json",
            "https://get.geojs.io/v1/ip/geo.json"
        ]

    for url in geo_urls:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with urllib.request.urlopen(req, timeout=3.5) as resp:
                data = json.loads(resp.read().decode("utf-8"))

                if "latitude" in data and "longitude" in data and data.get("latitude") is not None:
                    lat = float(data.get("latitude"))
                    lon = float(data.get("longitude"))
                    city = data.get("city") or data.get("cityName") or data.get("region") or "Client Node"
                    country = data.get("country") or data.get("countryName") or "Global"
                    country_code = data.get("country_code") or data.get("countryCode") or ""
                    return {
                        "status": "success",
                        "ip": data.get("ip", client_ip or "client"),
                        "city": city,
                        "country": country,
                        "country_code": country_code,
                        "latitude": lat,
                        "longitude": lon,
                        "source": "server_ip_geo"
                    }
                elif "lat" in data and "lon" in data and data.get("lat") is not None:
                    lat = float(data.get("lat"))
                    lon = float(data.get("lon"))
                    city = data.get("city") or data.get("region") or "Client Node"
                    country = data.get("country") or "Global"
                    country_code = data.get("country_code") or ""
                    return {
                        "status": "success",
                        "ip": data.get("ip", client_ip or "client"),
                        "city": city,
                        "country": country,
                        "country_code": country_code,
                        "latitude": lat,
                        "longitude": lon,
                        "source": "server_ip_geo"
                    }
        except Exception:
            continue

    return {
        "status": "fallback",
        "ip": client_ip or "127.0.0.1",
        "message": "Fallback to client-side geolocation"
    }


@app.post("/api/parse-elements")
async def parse_elements_only(req: ScreenRequest):
    if not req.raw_text.strip():
        raise HTTPException(status_code=400, detail="Disclosure text cannot be empty.")

    disclosure = InventionDisclosure(
        title=req.title or "Untitled Invention",
        raw_text=req.raw_text,
        technical_domain=req.technical_domain
    )

    from agents.disclosure_parser import DisclosureParserAgent
    parser = DisclosureParserAgent()
    try:
        parsed = parser.parse(disclosure)
        return {"status": "success", "parsed_disclosure": parsed.model_dump()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _build_threat_matrix(claim_elements, retrieval_output, clustering_output):
    from schemas.risk import classify_risk_score, normalize_threat_level

    all_docs = {}
    for el_res in retrieval_output.element_results.values():
        for c in el_res.candidates:
            all_docs[c.doc_id] = c.title

    tier_ranks = {"HIGH": 3, "MOD": 2, "LOW": 1}
    doc_stats = {}
    for el_id, cluster in clustering_output.element_clusters.items():
        for art in cluster.ranked_prior_art:
            raw_score = float(getattr(art, "novelty_risk_score", 0.5) or 0.5)
            raw_lvl = getattr(art, "threat_level", "low") or "low"

            lvl, score_pct = classify_risk_score(score=raw_score, raw_threat_level=raw_lvl)

            existing = doc_stats.get(art.doc_id)
            if not existing:
                doc_stats[art.doc_id] = {
                    "threat_level": lvl,
                    "similarity": score_pct,
                    "matches": 1
                }
            else:
                doc_stats[art.doc_id]["matches"] += 1
                curr_rank = tier_ranks.get(existing["threat_level"], 1)
                new_rank = tier_ranks.get(lvl, 1)
                if new_rank > curr_rank:
                    doc_stats[art.doc_id]["threat_level"] = lvl
                    doc_stats[art.doc_id]["similarity"] = max(existing["similarity"], score_pct)
                elif new_rank == curr_rank:
                    doc_stats[art.doc_id]["similarity"] = max(existing["similarity"], score_pct)

    docs_payload = []
    for d_id, d_title in all_docs.items():
        stats = doc_stats.get(d_id, {})
        lvl = stats.get("threat_level", "LOW")
        sim = stats.get("similarity", 72)
        docs_payload.append({
            "doc_id": d_id,
            "title": d_title,
            "threat_level": lvl,
            "similarity": sim,
            "match_count": stats.get("matches", 1)
        })

    matrix_rows = []
    for el in claim_elements:
        cluster = clustering_output.element_clusters.get(el.element_id)
        doc_threats = {}
        if cluster:
            for art in cluster.ranked_prior_art:
                art_lvl, _ = classify_risk_score(score=art.novelty_risk_score, raw_threat_level=art.threat_level)
                doc_threats[art.doc_id] = art_lvl
        matrix_rows.append({
            "element_id": el.element_id,
            "element_title": el.title,
            "overall_risk": cluster.overall_element_risk if cluster else "low",
            "threats": doc_threats
        })

    return {
        "documents": docs_payload,
        "rows": matrix_rows
    }


@app.post("/api/screen-elements")
async def screen_from_elements(req: ScreenElementsRequest):
    from schemas.disclosure import ParsedDisclosure, ClaimElement
    from agents.retrieval_agent import RetrievalAgent
    from agents.novelty_clustering import NoveltyClusteringAgent
    from agents.report_writer import ReportWriterAgent

    elements = [ClaimElement(**el) for el in req.claim_elements]
    parsed = ParsedDisclosure(
        title=req.title,
        technical_domain=req.technical_domain,
        summary=req.summary or f"Invention regarding {req.title}",
        claim_elements=elements
    )

    retrieval = RetrievalAgent()
    clustering = NoveltyClusteringAgent()
    report_writer = ReportWriterAgent()

    try:
        ret_out = retrieval.retrieve(parsed)
        clust_out = clustering.cluster_and_score(parsed, ret_out)
        rep_out = report_writer.generate_report(parsed, ret_out, clust_out)

        threat_matrix = _build_threat_matrix(parsed.claim_elements, ret_out, clust_out)

        return {
            "status": "success",
            "parsed_disclosure": parsed.model_dump(),
            "retrieval_output": ret_out.model_dump(),
            "clustering_output": clust_out.model_dump(),
            "report": rep_out.model_dump(),
            "threat_matrix": threat_matrix
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/screen")
async def screen_invention(req: ScreenRequest):
    if not req.raw_text.strip():
        raise HTTPException(status_code=400, detail="Invention disclosure text cannot be empty.")

    disclosure = InventionDisclosure(
        title=req.title or "Untitled Invention",
        raw_text=req.raw_text,
        technical_domain=req.technical_domain
    )

    pipeline = PriorArtPipeline()
    state = pipeline.run(disclosure)

    if state.errors:
        raise HTTPException(status_code=500, detail="; ".join(state.errors))

    threat_matrix = _build_threat_matrix(
        state.parsed_disclosure.claim_elements,
        state.retrieval_output,
        state.clustering_output
    )

    return {
        "status": "success",
        "parsed_disclosure": state.parsed_disclosure.model_dump(),
        "retrieval_output": state.retrieval_output.model_dump(),
        "clustering_output": state.clustering_output.model_dump(),
        "report": state.final_report.model_dump(),
        "threat_matrix": threat_matrix
    }


@app.get("/api/benchmark-run")
async def benchmark_endpoint():
    import glob
    from eval.metrics import calculate_element_recall, calculate_retrieval_coverage, verify_citation_authenticity
    eval_files = glob.glob("eval/disclosures/*.json")
    pipeline = PriorArtPipeline()
    results = []

    for file_path in eval_files:
        import json
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        disclosure = InventionDisclosure(
            title=data["title"],
            raw_text=data["raw_text"],
            technical_domain=data.get("technical_domain", "mechanical")
        )
        state = pipeline.run(disclosure)
        extracted_titles = [el.title for el in state.parsed_disclosure.claim_elements]
        elem_recall = calculate_element_recall(extracted_titles, data.get("ground_truth_claim_elements", []))

        all_retrieved_ids = []
        for el_res in state.retrieval_output.element_results.values():
            all_retrieved_ids.extend([c.doc_id for c in el_res.candidates])
        coverage = calculate_retrieval_coverage(all_retrieved_ids, data.get("known_prior_art", []))
        cit_eval = verify_citation_authenticity(state.final_report, state.retrieval_output)

        results.append({
            "id": data.get("id"),
            "title": disclosure.title,
            "element_recall": elem_recall * 100,
            "prior_art_coverage": coverage * 100,
            "citation_accuracy": cit_eval["accuracy"] * 100,
            "total_citations": cit_eval["total_citations"]
        })

    avg_recall = sum(r["element_recall"] for r in results) / max(1, len(results))
    avg_coverage = sum(r["prior_art_coverage"] for r in results) / max(1, len(results))
    avg_cit = sum(r["citation_accuracy"] for r in results) / max(1, len(results))

    return {
        "status": "success",
        "cases": results,
        "summary": {
            "mean_element_recall": avg_recall,
            "mean_prior_art_coverage": avg_coverage,
            "mean_citation_accuracy": avg_cit
        }
    }


@app.get("/api/presets")
async def get_presets():
    return [
        {
            "id": "drone_rotor",
            "patent_no": "US-2026-0048192-A1",
            "title": "Variable-Pitch Drone Rotor with Magnetic Position Feedback",
            "domain": "mechanical",
            "category": "Aerospace & Robotics",
            "text": "1. Rotor Hub with Dual Bearings: A multirotor central hub assembly having four blade grips pivotally seated on pre-loaded dual angular-contact ball bearings.\n2. Concentric Axial Pushrod Actuator: A hollow-shaft brushless motor driving an axial pushrod through the center of the motor shaft to adjust blade pitch dynamically.\n3. Magnetic Rotary Sensor Array: Contactless Hall-effect rotary encoders integrated directly into each blade root retention sleeve to measure angular deflection in real-time."
        },
        {
            "id": "acoustic_harvester",
            "patent_no": "US-2026-0092144-A1",
            "title": "Sub-Nanowatt Acoustic Trigger with Energy Harvesting Rectifier",
            "domain": "electronics",
            "category": "Micro-Power & MEMS",
            "text": "1. Piezoelectric Acoustic Harvester: A MEMS piezoelectric cantilever diaphragm tuned to ultrasonic frequencies to harvest acoustic wave energy.\n2. Sub-Threshold Comparator Wake-Up Circuit: A dynamic threshold differential comparator operating in weak inversion CMOS regime consuming under 1 nanowatt in standby.\n3. Power-Gating Switch: High-side PMOS switch isolating the main microcontroller until a validated threshold voltage burst triggers system power."
        },
        {
            "id": "stepper_actuator",
            "patent_no": "EP-4182901-A1",
            "title": "Direct-Drive Micro-Stepper Pitch Linkage for UAVs",
            "domain": "mechanical",
            "category": "Precision Actuators",
            "text": "1. Blade Root Micro-Steppers: Direct brushless torque actuators embedded inside each blade shank to eliminate mechanical swashplates.\n2. Dual Hall Rotary Feedback: High-resolution absolute angular encoders providing closed-loop control under 0.1 degree resolution.\n3. Harmonic Anti-Backlash Reducer: Integrated strain wave gearing providing 50:1 reduction within an 18mm cylindrical envelope."
        },
        {
            "id": "quantum_annealer",
            "patent_no": "WO-2026-081920-A2",
            "title": "Superconducting Flux Qubit Array with Topological Noise Mitigation",
            "domain": "electronics",
            "category": "Quantum Computing",
            "text": "1. SQUID Loop Coplanar Resonator: An array of capacitively shunted flux qubits coupled via tunable Josephson inductive elements.\n2. Flux-Noise Mitigation Geometry: Symmetric differential bias lines canceling external homogeneous magnetic field fluctuations below 10 micro-flux quanta.\n3. Multiplexed Kinetic Inductance Readout: High-Q transmission line interrogating 64 qubits simultaneously via frequency division multiplexing."
        },
        {
            "id": "solid_state_battery",
            "patent_no": "US-2026-0118392-A1",
            "title": "Dendrite-Free Silicon-Graphene Solid-State Electrolyte",
            "domain": "chemical",
            "category": "Clean Energy Storage",
            "text": "1. Sulfide-Halide Composite Electrolyte: Cold-pressed Li6PS5Cl glass-ceramic matrix having ionic conductivity exceeding 12 mS/cm at 25 degrees Celsius.\n2. 3D Graphene Porous Scaffold Anode: Vapor-grown vertically oriented graphene networks hosting sub-5nm silicon nanoparticles with pre-lithiated interfaces.\n3. Elastic Self-Healing Interphase: In-situ polymer buffer layer absorbing 300% volume expansion during 4C high-rate cycling."
        },
        {
            "id": "neural_bci",
            "patent_no": "EP-4209115-A1",
            "title": "Intracortical Microelectrode Array with Spike Deconvolution",
            "domain": "biotech",
            "category": "Neural Interfaces",
            "text": "1. Flexible Polyimide Micro-Shank Array: 1024-channel platinum-nanograss microelectrode shank penetrating motor cortex tissue with bending stiffness under 0.05 N/m.\n2. In-Situ Neural Spike Deconvolution ASIC: Sub-microwatt analog front-end performing continuous wavelet transform for real-time single-unit action potential isolation.\n3. Inductive Transcutaneous Telemetry: 13.56 MHz near-field power and 50 Mbps secure data carrier operating through intact dermal layer."
        },
        {
            "id": "photonic_tpu",
            "patent_no": "US-2026-0149021-A1",
            "title": "Silicon Photonic Tensor Core Using Mach-Zehnder Meshes",
            "domain": "electronics",
            "category": "Optical AI Hardware",
            "text": "1. Integrated Optical Waveguide Mesh: Silicon-on-insulator triangular mesh of 128 thermo-optic Mach-Zehnder interferometers performing unitary matrix multiplications.\n2. Phase-Change Non-Volatile Weight Storage: Antimony triselenide (Sb2Se3) optical phase-change material cells maintaining weight states with zero static holding power.\n3. High-Bandwidth Balanced Photodetector Grid: Germanium waveguide photodetectors converting optical dot products into differential currents at 40 GHz line rates."
        },
        {
            "id": "mhd_thruster",
            "patent_no": "WO-2026-039182-A1",
            "title": "Helical Magnetohydrodynamic Propulsion for Marine Craft",
            "domain": "mechanical",
            "category": "Fluid Propulsion",
            "text": "1. Superconducting Helical Dipole Magnet: Cryogen-free high-temperature REBCO superconducting coil generating a continuous 8 Tesla transverse magnetic field along a central water conduit.\n2. Segmented Titanium Diboride Electrodes: Corrosion-resistant conductive cathode-anode pairs establishing orthogonal pulsed electric fields across seawater flow paths.\n3. Acoustic Cavitation Suppressor: Boundary layer micro-bubble injection ring attenuating acoustic turbulence signatures below 10 kHz."
        },
        {
            "id": "crispr_nanorobot",
            "patent_no": "US-2026-0177301-A1",
            "title": "Magnetic Nanocarrier for Epigenetic CRISPR-Cas12b Delivery",
            "domain": "biotech",
            "category": "Genomic Nanomedicine",
            "text": "1. Superparamagnetic Iron Oxide Core: 25nm Fe3O4 magnetic nanoparticle core functionalized with hyperbranched poly(beta-amino ester) shell.\n2. Hypoxia-Cleavable Polyethylene Glycol Corona: Azobenzene linker releasing Cas12b ribonucleoprotein complexes specifically within acidic tumor microenvironments.\n3. Electromagnetic Steering Array: External rotating magnetic gradient system navigating nanocarriers through microvascular endothelium barriers."
        },
        {
            "id": "fusion_divertor",
            "patent_no": "EP-4318990-A1",
            "title": "Liquid-Metal Capillary Divertor with MHD Recirculation",
            "domain": "mechanical",
            "category": "Fusion Energy Systems",
            "text": "1. Capillary Porous Tungsten Matrix: 3D printed mesh with 50-micron pore channels continuously wetted by liquid lithium to absorb 20 MW/m2 heat loads.\n2. Thermoelectric MHD Return Pump: Utilizing intrinsic temperature gradients between plasma-facing surface and heat-sink to drive passive lithium replenishment.\n3. Deuterium-Tritium Getter Reservoir: In-line getter bed continuously extracting absorbed hydrogen isotopes from circulating liquid metal."
        },
        {
            "id": "terahertz_6g",
            "patent_no": "US-2026-0205814-A1",
            "title": "Phased-Array Sub-Terahertz Beamforming Transceiver",
            "domain": "electronics",
            "category": "6G Communications",
            "text": "1. Monolithic Indium Phosphide RFIC: Heterojunction bipolar transistor mixer operating in 140-170 GHz D-band with 8 dB noise figure.\n2. Metamaterial Patch Array: 64-element dielectric resonator antenna array printed on liquid crystal polymer substrate with 22 dBi peak gain.\n3. True-Time-Delay Optical Phase Shifter: Micro-ring resonator time-delay matrix eliminating beam-squint across 10 GHz instantaneous channel bandwidth."
        },
        {
            "id": "ev_swarm_mesh",
            "patent_no": "WO-2026-054911-A1",
            "title": "Cryptographic Mesh for Autonomous Fleet Platoon Routing",
            "domain": "software",
            "category": "Autonomous Systems",
            "text": "1. Byzantine Fault-Tolerant V2V Mesh: Low-latency 5.9 GHz C-V2X ad-hoc peer network exchanging cryptographic kinematic proofs every 10 milliseconds.\n2. Zero-Knowledge Spatial Claim Verification: Verifying vehicle braking capabilities and trajectory envelopes without revealing complete historical telemetry.\n3. Cooperative Dynamic Platooning Controller: Model predictive control solver synchronizing inter-vehicle spacing down to 0.5 meters at highway cruise speeds."
        }
    ]


# Authentication configuration endpoint for client-side Supabase SDK
@app.get("/api/auth/config")
async def get_auth_config():
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL", "")
    supabase_anon_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_ANON_KEY", "")
    return {
        "status": "success",
        "supabaseUrl": supabase_url,
        "supabaseAnonKey": supabase_anon_key,
        "hasConfig": bool(supabase_url and supabase_anon_key)
    }


@app.get("/api/auth/provider-status")
async def get_provider_status(provider: str = "google"):
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL", "")
    supabase_anon_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_ANON_KEY", "")
    if not supabase_url or not supabase_anon_key:
        return {"enabled": False, "reason": "missing_keys"}

    import urllib.request
    check_url = f"{supabase_url.rstrip('/')}/auth/v1/authorize?provider={provider}"
    req = urllib.request.Request(check_url, headers={"apikey": supabase_anon_key})
    try:
        urllib.request.urlopen(req, timeout=3.5)
        return {"enabled": True}
    except urllib.error.HTTPError as e:
        if e.code == 400:
            body = e.read().decode(errors="ignore")
            if "provider is not enabled" in body:
                return {"enabled": False, "reason": "provider_not_enabled"}
        return {"enabled": True}
    except Exception:
        return {"enabled": True}


@app.get("/api/engine-status")
async def get_engine_status():
    """Returns real-time status of the active AI model engine."""
    from agents.llm_client import LLMClient
    client = LLMClient()
    return {
        "status": "online" if client.is_live else "heuristic_fallback",
        "model": client.model_name,
        "provider": "Google DeepMind (GenAI SDK)",
        "pipeline": "Autonomous 4-Agent Pipeline",
        "structured_schema": "Pydantic 35 U.S.C. §§ 102/103",
        "inference_mode": "Deterministic (Temp 0.2)",
        "generation": "Gemini 3 Flash (Latest Generation)"
    }




# Serve frontend static files
web_dir = Path(__file__).resolve().parent / "web"
if not web_dir.exists():
    web_dir = Path.cwd() / "web"
if not web_dir.exists():
    web_dir.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory=str(web_dir)), name="static")

@app.get("/")
async def serve_index():
    index_file = web_dir / "index.html"
    if not index_file.exists():
        index_file = Path.cwd() / "web" / "index.html"
    return FileResponse(
        str(index_file),
        headers={"Cache-Control": "no-cache, no-store, must-revalidate"}
    )


@app.get("/login")
async def serve_login():
    login_file = web_dir / "login.html"
    if not login_file.exists():
        login_file = Path.cwd() / "web" / "login.html"
    return FileResponse(
        str(login_file),
        headers={"Cache-Control": "no-cache, no-store, must-revalidate"}
    )


@app.get("/auth/callback")
async def serve_auth_callback():
    cb_file = web_dir / "callback.html"
    if not cb_file.exists():
        cb_file = Path.cwd() / "web" / "callback.html"
    return FileResponse(
        str(cb_file),
        headers={"Cache-Control": "no-cache, no-store, must-revalidate"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
