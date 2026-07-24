from __future__ import annotations

import json
import shutil
from pathlib import Path

from .models import (
    HANDOFF_DIR,
    PROMPTS_DIR,
    SCHEMA_DIR,
    gate_handoff_dir,
    gate_input_dir,
    load_engine_rules,
    load_manifest,
    resolve_photo_paths,
)


def _read_prompt() -> str:
    path = PROMPTS_DIR / "gate_analysis.md"
    return path.read_text(encoding="utf-8")


def prepare_handoff(gate_type: str) -> Path:
    """Build a Cursor/agent bundle: prompt + manifest + photo list + schema."""
    gate_folder = gate_input_dir(gate_type)
    if not gate_folder.exists():
        raise FileNotFoundError(
            f"Input folder missing: {gate_folder}\n"
            f"Create it and add manifest.yaml + photos."
        )

    manifest = load_manifest(gate_folder)
    photos = resolve_photo_paths(gate_folder, manifest)
    rules = load_engine_rules()
    out_dir = gate_handoff_dir(gate_type)
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True)

    # Copy photos for easy @ attachment in Cursor
    copied: list[str] = []
    for photo in photos:
        dest = out_dir / photo.name
        shutil.copy2(photo, dest)
        copied.append(photo.name)

    schema_path = SCHEMA_DIR / "observed_gate.schema.json"
    shutil.copy2(schema_path, out_dir / "observed_gate.schema.json")

    manifest_dump = out_dir / "manifest.yaml"
    shutil.copy2(gate_folder / "manifest.yaml", manifest_dump)

    rules_dump = out_dir / "engine_rules.snapshot.json"
    rules_dump.write_text(json.dumps(rules, indent=2), encoding="utf-8")

    request_path = out_dir / "ANALYSIS_REQUEST.md"
    request_path.write_text(
        _build_analysis_request(gate_type, manifest, copied, rules),
        encoding="utf-8",
    )

    # Empty observed template
    template_path = out_dir / "observed.template.json"
    template_path.write_text(
        json.dumps(_observed_template(manifest.gate_type), indent=2),
        encoding="utf-8",
    )

    return out_dir


def _observed_template(gate_type: str) -> dict:
    return {
        "gate_type_guess": gate_type,
        "confidence": 0.0,
        "leaf_count": 1,
        "style_guess": "traditional_victorian",
        "topology": {
            "posts": {"count": 0, "role": ""},
            "frame": {"top_rail": True, "bottom_rail": True},
            "infill": {"upper_zone": "", "lower_zone": "", "bar_orientation": "vertical"},
            "hardware": [],
            "sliding_system": None,
        },
        "visible_options": {
            "middle_bar": False,
            "top_railheads": False,
            "dog_bars": False,
            "dog_bar_railheads": False,
            "arched_top": False,
            "bushes": False,
            "spirals": False,
        },
        "composition_narrative": {
            "how_parts_connect": "",
            "why_layout": "",
            "distinctive_features": [],
        },
        "proportion_observations": {},
        "uncertainties": [],
        "renderer_recommendations": [],
        "open_questions_for_client": [],
    }


def _build_analysis_request(
    gate_type: str,
    manifest,
    photo_names: list[str],
    rules: dict,
) -> str:
    prompt = _read_prompt()
    dims = manifest.known_dimensions_mm or {}
    dims_line = (
        f"- Known dimensions (mm): width={dims.get('width', '?')}, height={dims.get('height', '?')}"
        if dims
        else "- Known dimensions: not supplied — describe proportions qualitatively only."
    )

    return f"""# Gate photo analysis request — `{gate_type}`

Use this bundle to produce a structured gate audit for the Steelyes configurator.

## Your task

1. Open and inspect every photo listed below (they are copied in this folder).
2. Read `engine_rules.snapshot.json` for current configurator rules.
3. Fill in **`observed.json`** in this same folder using the JSON schema in `observed_gate.schema.json`.
4. Be specific about topology: posts, frame, infill zones, hardware, sliding parts.
5. Explain **how parts connect** and **why** the layout looks that way.
6. List **renderer_recommendations** for improving the 2D/3D configurator preview.
7. List **open_questions_for_client** for anything that needs Marius / site measure.

## Manifest

- Gate type (expected): `{manifest.gate_type}`
- Style hint: `{manifest.style_hint or "not set"}`
{dims_line}
- Motorised hint: `{manifest.motorised_hint}`
- Notes: {manifest.notes or "none"}

## Photos in this folder

{chr(10).join(f"- `{name}`" for name in photo_names)}

## Output file (required)

Write valid JSON to:

```
handoff/{gate_type}/observed.json
```

Start from `observed.template.json`. Do not wrap in markdown fences in the file itself.

After saving, run from repo root:

```bash
cd tools/gate-photo-audit
python audit.py report {gate_type}
```

## Analysis instructions

{prompt}

## Engine gate types

{", ".join(rules.get("gate_types", []))}

## Engine options

{", ".join(rules.get("gate_options", []))}

## Known renderer gaps (check against photos)

{chr(10).join(f"- {gap}" for gap in rules.get("known_renderer_gaps", []))}
"""
