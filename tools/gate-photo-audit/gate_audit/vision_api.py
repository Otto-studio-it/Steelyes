from __future__ import annotations

import base64
import json
import os
from pathlib import Path

from .models import ObservedGateAnalysis, resolve_photo_paths, gate_input_dir, load_manifest


def analyze_with_anthropic(gate_type: str, model: str = "claude-sonnet-4-20250514") -> ObservedGateAnalysis:
    """Optional API path — requires ANTHROPIC_API_KEY."""
    try:
        import anthropic
    except ImportError as exc:
        raise RuntimeError("Install anthropic: pip install anthropic") from exc

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("Set ANTHROPIC_API_KEY for --mode api")

    from .prepare import _read_prompt
    from .models import load_engine_rules, SCHEMA_DIR

    gate_folder = gate_input_dir(gate_type)
    manifest = load_manifest(gate_folder)
    photos = resolve_photo_paths(gate_folder, manifest)
    rules = load_engine_rules()
    schema = (SCHEMA_DIR / "observed_gate.schema.json").read_text(encoding="utf-8")

    content: list[dict] = [
        {
            "type": "text",
            "text": (
                f"{_read_prompt()}\n\n"
                f"Expected gate_type: {manifest.gate_type}\n"
                f"Style hint: {manifest.style_hint}\n"
                f"Known dimensions: {manifest.known_dimensions_mm}\n"
                f"Engine rules snapshot:\n{json.dumps(rules, indent=2)}\n\n"
                f"Return ONLY valid JSON matching this schema:\n{schema}"
            ),
        }
    ]

    for photo in photos:
        media_type = "image/jpeg" if photo.suffix.lower() in {".jpg", ".jpeg"} else "image/png"
        data = base64.standard_b64encode(photo.read_bytes()).decode("ascii")
        content.append(
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": media_type,
                    "data": data,
                },
            }
        )

    client = anthropic.Anthropic(api_key=api_key)
    message = client.messages.create(
        model=model,
        max_tokens=4096,
        messages=[{"role": "user", "content": content}],
    )

    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()

    data = json.loads(raw)
    return ObservedGateAnalysis.model_validate(data)
