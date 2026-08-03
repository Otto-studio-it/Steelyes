---
adr_number: 002
title: Configurator 2D-first with on-demand 3D/AR
status: Accepted
date_proposed: 2026-05-19
date_accepted: 2026-05-19
author: Codex
---

# 002. Configurator 2D-first with on-demand 3D/AR

## Status

Accepted

## Context

The current configurator surface is only a placeholder page, and the shared business logic package is still a stub. The documented architecture originally assumes a configurator that is tightly coupled to Three.js and AR export, but that is a high-cost starting point for the first usable release.

The product needs to become useful before the full 3D/AR pipeline is complete. A 2D preview gives users immediate value, keeps the page fast on mobile, and reduces the amount of code that must be built before the configurator can be used for quoting.

The business constraints remain unchanged:

- final pricing data is still partially blocked by the client;
- pricing must remain indicative until confirmed;
- no speculative catalogue schema should be introduced just to support an unfinished renderer.

## Decision

We will build the Steelyes configurator as a **2D-first product** with **3D/AR generated only on user request**.

This means:

- the main configurator page shows a live 2D preview by default;
- the shared configuration model drives preview, price, save, share, and export;
- 3D export and AR handoff are lazy-loaded and optional;
- Three.js is not part of the main interaction path;
- the first implementation goal is a usable 2D configurator, not a complete AR system.

This decision is now the execution baseline for the configurator roadmap and related documentation.

## Consequences

### Positive
- Faster time to first usable configurator.
- Lower bundle weight and lower mobile interaction cost.
- Easier to test and debug the core configuration flow.
- One shared model can later feed a 3D renderer without redesigning the product.
- The site can ship a credible configurator before the full AR pipeline is done.

### Negative
- The initial visual preview will be schematic, not a full 3D product view.
- AR becomes a secondary action rather than the primary product promise.
- Some future 3D geometry work will still be needed for export.

### Effort Required
- Build and test the shared config model.
- Implement the 2D renderer and preview states.
- Implement lazy-loaded 3D/AR export later in the flow.
- Update public copy so users understand that pricing remains indicative.

## Alternatives Considered

### Option 1: 3D-first configurator
- **Pros:** matches the long-term architecture and AR vision.
- **Cons:** slower to ship, higher implementation risk, heavier mobile cost.
- **Why rejected:** the first release needs to deliver value before full 3D/AR exists.

### Option 2: Separate 2D configurator and separate 3D/AR tool
- **Pros:** clear separation of concerns.
- **Cons:** duplicated configuration logic, duplicated validation, duplicated pricing handling.
- **Why rejected:** too much maintenance overhead and too much room for drift.

### Option 3: No visual configurator, quote-only flow
- **Pros:** fastest possible quote funnel.
- **Cons:** loses the product differentiation and the exploratory visual experience.
- **Why rejected:** the configurator is a core commercial differentiator and should remain visible.

## Implementation Notes

- Create the shared configuration schema first.
- Keep pricing and compatibility rules in `packages/gate-engine`.
- Use SVG or canvas for the first preview renderer.
- Keep Three.js lazy-loaded and outside the default page bundle.
- Add tests for validation, pricing, and preview output before expanding to all six gate types.
- Update `docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md`, `docs/PROJECT_STATUS.md`, `docs/NEXT_ACTION_PLAN.md`, and `docs/PROJECT_BRIEF.md` so the execution story matches this decision.

## Related Documents

- `docs/frontend/CONFIGURATOR_ROADMAP_2026-05-19.md`
- `docs/PROJECT_STATUS.md`
- `docs/NEXT_ACTION_PLAN.md`
- `docs/PROJECT_BRIEF.md`
- `docs/ARCHITECTURE_RULES.md`
- `docs/STACK_RULES.md`

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-05-19 | Codex | Initial: adopt 2D-first configurator with on-demand 3D/AR |
