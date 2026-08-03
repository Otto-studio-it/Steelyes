from __future__ import annotations

from typing import Any

from .models import DiffItem, Manifest, ObservedGateAnalysis


def _fmt_options(options: dict[str, bool]) -> str:
    enabled = [key for key, value in options.items() if value]
    return ", ".join(enabled) if enabled else "none detected"


def build_diff(
    manifest: Manifest,
    observed: ObservedGateAnalysis,
    rules: dict[str, Any],
) -> list[DiffItem]:
    items: list[DiffItem] = []
    expected_type = manifest.gate_type

    # Gate type
    if observed.gate_type_guess == expected_type:
        items.append(
            DiffItem(
                area="Gate type",
                observed=observed.gate_type_guess,
                engine_today=expected_type,
                status="MATCH",
            )
        )
    else:
        items.append(
            DiffItem(
                area="Gate type",
                observed=observed.gate_type_guess,
                engine_today=expected_type,
                status="CONFLICT",
                notes=f"Vision guess differs from manifest ({expected_type}).",
            )
        )

    # Style
    style_hint = manifest.style_hint or "traditional_victorian"
    if observed.style_guess == style_hint:
        status = "MATCH"
    elif style_hint and observed.style_guess != style_hint:
        status = "REVIEW"
    else:
        status = "UNKNOWN"
    items.append(
        DiffItem(
            area="Style / infill",
            observed=observed.style_guess,
            engine_today=style_hint,
            status=status,
        )
    )

    # Leaf count vs type
    expected_leaves = 2 if "double" in expected_type or expected_type == "bifolding_double_swing" else 1
    if observed.leaf_count == expected_leaves:
        status = "MATCH"
    elif expected_type in {"telescopic_sliding", "radius_sliding"}:
        status = "REVIEW"
        expected_leaves_label = "multi-panel (check photo)"
    else:
        status = "CONFLICT"
    items.append(
        DiffItem(
            area="Leaf / panel count",
            observed=str(observed.leaf_count),
            engine_today=str(expected_leaves),
            status=status,
        )
    )

    # Options vs engine enum
    engine_options = set(rules.get("gate_options", []))
    for key, enabled in observed.visible_options.items():
        if key not in engine_options:
            items.append(
                DiffItem(
                    area=f"Option: {key}",
                    observed="visible in photo",
                    engine_today="not in gate-engine enum",
                    status="GAP",
                    notes="Consider adding to GATE_OPTION_KEYS or map to existing option.",
                )
            )
            continue
        if enabled:
            items.append(
                DiffItem(
                    area=f"Option: {key}",
                    observed="visible",
                    engine_today="supported in model",
                    status="MATCH",
                )
            )

    # Composite compatibility
    if observed.style_guess == "composite_boards":
        victorian_only = [
            "top_railheads",
            "dog_bars",
            "dog_bar_railheads",
            "bushes",
            "spirals",
        ]
        for key in victorian_only:
            if observed.visible_options.get(key):
                items.append(
                    DiffItem(
                        area=f"Compatibility: {key} on composite",
                        observed="visible on composite-style gate",
                        engine_today="blocked by compatibility rules",
                        status="CONFLICT",
                        notes="Photo may show Victorian infill mislabeled as composite, or rule needs review.",
                    )
                )

    # Sliding topology
    if "sliding" in expected_type:
        sliding = observed.topology.get("sliding_system")
        if sliding:
            items.append(
                DiffItem(
                    area="Sliding system",
                    observed=str(sliding),
                    engine_today=rules["renderer_parts_expected"].get(
                        "cantilever_sliding" if expected_type == "cantilever_sliding" else "sliding",
                        "track + panel",
                    ),
                    status="REVIEW",
                )
            )
        else:
            items.append(
                DiffItem(
                    area="Sliding system",
                    observed="not described in analysis",
                    engine_today="track + panel (+ counterweight for cantilever)",
                    status="UNKNOWN",
                    notes="Re-run analysis with track/rail close-up photo.",
                )
            )

    # Known renderer gaps — always surface for configurator work
    for gap in rules.get("known_renderer_gaps", []):
        items.append(
            DiffItem(
                area="Renderer fidelity",
                observed="real gate in photo",
                engine_today=gap,
                status="GAP",
            )
        )

    return items
