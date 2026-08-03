# Configurator Improvement Plan

> **Status update (2026-06-12):** Sprint 6h completato — opzioni pricing da Supabase
> (`gate_options`), summary condiviso, PDF indicativo, email cliente, admin quote pipeline
> con update stato. Vedi `docs/PLATFORM_ROADMAP.md` per la roadmap piattaforma.

This document lists the next technical improvements for the configurator, in the exact order I would apply them.

Goal:
- keep the 2D preview, 3D preview, mesh plan, validation, sharing, and UI copy aligned
- reduce the chance of future regressions
- make the cantilever and site-survey flow read as one coherent product

## 1. Centralize the visual thickness scale

What to change:
- move the `1.25` visual scale into a shared constant or helper
- reuse the same scale in both 2D and 3D rendering code

Files to touch:
- `packages/gate-engine/src/rendering.ts`
- `packages/gate-engine/src/mesh/index.ts`
- optionally `packages/gate-engine/src/index.ts` if the helper should be exported

Why this comes first:
- the same visual rule is currently duplicated
- if it changes in one place but not the others, the preview and mesh will drift apart
- this is the lowest-risk cleanup and it makes the rest of the work safer

Suggested implementation order:
1. Add a shared constant/helper in `packages/gate-engine/src/rendering.ts` or a small shared utility file.
2. Replace the hardcoded `1.25` values in `rendering.ts` and `mesh/index.ts`.
3. Update tests only if the new helper changes exact numeric expectations.

## 2. Make the cantilever mesh more explicit

What to change:
- keep the counterbalance tail visible in the 2D render
- improve the 3D mesh so the cantilever reads as a real sliding system, not just a rectangular block
- keep the special `4 m => 1/3 tail` rule intact

Files to touch:
- `packages/gate-engine/src/rendering.ts`
- `packages/gate-engine/src/mesh/index.ts`
- `packages/gate-engine/src/mesh/types.ts` only if a new role is needed
- `packages/gate-engine/tests/rendering.test.ts`
- `packages/gate-engine/tests/mesh.test.ts`

Why this comes second:
- it is the most visible product change for the client
- the rule already exists, so this is refinement rather than a structural change
- the rendering and mesh should be updated together to avoid mismatch

Suggested implementation order:
1. Refine the 2D cantilever tail geometry if needed.
2. Improve the 3D mesh boxes and labels for the counterbalance.
3. Extend tests to lock in the expected `4 m` behavior.

## 3. Propagate `siteSurveyRequested` through the full quote flow

What to change:
- ensure the checkbox value is included everywhere the configuration is displayed or consumed
- pass it through any quote handoff, admin summary, stored payload, and contact flow fields
- make the wording consistent across UI and backend-facing views

Files to touch:
- `apps/web/src/components/configurator/OptionsAccordion.tsx`
- `apps/web/src/components/configurator/ConfiguratorPriceSummary.tsx`
- `apps/web/src/components/configurator/ConfigurationReferenceBanner.tsx`
- `apps/web/src/components/configurator/QuoteShareView.tsx`
- `apps/web/src/store/configuratorStore.ts` only if persistence logic needs to change
- `apps/web/src/app/(marketing)/configurator/actions.ts` if the saved payload needs to carry the new field explicitly
- `apps/web/src/app/actions.ts` or the destination contact/quote handler if the field is used there
- `apps/web/tests/e2e/helpers/configurator.ts`

Why this comes third:
- the data already exists in the model, but it still needs end-to-end propagation
- this is the key business flag for the sales workflow
- once it is wired through the full chain, the rest of the UI can stay simple

Suggested implementation order:
1. Confirm the field is serialized and deserialized correctly.
2. Confirm it is shown in all relevant summary views.
3. Confirm it reaches the handoff path / contact flow if needed.
4. Add an e2e check that toggles the checkbox, saves, and reloads.

## 4. Decide whether the 900-1000 mm fence-panel rule should be global or scoped

What to change:
- verify if the rule applies to all fence panels or only to the specific panel type used in this configurator slice
- if it is global, keep the validation as-is
- if it is scoped, move the rule into a more specific validator

Files to touch:
- `packages/gate-engine/src/validation.ts`
- `packages/gate-engine/tests/validation.test.ts`
- possibly `packages/gate-engine/src/types.ts` if a fence-panel subtype or discriminator is needed

Why this comes fourth:
- this is a domain rule, not just a UI detail
- if the rule is too broad, it will cause unnecessary future constraints
- if the rule is correct globally, no further change is needed

Suggested implementation order:
1. Confirm the business rule with the client.
2. Keep the current validation if it is truly universal.
3. Otherwise, scope it to the right panel family.

## 5. Add a real user-flow e2e test for the checkbox and persistence

What to change:
- test the new checkbox in the browser flow
- verify the state persists after reload
- verify the saved / shared summary shows the expected label

Files to touch:
- `apps/web/tests/e2e/configurator.spec.ts`
- `apps/web/tests/e2e/helpers/configurator.ts`
- optionally `apps/web/tests/e2e/helpers/configurator.ts` if a helper for the site-survey state is useful

Why this comes fifth:
- unit tests already cover the model and render plan
- the e2e layer is where browser persistence and UX regressions show up
- this protects the most user-visible part of the new brief

Suggested implementation order:
1. Toggle the checkbox in the configurator.
2. Reload and confirm it stays checked.
3. Open the summary / share view and confirm the label is present.

## 6. Normalize the wording

What to change:
- choose one canonical term for the feature, for example `site survey requested`
- replace mixed wording like `site check`, `physical site check`, and `survey-led` where appropriate
- keep the same business meaning, but make the copy consistent

Files to touch:
- `apps/web/src/lib/configurator/labels.ts`
- `apps/web/src/components/configurator/OptionsAccordion.tsx`
- `apps/web/src/components/configurator/ConfiguratorPriceSummary.tsx`
- `apps/web/src/components/configurator/ConfigurationReferenceBanner.tsx`
- `apps/web/src/components/configurator/QuoteShareView.tsx`
- any contact or handoff copy that references the same feature

Why this comes last:
- copy cleanup is important, but it should happen after the data flow is stable
- if the wording changes too early, it can create confusion during implementation
- once the flow is stable, consistency is easy to enforce

## Recommended execution sequence

1. Centralize the visual scale.
2. Refine the cantilever mesh and render details.
3. Wire `siteSurveyRequested` through the full quote flow.
4. Confirm or scope the fence-panel length rule.
5. Add browser-level persistence coverage.
6. Normalize copy across the configurator.

## Notes

- The current code already compiles and passes the existing typecheck and gate-engine tests.
- The safest rule is to change the domain model first, then the renderers, then the UI copy, then the browser tests.
- If a future change touches the same files, keep the order above: model, rendering, sharing, then UX polish.
