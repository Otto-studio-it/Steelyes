---
title: Configurator Master Roadmap
description: End-to-end execution roadmap for the Steelyes configurator, from current baseline to final release
owner: Ruben
status: ACTIVE
last_updated: 2026-05-20
depends_on:
  - docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
  - docs/frontend/CONFIGURATOR_PHASES_1_3_EXECUTION_PLAN_2026-05-19.md
  - docs/frontend/CONFIGURATOR_FINISH_ORIENTATION_EXECUTION_PLAN_2026-05-20.md
  - docs/frontend/CONFIGURATOR_EXECUTION_PROMPTS_2026-05-19.md
  - docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md
  - docs/adr/002-configurator-2d-first-on-demand-3d-ar.md
---

# Steelyes - Configurator Master Roadmap

Purpose:

- define the single execution sequence from the current partial configurator to the final release
- specify what each phase must do
- specify which files each phase touches
- specify how to work, not just what to build
- keep the 2D-first product decision intact while reserving 3D / AR for later
- make the release path explicit enough that the file can be executed phase by phase without guesswork

This document is intended to be the authoritative working roadmap for the configurator.
If a smaller phase document conflicts with this file, this file wins for execution order.

---

## 1. Product Goal

The final configurator must let a user:

1. choose a gate type and style
2. choose a finish
3. choose motorised or manual
4. set dimensions
5. choose supported decorative options
6. optionally specify fence panels
7. see a live 2D preview that updates with the config
8. see an indicative price that is clearly not final
9. save, share, and request a quote
10. open 3D / AR later without changing the core config model

The product should feel like a real configuration tool, not a marketing toy.

---

## 2. Current Baseline

What already exists:

- shared gate types, styles, options, finish codes, and fence panel types in `packages/gate-engine`
- validation and normalization in `packages/gate-engine/src/validation.ts`
- indicative pricing in `packages/gate-engine/src/pricing.ts`
- 2D render plan generation in `packages/gate-engine/src/rendering.ts`
- serialization / deserialization in `packages/gate-engine/src/serialization.ts`
- mobile-first configurator shell in `apps/web`
- live preview and live indicative pricing in the configurator UI
- local persistence of configurator state

What is still incomplete:

- finish values are duplicated between engine and web
- finish colors are not yet defined through a canonical finish catalog
- the preview does not yet read finish tokens from a single engine source
- the UI still uses a select for finishes
- landscape-phone layout logic is not yet explicit
- orientation hinting is not yet implemented
- fence panels exist in the domain model but do not have a dedicated UI step
- compatibility and geometry rules are not split into their own engine layer
- save/share/quote handoff is not yet a complete final flow
- 3D / AR is not yet formalized as a post-release phase
- variant catalog work remains blocked on client data

---

## 3. Execution Rules

- keep all business rules in `packages/gate-engine`
- keep React as a consumer of engine outputs, not a source of business logic
- do not duplicate finish labels, finish colors, or pricing rules in React
- do not add speculative pricing formulas for missing client data
- do not introduce Three.js into the main configurator bundle
- keep the default experience 2D-first
- keep every phase shippable on its own if possible
- if a phase depends on client data, use a visible provisional state instead of inventing values
- separate phases into `HARDEN`, `BUILD`, and `RELEASE` work so existing implementation is not mistaken for a greenfield rewrite

---

## 4. Canonical File Ownership

### Engine

- `packages/gate-engine/src/types.ts`
- `packages/gate-engine/src/validation.ts`
- `packages/gate-engine/src/rules/compatibility.ts` new
- `packages/gate-engine/src/rules/geometry.ts` new
- `packages/gate-engine/src/pricing.ts`
- `packages/gate-engine/src/rendering.ts`
- `packages/gate-engine/src/serialization.ts`
- `packages/gate-engine/src/finishes.ts` new
- `packages/gate-engine/src/index.ts`
- `packages/gate-engine/tests/*`

### Web

- `apps/web/src/store/configuratorStore.ts`
- `apps/web/src/lib/configurator/navigation.ts`
- `apps/web/src/lib/configurator/options.ts`
- `apps/web/src/lib/configurator/presentation.ts`
- `apps/web/src/lib/configurator/labels.ts`
- `apps/web/src/components/configurator/*`
- `apps/web/src/app/(marketing)/configurator/page.tsx`
- `apps/web/src/app/(marketing)/configurator/ConfiguratorClient.tsx`

### Docs

- `docs/frontend/CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md`
- `docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md`
- `docs/frontend/CONFIGURATOR_PHASES_1_3_EXECUTION_PLAN_2026-05-19.md`
- `docs/frontend/CONFIGURATOR_FINISH_ORIENTATION_EXECUTION_PLAN_2026-05-20.md`
- `docs/PROJECT_STATUS.md`
- `docs/NEXT_ACTION_PLAN.md`

---

## 5. Final Release Definition

The configurator is final when:

- the same `GateConfig` powers preview, pricing, save, and quote handoff
- the finish catalog is canonical in the engine
- the 2D preview changes with finish, dimensions, options, and gate type
- the mobile experience works in portrait and landscape
- the price is clearly indicative everywhere
- fence panels are supported in the UI or explicitly hidden with a documented reason
- validation rejects invalid configs before they reach preview or pricing
- save / share / quote flows are complete enough for release
- the code has regression tests for domain, pricing, rendering, serialization, and finish catalog integrity

---

## 6. Phase Sequence

### Phase 0 - Scope Freeze and Release Contract

Goal:

- lock the product contract before more UI work
- stop drift between docs, engine, and UI

What to do:

1. confirm that `/configurator` remains the public entry
2. confirm that `GateConfig` is the only persisted config shape
3. confirm that finish multipliers stay blocked until client confirmation
4. confirm that the final release remains 2D-first with 3D / AR on demand
5. confirm whether fence panels must be a visible step in release 1 or can remain hidden behind a later release gate

Files to touch:

- `docs/PROJECT_STATUS.md`
- `docs/NEXT_ACTION_PLAN.md`
- `docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md`
- `docs/frontend/CONFIGURATOR_FINISH_ORIENTATION_EXECUTION_PLAN_2026-05-20.md`

How to do it:

- do not code new features here
- rewrite stale claims so they match the current baseline
- resolve route and release assumptions in writing before implementation continues

Done when:

- every later phase can reference one agreed scope without re-litigating route or view decisions

---

### Phase 1 - Engine Contract Hardening

Goal:

- make the shared config model boring, stable, and safe

What to do:

1. keep the gate type enum complete and stable
2. keep the style enum limited to the confirmed styles
3. keep the option keys stable
4. keep serialization versioned
5. validate width, height, options, and fence panels
6. normalize partial drafts to safe presets
7. keep invalid configs out of rendering and pricing

Files to touch:

- `packages/gate-engine/src/types.ts`
- `packages/gate-engine/src/validation.ts`
- `packages/gate-engine/src/serialization.ts`
- `packages/gate-engine/src/index.ts`
- `packages/gate-engine/tests/index.test.ts`
- `packages/gate-engine/tests/validation.test.ts`
- `packages/gate-engine/tests/serialization.test.ts`
- `packages/gate-engine/tests/domain-regression.test.ts`

How to do it:

- keep the config shape explicit
- if a field is optional in UI input, normalize it before it reaches the engine
- reject duplicated option keys and invalid fence panel counts
- keep the tests focused on contract stability, not UI behavior

Done when:

- any valid config can be created, normalized, serialized, deserialized, and validated deterministically

---

### Phase 1.5 - Compatibility and Geometry

Goal:

- make invalid option combinations impossible and move geometry-derived rules out of the UI

What to do:

1. add explicit compatibility rules for gate type, style, and option combinations
2. add geometry rules for options and quantities that should be derived from width or mechanism
3. block invalid combinations before rendering and pricing
4. keep railheads provisional where the real catalog is missing
5. make fence panel consistency explicit if fence panels remain in scope

Files to touch:

- `packages/gate-engine/src/rules/compatibility.ts` new
- `packages/gate-engine/src/rules/geometry.ts` new
- `packages/gate-engine/src/validation.ts`
- `packages/gate-engine/tests/validation.test.ts`
- `packages/gate-engine/tests/domain-regression.test.ts`

How to do it:

- encode the rules once in the engine
- do not let the UI decide whether a combination is valid
- derive counts and constraints from the selected gate type and dimensions where the business rules require it
- keep each rejected case covered by a readable test

Done when:

- impossible states are rejected before the user can save or price them

---

### Phase 2 - Indicative Pricing Lockdown

Goal:

- make pricing explainable, deterministic, and visibly provisional where needed

What to do:

1. keep manual and auto base prices explicit per gate type
2. keep width and height uplifts banded and predictable
3. keep option pricing visible and traceable
4. keep railheads provisional until the real catalog is confirmed
5. keep all totals clearly marked as indicative unless data is complete
6. keep survey-required fallback behavior for missing business data

Files to touch:

- `packages/gate-engine/src/pricing.ts`
- `packages/gate-engine/tests/pricing.test.ts`
- `apps/web/src/lib/configurator/labels.ts`
- `apps/web/src/components/configurator/ConfiguratorPriceSummary.tsx`
- `apps/web/src/components/configurator/ConfiguratorActionBar.tsx`

How to do it:

- source all pricing outputs from the engine
- do not compute totals in React
- if a pricing input is unknown, return `survey_required` instead of guessing
- keep the UI copy aligned with the pricing status

Done when:

- the same config always produces the same price explanation and the same fallback behavior

---

### Phase 2.5 - Style-Aware Pricing

Goal:

- make the pricing layer acknowledge the confirmed style split without inventing unsupported business rules

What to do:

1. reflect price differences between `traditional_victorian` and `composite_boards` where the client data confirms them
2. keep the price model explicit when the style changes the base or option cost
3. keep unresolved style pricing in a visible provisional state
4. keep tests for style-sensitive cases separate from generic gate-type pricing

Files to touch:

- `packages/gate-engine/src/pricing.ts`
- `packages/gate-engine/tests/pricing.test.ts`
- `apps/web/src/lib/configurator/labels.ts`
- `apps/web/src/components/configurator/ConfiguratorPriceSummary.tsx`

How to do it:

- do not guess style multipliers
- if the style split is not confirmed for a particular gate type, keep the data provisional and documented
- cover the confirmed differences with pricing tests

Done when:

- style changes are either priced correctly or explicitly marked as blocked by missing client data

---

### Phase 3 - 2D Renderer Stabilization

Goal:

- make the preview feel like an actual technical drawing of the selected gate

What to do:

1. keep the render plan deterministic
2. keep swing and sliding gates visually distinct
3. keep options visible in a schematic way
4. keep the render output stable enough for tests
5. keep the preview independent from pricing and persistence

Files to touch:

- `packages/gate-engine/src/rendering.ts`
- `packages/gate-engine/tests/rendering.test.ts`
- `apps/web/src/components/configurator/ConfiguratorPreview.tsx`

How to do it:

- keep geometry in the engine
- keep the preview component as a thin renderer of the plan
- keep labels and notes truthful
- do not make the preview pseudo-3D

Done when:

- the preview updates correctly with type, dimensions, style, and options

---

### Phase 4 - Finish System Canonicalization

Goal:

- make finish a first-class shared concept instead of a duplicated UI list

What to do:

1. create the canonical finish catalog in the engine
2. move finish labels and visual tokens into the engine
3. make the preview use finish-aware schematic colors
4. replace the finish select with a swatch picker in the UI
5. keep finish pricing multipliers out until client data is confirmed

Files to touch:

- `packages/gate-engine/src/finishes.ts` new
- `packages/gate-engine/src/types.ts`
- `packages/gate-engine/src/rendering.ts`
- `packages/gate-engine/src/index.ts`
- `packages/gate-engine/tests/finishes.test.ts` new
- `packages/gate-engine/tests/rendering.test.ts`
- `apps/web/src/lib/configurator/presentation.ts`
- `apps/web/src/lib/configurator/labels.ts`
- `apps/web/src/components/configurator/acts/ChooseActPanel.tsx`
- `apps/web/src/components/configurator/FinishPicker.tsx` new

How to do it:

- define one catalog entry per finish code
- keep the catalog small and provisional
- let the UI read labels and swatches from the catalog
- keep the renderer consuming the same catalog for frame/infill/stroke tokens

Suggested finish codes:

- `matte_black`
- `zinc_grey`
- `bronze`
- `pearl_white`

Done when:

- a finish change updates both the preview and the picker without duplicated definitions

---

### Phase 5 - Mobile Layout and Orientation

Goal:

- make the configurator work better on phones without blocking portrait users

What to do:

1. detect viewport mode explicitly
2. show a soft portrait hint only when landscape would clearly help
3. improve landscape-phone layout by placing preview and controls side by side where space allows
4. keep the hint dismissible and non-blocking
5. keep the preview wrapper ready for future 3D insertion without mounting 3D now

Files to touch:

- `apps/web/src/hooks/useConfiguratorViewport.ts` new
- `apps/web/src/components/configurator/ConfiguratorOrientationHint.tsx` new
- `apps/web/src/components/configurator/ConfiguratorPreview.tsx`
- `apps/web/src/components/configurator/ConfiguratorShell.tsx`
- `apps/web/src/store/configuratorStore.ts`

How to do it:

- use `matchMedia` and resize or orientation listeners with cleanup
- store only the hint dismissal state if needed
- do not show the hint unless the landscape layout exists
- do not block portrait interaction

Done when:

- mobile portrait remains usable and mobile landscape gains a better density of information

---

### Phase 6 - Release Flow and Persistence

Goal:

- make the configurator usable as a real product flow, not just a local wizard

What to do:

1. persist configs to the database or the agreed storage layer
2. create a read-only share route at `/quote/[shareToken]`
3. pass a configuration reference into the quote handoff flow
4. make the quote CTA carry the saved configuration reference, not a blind link to `/contact`
5. decide fence panels explicitly: either in release 1 or documented as out of scope for release 1

Files to touch:

- `apps/web/src/app/(marketing)/configurator/ConfiguratorClient.tsx`
- `apps/web/src/components/configurator/steps/SummaryStep.tsx`
- `apps/web/src/components/configurator/ConfiguratorPriceSummary.tsx`
- `apps/web/src/store/configuratorStore.ts`
- `apps/web/src/app/(marketing)/configurator/page.tsx`
- future share / quote route files
- `packages/gate-engine/src/serialization.ts`

How to do it:

- make save/share an explicit product requirement, not an optional enhancement
- keep share payloads based on the canonical serialized config
- do not close the release until a shareable config can be reopened in a read-only state
- if fence panels are not in v1, say so in the doc and hide the UI cleanly

Done when:

- the user can save, reopen, share, and continue to quote from the same configuration reference

---

### Phase 6A - Save Configuration

Goal:

- persist the current config reliably

What to do:

1. save the canonical config to the chosen storage layer
2. load it back on refresh
3. keep local draft fallback if network persistence fails

Files to touch:

- `apps/web/src/store/configuratorStore.ts`
- `packages/gate-engine/src/serialization.ts`
- database or API route files if persistence is implemented there

Done when:

- a configuration survives refresh and can be restored deterministically

---

### Phase 6B - Share Route

Goal:

- expose a stable read-only share URL

What to do:

1. implement `/quote/[shareToken]`
2. make the route read-only
3. load and render the saved config reference
4. keep the route baseline aligned with the ADR and project status

Files to touch:

- `apps/web/src/app/(marketing)/configurator/page.tsx`
- future `apps/web/src/app/quote/[shareToken]/page.tsx` or the agreed route location
- share loader utilities

Done when:

- a user can reopen a shared configuration without mutating it

---

### Phase 6C - Quote Handoff

Goal:

- make the quote CTA submit the actual configuration reference

What to do:

1. replace blind navigation to `/contact` with a handoff that includes the saved reference
2. preserve the config state in the handoff payload
3. ensure the quote request has enough context for sales or operations

Files to touch:

- `apps/web/src/components/configurator/ConfiguratorPriceSummary.tsx`
- `apps/web/src/components/configurator/ConfiguratorActionBar.tsx`
- `apps/web/src/components/configurator/steps/SummaryStep.tsx`

Done when:

- the CTA carries the configuration reference and does not discard the user state

---

### Phase 6D - Fence Panels Decision

Goal:

- remove ambiguity about fence panels

What to do:

1. decide whether fence panels are part of release 1
2. if yes, create the UI step and validation wiring
3. if no, document them as out of scope and hide the controls cleanly

Files to touch:

- `apps/web/src/components/configurator/ConfiguratorShell.tsx`
- `apps/web/src/components/configurator/steps/*`
- `apps/web/src/lib/configurator/navigation.ts`
- `apps/web/src/lib/configurator/presentation.ts`
- `packages/gate-engine/src/types.ts`
- `packages/gate-engine/src/validation.ts`

Done when:

- the roadmap and the UI agree on whether fence panels are visible in v1

---

### Phase 7 - QA and E2E Coverage

Goal:

- finish the part of the domain that already exists in the model but is not yet surfaced cleanly in the UI

What to do:

1. decide whether fence panels are release-1 visible or gated behind a later step
2. if visible, create the dedicated step and controls
3. if not visible, keep the data hidden and document the reason
4. complete the quote handoff path
5. complete save/share behavior if it is part of the release scope

Files to touch if fence panels become visible:

- `apps/web/src/components/configurator/steps/FencePanelsStep.tsx` new
- `apps/web/src/components/configurator/ConfiguratorShell.tsx`
- `apps/web/src/lib/configurator/navigation.ts`
- `apps/web/src/lib/configurator/presentation.ts`
- `apps/web/src/store/configuratorStore.ts`
- `packages/gate-engine/src/validation.ts`
- `packages/gate-engine/src/pricing.ts`

Files to touch for release flow:

- `apps/web/src/components/configurator/steps/SummaryStep.tsx`
- `apps/web/src/components/configurator/ConfiguratorPriceSummary.tsx`
- `apps/web/src/app/(marketing)/configurator/ConfiguratorClient.tsx`
- `apps/web/src/app/(marketing)/configurator/page.tsx`
- future share / quote routes if and when added

How to do it:

- do not add a UI step unless the behavior is clear
- keep fence panel validation strict
- if pricing is still missing, show a visible survey-required state

Done when:

- the user can complete the intended MVP flow without dead ends

---

### Phase 7 - QA, Regression, and Release Gate

Goal:

- prove the configurator is safe to ship

What to do:

1. run engine unit tests
2. run web lint and typecheck
3. verify the configurator visually on mobile and desktop
4. verify that finish changes affect preview
5. verify that indicative pricing and survey-required states render correctly
6. verify that serialization round-trips still work
7. verify the configurator flow with Playwright E2E
8. verify that the final release copy is honest

Files to touch:

- tests only, unless a bug is found
- `docs/PROJECT_STATUS.md` if release status changes
- `docs/NEXT_ACTION_PLAN.md` if next focus changes

How to do it:

- treat QA as a release gate, not a formality
- if a bug is found in an earlier phase, fix the earlier phase first
- do not ship a hidden regression because the UI “looks fine”
- add regression coverage for the configurator path itself, not just isolated engine units

Done when:

- the configurator is stable enough to be considered the final version for the current scope

---

### Phase 8 - On-Demand 3D and AR

Goal:

- add 3D and AR without changing the default 2D release architecture

What to do:

1. introduce lazy-loaded 3D preview mounting
2. reuse the same `GateConfig` contract
3. generate 3D artifacts on demand
4. keep the main bundle free of Three.js
5. keep 3D behind the final 2D release gate

Files to touch:

- future preview wrapper files
- future 3D / AR components
- `apps/web/src/components/configurator/ConfiguratorPreview.tsx`
- `apps/web/src/components/configurator/ConfiguratorShell.tsx`
- `packages/gate-engine` future mesh/export modules

How to do it:

- make 3D additive, not structural
- do not move the source of truth away from `GateConfig`
- keep 3D / AR out of the baseline release bundle

Done when:

- 3D / AR exists as an on-demand extension of the same configurator state

---

### Phase 9 - Variant Catalog and Railheads

Goal:

- finish the variant-heavy catalogue work once the client has confirmed the data

What to do:

1. add the real railhead catalog
2. add unit prices for railhead variants
3. add compatibility rules per gate style and mechanism
4. add the higher-volume variant set such as the 150-point catalog if and when it is confirmed
5. keep the work blocked until Marius confirms the missing inputs

Files to touch:

- `packages/gate-engine/src/pricing.ts`
- `packages/gate-engine/src/rules/compatibility.ts`
- `packages/gate-engine/src/validation.ts`
- `packages/gate-engine/tests/pricing.test.ts`
- `packages/gate-engine/tests/validation.test.ts`
- future catalog files

How to do it:

- do not create placeholder variants that will later be mistaken for final data
- keep the catalog release separate from the core configurator release
- annotate the blocked state in docs until the client data arrives

Done when:

- the variant catalog is real, priced, and compatible with the supported gate styles

---

## 7. Recommended Execution Order

1. Phase 0 - Scope Freeze and Release Contract
2. Phase 1 - Engine Contract Hardening
3. Phase 1.5 - Compatibility and Geometry
4. Phase 2 - Indicative Pricing Lockdown
5. Phase 2.5 - Style-Aware Pricing
6. Phase 3 - 2D Renderer Stabilization
7. Phase 4 - Finish System Canonicalization
8. Phase 5 - Mobile Layout and Orientation
9. Phase 6 - Release Flow and Persistence
10. Phase 7 - QA and E2E Coverage
11. Phase 8 - On-Demand 3D and AR
12. Phase 9 - Variant Catalog and Railheads

This order keeps the most fragile work first:

- domain contract
- pricing contract
- preview contract
- finish contract
- compatibility and geometry contract
- layout refinement
- release flow
- QA

---

## 8. What I Would Do Before Starting Code

Before implementing the next wave, I would do these checks:

1. confirm the finish catalog values with the client if there is any doubt about the accepted surface set
2. decide whether fence panels are in the first release or deliberately hidden
3. confirm the exact final quote handoff route
4. confirm whether the finish swatch names should remain generic or become client-facing copy
5. confirm the release boundary between MVP and later enhancements

Reason:

- this avoids building UI around assumptions that will need rework
- it keeps the roadmap aligned with the actual business blockers

---

## 9. Acceptance Criteria For the Final Configurator

The configurator is done when:

- the user can complete a full gate configuration without seeing broken states
- the preview is coherent for all supported gate types
- finish selection is canonical and affects the preview
- pricing is consistent and clearly indicative
- the app is usable on mobile portrait and landscape
- invalid inputs cannot silently propagate
- serialization is stable
- the codebase has tests covering the contract
- save, reopen, share, and quote handoff all work from the same persisted config reference
- all supported gate types are production-capable even if the primary slice was built first
- 3D / AR exists as an on-demand extension rather than a rewrite
- variant catalog work is either complete or clearly blocked by client data
