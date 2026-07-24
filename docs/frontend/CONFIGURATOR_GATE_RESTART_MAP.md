---
title: Configurator Gate Restart Map
description: Practical map of gate-by-gate documentation coverage, current strengths, known gaps, and restart order for the Steelyes configurator
owner: Ruben
status: ACTIVE
last_updated: 2026-07-18
---

# Configurator Gate Restart Map

This document is the practical handoff for restarting configurator work gate by gate.

Goal:

- know which document exists for each gate type
- separate confirmed behavior from provisional behavior
- identify which families are ready to resume first
- avoid mixing photo evidence, client notes, and engine contract as if they were the same source

Local verification on 2026-07-18:

- `pnpm --filter @steelyes/gate-engine test` passes
- `pnpm --filter web typecheck` passes

That means the current problem is not a broken codebase. The problem is alignment: some families are well documented, some are only partially audited, and some still need client confirmation.

---

## 1. What already works

These parts are stable enough to build on:

- shared domain model in `packages/gate-engine`
- validation and normalization
- indicative pricing
- 2D render plan
- schematic 3D mesh plan
- serialization and share-token flow
- live `/configurator` entry
- persisted configurator state
- mobile and desktop configurator shell
- per-gate catalog pages in `docs/frontend/gate-catalog/`

The engine currently covers 8 gate types, 2 styles, pricing, validation, and rendering well enough for the MVP scope.

---

## 2. What is not finished

The main gaps are not structural bugs. They are domain gaps:

- `radius_sliding` is still ambiguous in meaning and has no deep photo audit folder
- `composite_boards` is still less defined than `traditional_victorian`
- railhead catalog data is still provisional
- decorative count rules still need final client sign-off in several places
- `circles` appears in client notes and audit material, but it is not a first-class option key in `packages/gate-engine/src/types.ts`
- only 4 gate families have full photo-audit folders

The practical consequence is simple:

- some gates are ready for refinement
- some gates are ready only for documentation completion
- one gate should stay blocked until the client defines the mechanism more precisely

---

## 3. Gate-by-gate coverage

| Gate type | Catalog doc | Deep audit folder | Current state |
|---|---|---|---|
| `double_swing` | yes | yes | best documented, best restart candidate |
| `single_swing` | yes | yes | clear, compact, good second candidate |
| `tracked_sliding` | yes | yes | clear mechanism, distinct from cantilever |
| `cantilever_sliding` | yes | yes | clear mechanism, but structurally different from tracked |
| `bifolding_double_swing` | yes | no | documented, but lacks photo-driven audit depth |
| `single_bifolding` | yes | no | documented, but lacks photo-driven audit depth |
| `telescopic_sliding` | yes | no | documented, but lacks photo-driven audit depth |
| `radius_sliding` | yes | no | weakest definition, should stay last |

Observed audit folders currently exist for:

- `docs/frontend/gate-audits/double_swing/`
- `docs/frontend/gate-audits/single_swing/`
- `docs/frontend/gate-audits/tracked_sliding/`
- `docs/frontend/gate-audits/cantilever_sliding/`

There is no `docs/frontend/gate-audits/radius_sliding/` folder yet.

---

## 4. Per-gate diagnosis

### `double_swing`

Strongest starting point.

Why:

- richest gate catalog sheet
- deep photo audit exists
- topology and renderer gaps are already identified
- this is the best candidate for the first production-quality visual slice

Known issues:

- photo evidence suggests more detail than the current schematic renderer shows
- decorative bands and finial density are still simplified
- `circles`/circle-band language appears in docs but is not a first-class option key
- photo sizes look larger than the current FROM bands, so the catalog may be minimum-band language rather than literal photo size

### `single_swing`

Good second candidate.

Why:

- simple mechanism
- deep audit exists
- useful for compact pedestrian or light driveway access

Known issues:

- visual distinction from `double_swing` must stay obvious
- composite variant still lacks a fully defined construction model

### `tracked_sliding`

Good third candidate and mechanically distinct.

Why:

- deep audit exists
- track-vs-no-track distinction is now well understood
- engine already separates it from cantilever

Known issues:

- current renderer still looks schematic
- composite sliding variants need more detail
- photo sizes again suggest the catalog band is not the same as the photographed install scale

### `cantilever_sliding`

Important to keep separate from tracked sliding.

Why:

- deep audit exists
- this family changes the whole structural layout because there is no ground track in the opening
- the engine already has a cantilever rule, so it is a good validation anchor

Known issues:

- tail / counterbalance ratio still needs tighter production confirmation
- renderer and mesh are still schematic
- the opening width semantics must stay explicit

### `bifolding_double_swing`

Documented, but not visually grounded enough yet.

Why it matters:

- more complex than double swing
- has two main leaves and folding sub-panels

Known issues:

- no photo audit folder yet
- exact folding ratios are still open
- not enough visual evidence to tune renderer fidelity safely

### `single_bifolding`

Documented, but still mostly a spec sheet.

Why it matters:

- compact folding mechanism
- useful where swing clearance is tight

Known issues:

- no photo audit folder yet
- side collection rules are not fully locked
- composite construction is still incomplete

### `telescopic_sliding`

Documented, but mechanically under-specified.

Why it matters:

- multi-panel sequencing changes rendering and geometry logic
- it is more complex than tracked sliding

Known issues:

- no photo audit folder yet
- panel count, overlap order, and motion timing are still open
- should stay schematic until the client confirms the mechanics

### `radius_sliding`

Most blocked family.

Why:

- the term itself is still ambiguous
- it may mean curved motion, curved top, or both
- there is no deep audit folder yet

Known issues:

- should not be treated as a finished product definition
- needs a client decision before implementation work goes far

---

## 5. Restart order

If the goal is to finish the configurator in the safest order, work like this:

1. `double_swing`
2. `single_swing`
3. `tracked_sliding`
4. `cantilever_sliding`
5. `bifolding_double_swing`
6. `single_bifolding`
7. `telescopic_sliding`
8. `radius_sliding`

Reasoning:

- the first four families have both catalog sheets and audit material
- the first two are the clearest visual and mechanical baseline
- tracked and cantilever sliding prove the system can separate similar mechanisms correctly
- bifolding and telescopic are more complex and need more structural clarity
- radius should be last because the meaning is still not closed

---

## 6. Recommended working slice

If the team wants the shortest safe path to visible progress, use this slice:

- `double_swing` Traditional Victorian
- current engine pricing and validation
- current schematic 2D preview
- current schematic 3D preview
- one audit-backed doc path from requirements to renderer

That slice has the best balance of:

- documentation quality
- photo evidence
- engine support
- low ambiguity

It is the best place to restart if the objective is to make the configurator feel real again before widening the scope.

---

## 7. Exact doc map

### Gate catalog

- [`docs/frontend/gate-catalog/double-swing.md`](./gate-catalog/double-swing.md)
- [`docs/frontend/gate-catalog/single-swing.md`](./gate-catalog/single-swing.md)
- [`docs/frontend/gate-catalog/tracked-sliding.md`](./gate-catalog/tracked-sliding.md)
- [`docs/frontend/gate-catalog/cantilever-sliding.md`](./gate-catalog/cantilever-sliding.md)
- [`docs/frontend/gate-catalog/bifolding-double-swing.md`](./gate-catalog/bifolding-double-swing.md)
- [`docs/frontend/gate-catalog/single-bifolding.md`](./gate-catalog/single-bifolding.md)
- [`docs/frontend/gate-catalog/telescopic-sliding.md`](./gate-catalog/telescopic-sliding.md)
- [`docs/frontend/gate-catalog/radius-sliding.md`](./gate-catalog/radius-sliding.md)

### Deep audits

- [`docs/frontend/gate-audits/double_swing/README.md`](./gate-audits/double_swing/README.md)
- [`docs/frontend/gate-audits/single_swing/README.md`](./gate-audits/single_swing/README.md)
- [`docs/frontend/gate-audits/tracked_sliding/README.md`](./gate-audits/tracked_sliding/README.md)
- [`docs/frontend/gate-audits/cantilever_sliding/README.md`](./gate-audits/cantilever_sliding/README.md)

### Shared baseline

- [`docs/GATE_CREATOR_BASELINE.md`](../GATE_CREATOR_BASELINE.md)
- [`docs/frontend/CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md`](./CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md)
- [`docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md`](./CLIENT_GATE_REQUIREMENTS_REFERENCE.md)
- [`packages/gate-engine/README.md`](../../packages/gate-engine/README.md)

