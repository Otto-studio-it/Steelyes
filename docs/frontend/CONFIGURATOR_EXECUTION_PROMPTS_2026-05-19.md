---
title: Configurator Execution Prompts
description: Phase-by-phase prompts for implementing the Steelyes configurator, split into small agent-sized tasks
owner: Ruben
status: ACTIVE
last_updated: 2026-05-19
---

# Steelyes - Configurator Execution Prompts

Use this file as the operational handoff for Composer, Cursor, and Codex.

For the concrete execution order of Phases 1, 2, and 3, use:

- `docs/frontend/CONFIGURATOR_PHASES_1_3_EXECUTION_PLAN_2026-05-19.md`

Base assumptions:

- 2D preview is the default configurator experience.
- 3D/AR is generated only when the user requests it.
- One shared config model powers preview, pricing, save/share, and export.
- No speculative pricing or schema work beyond the current confirmed business constraints.

When a phase is too large, split it into the listed subphases and run them in order.

---

## How To Use This File

1. Pick the next incomplete phase.
2. Run the smallest subphase that removes the current blocker.
3. Do not let multiple agents touch the same file set at once.
4. Keep `Codex` on engine and verification work.
5. Keep `Cursor` on React page and component work.
6. Use `Composer` for layout exploration and visual variants only.

Each prompt below is designed to be copied directly into an agent.

---

## Phase 0 - Scope Freeze And Route Decision

Purpose: lock the product shape before any implementation starts.

### 0.1 - Confirm route structure

**Prompt**

```text
You are working on the Steelyes configurator scope freeze.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/PROJECT_STATUS.md
- docs/NEXT_ACTION_PLAN.md
- docs/PROJECT_BRIEF.md
- docs/ARCHITECTURE_RULES.md

Task:
- confirm the route shape for the configurator MVP
- decide whether `/configurator` remains the main entry or becomes a redirect into `/(configurator)`
- identify every route file that must exist for the MVP
- keep the decision aligned with the accepted ADR: 2D-first, 3D/AR on demand

Do not write code. Return:
- decision summary
- affected routes
- risks
- any documentation updates needed
```

Done when:

- route ownership is final for the MVP
- no ambiguity remains about the public entry point

Working baseline for this project:

- keep `/configurator` as the public MVP entry
- use `/configurator/[type]` for the gate-type flow
- use `/quote/[shareToken]` as the default public share route
- treat `/configurator/[id]` as non-baseline unless a later ADR changes the share model

### 0.2 - Confirm visual direction

**Prompt**

```text
You are working on the Steelyes configurator visual scope.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md
- docs/frontend/CONTENT_FALLBACKS.md

Task:
- define the 2D preview style for the first release
- choose the minimum viable visual language for frame, infill, dimensions, railheads, dog bars, arched top, and fence panels
- decide what must be drawn precisely and what may be approximated
- keep the result honest and schematic rather than pseudo-3D

Do not write code. Return:
- visual priorities
- approved approximations
- elements that must remain hidden until data is confirmed
```

Done when:

- the renderer direction is specific enough to implement without design guessing

Working baseline for this project:

- 2D preview is schematic and honest, not pseudo-3D
- frame, proportions, dimensions, and infill must be clear
- railheads, dog bars, bushes, and spirals may be symbol-level approximations
- panel preview should be minimal and secondary
- final prices, AR visuals, and hidden catalogue details should stay out of the first render

### 0.3 - Confirm file ownership

**Prompt**

```text
You are coordinating the configurator implementation split.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/frontend/CONFIGURATOR_EXECUTION_PROMPTS_2026-05-19.md
- docs/frontend/FRONTEND_PARALLEL_WORK_PLAN.md

Task:
- assign file ownership for the first implementation wave
- split work between Codex, Cursor, and Composer
- make sure no two agents own the same write set

Do not write code. Return:
- ownership matrix
- write set boundaries
- recommended execution order
```

Done when:

- the team can start implementation without merge conflict risk

Working baseline for this project:

| Agent | Primary write set |
|---|---|
| Codex | `packages/gate-engine/*`, configurator docs, validation/pricing/tests, route decision docs |
| Cursor | `apps/web/src/app/(configurator)/*`, `apps/web/src/components/configurator/*` |
| Composer | visual references, layout experiments, no shared engine files |

---

## Phase 1 - Shared Config Model

Purpose: create the domain language of the configurator.

### 1.1 - Define types and enums

**Prompt**

```text
You own the shared configurator domain model.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/frontend/CONFIGURATOR_EXECUTION_PROMPTS_2026-05-19.md
- docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md
- docs/PROJECT_BRIEF.md
- docs/ARCHITECTURE_RULES.md

Implement:
- packages/gate-engine/src/types.ts
- packages/gate-engine/src/index.ts

Requirements:
- define the full gate type set needed for the MVP
- define the style set and option keys
- define the config object shape used by preview, price, save, and export
- include fence panel input in the shared type system
- keep the package pure TypeScript

Do not touch the React app yet.
Return:
- files changed
- exported types
- any open questions or assumptions
```

Done when:

- the config model is stable enough to be consumed by UI and tests

### 1.2 - Add validation and normalization

**Prompt**

```text
You own validation for the configurator domain model.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md
- docs/db/PRICING_SEMANTICS.md

Implement:
- packages/gate-engine/src/validation.ts
- any supporting helpers needed in packages/gate-engine/src/

Requirements:
- validate gate type, style, dimensions, motorisation, and options
- reject invalid combinations early
- normalize safe defaults for missing optional values
- keep Zod at the app boundary if used, but keep domain rules in `gate-engine`
- do not invent business rules that are not supported by the docs

Return:
- validation rules added
- invalid cases blocked
- tests needed or added
```

Done when:

- invalid configs are rejected before they reach the renderer

### Phase 1S - Vertical Slice

Purpose: prove one gate type end to end before expanding the catalogue.

**Prompt**

```text
You are building the first vertical slice of the Steelyes configurator.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/frontend/CONFIGURATOR_EXECUTION_PROMPTS_2026-05-19.md
- docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md
- docs/PROJECT_BRIEF.md

Task:
- choose one gate type to implement end to end
- make that type work through config, validation, pricing, 2D preview, and quote CTA
- keep the slice intentionally small and production-shaped
- do not expand to all gate types yet

Return:
- selected gate type
- files changed
- what is now usable end to end
- what remains for later slices
```

Done when:

- one gate type can be configured, previewed, and quoted in a single flow

### 1.3 - Add presets and serialization

**Prompt**

```text
You own presets and serialization for the configurator.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md
- docs/PROJECT_BRIEF.md

Implement:
- packages/gate-engine/src/rules/geometry.ts if needed
- packages/gate-engine/src/rules/compatibility.ts if needed
- packages/gate-engine/src/serialization.ts or equivalent helper

Requirements:
- create a safe default preset for each supported gate type
- create a stable JSON shape for saving and sharing configurations
- keep the format versioned or clearly versionable
- preserve fallback-friendly fields for incomplete pricing

Return:
- preset list
- serialization format
- compatibility constraints
```

Done when:

- a config can be created, serialized, and restored without loss of meaning

---

## Phase 2 - Indicative Pricing

Purpose: make the price visible and explainable without pretending it is final.

### 2.1 - Base pricing engine

**Prompt**

```text
You own the indicative pricing engine.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md
- docs/db/PRICING_SEMANTICS.md
- docs/PROJECT_STATUS.md

Implement:
- packages/gate-engine/src/pricing.ts

Requirements:
- support manual vs automated base prices
- keep all totals explicitly indicative
- never invent values when a confirmed number is missing
- surface clear fallback states for missing auto pricing

Return:
- pricing rules
- fallback behavior
- any assumptions that still need client confirmation
```

Done when:

- a representative config returns a deterministic indicative price

### 2.2 - Add-on pricing

**Prompt**

```text
You own add-on pricing for the configurator.

Read:
- docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md
- docs/frontend/CONTENT_FALLBACKS.md
- docs/db/RAILHEADS_TBD.md

Implement:
- support for middle bar
- support for provisional railheads
- support for dog bars
- support for arched top
- support for bushes and spirals

Requirements:
- keep each option individually toggleable where appropriate
- preserve provisional wording when unit prices or rules are incomplete
- do not create a new schema for rails/heads unless the business data is confirmed

Return:
- option price handling
- provisional handling rules
- test cases added or required
```

Done when:

- the price summary can reflect the selected options without fake certainty

### 2.3 - Pricing tests

**Prompt**

```text
You own pricing verification.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/DEFINITION_OF_DONE.md

Add tests for:
- manual vs auto selection
- missing auto price fallback
- one representative config per major gate type
- option pricing combinations

Requirements:
- use predictable, readable test cases
- keep tests focused on the shared engine
- do not test UI here

Return:
- test names
- covered scenarios
- any failed assumptions
```

Done when:

- pricing is stable enough for the UI to trust it

---

## Phase 3 - 2D Renderer MVP

Purpose: produce a live, lightweight visual gate preview.

### 3.1 - Define the render contract

**Prompt**

```text
You own the 2D render contract for the configurator.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/frontend/CONFIGURATOR_EXECUTION_PROMPTS_2026-05-19.md
- docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md

Task:
- define the render input object for the 2D preview
- define the output shape or component contract
- decide what data the UI must pass to the renderer
- keep the contract small and deterministic

Do not build the full UI yet.
Return:
- render input contract
- render output contract
- implementation notes
```

Done when:

- the UI can call the renderer without guessing how to shape the input

### 3.2 - Build the base gate drawing

**Prompt**

```text
You own the base 2D gate drawing.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md

Implement the first preview renderer for:
- one gate frame
- one infill style
- width and height markers
- a readable scale/proportion system

Requirements:
- use SVG or canvas
- keep it fast and schematic
- do not introduce Three.js

Return:
- files changed
- drawing approach
- what is still missing for the next subphase
```

Done when:

- the preview shows a clear, stable gate shape

### 3.3 - Add option overlays

**Prompt**

```text
You own option overlays for the 2D preview.

Read:
- docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md

Extend the 2D renderer with:
- middle bar
- railheads approximation
- dog bars approximation
- arched top
- bushes and spirals approximation

Requirements:
- show the major differences clearly
- avoid overdraw and visual clutter
- allow approximate visual matching where the docs say it is acceptable

Return:
- overlay logic
- approximation notes
- any options that remain admin-only for now
```

Done when:

- the preview reflects the important configuration changes

### 3.4 - Add adjacent fence panel preview

**Prompt**

```text
You own the fence panel preview behavior.

Read:
- docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md

Implement:
- a minimal matching fence panel preview next to the gate
- quantity-aware display
- height and length markers if there is room

Requirements:
- render at least one matching panel when selected
- do not overbuild the catalogue
- keep the preview secondary to the gate itself

Return:
- panel preview behavior
- data requirements
- remaining unknowns
```

Done when:

- the configurator can suggest the look of the entrance, not just the gate alone

---

## Phase 4 - Configurator UI Shell

Purpose: turn the engine and renderer into a usable page.

### 4.1 - Build the app shell

**Prompt**

```text
You own the configurator page shell.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/frontend/FRONTEND_PARALLEL_WORK_PLAN.md
- docs/PROJECT_BRIEF.md

Implement:
- the real `/configurator` entry experience
- the surrounding layout for preview, controls, and summary
- the mobile-first page structure

Requirements:
- keep the page usable without 3D
- keep quote CTA visible
- keep AR CTA secondary
- do not import Three.js in the main bundle

Return:
- files changed
- page structure
- layout decisions
```

Done when:

- the page no longer feels like a coming-soon shell

### 4.2 - Add state management

**Prompt**

```text
You own configurator state management.

Read:
- docs/ARCHITECTURE_RULES.md
- docs/STACK_RULES.md
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md

Implement:
- a Zustand store for the current configuration
- selectors for preview, price, and UI controls
- state updates that do not force the whole page to rerender

Requirements:
- keep the state shape aligned with the shared config model
- preserve fast updates during slider or input changes

Return:
- store shape
- selectors
- notes on re-render boundaries
```

Done when:

- UI updates feel responsive and isolated

### 4.3 - Add controls and summary

**Prompt**

```text
You own the configurator controls and summary panel.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md
- docs/frontend/CONTENT_FALLBACKS.md

Implement:
- dimension inputs
- option toggles
- step rail or section navigation
- price summary with disclaimer
- quote CTA and save/share actions placeholder

Requirements:
- keep the controls understandable on mobile
- show indicative pricing language clearly
- do not hide critical actions behind extra clicks

Return:
- component list
- interaction notes
- any accessibility concerns
```

Done when:

- a user can configure a gate without losing context

### 4.4 - Add loading and error states

**Prompt**

```text
You own the configurator loading and error states.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/DEFINITION_OF_DONE.md

Implement:
- loading state for the configurator route
- user-facing error state for route failures
- empty or invalid config handling

Requirements:
- keep the failure states calm and useful
- avoid broken or blank screens

Return:
- states implemented
- when each state appears
- any remaining gaps
```

Done when:

- the configurator fails gracefully instead of collapsing

---

## Phase 5 - Save, Share, Quote, And AR Handoff

Purpose: make the configurator persist and extend into quoting and AR.

### 5.1 - Save and serialization contract

**Prompt**

```text
You own configuration save and restore behavior.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/db/DB_CLOSURE_PLAN.md
- docs/PROJECT_STATUS.md

Implement:
- serializing the current configuration
- persisting it using the agreed app path
- restoring it without changing meaning

Requirements:
- keep the save format aligned with the shared schema
- do not invent new database structures
- preserve fallback states

Return:
- save format
- restore format
- any integration dependencies
```

Done when:

- a user can save and reopen a configuration reliably

### 5.2 - Share route

**Prompt**

```text
You own the read-only share route for the configurator.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/PROJECT_STATUS.md
- docs/NEXT_ACTION_PLAN.md

Implement:
- `/quote/[shareToken]` as the default public share route, or the agreed equivalent if Phase 0 changed the route decision
- read-only display of a saved configuration
- clear handling for missing or invalid ids

Requirements:
- keep the route public-safe
- do not allow user mutation from the share view

Return:
- route behavior
- data contract
- fallback/error states
```

Done when:

- a saved config can be revisited through a stable public URL

### 5.3 - Quote handoff

**Prompt**

```text
You own the quote handoff from the configurator.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/frontend/CONTENT_FALLBACKS.md
- docs/DEFINITION_OF_DONE.md

Implement:
- quote CTA path from the configurator summary
- passing the configuration reference into the lead flow
- any required UI microcopy to explain the survey-led process

Requirements:
- keep the quote path simple
- avoid pretending the price is final

Return:
- quote handoff flow
- data passed forward
- any copy updates needed
```

Done when:

- the configurator leads naturally into a quote request

### 5.4 - On-demand 3D/AR export

**Prompt**

```text
You own the on-demand 3D/AR export path.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/ARCHITECTURE_RULES.md
- docs/STACK_RULES.md
- docs/DEFINITION_OF_DONE.md

Implement:
- lazy-loaded 3D export only when the user requests it
- AR handoff behavior for iPhone and Android
- fallback behavior when AR is unavailable

Requirements:
- do not add Three.js to the default configurator bundle
- keep 2D working if export fails
- keep the export path secondary to the main configurator

Return:
- export flow
- lazy-loading strategy
- platform handoff behavior
```

Done when:

- a user can open AR only when they choose to

---

## Phase 6 - Tests, QA, And Launch

Purpose: make the configurator stable enough for real use.

### 6.1 - Unit and contract tests

**Prompt**

```text
You own unit test coverage for the configurator foundation.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/DEFINITION_OF_DONE.md

Add or extend tests for:
- shared config model
- validation
- pricing
- 2D render contract
- save/restore serialization

Requirements:
- keep tests deterministic
- cover the critical user path first

Return:
- tests added
- gaps remaining
- any broken assumptions exposed by the tests
```

Done when:

- the shared engine and render contract are covered by useful tests

### 6.2 - E2E flow

**Prompt**

```text
You own the configurator end-to-end smoke path.

Read:
- docs/DEFINITION_OF_DONE.md
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md

Implement or update a Playwright flow that covers:
- load the configurator
- configure a gate
- confirm the preview updates
- confirm indicative pricing
- save or share the configuration
- proceed to quote

Requirements:
- keep the scenario short and stable
- do not overfit to implementation details

Return:
- flow coverage
- selectors used
- failures or flakiness risks
```

Done when:

- the main configurator journey is testable from the browser

### 6.3 - Browser QA

**Prompt**

```text
You own browser QA for the configurator.

Read:
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md
- docs/STACK_RULES.md
- docs/DEFINITION_OF_DONE.md

Review:
- mobile layout at 375 px
- desktop layout
- visibility of the preview
- clarity of the price summary
- legibility of the disclaimer

Return:
- issues found
- severity
- concrete file/area references
```

Done when:

- the page is usable on mobile and desktop without obvious friction

### 6.4 - Deployment verification

**Prompt**

```text
You own deployment verification for the configurator.

Read:
- docs/PROJECT_STATUS.md
- docs/NEXT_ACTION_PLAN.md
- docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md

Verify:
- the app is deployed to the intended environment
- the public route is reachable
- the configurator loads without missing environment configuration
- the quote path and share path are reachable

Return:
- verification results
- blockers
- any environment mismatches
```

Done when:

- the configurator is live and reachable in the intended environment

---

## Suggested Execution Order

Use this order unless a blocker forces a change:

1. Phase 0.1 route structure
2. Phase 0.2 visual direction
3. Phase 1.1 types and enums
4. Phase 1.2 validation
5. Phase 1.3 presets and serialization
6. Phase 2.1 base pricing
7. Phase 2.2 add-on pricing
8. Phase 2.3 pricing tests
9. Phase 3.1 render contract
10. Phase 3.2 base 2D drawing
11. Phase 3.3 option overlays
12. Phase 3.4 fence panel preview
13. Phase 4.1 app shell
14. Phase 4.2 state management
15. Phase 4.3 controls and summary
16. Phase 4.4 loading/error states
17. Phase 5.1 save/restore
18. Phase 5.2 share route
19. Phase 5.3 quote handoff
20. Phase 5.4 on-demand 3D/AR export
21. Phase 6.1 unit tests
22. Phase 6.2 E2E
23. Phase 6.3 browser QA
24. Phase 6.4 deployment verification

---

## Quick Assignment Guide

Use this to decide who gets what:

| Work type | Best agent |
|---|---|
| Shared engine, validation, pricing, tests | Codex |
| React pages, controls, state, route wiring | Cursor |
| Layout ideas, visual alternatives, screen composition | Composer |

---

## Minimum Prompts To Start Immediately

If you want the smallest possible start set, use these four:

1. Phase 1.1 for `packages/gate-engine/src/types.ts`
2. Phase 1.2 for validation
3. Phase 2.1 for pricing
4. Phase 3S for the vertical slice

Those four unblock the rest of the roadmap.
