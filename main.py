import argparse
import json
import sys
import os
from pathlib import Path
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from schemas.disclosure import InventionDisclosure
from pipeline.graph import PriorArtPipeline


if sys.stdout.encoding.lower() not in ('utf-8', 'utf8'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


def format_markdown_report(report) -> str:
    """Format PriorArtReport into standard Markdown presentation."""
    md_lines = []
    md_lines.append(f"# {report.title}\n")
    md_lines.append(f"> [!WARNING]\n> **{report.disclaimer}**\n")
    md_lines.append(f"## Executive Summary\n\n{report.executive_summary}\n")
    md_lines.append(f"**Overall Novelty Risk**: `{report.overall_novelty_risk.upper()}`\n")
    
    md_lines.append("## Claim-by-Claim Prior Art Analysis\n")
    for section in report.element_sections:
        risk_tag = "[HIGH RISK]" if section.risk_level == "high" else ("[MODERATE RISK]" if section.risk_level == "moderate" else "[LOW RISK]")
        md_lines.append(f"### {risk_tag} Element [{section.element_id}]: {section.element_title}")
        md_lines.append(f"**Description:** {section.element_description}\n")
        md_lines.append(f"**Assessed Threat Level:** `{section.risk_level.upper()}`\n")
        md_lines.append(f"**Findings & Citations:**\n{section.findings_analysis}\n")
        md_lines.append(f"**Novelty Gap & Distinguishing Features:**\n{section.distinguishing_features}\n")
        md_lines.append("---\n")

    md_lines.append("## Master Index of Verified Citations\n")
    if report.all_citations:
        for cit in report.all_citations:
            url_part = f"([Link]({cit.url}))" if cit.url else ""
            md_lines.append(f"- **{cit.citation_id}** `{cit.doc_id}` — *{cit.title}* {url_part}")
            md_lines.append(f"  > \"{cit.cited_passage}\"\n")
    else:
        md_lines.append("No citations cited in report.\n")

    md_lines.append("## Recommended Claim Refinements\n")
    for ref in report.recommended_refinements:
        md_lines.append(f"- {ref}")

    return "\n".join(md_lines)


def main():
    parser = argparse.ArgumentParser(description="PriorArt Copilot: Multi-Agent Patentability & Prior-Art Screening")
    parser.add_argument("--disclosure", "-d", type=str, help="Path to input JSON or TXT file containing invention disclosure")
    parser.add_argument("--title", "-t", type=str, default="Novel Invention", help="Invention title (if entering text)")
    parser.add_argument("--domain", type=str, default="mechanical", choices=["mechanical", "electronics"], help="Technical domain")
    parser.add_argument("--output", "-o", type=str, default=None, help="Output file path (Markdown or JSON)")
    parser.add_argument("--format", type=str, choices=["markdown", "json"], default="markdown", help="Output format")

    args = parser.parse_args()

    if args.disclosure:
        disc_path = Path(args.disclosure)
        if not disc_path.exists():
            print(f"Error: Disclosure file '{args.disclosure}' not found.")
            sys.exit(1)

        if disc_path.suffix == ".json":
            with open(disc_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                disclosure = InventionDisclosure(
                    title=data.get("title", args.title),
                    raw_text=data.get("raw_text") or data.get("text") or data.get("description", ""),
                    technical_domain=data.get("technical_domain", args.domain)
                )
        else:
            with open(disc_path, "r", encoding="utf-8") as f:
                raw_text = f.read()
                disclosure = InventionDisclosure(
                    title=args.title,
                    raw_text=raw_text,
                    technical_domain=args.domain
                )
    else:
        # Sample default disclosure
        print("No input provided. Running with sample mechanical invention...")
        disclosure = InventionDisclosure(
            title="Variable-Pitch Drone Rotor with Direct Stepper Linkage",
            raw_text="""1. Blade Pitch Hub Assembly: A lightweight rotor hub containing four carbon-fiber blade grips pivotally mounted via high-speed ceramic ball bearings.
2. Direct-Drive Pitch Linkage: Each blade root is connected via an eccentric titanium pushrod to a central micro-stepper motor that changes blade attack angle during flight within 15 milliseconds.
3. Optical Position Feedback: Integrated reflective optical encoders positioned directly at each blade root to measure instantaneous blade angle.""",
            technical_domain="mechanical"
        )

    print(f"\n[PriorArt Copilot] Initializing 4-Agent Screening Pipeline for: '{disclosure.title}'")
    print(f"Domain: {disclosure.technical_domain}\n")

    def log_step(step: str, msg: str):
        print(f"  [*] [{step}] {msg}")

    pipeline = PriorArtPipeline(on_step_callback=log_step)
    state = pipeline.run(disclosure)

    if state.errors:
        print(f"\n[ERROR] Pipeline execution failed with errors: {state.errors}")
        sys.exit(1)

    print("\n[SUCCESS] Multi-Agent Screening Pipeline execution completed successfully!\n")
    report = state.final_report

    if args.format == "json":
        output_content = report.model_dump_json(indent=2)
    else:
        output_content = format_markdown_report(report)

    if args.output:
        out_path = Path(args.output)
        out_path.write_text(output_content, encoding="utf-8")
        print(f"Report written to: {out_path.resolve()}")
    else:
        print("=" * 70)
        print(output_content)
        print("=" * 70)


if __name__ == "__main__":
    main()
