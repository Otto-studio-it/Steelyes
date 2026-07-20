---
gate_type: double_swing
status: draft
last_updated: 2026-07-18
---

# Double swing workpack

This is the working sheet for rebuilding the 2D reference on `double_swing`.

Use it as the first concrete implementation target.

---

## 1. Sources to trust first

- [`docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md`](/Volumes/SSDRubb/Steelyes/docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md)
- [`docs/steelyes-gate-configurator-technical-spec.md`](/Volumes/SSDRubb/Steelyes/docs/steelyes-gate-configurator-technical-spec.md)
- [`docs/frontend/gate-audits/double_swing/README.md`](/Volumes/SSDRubb/Steelyes/docs/frontend/gate-audits/double_swing/README.md)
- [`docs/frontend/gate-audits/double_swing/TOPOLOGY_VICTORIAN.md`](/Volumes/SSDRubb/Steelyes/docs/frontend/gate-audits/double_swing/TOPOLOGY_VICTORIAN.md)
- [`docs/frontend/gate-audits/double_swing/COMPARISON_CLIENT_AND_ENGINE.md`](/Volumes/SSDRubb/Steelyes/docs/frontend/gate-audits/double_swing/COMPARISON_CLIENT_AND_ENGINE.md)
- [`docs/frontend/gate-audits/double_swing/RENDERER_RECOMMENDATIONS.md`](/Volumes/SSDRubb/Steelyes/docs/frontend/gate-audits/double_swing/RENDERER_RECOMMENDATIONS.md)

---

## 2. Confirmed facts

- gate type is `double_swing`
- family is two swing leaves
- style baseline is `traditional_victorian`
- `composite_boards` exists as a style, but its visual construction is still weaker
- FROM pricing exists for manual and automated versions
- the current reference image should be treated as a technical elevation, not a marketing render
- the reference style uses:
  - two leaves
  - brick pillars
  - a center meeting detail
  - vertical infill bars
  - horizontal rails
  - red dimensions

---

## 3. What the current engine already gets right

- two-leaf split
- generic swing behaviour
- base pricing contract
- validation contract
- 2D/3D shared config model

This means the main work is not to invent a new gate model. The work is to tighten the drawing grammar.

---

## 4. What still does not match the reference

### Structural gaps

- the 2D preview is still too schematic
- the reference has more visible rail structure than the current 2-zone simplification
- the center meeting detail is not drawn like the reference
- the lower zone density is not yet explicit enough
- the decorative layers are simplified or missing

### Documented ambiguity

- `widthMm` semantics still need confirmation
- `heightMm` semantics still need confirmation
- tube profile dimensions are not final
- the arch height may be part of the visual height, but that is still not fully locked
- the `circle band` language is not a first-class engine option
- `bushes` and `spirals` are still a partial mapping, not a definitive product truth

---

## 5. Missing data to close

| Data | Why it matters | Current state |
|---|---|---|
| `widthMm` meaning | needed for geometry and pricing | provisional |
| `heightMm` meaning | needed for visual scaling | provisional |
| frame tube size | needed for exact linework | blocked |
| rail count | needed for the 2D layout | provisional |
| picket spacing | needed for repeat geometry | provisional |
| center latch shape | needed for fidelity | provisional |
| hinge position | needed for front elevation | provisional |
| ground clearance | needed for the bottom gap | provisional |
| decorative band mapping | needed for option rendering | blocked |

---

## 6. Build order

1. lock the measurement semantics
2. set the outer frame
3. place the two leaves
4. draw the four rails
5. place the vertical bars
6. draw the center meeting detail
7. add the latch and drop bolt
8. add brick pillars or posts
9. add the red dimension layer
10. compare against the reference image
11. freeze a regression test

Do not move to later gates until this one reads correctly.

---

## 7. What to treat as provisional

- exact decorative mapping for `bushes`
- exact decorative mapping for `spirals`
- exact decorative mapping for `dog_bar_railheads`
- exact railhead count formula until the client confirms the visual reference
- exact tube profile until measured or confirmed

---

## 8. Acceptance criteria

`double_swing` is good enough when:

- the preview looks like a technical drawing of the reference
- the center meeting point reads immediately
- the rail structure is visibly four-part, not generic
- the lower zone density is obvious
- the dimension callouts are legible and consistent
- the same geometry can be reused for pricing and validation

---

## 9. Next action

Close the `double_swing` source questions first, then move the same drawing grammar into `single_swing`.

