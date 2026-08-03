# Phase 3 — Masters as primary preview (2026-08-03)

## Decisions

| # | Choice | Meaning |
|---|--------|---------|
| 1A | Masters primary | Preloaded Figma CAD silhouettes are the default customer preview |
| 2A | Installation secondary | Live colour / fit schematic stays available as a tab |

No separate configurator-UI Figma. No re-export of frames — packs under `docs/frontend/2d-masters/` + `pnpm sync:2d-masters` remain the asset source.

## Behaviour

- Default preview mode id: `technical` (user-facing label **Design**)
- Tab order: **Design** → **Installation** → (⋯ Plan / Photo / 3D schematic)
- Mobile Quick Path chip: master SVG thumbnail via `resolveSilhouette` (no live-CAD fallback)
- Mobile sheet inherits Design default; Installation still selectable
- Finish: swatch on Design + “colour fill in Installation”; full colour remains on Installation
- Missing master → error state (never invent CAD)

## Files

| File | Role |
|------|------|
| `apps/web/src/components/configurator/PreviewCanvas.tsx` | Default mode + Design label + tab order |
| `apps/web/src/components/configurator/mobile/MobilePreviewChip.tsx` | Master thumbnail chip |
| `apps/web/src/components/configurator/TechnicalMasterPreview.tsx` | Design copy + finish affordance |
| `apps/web/src/lib/configurator/silhouette.ts` | Phase 3 policy note |

## Non-goals (this phase)

- Pixel-perfect configurator shell redesign (needs a separate UI Figma)
- Hiding Installation from customers
- Railhead picket-aligned X / signed count rule (still Phase 2 provisional)
- Production deploy unless explicitly requested

## Verify

1. Desktop `/configurator` opens on **Design** master
2. Arched / dog bars / composite → master swaps; mm strip updates
3. **Installation** tab → live coloured schematic
4. Mobile chip shows master; sheet defaults to Design
5. Missing master still errors (no invented CAD)
6. **CA-01:** Manual → leaf handle overlay on Design; Motorised → no handle (masters never bake handles)

## Follow-up (2026-08-03)

- `resolveHandleOverlay()` + `TechnicalMasterPreview` compose the leaf handle when `!motorised`
- Swing silhouette SVGs stripped of baked `manual-handle-*`
- Quick Path opening dims use per-type `getDimensionLimits`
