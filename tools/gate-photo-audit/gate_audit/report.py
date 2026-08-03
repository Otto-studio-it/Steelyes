from __future__ import annotations

from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

from .models import TEMPLATES_DIR, DiffItem, Manifest, ObservedGateAnalysis


def render_report(
    gate_type: str,
    manifest: Manifest,
    observed: ObservedGateAnalysis,
    diff_items: list[DiffItem],
    photo_names: list[str],
) -> str:
    env = Environment(
        loader=FileSystemLoader(TEMPLATES_DIR),
        autoescape=select_autoescape(),
    )
    template = env.get_template("audit_report.md.j2")
    return template.render(
        gate_type=gate_type,
        manifest=manifest,
        observed=observed,
        diff_items=diff_items,
        photo_names=photo_names,
        match_count=sum(1 for item in diff_items if item.status == "MATCH"),
        gap_count=sum(1 for item in diff_items if item.status == "GAP"),
        conflict_count=sum(1 for item in diff_items if item.status == "CONFLICT"),
    )


def write_report(gate_type: str, content: str) -> Path:
    from .models import REPORTS_DIR

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    path = REPORTS_DIR / f"{gate_type}_audit.md"
    path.write_text(content, encoding="utf-8")
    return path
