# Phase 0 — Runtime contract (locked 2026-08-01)

## Decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Technical preview source | **Always preloaded masters** (Figma/SVG pack). Never invented live CAD. Only client mm change outside the SVG. |
| 2 | Serving | **Option A** — `apps/web/public/2d-masters/` |
| 3 | Scope | **Phase 0 only** — resolver + sync + tests. No configurator UI wiring yet. |

## Artefacts

| Path | Role |
|------|------|
| `docs/frontend/2d-masters/` | Source of truth (export tests + manifests) |
| `scripts/sync-2d-masters.mjs` | Copies SVGs → public + builds index |
| `apps/web/public/2d-masters/` | Runtime static files |
| `packages/gate-engine/src/silhouettes/silhouette-index.json` | Lookup index consumed by `resolveSilhouette` |
| `packages/gate-engine/src/silhouettes/resolve-silhouette.ts` | Resolver (fails closed if pack/slug missing) |
| `apps/web/src/lib/configurator/silhouette.ts` | Web re-export for Phase 1 |

## Commands

```bash
pnpm sync:2d-masters
pnpm --filter @steelyes/gate-engine test tests/resolve-silhouette.test.ts
```

## Phase 1

Done — see [`PHASE1_TECHNICAL_UI.md`](./PHASE1_TECHNICAL_UI.md).
