---
title: Configurator Gate Execution Checklist
description: Gate-by-gate checklist of missing data, source, status, and next action for rebuilding the configurator
owner: Ruben
status: ACTIVE
last_updated: 2026-07-18
---

# Configurator Gate Execution Checklist

Legend:

- `confirmed` = already stated clearly in source docs or engine
- `provisional` = present, but still not final
- `blocked` = cannot be closed without client confirmation
- `next` = the next concrete step to take

Use this file as the working checklist when reconstructing the 2D configurator.

---

## `double_swing`

| Step | What to find | Source | Status | Priority |
|---|---|---|---|---|
| 1 | Confirm whether `widthMm` is clear opening or total gate width | Client brief, audit | provisional | high |
| 2 | Confirm whether `heightMm` includes the arch or only the rectangular body | Client brief, audit | provisional | high |
| 3 | Confirm exact frame tube size | Photo audit, client | blocked | high |
| 4 | Confirm rail count and vertical bar spacing | Photo audit | provisional | high |
| 5 | Confirm center latch geometry | Photo audit | provisional | high |
| 6 | Confirm hinge position and side clearance | Photo audit | provisional | high |
| 7 | Confirm ground clearance | Photo audit | provisional | medium |
| 8 | Confirm which decorative bands are real product options | Client brief, audit | blocked | high |
| 9 | Rebuild the 2D geometry recipe | Engine + audit | next | high |
| 10 | Lock a regression test for the final drawing | Engine tests | next | high |

---

## `single_swing`

| Step | What to find | Source | Status | Priority |
|---|---|---|---|---|
| 1 | Confirm leaf width rule | Client brief, audit | provisional | high |
| 2 | Confirm hinge side default | Client brief, audit | provisional | high |
| 3 | Confirm latch side default | Client brief, audit | provisional | medium |
| 4 | Confirm whether the same rail layout is reused from double swing | Engine, audit | provisional | high |
| 5 | Confirm whether the same pillar / post logic is reused | Engine, audit | provisional | medium |
| 6 | Rebuild the one-leaf technical drawing | Engine + audit | next | high |
| 7 | Lock a visual regression test | Engine tests | next | high |

---

## `tracked_sliding`

| Step | What to find | Source | Status | Priority |
|---|---|---|---|---|
| 1 | Confirm visible track style | Photo audit | confirmed | high |
| 2 | Confirm track position and length | Photo audit | provisional | high |
| 3 | Confirm panel body proportions | Photo audit | provisional | medium |
| 4 | Confirm motor visibility rules | Photo audit, client | provisional | medium |
| 5 | Confirm open-state runback rule | Client brief, audit | provisional | high |
| 6 | Confirm which decorative details are shared with Victorian swing | Audit + engine | provisional | medium |
| 7 | Rebuild the sliding 2D recipe | Engine + audit | next | high |
| 8 | Lock a regression test for track vs no-track distinction | Engine tests | next | high |

---

## `cantilever_sliding`

| Step | What to find | Source | Status | Priority |
|---|---|---|---|---|
| 1 | Confirm tail ratio | Client brief, audit | blocked | high |
| 2 | Confirm support carriage position | Photo audit | provisional | high |
| 3 | Confirm ground clearance | Photo audit | provisional | medium |
| 4 | Confirm opening width semantics | Client brief, engine | blocked | high |
| 5 | Confirm how much of the support structure must be visible | Photo audit | provisional | medium |
| 6 | Remove ground track from the opening in the drawing | Engine + audit | next | high |
| 7 | Add the counterbalance tail and support block | Engine + audit | next | high |
| 8 | Lock a regression test that forbids a track in the opening | Engine tests | next | high |

---

## `bifolding_double_swing`

| Step | What to find | Source | Status | Priority |
|---|---|---|---|---|
| 1 | Confirm how many panels each leaf has | Client brief | provisional | high |
| 2 | Confirm how the fold is split | Client brief, audit | provisional | high |
| 3 | Confirm how the folding hinge is represented | Client brief, audit | provisional | high |
| 4 | Confirm open-state footprint | Client brief, audit | provisional | medium |
| 5 | Confirm whether the same visual style as swing gates is reused | Engine, audit | provisional | medium |
| 6 | Build the split-leaf drawing recipe | Engine | next | high |
| 7 | Lock a regression test for folding structure | Engine tests | next | high |

---

## `single_bifolding`

| Step | What to find | Source | Status | Priority |
|---|---|---|---|---|
| 1 | Confirm fold split ratio | Client brief | provisional | high |
| 2 | Confirm collection side | Client brief, audit | provisional | high |
| 3 | Confirm open-state footprint | Client brief, audit | provisional | medium |
| 4 | Confirm whether the same component logic can be reused from bifolding double swing | Engine | provisional | medium |
| 5 | Build the one-leaf folding drawing recipe | Engine | next | high |
| 6 | Lock a regression test for compact folding geometry | Engine tests | next | high |

---

## `telescopic_sliding`

| Step | What to find | Source | Status | Priority |
|---|---|---|---|---|
| 1 | Confirm number of panels | Client brief | blocked | high |
| 2 | Confirm overlap order | Client brief | blocked | high |
| 3 | Confirm closed position stack | Client brief, audit | provisional | medium |
| 4 | Confirm open position stack | Client brief, audit | provisional | medium |
| 5 | Confirm how much of the motion should be visible in 2D | Engine, audit | provisional | medium |
| 6 | Draw each panel as a separate block | Engine | next | high |
| 7 | Lock a regression test for multi-panel sequencing | Engine tests | next | high |

---

## `radius_sliding`

| Step | What to find | Source | Status | Priority |
|---|---|---|---|---|
| 1 | Confirm whether the term means curved path, curved top, or both | Client brief | blocked | high |
| 2 | Confirm whether it is a sliding family or a separate product definition | Client brief | blocked | high |
| 3 | Confirm what the preview must show in plan and elevation | Client brief, audit | blocked | high |
| 4 | Create the deep audit folder only after the meaning is fixed | Docs | next | medium |
| 5 | Build the renderer only after the geometry truth is fixed | Engine | next | high |

---

## Next action order

1. Close `double_swing`.
2. Close `single_swing`.
3. Separate `tracked_sliding` from `cantilever_sliding`.
4. Rebuild `bifolding_double_swing`.
5. Rebuild `single_bifolding`.
6. Rebuild `telescopic_sliding`.
7. Define `radius_sliding` last.

---

## Working rule

If a row is `blocked`, do not invent the value.

If a row is `provisional`, keep it out of the final geometry contract until the client confirms it.

