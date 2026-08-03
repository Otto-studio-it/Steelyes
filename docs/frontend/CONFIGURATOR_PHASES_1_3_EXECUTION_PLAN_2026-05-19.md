# Configurator Phases 1 to 3 Execution Plan

Date: 2026-05-19

Purpose: provide a concrete, agent-friendly execution plan for the first three configurator phases:

1. shared domain model and validation
2. indicative pricing
3. 2D renderer

This plan is written for a team working in parallel with Codex, Cursor, and Composer. It assumes the product direction is fixed:

- 2D is the default preview in the page
- 3D / AR is on demand later
- the same config object powers preview, price, save, and export
- pricing must remain indicative until final survey and quote confirmation

## Execution Rules

- Keep shared domain logic in `packages/gate-engine`.
- Keep React and route wiring in `apps/web`.
- Keep Zod, if used, at the app boundary only.
- Do not let UI invent business rules.
- Do not let the renderer receive invalid configs.
- Prefer small, reviewable waves over broad refactors.
- One agent owns one write set at a time.

## Ownership Matrix

| Area | Primary owner | Secondary support |
|---|---|---|
| Domain types, validation, serialization | Codex | Cursor for UI shape alignment |
| Pricing engine and pricing tests | Codex | Cursor for copy and summary text |
| 2D rendering contract and SVG output | Codex | Composer for visual reference feedback |
| Configurator page and component composition | Cursor | Composer for layout alternatives |
| Visual QA against the reference image | Composer | Codex for implementation adjustments |

## Phase 1 - Shared Domain Model

Goal: make the configurator speak one stable language across UI, pricing, rendering, and persistence.

Current status:

- core types already exist in `packages/gate-engine`
- validation already exists in `packages/gate-engine`
- serialization already exists in `packages/gate-engine`
- this phase is now about hardening the contract and keeping it stable as the product grows

### 1.1 - Lock the config shape

Purpose:

- keep the shared config object explicit and versioned
- ensure the gate type, style, option, finish, and fence panel fields are the only source of truth

Files:

- `packages/gate-engine/src/types.ts`
- `packages/gate-engine/src/index.ts`
- `packages/gate-engine/tests/index.test.ts`

Checklist:

- gate type enum is complete for the MVP catalogue
- style enum is complete for the MVP catalogue
- option keys are stable and documented
- default presets exist for every supported gate type
- fence panel input is part of the shared model
- the entrypoint re-exports the public contract cleanly

Done when:

- UI code can create a config without guessing field names
- tests prove the public exports are stable

### 1.2 - Harden validation and normalization

Purpose:

- reject invalid combinations before they reach the renderer or pricing engine
- normalize partial input into safe defaults

Files:

- `packages/gate-engine/src/validation.ts`
- `packages/gate-engine/tests/validation.test.ts`

Checklist:

- gate type, style, finish, dimensions, and options are validated
- duplicate options are rejected
- quantity rules are enforced
- fence panel consistency is checked
- missing optional fields are normalized safely
- invalid combinations produce readable issues

Done when:

- a bad config never reaches render or pricing in an unhandled state

### 1.3 - Stabilize serialization

Purpose:

- make save and share deterministic
- support future schema changes without breaking existing saved configs

Files:

- `packages/gate-engine/src/serialization.ts`
- `packages/gate-engine/tests/serialization.test.ts`

Checklist:

- serialized shape is versioned
- round trip preserves the meaningful config state
- partial drafts can be normalized before serialization
- no UI-only fields leak into the persisted shape

Done when:

- a config can be saved, reloaded, and compared without ambiguity

### 1.4 - Final domain regression pass

Purpose:

- prove the domain layer remains stable after the first UI integration work

Files:

- `packages/gate-engine/tests/*`
- `docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md`

Checklist:

- type coverage exists for the canonical gate types
- validation coverage exists for invalid and edge cases
- serialization coverage exists for round trips
- the public contract remains readable and boring

Done when:

- the shared domain layer is safe enough to be consumed by the page and by future API routes

## Phase 2 - Indicative Pricing

Goal: show a believable price without pretending it is final.

Current status:

- base pricing exists
- add-on pricing exists for the current supported options
- the engine distinguishes indicative and survey-required states
- this phase is now about keeping the pricing model explainable and expanding coverage safely

### 2.1 - Base price table discipline

Purpose:

- keep manual and auto base pricing explicit
- make the source of the estimate visible in the UI

Files:

- `packages/gate-engine/src/pricing.ts`
- `packages/gate-engine/tests/pricing.test.ts`

Checklist:

- manual base price is selected when motorisation is off
- auto base price is selected when motorisation is on
- fallback logic is explicit when auto pricing is missing
- totals remain indicative
- no fabricated final price is ever shown

Done when:

- the same config always produces the same explanatory price result

### 2.2 - Option pricing and provisional states

Purpose:

- add or preserve pricing for visible options without inventing missing business data

Files:

- `packages/gate-engine/src/pricing.ts`
- `packages/gate-engine/tests/pricing.test.ts`

Checklist:

- middle bar is priced
- dog bars are priced
- arched top is priced
- bushes are priced
- spirals are priced
- railheads remain clearly provisional if pricing is not confirmed

Done when:

- every visible option has a clear price state: priced, provisional, or survey-required

### 2.3 - Price breakdown and messaging

Purpose:

- make the estimate easy to explain in the UI
- ensure copy matches the actual pricing state

Files:

- `apps/web/src/app/(marketing)/configurator/ConfiguratorClient.tsx`
- `docs/frontend/CONTENT_FALLBACKS.md`

Checklist:

- summary labels match the engine output
- provisional labels are visible
- survey-required labels are visible
- disclaimer text is consistent everywhere

Done when:

- the user understands that the price is indicative and why

### 2.4 - Pricing regression grid

Purpose:

- lock the engine against accidental changes

Files:

- `packages/gate-engine/tests/pricing.test.ts`

Checklist:

- one representative config per major gate type is covered
- manual and auto paths are covered
- missing data fallback is covered
- option combinations are covered

Done when:

- pricing can be changed intentionally, not accidentally

## Phase 3 - 2D Renderer

Goal: render a believable technical drawing that feels close to a real gate, not an icon.

Current status:

- the preview already exists in the page
- the current visual direction is a technical drawing with heavier line weight
- this phase is about pushing fidelity, proportion, and clarity closer to the reference image

### 3.1 - Lock the render contract

Purpose:

- define the exact input and output shape for the 2D preview

Files:

- `packages/gate-engine/src/rendering.ts`
- `packages/gate-engine/src/index.ts`
- `packages/gate-engine/tests/rendering.test.ts`

Checklist:

- render output is deterministic
- the UI passes only the data the renderer needs
- the renderer contract is small and stable

Done when:

- the preview can be drawn without UI-specific branching logic

### 3.2 - Double swing fidelity pass

Purpose:

- make the primary slice look like a real technical drawing of a gate

Files:

- `packages/gate-engine/src/rendering.ts`
- `packages/gate-engine/tests/rendering.test.ts`
- `apps/web/src/app/(marketing)/configurator/ConfiguratorClient.tsx`

Checklist:

- posts are visually weighty
- central latch area reads like real hardware
- lower infill is denser and more industrial
- dimension lines are readable
- line weight feels closer to the reference
- the drawing still stays clean enough for mobile

Done when:

- the `double_swing` preview feels like a drawing of a real gate and not a schematic icon

### 3.3 - First sliding gate pass

Purpose:

- apply the same visual language to the first sliding type

Files:

- `packages/gate-engine/src/rendering.ts`
- `packages/gate-engine/tests/rendering.test.ts`

Checklist:

- track/rail reads clearly
- the panel shape is believable
- option overlays remain readable
- the renderer distinguishes swing and sliding at a glance

Done when:

- one sliding type has parity in visual quality with the swing slice

### 3.4 - Option overlay realism pass

Purpose:

- refine the visible option layer so bars and decoration feel physically attached to the gate

Files:

- `packages/gate-engine/src/rendering.ts`
- `packages/gate-engine/tests/rendering.test.ts`

Checklist:

- railheads do not feel like generic dots
- bushes and spirals sit in plausible positions
- arched top remains visibly distinct
- overlays do not overwhelm the base structure

Done when:

- the preview can communicate options without looking noisy

### 3.5 - Visual QA loop

Purpose:

- compare the rendered output against the source reference and tune line weight, spacing, and composition

Files:

- `packages/gate-engine/src/rendering.ts`
- `apps/web/src/app/(marketing)/configurator/ConfiguratorClient.tsx`

Checklist:

- the gate proportions match the reference direction
- the preview stays legible at desktop and mobile widths
- the drawing still feels like a technical illustration

Done when:

- the preview is visually close enough to be used as the product default

## Suggested Execution Order

Use this sequence if the team wants the lowest-risk path:

1. Phase 1.1
2. Phase 1.2
3. Phase 1.3
4. Phase 2.1
5. Phase 2.2
6. Phase 2.3
7. Phase 3.1
8. Phase 3.2
9. Phase 3.5
10. Phase 3.3
11. Phase 3.4

If the team wants faster product learning, use a vertical slice after Phase 2.1 and before broadening the catalogue:

- single gate type
- one pricing path
- one 2D renderer pass
- one quote CTA

## Agent Prompt Split

### Codex

Own:

- `packages/gate-engine`
- shared tests
- render contract
- pricing engine

Best fit:

- phases 1.1, 1.2, 1.3, 2.1, 2.2, 2.4, 3.1, 3.2, 3.3, 3.4

### Cursor

Own:

- `apps/web/src/app/(marketing)/configurator/*`
- state wiring
- shell composition
- route and interaction polish

Best fit:

- phases 2.3, 3.2, 3.5, and UI follow-on work

### Composer

Own:

- visual references
- layout variations
- composition ideas

Best fit:

- phase 3.2 and 3.5 feedback loops

## Delivery Rule

After each wave, report:

- files modified
- behavior changed
- tests run
- what remains open

Do not merge unrelated cleanup into the same wave.
Do not expand scope before the current wave is verifiably done.
