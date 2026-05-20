---
title: Configurator Roadmap
description: Execution roadmap for the Steelyes configurator, starting from 2D preview and extending to on-demand 3D/AR export
owner: Ruben
status: ACTIVE
last_updated: 2026-05-20
---

# Steelyes - Configurator Roadmap

This document is retained as a precursor. Execution now follows `docs/frontend/CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md`.

Product decision assumed by this roadmap:

- 2D preview is the default experience inside the page.
- 3D and AR are generated only when the user asks for them.
- One shared configuration model powers both views.
- No new speculative pricing schema is added until the client confirms the missing business data.

The roadmap is 2D-first with on-demand 3D/AR. Later 3D/AR work is additive, not a priority swap.

---

## 1. What We Are Building

The configurator must do four things well:

1. Let the user choose a gate type and style without confusion.
2. Let the user adjust dimensions and options with immediate visual feedback.
3. Show an indicative price that is clearly not a final quote.
4. Hand off to quote request, saved share link, and later AR preview.

The first release should feel like a real product, not a teaser page.

The public configurator entry remains `/configurator`, implemented under `apps/web/src/app/(marketing)/configurator/page.tsx` until a later route ADR changes it.

---

## 2. Non-Negotiables

| Rule | Why it matters |
|---|---|
| 2D preview must work without loading Three.js | Keeps the main page fast and usable on mobile |
| AR/3D must be optional and lazy-loaded | Avoids bundle bloat and keeps INP under control |
| Pricing must stay indicative until the client confirms final data | Avoids false certainty and commercial risk |
| Configuration state must be shared between preview, price, save, and export | Prevents duplicated logic and drift |
| No new catalogue guesses | Keeps the business model aligned with the current blocker state |
| Mobile-first interaction at 375 px | The product is consumer-facing and mobile-heavy |

---

## 3. Target User Flow

The user journey should be:

1. Enter the configurator from the marketing site.
2. Choose the gate mechanism.
3. Pick the style and optional decorative features.
4. Enter dimensions.
5. See the 2D gate update immediately.
6. See an indicative price update immediately.
7. Save or share the configuration.
8. Open AR or camera view only if desired.
9. Request a survey-led quote.

This flow keeps the page useful even if the user never opens AR.

---

## 4. Architecture Summary

The configurator should be split into four layers.

| Layer | Responsibility | Suggested location |
|---|---|---|
| Domain model | Gate types, styles, options, validation rules | `packages/gate-engine/src/` |
| Pricing | Indicative pricing, rule application, fallback handling | `packages/gate-engine/src/pricing.ts` |
| 2D rendering | SVG or canvas gate preview, option overlays, dimensions | `apps/web/src/components/configurator/` |
| App flow | Step navigation, state, save/share, quote CTA, AR handoff | `apps/web/src/app/(marketing)/configurator/` |

The domain model should be pure TypeScript and testable in isolation.

The 2D renderer should not know about persistence or business rules.

The app layer should not contain pricing formulas.

---

## 5. File Map To Create

### `packages/gate-engine`

| File | Purpose |
|---|---|
| `src/index.ts` | Public exports for types, pricing, and rendering helpers |
| `src/types.ts` | `GateType`, `GateStyle`, `GateConfig`, `GateOption`, `FencePanelInput` |
| `src/pricing.ts` | Indicative pricing engine with clear fallback states |
| `src/validation.ts` | Domain validation and safe normalization helpers |
| `src/rules/compatibility.ts` | Option compatibility rules by gate type/style |
| `src/rules/geometry.ts` | Dimension constraints, spacing rules, count rules |
| `src/render-2d/index.ts` | Entry point for 2D projection |
| `src/render-2d/build-gate-2d.ts` | Produces a simple, deterministic 2D representation |
| `tests/pricing.test.ts` | Pricing unit tests |
| `tests/compatibility.test.ts` | Option validation and incompatibility tests |
| `tests/render-2d.test.ts` | Shape and layout tests for 2D output |

### `apps/web`

| File | Purpose |
|---|---|
| `src/app/(marketing)/configurator/page.tsx` | Configurator entry and type picker |
| `src/app/(marketing)/configurator/[type]/page.tsx` | One flow per gate type |
| `src/app/(marketing)/configurator/[type]/loading.tsx` | Lightweight loading state |
| `src/app/(marketing)/configurator/[type]/error.tsx` | User-facing error state |
| `src/app/(marketing)/quote/[shareToken]/page.tsx` | Read-only saved configuration |
| `src/components/configurator/ConfiguratorShell.tsx` | Layout for canvas, controls, summary |
| `src/components/configurator/ConfiguratorCanvas.tsx` | 2D preview renderer |
| `src/components/configurator/StepRail.tsx` | Step progress and navigation |
| `src/components/configurator/OptionPanel.tsx` | Option groups and toggles |
| `src/components/configurator/DimensionInputs.tsx` | Width/height inputs and validation |
| `src/components/configurator/PriceSummary.tsx` | Indicative price + disclaimer |
| `src/components/configurator/ExportActions.tsx` | Save, share, AR, quote CTAs |
| `src/store/configuratorStore.ts` | Zustand store for current config state |
| `src/lib/configurator/schema.ts` | Zod boundary schema for form/input parsing only |
| `src/lib/configurator/presets.ts` | Default presets for each gate type |
| `src/lib/configurator/serialization.ts` | Save/load/share token helpers |

### Existing files to replace or retire

| File | Action |
|---|---|
| `apps/web/src/app/(marketing)/configurator/page.tsx` | Keep the public entry stable while the configurator implementation matures |
| `packages/gate-engine/src/index.ts` | Replace the placeholder export with real public exports |
| `packages/gate-engine/tests/index.test.ts` | Replace the placeholder test with real coverage |

---

## 6. Phase Plan

### Phase 0 - Scope Freeze and Rules

Goal: lock the product shape before implementation starts.

Deliverables:

| Item | Output |
|---|---|
| Route decision | Keep `/configurator` as the public MVP entry and keep the current marketing-route implementation until a later ADR changes the URL surface |
| View decision | Keep 2D-first with on-demand 3D/AR |
| Data decision | Do not create new DB tables for unfinished catalogue data |
| Visual decision | Use a consistent 2D representation style for gate frame, infill, rails, and options |
| Docs decision | Update stale docs so they match the master roadmap and the 2D-first release contract |

Acceptance criteria:

| Check | Pass condition |
|---|---|
| Scope | Everyone agrees on 2D default + AR on demand |
| Data | The config object is defined and versioned |
| Routes | The route structure is final for the MVP |

Baseline decisions for Phase 0:

| Topic | Decision |
|---|---|
| Public configurator entry | Keep `/configurator` as the public MVP entry |
| Internal type flow | Keep the first working flow under the marketing route until a later ADR changes the URL surface |
| Share route | Use `/quote/[shareToken]` as the default public share route |
| Route group strategy | Keep the public URL stable; route groups may change internally without changing the URL surface |
| Docs cleanup | Treat older `/configurator/[id]` references as non-baseline and keep this roadmap as historical context only |

Recommended owner split:

| Agent | Responsibility |
|---|---|
| Codex | Document alignment, scope freeze, engine design |
| Cursor | UI planning, route map, visual hierarchy |
| Composer | Optional layout prototypes and quick UI drafts |

Write-set boundaries:

| Agent | Files / areas |
|---|---|
| Codex | `packages/gate-engine/*`, configurator docs, route/decision docs |
| Cursor | `apps/web/src/app/(marketing)/configurator/*`, `apps/web/src/components/configurator/*` |
| Composer | Visual references, layout experiments, no shared engine files |

---

### Phase 1 - Domain Model and Validation

Goal: create the shared language of the configurator.

Deliverables:

| Item | Output |
|---|---|
| Gate type enum | Double swing, single swing, sliding, cantilever, bifold, telescopic, radius |
| Style enum | Traditional Victorian, Composite Boards |
| Option model | Middle bar, railheads, dog bars, arched top, bushes, spirals |
| Fence panel model | Quantity plus height/length per panel |
| Validation | Dimensions, option compatibility, safe defaults |
| Serialization | Stable JSON shape for save/share/export |

Implementation rules:

| Rule | Detail |
|---|---|
| One config object | The same object feeds preview, price, save, and export |
| No magic strings in UI | Use enums and labels from shared data |
| Zod at the boundary | Use Zod in the app layer for parsing and form input; keep domain rules in `gate-engine` |
| Compatibility first | Do not allow invalid combinations to reach the renderer |
| Fallback safe | Missing final pricing stays clearly marked |

Acceptance criteria:

| Check | Pass condition |
|---|---|
| Config schema | A config can be validated and serialized |
| Defaults | Each gate type has a sensible starting preset |
| Errors | Invalid combinations return readable errors |

Recommended owner split:

| Agent | Responsibility |
|---|---|
| Codex | `packages/gate-engine/src/types.ts`, validation, serialization, tests |
| Cursor | UI labels and option taxonomy used in the form |
| Composer | Alternative control mockups if needed |

---

### Phase 2 - Indicative Pricing Engine

Goal: make the price shown on screen predictable, explainable, and safe.

Deliverables:

| Item | Output |
|---|---|
| Base prices | Manual vs automated base per gate type |
| Add-on pricing | Middle bar, railheads, dog bars, arched top, bushes, spirals |
| Fence pricing rule | Placeholder rule only if the business data is still incomplete |
| Disclaimer logic | Always surface "Indicative, subject to survey" |
| Price tests | Golden tests for representative configurations |

Pricing behavior:

| Situation | Result |
|---|---|
| Manual price exists | Use it |
| Auto price exists | Use it when motorised is selected |
| Auto price missing | Show price on request / survey required |
| Option price missing | Hide the option or show it as provisional admin-only |
| Final quote not confirmed | Never show the total as final |

Acceptance criteria:

| Check | Pass condition |
|---|---|
| Deterministic | Same config always yields same indicative price |
| Safe fallback | Missing values never produce fake numbers |
| Test coverage | Representative configs are covered by unit tests |

Recommended owner split:

| Agent | Responsibility |
|---|---|
| Codex | Pricing engine and unit tests |
| Cursor | Copywriting for price labels and fallback text |
| Composer | Summary card layouts and CTA placement |

---

### Phase 3 - 2D Renderer MVP

Goal: show a live visual gate without loading 3D.

Deliverables:

| Item | Output |
|---|---|
| Render mode | SVG or canvas-based gate preview |
| Frame drawing | Outer frame, posts, leaves, sliding rail where relevant |
| Infill drawing | Bars, boards, spacing, panel divisions |
| Option overlays | Middle bar, railheads, dog bars, arched top |
| Dimension markers | Width and height labels on the preview |
| Fence preview | Optional adjacent panel preview for one matching panel |

Visual priority order:

| Priority | Render element |
|---|---|
| 1 | Overall gate shape and proportion |
| 2 | Gate type difference |
| 3 | Style difference |
| 4 | Option overlays |
| 5 | Decorative approximation for railheads and bars |
| 6 | Adjacent panel preview |

Rules for the 2D renderer:

| Rule | Detail |
|---|---|
| Deterministic | The same input always draws the same output |
| Fast | Repaint must feel instant on mobile |
| Simple first | Better a clean schematic than a slow pseudo-3D image |
| Honest | Approximation is acceptable if it is visibly labeled as such |

Acceptance criteria:

| Check | Pass condition |
|---|---|
| Responsiveness | Preview updates while the user edits inputs |
| Clarity | Gate type and dimensions are readable at a glance |
| Option visibility | At least the major options are visible in the preview |

Recommended owner split:

| Agent | Responsibility |
|---|---|
| Composer | Fast UI prototypes and visual layout ideas |
| Cursor | UI integration and preview panel composition |
| Codex | Rendering contract and preview data shape |

---

### Phase 3S - Vertical Slice

Goal: prove the end-to-end product path with one gate type before expanding to the full catalogue.

Deliverables:

| Item | Output |
|---|---|
| Single gate path | One fully working gate type from config to preview to price to quote CTA |
| Single-screen flow | One page or one flow that can be used without switching to other gate types |
| Real interaction | The preview reacts to form changes and price updates in the same flow |
| Minimal persistence | Local or temporary save if DB save is not ready yet |

Implementation rules:

| Rule | Detail |
|---|---|
| Pick one type | Use the most documentable gate type first |
| Keep scope small | No fence panel deep dive, no AR polish, no multi-type expansion yet |
| Reuse later | The slice must become the template for the remaining gate types |

Acceptance criteria:

| Check | Pass condition |
|---|---|
| End-to-end | A user can configure one gate type from start to summary |
| Visible value | The 2D preview and indicative price both update in the same flow |
| Usable | The flow is understandable on mobile |

Recommended owner split:

| Agent | Responsibility |
|---|---|
| Codex | Engine glue, validation, tests, slice contract |
| Cursor | One working React flow |
| Composer | Optional visual variation for the single slice |

---

### Phase 4 - Configurator UI Shell

Goal: turn the engine and renderer into a usable product.

Deliverables:

| Item | Output |
|---|---|
| Step flow | Gate type, dimensions, style, options, summary |
| State store | Zustand store with fine-grained selectors |
| Controls | Inputs, toggles, grouped options, presets |
| Summary panel | Live chosen options, price, disclaimer, CTA |
| Mobile layout | Preview above or beside controls depending on width |
| Loading/error states | No blank screen, no dead ends |

Interaction rules:

| Rule | Detail |
|---|---|
| Preview stays visible | The user should always see the effect of changes |
| Quote CTA stays present | The page should always have a clear next step |
| AR CTA is secondary | Visible, but not more prominent than the core configurator |
| No hard refresh dependency | State should not vanish during normal interaction |

Acceptance criteria:

| Check | Pass condition |
|---|---|
| Mobile | Works at 375 px without layout breakage |
| Keyboard | Step controls can be used without a mouse |
| Clarity | User understands what is editable and what is indicative |

Recommended owner split:

| Agent | Responsibility |
|---|---|
| Cursor | Main React UI implementation |
| Composer | Secondary layout exploration or alternative visual treatment |
| Codex | Store integration, state contract, regression review |

---

### Phase 5 - Save, Share, Quote, and AR Handoff

Goal: make the configurator useful beyond a single session.

Deliverables:

| Item | Output |
|---|---|
| Save action | Persist configuration to DB |
| Share route | Read-only `/quote/[shareToken]` as the default public share route |
| Quote CTA | Lead capture path from saved config |
| AR handoff | Generate GLB/USDZ only when requested |
| Device routing | iPhone -> Quick Look, Android -> Scene Viewer |

Important implementation rule:

The 3D export path must not block the 2D configurator. If export fails, the 2D page must still work.

Acceptance criteria:

| Check | Pass condition |
|---|---|
| Save | A configuration can be persisted and re-opened |
| Share | A tokenized read-only view works |
| Quote | The quote request contains the configuration reference |
| AR | Viewer handoff works only when the user requests it |

Recommended owner split:

| Agent | Responsibility |
|---|---|
| Codex | Share/save contract and AR export integration rules |
| Cursor | UI for save/share/quote actions |
| Composer | AR handoff screen or alternative device-specific CTA layout |

---

### Phase 6 - Test, Performance, and Launch

Goal: make the configurator stable enough for real users.

Deliverables:

| Item | Output |
|---|---|
| Unit tests | Pricing, validation, compatibility, 2D render output |
| E2E tests | Load, configure, save, share, quote |
| Performance | Fast enough on mobile without jank |
| Accessibility | Keyboard support, readable labels, clear state changes |
| Deployment | Live on the correct public domain and environment |

Testing checklist:

| Check | Pass condition |
|---|---|
| Typecheck | No TypeScript errors |
| Lint | No lint errors in configurator files |
| Build | Production build succeeds |
| E2E | Core configurator flow passes |
| Mobile QA | Works on phone viewport without clipping |

Launch checklist:

| Check | Pass condition |
|---|---|
| Domain | New app is actually serving the public route |
| Env vars | Production env points to the correct Supabase project |
| Copy | Indicative pricing language is visible |
| Fallbacks | Missing business data is not presented as final |

---

## 7. Execution Order

This is the recommended implementation sequence.

| Order | Work |
|---|---|
| 1 | Freeze scope and route structure |
| 2 | Implement shared config model and validation |
| 3 | Implement indicative pricing |
| 4 | Implement 2D renderer |
| 5 | Run vertical slice for one gate type |
| 6 | Build UI shell and step flow |
| 7 | Add save/share/quote |
| 8 | Add on-demand AR export |
| 9 | Write tests and run QA |
| 10 | Deploy and verify on the real domain |

---

## 8. Role Split For Composer, Cursor, And Codex

| Tool | Best use in this project |
|---|---|
| Composer | Rapid UI exploration, alternative configurator layouts, polished screen composition |
| Cursor | Main implementation of React pages, controls, store integration, route wiring |
| Codex | Domain model, pricing, compatibility logic, tests, integration review, documentation |

Working rule:

- Do not let two agents edit the same file at the same time.
- Let Codex own the shared engine and docs.
- Let Cursor own the React application surface.
- Use Composer for layout experimentation and visual variants, not for core business logic.

---

## 9. Definition Of Done For The First Usable Release

The first release is done when all of the following are true:

| Area | Done condition |
|---|---|
| Config flow | A user can configure at least one gate type from start to summary |
| 2D preview | The gate updates visually as the user edits inputs |
| Pricing | A clear indicative price is shown with a disclaimer |
| Save/share | A configuration can be saved and reopened |
| Quote path | The user can request a quote from the configurator |
| AR | A user can open the 3D/AR handoff on demand |
| Quality | Typecheck, lint, build, and core tests pass |

---

## 10. Immediate Next Actions

If we start now, the next concrete work items should be:

1. Evolve the current `/configurator` entry shell into the real configurator flow.
2. Expand `packages/gate-engine` from stub to real domain and pricing logic.
3. Define the shared configuration schema and presets.
4. Build the first 2D preview renderer for one gate type.
5. Run a vertical slice for one gate type end to end.
6. Wire the page to the shared store and a live summary panel.

That sequence gives us a working product early, while leaving AR and full 3D as an additive layer instead of a blocker.
