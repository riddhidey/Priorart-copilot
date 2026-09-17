import os
import sys
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException
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

        # Build 2D Threat Matrix
        all_docs = {}
        for el_res in ret_out.element_results.values():
            for c in el_res.candidates:
                all_docs[c.doc_id] = c.title

        matrix_rows = []
        for el in parsed.claim_elements:
            cluster = clust_out.element_clusters.get(el.element_id)
            doc_threats = {art.doc_id: art.threat_level for art in cluster.ranked_prior_art} if cluster else {}
            matrix_rows.append({
                "element_id": el.element_id,
                "element_title": el.title,
                "overall_risk": cluster.overall_element_risk if cluster else "low",
                "threats": doc_threats
            })

        return {
            "status": "success",
            "parsed_disclosure": parsed.model_dump(),
            "retrieval_output": ret_out.model_dump(),
            "clustering_output": clust_out.model_dump(),
            "report": rep_out.model_dump(),
            "threat_matrix": {
                "documents": [{"doc_id": d_id, "title": d_title} for d_id, d_title in all_docs.items()],
                "rows": matrix_rows
            }
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

    # Build 2D Threat Matrix
    all_docs = {}
    for el_res in state.retrieval_output.element_results.values():
        for c in el_res.candidates:
            all_docs[c.doc_id] = c.title

    matrix_rows = []
    for el in state.parsed_disclosure.claim_elements:
        cluster = state.clustering_output.element_clusters.get(el.element_id)
        doc_threats = {art.doc_id: art.threat_level for art in cluster.ranked_prior_art} if cluster else {}
        matrix_rows.append({
            "element_id": el.element_id,
            "element_title": el.title,
            "overall_risk": cluster.overall_element_risk if cluster else "low",
            "threats": doc_threats
        })

    return {
        "status": "success",
        "parsed_disclosure": state.parsed_disclosure.model_dump(),
        "retrieval_output": state.retrieval_output.model_dump(),
        "clustering_output": state.clustering_output.model_dump(),
        "report": state.final_report.model_dump(),
        "threat_matrix": {
            "documents": [{"doc_id": d_id, "title": d_title} for d_id, d_title in all_docs.items()],
            "rows": matrix_rows
        }
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
            "title": "Variable-Pitch Drone Rotor with Magnetic Position Feedback",
            "domain": "mechanical",
            "text": "1. Rotor Hub with Dual Bearings: A multirotor central hub assembly having four blade grips pivotally seated on pre-loaded dual angular-contact ball bearings.\n2. Concentric Axial Pushrod Actuator: A hollow-shaft brushless motor driving an axial pushrod through the center of the motor shaft to adjust blade pitch dynamically.\n3. Magnetic Rotary Sensor Array: Contactless Hall-effect rotary encoders integrated directly into each blade root retention sleeve to measure angular deflection in real-time."
        },
        {
            "id": "acoustic_harvester",
            "title": "Sub-Nanowatt Acoustic Trigger with Energy Harvesting Rectifier",
            "domain": "electronics",
            "text": "1. Piezoelectric Acoustic Harvester: A MEMS piezoelectric cantilever diaphragm tuned to ultrasonic frequencies to harvest acoustic wave energy.\n2. Sub-Threshold Comparator Wake-Up Circuit: A dynamic threshold differential comparator operating in weak inversion CMOS regime consuming under 1 nanowatt in standby.\n3. Power-Gating Switch: High-side PMOS switch isolating the main microcontroller until a validated threshold voltage burst triggers system power."
        },
        {
            "id": "stepper_actuator",
            "title": "Direct-Drive Micro-Stepper Pitch Linkage for UAVs",
            "domain": "mechanical",
            "text": "1. Blade Root Micro-Steppers: Direct brushless torque actuators embedded inside each blade shank to eliminate mechanical swashplates.\n2. Dual Hall Rotary Feedback: High-resolution absolute angular encoders providing closed-loop control under 0.1 degree resolution."
        }
    ]


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
