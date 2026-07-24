#!/usr/bin/env python3
"""CLI for gate photo audit — Cursor handoff or optional Vision API."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from gate_audit.diff import build_diff
from gate_audit.models import (
    INPUTS_DIR,
    gate_handoff_dir,
    gate_input_dir,
    load_engine_rules,
    load_manifest,
    load_observed_json,
    resolve_photo_paths,
)
from gate_audit.prepare import prepare_handoff
from gate_audit.report import render_report, write_report
from gate_audit.vision_api import analyze_with_anthropic


def cmd_prepare(args: argparse.Namespace) -> int:
    out = prepare_handoff(args.gate_type)
    print(f"Handoff ready: {out}")
    print()
    print("Next in Cursor:")
    print(f"  1. Open {out / 'ANALYSIS_REQUEST.md'}")
    print(f"  2. Attach photos in {out}/")
    print('  3. Ask: "Analyze these gate photos and write observed.json"')
    print(f"  4. Run: python audit.py report {args.gate_type}")
    return 0


def cmd_report(args: argparse.Namespace) -> int:
    gate_type = args.gate_type
    gate_folder = gate_input_dir(gate_type)
    manifest = load_manifest(gate_folder)
    photos = resolve_photo_paths(gate_folder, manifest)

    observed_path = gate_handoff_dir(gate_type) / "observed.json"
    if args.observed:
        observed_path = Path(args.observed)
    if not observed_path.exists():
        print(f"Missing {observed_path}", file=sys.stderr)
        print("Run prepare + Cursor analysis, or: python audit.py analyze --mode api", file=sys.stderr)
        return 1

    observed = load_observed_json(observed_path)
    rules = load_engine_rules()
    diff_items = build_diff(manifest, observed, rules)
    content = render_report(
        gate_type,
        manifest,
        observed,
        diff_items,
        [p.name for p in photos],
    )
    report_path = write_report(gate_type, content)
    print(f"Report written: {report_path}")
    return 0


def cmd_analyze(args: argparse.Namespace) -> int:
    gate_type = args.gate_type
    if args.mode == "api":
        observed = analyze_with_anthropic(gate_type, model=args.model)
        out_dir = gate_handoff_dir(gate_type)
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / "observed.json"
        out_path.write_text(observed.model_dump_json(indent=2), encoding="utf-8")
        print(f"API analysis saved: {out_path}")
        return cmd_report(argparse.Namespace(gate_type=gate_type, observed=str(out_path)))

    print("For agent mode use: python audit.py prepare <gate_type>", file=sys.stderr)
    return 1


def cmd_list(args: argparse.Namespace) -> int:
    if not INPUTS_DIR.exists():
        print("No inputs/ folder yet.")
        return 0
    for folder in sorted(INPUTS_DIR.iterdir()):
        if folder.is_dir() and not folder.name.startswith("_"):
            has_manifest = (folder / "manifest.yaml").exists()
            photo_count = sum(
                1 for f in folder.iterdir() if f.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
            )
            print(f"  {folder.name}: manifest={'yes' if has_manifest else 'NO'} photos={photo_count}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Steelyes gate photo audit tool")
    sub = parser.add_subparsers(dest="command", required=True)

    p_prepare = sub.add_parser("prepare", help="Build Cursor handoff bundle for one gate type")
    p_prepare.add_argument("gate_type")
    p_prepare.set_defaults(func=cmd_prepare)

    p_report = sub.add_parser("report", help="Generate Markdown report from observed.json")
    p_report.add_argument("gate_type")
    p_report.add_argument("--observed", help="Path to observed.json (default: handoff/<type>/observed.json)")
    p_report.set_defaults(func=cmd_report)

    p_analyze = sub.add_parser("analyze", help="Run vision analysis")
    p_analyze.add_argument("gate_type")
    p_analyze.add_argument("--mode", choices=["api", "agent"], default="agent")
    p_analyze.add_argument("--model", default="claude-sonnet-4-20250514")
    p_analyze.set_defaults(func=cmd_analyze)

    p_list = sub.add_parser("list", help="List input folders")
    p_list.set_defaults(func=cmd_list)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
