---
title: Missing Gates Build Plan
description: Plan to bring enquire / fiction gate types to honest schematic then configure
owner: Ruben
status: ACTIVE
last_updated: 2026-07-30
depends_on:
  - docs/frontend/CONFIGURATOR_DATA_READINESS_2026-07-28.md
  - docs/frontend/DELIVERY_ROADMAP_2W_2026-07-30.md
  - docs/frontend/CONFIGURATOR_REBUILD_PLAYBOOK.md
  - docs/client-answers/2026-07-28-marius.md
---

# Missing Gates Build Plan — 2026-07-30

## Goal

Move the four non-buildable gate types from **fiction / enquire** to **honest schematic**, then (only after Marius) to **configure**. Never invent workshop rules on customer surfaces.

## Current honesty tiers

| Gate type | Tier | Geometry truth |
|---|---|---|
| `double_swing` / `single_swing` | configure | Victorian recipe |
| `tracked_sliding` / `cantilever_sliding` | schematic | Labelled sliding abstraction |
| `bifolding_double_swing` / `single_bifolding` | **schematic** (CA-09/10) | 2 panels/leaf 50/50; hinge-side stack; L/R at quote |
| `telescopic_sliding` / `radius_sliding` | **schematic** (CA-11/12) | 3 panels + overlap band; curved path always |

## Phases

### Phase A — Marius intake (blocking for configure; not for labelled schematic)

Send worked-example questions (see `docs/client-answers/FOLLOWUP_MISSING_GATES_2026-07-30.md`):

1. `open.width_meaning` / `open.height_meaning`
2. `gate.bifold.panels_per_leaf` + equal split?
3. `gate.single_bifold.collection_side`
4. `gate.telescopic.panel_count` + overlap order
5. `gate.radius.definition`

### Phase B — Schematic honesty (code)

| Order | Type | Done when |
|---|---|---|
| B1 | Bifold double + single | Fold lines + hinges obvious; tier = schematic; notes name open intake ids |
| B2 | Telescopic | Multi-panel stack readable; still schematic |
| B3 | Radius | Only after definition; else stay enquire |

### Phase C — Configure + 3D/AR

Only after Phase A answers for that type. Same `GateConfig` → 2D → mesh → AR (ADR 002).

## Catalog assumptions used in B1 (explicitly provisional)

From `docs/frontend/gate-catalog/bifolding-double-swing.md` / `single-bifolding.md`:

- 2 panels per main leaf
- Double = 4 panels; single = 2
- Equal 50/50 split
- Single collection side default = hinge-left (schematic)

Code owner: `packages/gate-engine/src/rules/bifold.ts`.

## Out of scope until later

- Final prices / size uplift
- Radius without definition
- Promoting bifold/telescopic/radius to **configure**
- Photoreal materials

## Sequencing vs 2-week handoff

Day-14 freeze still allows enquire for telescopic/radius. Bifold schematic exploration is an honesty upgrade: customers can explore fold layout without claiming fabrication truth.
