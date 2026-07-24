# Gate photo analysis — instructions for AI (Cursor agent or API)

You are auditing a real Steelyes gate from reference photos for the parametric configurator.

## Goals

1. Describe the **topology** (physical parts and how they connect).
2. Map visible features to **gate-engine** enums (`GateType`, `GateStyle`, `GateOptionKey`).
3. Compare against coded rules and flag **MATCH / GAP / CONFLICT / REVIEW**.
4. Recommend concrete **2D renderer** and **3D mesh** improvements.

## Gate types (use exact slugs)

`double_swing`, `single_swing`, `tracked_sliding`, `cantilever_sliding`, `bifolding_double_swing`, `single_bifolding`, `telescopic_sliding`, `radius_sliding`

## Styles

- `traditional_victorian` — open metal bar infill, decorative options
- `composite_boards` — closed panel / privacy infill

## Options to detect visually

`middle_bar`, `top_railheads`, `dog_bars`, `dog_bar_railheads`, `arched_top`, `bushes`, `spirals`

## Topology checklist

For **swing** gates:
- Posts (count, relative width vs bars)
- Frame (top rail, bottom rail, stiles)
- Leaves (1 or 2, meeting stile / latch zone)
- Upper infill (vertical bars, spacing density)
- Lower zone (dog bars or denser infill — estimate % of height)
- Hardware (hinges, latch, drop bolts if visible)

For **sliding** gates:
- Ground track or overhead rail
- Sliding panel vs fixed section
- Cantilever counterbalance tail (length ratio if estimable)
- Motor / carrier hardware if visible

For **bifolding**:
- Fold panel count and hinge direction hints

## Proportion rules

Without a scale reference in the photo:
- Do NOT invent millimetre bar spacing.
- DO describe ratios: e.g. "lower dense zone ≈ 35% of gate height".
- If manifest includes known width/height mm, use them to sanity-check leaf proportions.

## composition_narrative

Write clearly for a fabricator and a frontend developer:

- **how_parts_connect**: assembly order and junctions (post → frame → infill → decorations).
- **why_layout**: functional reason (security, style, animal barrier, sliding clearance).
- **distinctive_features**: what makes this gate recognisably Steelyes / Victorian.

## renderer_recommendations

Prioritize actionable items, e.g.:
- "Draw center meeting stile as double-line with latch block"
- "Split infill at 72% height to match dog bar zone"
- "Cantilever tail should be 33% of width at 4m opening"

## uncertainties

Always list what the photo cannot prove (tube size, exact spacing, motor type, finish code).
