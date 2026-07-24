---
title: Configurator Rebuild Playbook
description: Minimal step-by-step plan to clean up the configurator work and rebuild the 2D reference gate by gate
owner: Ruben
status: ACTIVE
last_updated: 2026-07-18
---

# Configurator Rebuild Playbook

This is the shortest useful plan.

Use it to restart the configurator cleanly and finish the 2D work without spreading effort across too many moving parts.

---

## 0. Clean up first

Keep these as the working set:

- [`docs/frontend/CONFIGURATOR_GATE_RESTART_MAP.md`](./CONFIGURATOR_GATE_RESTART_MAP.md)
- [`docs/frontend/CONFIGURATOR_2D_REFERENCE_RECONSTRUCTION_ROADMAP.md`](./CONFIGURATOR_2D_REFERENCE_RECONSTRUCTION_ROADMAP.md)
- [`docs/frontend/CONFIGURATOR_GATE_EXECUTION_CHECKLIST.md`](./CONFIGURATOR_GATE_EXECUTION_CHECKLIST.md)
- [`docs/frontend/gate-catalog/README.md`](./gate-catalog/README.md)
- [`docs/frontend/gate-audits/`](./gate-audits/)
- [`docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md`](./CLIENT_GATE_REQUIREMENTS_REFERENCE.md)
- [`packages/gate-engine/README.md`](../../packages/gate-engine/README.md)

Treat everything else in the configurator docs as supporting material unless it gives a confirmed value, a confirmed rule, or a confirmed visual reference.

Do not use provisional wording as truth.

---

## 1. Lock the rules

Before drawing anything:

1. confirm what `widthMm` means for each gate type
2. confirm what `heightMm` means for each gate type
3. confirm whether the quoted size includes posts or pillars
4. confirm which decorative names are real product options
5. confirm which gates are manual, automatic, or both
6. confirm which gates are still blocked by client ambiguity

Output of this step:

- one short source-of-truth note per gate type
- one list of unresolved questions

Done when:

- no gate depends on a hidden assumption to render correctly

---

## 2. Rebuild `double_swing` first

This is the baseline gate.

### Data to collect

1. exact width band
2. exact height band
3. frame tube size
4. rail count
5. vertical bar spacing
6. center latch shape
7. hinge position
8. ground clearance
9. whether the reference includes brick pillars
10. which decorative bands are real options and which are only visual styling

### Build order

1. draw the outer frame
2. place the two leaves
3. draw the vertical infill
4. add the horizontal rails
5. add the center meeting detail
6. add the latch hardware
7. add the pillars or posts
8. add the red dimension layer
9. align proportions against the reference image
10. lock a test for the final shape

### Done when

- the 2D preview looks like the reference drawing
- the same geometry can drive pricing and validation
- there is no gate-specific workaround in the UI

---

## 3. Derive `single_swing`

Use the same visual grammar as `double_swing`, but with one leaf.

### Data to collect

1. leaf width rule
2. hinge side default
3. latch side default
4. whether the same rail layout is reused
5. whether the same pillar / post logic is reused

### Build order

1. reuse the double swing frame recipe
2. remove the second leaf
3. adjust the center meeting detail to a single leaf latch side
4. keep the same technical dimension language
5. validate the result against the single swing audit

### Done when

- the drawing is clearly a one-leaf version of the same family

---

## 4. Separate the sliding families

Do not let these look interchangeable.

### `tracked_sliding`

Collect:

1. visible track style
2. track position
3. panel body proportions
4. motor visibility rules
5. open-state runback rule

Build:

1. draw track
2. draw single sliding panel
3. show rail structure
4. show automation only if confirmed
5. keep the drawing technically plain

Done when:

- the track reads immediately
- nobody confuses it with cantilever

### `cantilever_sliding`

Collect:

1. tail ratio
2. support carriage position
3. ground clearance
4. opening width semantics
5. how much of the support structure must be visible

Build:

1. remove the ground track from the opening
2. add the counterbalance tail
3. add the carriage/support block
4. keep the panel geometry consistent with tracked sliding

Done when:

- the opening is visibly clear of a ground track
- the tail makes the mechanism obvious

---

## 5. Rebuild the folding families

These need more mechanical truth than the swing gates.

### `bifolding_double_swing`

Collect:

1. how many panels each leaf has
2. how the fold is split
3. how the folding hinge is represented
4. open-state footprint
5. whether the same visual style as swing gates is reused

Build:

1. start from `double_swing`
2. split each leaf into folding panels
3. show the folding hinge
4. keep the same technical dimension layer

Done when:

- the folding structure is obvious at a glance

### `single_bifolding`

Collect:

1. fold split ratio
2. collection side
3. open-state footprint
4. whether the same component logic can be reused from bifolding double swing

Build:

1. start from `single_swing`
2. split the leaf into two folding panels
3. show the fold hinge
4. keep the same drawing language

Done when:

- the drawing makes the compact folding action obvious

---

## 6. Rebuild `telescopic_sliding`

This is a sequencing problem.

### Data to collect

1. number of panels
2. overlap order
3. closed position stack
4. open position stack
5. how much of the motion should be visible in 2D

### Build order

1. define panel count
2. define overlap order
3. draw each panel as a separate block
4. show the open stack logic
5. keep the track language consistent with other sliding gates

### Done when

- the user can tell it is multi-panel without reading text

---

## 7. Resolve `radius_sliding` last

Do not implement this until the client defines the meaning.

### Questions to close

1. curved path or curved top
2. one mechanism or two
3. whether it is really a sliding family or a separate product
4. what the preview must show in plan and elevation

### Done when

- the name has a single technical meaning
- the renderer can follow that meaning without guessing

---

## 8. Close the missing data

For every gate type, keep one simple table with:

- confirmed sizes
- confirmed options
- confirmed mechanism
- confirmed drawing rules
- open questions

If a value is not confirmed, label it provisional and keep it out of the final geometry contract.

---

## 9. Finish criteria

The work is finished when:

1. every gate type has a single technical sheet
2. every gate type has a clear visual rule set
3. every gate type has a known list of unresolved data
4. the engine owns geometry truth
5. the UI only renders what the engine says
6. `double_swing` matches the reference drawing
7. the rest of the families are derived from the same base language
