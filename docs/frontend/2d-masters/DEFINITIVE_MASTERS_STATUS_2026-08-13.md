# Definitive masters status — 2026-08-13

Post-intake cleanup and matrix audit after AppleDouble/`._*` removal from public + docs silhouettes.

**Policy (index):** `technicalSource=preloaded_master_only`, never invent CAD; serve from `apps/web/public/2d-masters` (Option A).

**Victorian matrix tipologies:** `base`, `arched`, `dog_bars`, `arched_dog_bars`
**Decorative suffixes:** `` (plain), `_circles`, `_collar_1`, `_circles_collar_1` + `composite`
**Motorised-split gates:** expect `{slug}` and `{slug}_motorised` (34 Victorian+composite ×2 = 34 files when complete).
**Flat gates:** expect `{slug}` only (17 Victorian+composite when complete; fewer if some combos intentionally omitted).

## Cleanup

- Deleted **88** AppleDouble `._*` files (34 double_swing public + 34 docs; 10 telescopic public + 10 docs).
- Deleted **0** non-index `.svg` orphans (the inflated public counts were `._*.svg` counted as SVGs).
- After cleanup: every gate `public` SVG count == `index` silhouettes keys; `docs` mirrors public.

## Per-gate matrix

### `double_swing`

- **Policy:** motorised-split (manual + `_motorised` twins)
- **Index status:** ready
- **Present (index):** 34
- **Expected (full victorian×deco + composite ×2 motor):** 34
- **Missing vs full matrix:** _(none)_
- **public == index:** YES (34 SVG)
- **docs == index:** YES (34 SVG)

### `single_swing`

- **Policy:** motorised-split (manual + `_motorised` twins)
- **Index status:** ready
- **Present (index):** 34
- **Expected (full victorian×deco + composite ×2 motor):** 34
- **Missing vs full matrix:** _(none)_
- **public == index:** YES (34 SVG)
- **docs == index:** YES (34 SVG)

### `tracked_sliding`

- **Policy:** flat (same 2D for manual/automatic; no `_motorised` twins)
- **Index status:** ready
- **Present (index):** 15
- **Expected (full victorian×deco + composite):** 17
- **Missing vs full matrix:** `base_circles`, `arched_circles`
- **public == index:** YES (15 SVG)
- **docs == index:** YES (15 SVG)

### `cantilever_sliding`

- **Policy:** flat (same 2D for manual/automatic; no `_motorised` twins)
- **Index status:** ready
- **Present (index):** 17
- **Expected (full victorian×deco + composite):** 17
- **Missing vs full matrix:** _(none)_
- **public == index:** YES (17 SVG)
- **docs == index:** YES (17 SVG)

### `bifolding_double_swing`

- **Policy:** motorised-split (manual + `_motorised` twins)
- **Index status:** ready
- **Present (index):** 31
- **Expected (full victorian×deco + composite ×2 motor):** 34
- **Missing vs full matrix:** `arched_dog_bars_circles_motorised`, `arched_dog_bars_collar_1`, `arched_dog_bars_collar_1_motorised`
- **public == index:** YES (31 SVG)
- **docs == index:** YES (31 SVG)

### `single_bifolding`

- **Policy:** motorised-split (manual + `_motorised` twins)
- **Index status:** ready
- **Present (index):** 32
- **Expected (full victorian×deco + composite ×2 motor):** 34
- **Missing vs full matrix:** `dog_bars_collar_1_motorised`, `arched_dog_bars_circles_collar_1_motorised`
- **public == index:** YES (32 SVG)
- **docs == index:** YES (32 SVG)

### `telescopic_sliding`

- **Policy:** flat (same 2D for manual/automatic; no `_motorised` twins)
- **Index status:** ready
- **Present (index):** 10
- **Expected (full victorian×deco + composite):** 17
- **Missing vs full matrix:** `base_circles`, `base_circles_collar_1`, `arched_circles_collar_1`, `dog_bars_circles`, `dog_bars_collar_1`, `dog_bars_circles_collar_1`, `arched_dog_bars_circles`
- **public == index:** YES (10 SVG)
- **docs == index:** YES (10 SVG)

### `radius_sliding`

- **Policy:** flat (same 2D for manual/automatic; no `_motorised` twins)
- **Index status:** ready
- **Present (index):** 15
- **Expected (full victorian×deco + composite):** 17
- **Missing vs full matrix:** `arched_collar_1`, `dog_bars_collar_1`
- **public == index:** YES (15 SVG)
- **docs == index:** YES (15 SVG)

## Compact missing summary

| Gate | Policy | Present | Expected | Missing | public==index |
|---|---|---:|---:|---|---|
| `double_swing` | motor-split | 34 | 34 | — | YES |
| `single_swing` | motor-split | 34 | 34 | — | YES |
| `tracked_sliding` | flat | 15 | 17 | base_circles, arched_circles | YES |
| `cantilever_sliding` | flat | 17 | 17 | — | YES |
| `bifolding_double_swing` | motor-split | 31 | 34 | arched_dog_bars_circles_motorised, arched_dog_bars_collar_1, arched_dog_bars_collar_1_motorised | YES |
| `single_bifolding` | motor-split | 32 | 34 | dog_bars_collar_1_motorised, arched_dog_bars_circles_collar_1_motorised | YES |
| `telescopic_sliding` | flat | 10 | 17 | base_circles, base_circles_collar_1, arched_circles_collar_1, dog_bars_circles, dog_bars_collar_1, dog_bars_circles_collar_1, arched_dog_bars_circles | YES |
| `radius_sliding` | flat | 15 | 17 | arched_collar_1, dog_bars_collar_1 | YES |

## Design readiness

All **8** gate families have definitive packs ingested into `silhouette-index.json` and mirrored under `apps/web/public/2d-masters/{gate}/silhouettes/`. Missing matrix cells (if any) use tipology + overlay fallback at resolve time; packs remain `status: ready` for configurator Design.

## Resolver fix — 2026-08-13 (P0)

- Lookup rules rebuilt tipology-safe (`scripts/rebuild-silhouette-lookup.mjs` / `scripts/lib/silhouette-lookup.mjs`).
- `resolveSilhouette` picks **most-specific** matching rule (not first-match).
- Audit: `packages/gate-engine/tests/audit-2d-matrix.test.ts` asserts `tipology_drift === 0` across 212 client combos.
- Report: `AUDIT_2D_MATRIX_2026-08-13.json`.
