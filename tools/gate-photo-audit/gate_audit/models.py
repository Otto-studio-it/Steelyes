from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_DIR = ROOT / "schema"
PROMPTS_DIR = ROOT / "prompts"
TEMPLATES_DIR = ROOT / "templates"
INPUTS_DIR = ROOT / "inputs"
HANDOFF_DIR = ROOT / "handoff"
REPORTS_DIR = ROOT / "reports"

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".heic"}


class PhotoRef(BaseModel):
    path: str
    view: str = "front_elevation"
    notes: str | None = None


class Manifest(BaseModel):
    gate_type: str
    style_hint: str | None = None
    known_dimensions_mm: dict[str, int] | None = None
    motorised_hint: bool | None = None
    photos: list[PhotoRef] = Field(default_factory=list)
    notes: str | None = None


class ObservedGateAnalysis(BaseModel):
    gate_type_guess: str
    confidence: float
    leaf_count: int
    style_guess: str
    topology: dict[str, Any]
    visible_options: dict[str, bool]
    composition_narrative: dict[str, Any]
    proportion_observations: dict[str, str]
    uncertainties: list[str]
    renderer_recommendations: list[str] = Field(default_factory=list)
    open_questions_for_client: list[str] = Field(default_factory=list)


class DiffItem(BaseModel):
    area: str
    observed: str
    engine_today: str
    status: str  # MATCH | GAP | CONFLICT | REVIEW | UNKNOWN
    notes: str | None = None


def load_manifest(gate_folder: Path) -> Manifest:
    manifest_path = gate_folder / "manifest.yaml"
    if not manifest_path.exists():
        raise FileNotFoundError(f"Missing manifest: {manifest_path}")
    with manifest_path.open(encoding="utf-8") as handle:
        data = yaml.safe_load(handle)
    return Manifest.model_validate(data)


def resolve_photo_paths(gate_folder: Path, manifest: Manifest) -> list[Path]:
    paths: list[Path] = []
    for photo in manifest.photos:
        candidate = gate_folder / photo.path
        if not candidate.exists():
            raise FileNotFoundError(f"Photo not found: {candidate}")
        paths.append(candidate)
    if not paths:
        # Fallback: any image in folder except hidden
        for item in sorted(gate_folder.iterdir()):
            if item.suffix.lower() in IMAGE_EXTENSIONS and not item.name.startswith("."):
                paths.append(item)
    if not paths:
        raise FileNotFoundError(f"No photos found in {gate_folder}")
    return paths


def load_engine_rules() -> dict[str, Any]:
    import json

    path = SCHEMA_DIR / "engine_rules.json"
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def load_observed_json(path: Path) -> ObservedGateAnalysis:
    import json

    with path.open(encoding="utf-8") as handle:
        data = json.load(handle)
    return ObservedGateAnalysis.model_validate(data)


def gate_input_dir(gate_type: str) -> Path:
    return INPUTS_DIR / gate_type


def gate_handoff_dir(gate_type: str) -> Path:
    return HANDOFF_DIR / gate_type
