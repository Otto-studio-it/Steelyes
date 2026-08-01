# Phase 1 — Technical UI (2026-08-01)

## Done

- Tab **Technical** renders `resolveSilhouette(config).publicPath` via `TechnicalMasterPreview`
- Client `widthMm × heightMm` shown in a strip **under** the master SVG (not baked in)
- Master slug shown in the strip (e.g. `arched`, `composite`)
- **No live-CAD fallback** — missing master → error state, not invented geometry
- Installation / Plan / Photo / 3D unchanged (still schematic/live engine)

## Files

| File | Role |
|------|------|
| `apps/web/src/components/configurator/TechnicalMasterPreview.tsx` | Technical UI |
| `apps/web/src/components/configurator/ConfiguratorPreview.tsx` | Routes `technical` → master preview |
| `apps/web/public/2d-masters/` | Served SVGs |

## Verify locally

1. `pnpm sync:2d-masters` (if masters changed)
2. Open configurator → **Technical**
3. Change style / arched / dog bars / composite → master swaps
4. Change width/height → drawing stays, strip updates

## Next (Phase 2)

Railhead overlays on the master.
