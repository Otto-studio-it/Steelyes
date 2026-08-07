# Phase 2 — Railhead overlays on Technical masters (2026-08-01)

## Product note (current)

Railhead SKUs are chosen in Refine (`RailheadChooserSection`) for quote / email / PDF.
**Design drawing and 3D/AR mesh do not composite or draw finials.** Catalogue selection only.

`resolveRailheadOverlays` remains in the engine for placement math / assets; the Design UI no longer calls it.

## Historical (overlay composition — retired from Design UI)

- Engine `resolveRailheadOverlays(config)` places preloaded SKU SVGs along top / dog rails
- Count uses the same provisional divisors as `getExpectedTopRailheadCount` / dog-bar twin
- Dog catalogue slugs (`RH32-dog`) map to shared overlay files (`RH32.svg`)
- Default SKU when option is on but picker empty: **RH32**
- Strip under the drawing previously showed selected railhead code(s) when overlays were active

## Files

| File | Role |
|------|------|
| `packages/gate-engine/src/silhouettes/resolve-railhead-overlays.ts` | Placement plan (engine helper) |
| `apps/web/src/components/configurator/RailheadChooserSection.tsx` | Catalogue chooser (Refine) |
| `apps/web/src/components/configurator/TechnicalMasterPreview.tsx` | Design master only — no overlays |
| `apps/web/public/2d-masters/railheads/silhouettes/*.svg` | Catalogue / asset SVGs |
| `packages/gate-engine/tests/resolve-railhead-overlays.test.ts` | Engine placement tests |

## Layout (provisional — for engine helper)

Masters share a 1200×860 paper. Anchors match Victorian elevation rails:

| Row | Anchor |
|-----|--------|
| Top | y = 164 / 860 |
| Dog | y = 514 / 860 |
| Opening band | x = 126…1074 / 1200 |

## Still provisional

- Exact picket-aligned X positions (today: even spacing across opening)
- Client-signed count rule (`open.railhead_count_rule`)
- Per-type layout overrides if a master paper differs

## Verify

1. Configurator → Refine → **Choose your railheads** grid
2. Pick RH7 / RH32 / … — selection stored on config
3. Design drawing has no railhead overlays; Summary / email / PDF show **Railheads: RH32**
