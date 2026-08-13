# Tracked Sliding definitive — 2026-08-13

**COMPLETO: False** — 15/17 tipology×deco matrix (single flat set; no motorised split)

Policy: manual and automatic (motorised) share the **same** 2D masters — do **not** create `_motorised` variants.

| Slug | Present | Notes |
|---|---|---|
| `base` | ✅ | from `base 1.svg` |
| `base_circles` | ❌ | missing — overlay fallback OK |
| `base_collar_1` | ✅ | from `base collar.svg` |
| `base_circles_collar_1` | ✅ | kept larger `base collar + circles.svg`; smaller `-1` in `_review/` |
| `arched` | ✅ | from `arched 1.svg` |
| `arched_circles` | ❌ | missing — overlay fallback OK |
| `arched_collar_1` | ✅ | from `arched collars.svg` |
| `arched_circles_collar_1` | ✅ | kept larger `arched collars + circles.svg`; smaller `-1` in `_review/` |
| `dog_bars` | ✅ | from `dog_bars 1.svg` |
| `dog_bars_circles` | ✅ | from `dog_bars circles.svg` |
| `dog_bars_collar_1` | ✅ | from `dog_bars collars.svg` |
| `dog_bars_circles_collar_1` | ✅ | from `dog_bars collars + circles.svg` |
| `arched_dog_bars` | ✅ | from `arched_dog_bars 1.svg` |
| `arched_dog_bars_circles` | ✅ | from `arched_dog_bars + circles.svg` |
| `arched_dog_bars_collar_1` | ✅ | from `arched_dog_bars collars.svg` |
| `arched_dog_bars_circles_collar_1` | ✅ | from `arched_dog_bars collars + circles.svg` |
| `composite` | ✅ | from `composite 1.svg` |

## Missing (overlay fallback OK)

- `base_circles`
- `arched_circles`

## Duplicates parked

- `_review/DUPLICATE__base_collar_+_circles-1__smaller.svg` (38452 B; kept 43756 B)
- `_review/DUPLICATE__arched_collars_+_circles-1__smaller.svg` (40982 B; kept 46288 B)

## Paths

- Definitive: `docs/frontend/2d-masters/tracked_sliding/definitive/`
- Figma mirror: `docs/frontend/2d-masters/figma-import-2026-08/04-gate-masters-reference/tracked_sliding/definitive/`
- Docs silhouettes: `docs/frontend/2d-masters/tracked_sliding/silhouettes/{slug}.svg`
- Runtime: `apps/web/public/2d-masters/tracked_sliding/silhouettes/{slug}.svg`
- Raw archive: `docs/frontend/2d-masters/tracked_sliding/_archive_tracked_sliding_raw/`
