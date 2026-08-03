---
title: Gate Creator Baseline
description: Short working baseline for what is already ready, what needs refinement, and what should be built later in the Steelyes gate configurator
owner: Ruben
status: ACTIVE
last_updated: 2026-06-24
---

# Steelyes - Gate Creator Baseline

Use this as the working map for the gate configurator.

The rule is simple:

- keep the current base lean;
- refine only what blocks the real product flow;
- defer anything that needs client confirmation or true 3D fidelity.

For the mobile-first field cut, use [`docs/CONFIGURATOR_FIELD_MAP_MOBILE_FIRST.md`](/Volumes/SSDRubb/Steelyes/docs/CONFIGURATOR_FIELD_MAP_MOBILE_FIRST.md).
For the execution order, use [`docs/CONFIGURATOR_EXECUTION_CHECKLIST.md`](/Volumes/SSDRubb/Steelyes/docs/CONFIGURATOR_EXECUTION_CHECKLIST.md).

---

## 1. Already Ready

These pieces already exist and are usable now.

### Domain and pricing

- Shared `GateConfig` model in `packages/gate-engine`.
- 8 gate types already defined.
- 2 styles already defined:
  - `traditional_victorian`
  - `composite_boards`
- Core options already defined:
  - `middle_bar`
  - `top_railheads`
  - `dog_bars`
  - `dog_bar_railheads`
  - `arched_top`
  - `bushes`
  - `spirals`
- Finish codes already defined.
- Validation and normalization already exist.
- Indicative pricing already exists with `FROM GBP` logic.
- Base pricing table already exists for all 8 gate types.
- Option pricing is already modeled.

### Rendering and export

- 2D render plan exists.
- 3D mesh plan exists.
- Share token generation exists.
- Save / load configuration path exists.
- Quote handoff path already exists.

### Configurator UI

- Main configurator shell exists.
- Gate type picker exists.
- Dimension inputs exist.
- Fence panel quantity + per-panel height/length exist.
- Options panel exists.
- Railhead variant picker exists, even if the catalog is still provisional.
- Price summary exists.
- Share panel exists.
- Mobile and desktop layouts already exist.
- The public entry route is `/configurator`.
- The public saved-view route baseline is `/quote/[shareToken]`.

### Current file anchors

- `packages/gate-engine/src/types.ts`
- `packages/gate-engine/src/validation.ts`
- `packages/gate-engine/src/pricing.ts`
- `packages/gate-engine/src/rendering.ts`
- `packages/gate-engine/src/mesh/index.ts`
- `apps/web/src/store/configuratorStore.ts`
- `apps/web/src/components/configurator/ConfiguratorShell.tsx`
- `apps/web/src/components/configurator/ConfiguratorPreview.tsx`
- `apps/web/src/components/configurator/ConfiguratorPreview3D.tsx`
- `apps/web/src/components/configurator/ConfiguratorPriceSummary.tsx`
- `apps/web/src/components/configurator/steps/FencePanelsStep.tsx`
- `apps/web/src/components/configurator/OptionsAccordion.tsx`

---

## 2. Refine Next

These parts already exist, but they still need sharpening before the configurator feels complete.

### Pricing and catalogue

- Railhead catalog is still provisional.
- Railhead prices are not final.
- Dog bar / circle / bushes / spirals count rules still need client sign-off.
- Radius sliding is still technically provisional.
- Composite Boards geometry still needs clearer product definition.
- Fence panel pricing is not yet a final business rule.

### Configurator behavior

- Gate type and style labels should stay aligned everywhere.
- Option compatibility still needs tighter per-gate rules.
- Some option states are still schematic rather than product-true.
- The summary copy still leans on survey-led language in places that will later need exact catalogue data.

### 2D / 3D fidelity

- 2D preview is usable, but it is still schematic.
- 3D preview exists, but it is not yet the final product mesh.
- Per-gate geometry detail is not yet complete for a production-grade visual model.
- Railheads need real variant shapes before they can look product-true.

### Operational refinement

- Save/share flow is present, but it should be stress-tested against the final content model.
- Mobile quick-path behavior is already there, but should be kept aligned with the authoritative gate model.
- Documentation drift should be kept down to a minimum while the model settles.

---

## 3. Build After

These are the next layers only after the current model is confirmed.

### Real 3D work

- Final mesh per gate type.
- Accurate motion per mechanism:
  - swing
  - tracked sliding
  - cantilever
  - bifolding
  - telescopic
  - radius
- Real decorative attachments on the mesh.
- True railhead variants as actual 3D details.

### Final catalogue work

- Final railhead variant list.
- Final railhead unit prices.
- Final option formulas.
- Final panel pricing rules.
- Final compatibility matrix from client-confirmed data.

### Product expansion

- Admin editing for real catalogue updates.
- Any alternate share route only if the MVP scope changes.
- AR export only after the 2D + config model is stable.
- Additional visualization polish only after the product rules are no longer moving.

---

## 4. Practical Working Order

If you want the shortest safe path, work in this order:

1. Keep the current shared model as the source of truth.
2. Refine pricing and option rules that are already partially modeled.
3. Tighten the 2D preview so it matches the confirmed catalogue.
4. Keep 3D schematic until the client-confirmed data is complete.
5. Only then move to final mesh fidelity and AR.

---

## 5. Decision Rule

If a feature:

- changes pricing truth,
- changes gate geometry truth,
- depends on unconfirmed client data,
- or exists only to make 3D prettier,

then it belongs in **Refine Next** or **Build After**, not in the immediate base.
