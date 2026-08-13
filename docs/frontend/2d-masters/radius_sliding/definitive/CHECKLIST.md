# Radius Sliding definitive — 2026-08-13

**COMPLETO: False** — 15/17 tipology×deco matrix (single flat set; no motorised split)

Policy: manual and automatic (motorised) share the **same** 2D masters — do **not** create `_motorised` variants.

| Slug | Present | Notes |
|---|---|---|
| `base` | ✅ | from `base 1.svg` |
| `base_circles` | ✅ | from `base 2 + circles +.svg` |
| `base_collar_1` | ✅ | from `base 2  + collars.svg` |
| `base_circles_collar_1` | ✅ | from `base 2 + circles + collars.svg` |
| `arched` | ✅ | from `arched 1.svg` |
| `arched_circles` | ✅ | from `arched 2 + circles.svg` |
| `arched_collar_1` | ❌ | missing — overlay fallback OK |
| `arched_circles_collar_1` | ✅ | from `arched 2 colars + circles.svg` |
| `dog_bars` | ✅ | from `dog_bars 1.svg` |
| `dog_bars_circles` | ✅ | from `dog_bars 2 + circles-1.svg` |
| `dog_bars_collar_1` | ❌ | missing — overlay fallback OK |
| `dog_bars_circles_collar_1` | ✅ | from `dog_bars 2 + circles _ colalrs.svg` |
| `arched_dog_bars` | ✅ | from `arched_dog_bars 1.svg` |
| `arched_dog_bars_circles` | ✅ | from `arched_dog_bars 2 + circles.svg` |
| `arched_dog_bars_collar_1` | ✅ | from `arched_dog_bars 3 + colalrs.svg` |
| `arched_dog_bars_circles_collar_1` | ✅ | from `arched_dog_bars 2 + circles + collars.svg` |
| `composite` | ✅ | from `silhouettes/composite.svg (prior; not in Aug13 dump)` |

## Missing (overlay fallback OK)

- `arched_collar_1`
- `dog_bars_collar_1`

## Duplicates parked

- `_review/DUPLICATE__arched_2_colars_+_circles-1__smaller.svg` (35849 B)
- `_review/DUPLICATE__dog_bars_2_+_circles__smaller.svg` (38812 B)

## Paths

- Definitive: `docs/frontend/2d-masters/radius_sliding/definitive/`
- Figma mirror: `docs/frontend/2d-masters/figma-import-2026-08/04-gate-masters-reference/radius_sliding/definitive/`
- Docs silhouettes: `docs/frontend/2d-masters/radius_sliding/silhouettes/{slug}.svg`
- Runtime: `apps/web/public/2d-masters/radius_sliding/silhouettes/{slug}.svg`
- Raw archive: `docs/frontend/2d-masters/radius_sliding/_archive_radius_sliding_raw/`
