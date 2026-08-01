# Phase 2 — Railhead overlays on Technical masters (2026-08-01)

## Done

- Engine `resolveRailheadOverlays(config)` places preloaded SKU SVGs along top / dog rails
- Count uses the same provisional divisors as `getExpectedTopRailheadCount` / dog-bar twin
- Dog catalogue slugs (`RH32-dog`) map to shared overlay files (`RH32.svg`)
- Default SKU when option is on but picker empty: **RH32**
- `TechnicalMasterPreview` composites overlays on the master (never invents CAD geometry)
- Strip under the drawing shows selected railhead code(s) when overlays are active

## Files

| File | Role |
|------|------|
| `packages/gate-engine/src/silhouettes/resolve-railhead-overlays.ts` | Placement plan |
| `apps/web/src/components/configurator/TechnicalMasterPreview.tsx` | Composite UI |
| `apps/web/public/2d-masters/railheads/silhouettes/*.svg` | Overlay assets |
| `packages/gate-engine/tests/resolve-railhead-overlays.test.ts` | Tests |

## Layout (provisional)

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

1. Configurator → Technical
2. Enable **Top railheads** + pick RH7 / RH32 / …
3. Heads appear on the top rail; mm strip still client-driven
4. Enable dog bars + dog bar railheads → second row mid/lower
