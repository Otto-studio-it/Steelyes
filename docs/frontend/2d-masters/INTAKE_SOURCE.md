# 2D masters intake source (2026-08-05)

Canonical export folder (exact client filenames):

`foto /double swing gates/esport per ora /`

Double swing set lives beside it (esport `DS/` is empty):

`foto /DS`

## Handle / motor policy

| Filename cue | Meaning in Design |
|---|---|
| `manual` / `manuale` | Handle is **already drawn** in the SVG |
| `automatic` / `autoamatic` / `*_motorised` | Dedicated motorised master — **no handle** |
| No manual/automatic in the name | One shared CAD — design **does not place** a handle (manual or motorised) |

**Never** composite a UI handle overlay on Design masters.

## Packs

| Pack | Source | Manual vs auto |
|------|--------|----------------|
| `double_swing` | `foto /DS` | separate SVG sets |
| `single_swing` | `esport…/SS/` | separate SVG sets |
| `bifolding_double_swing` | `bifloding_double_swing_*` | separate SVG sets |
| `tracked_sliding` | `tracked_sliding_*` | shared CAD (no handle) |
| `cantilever_sliding` | `cantiliver_sliding_*` | shared CAD (no handle) |
| `telescopic_sliding` | `telescopis_sliding_*` | shared CAD (no handle) |
| `radius_sliding` | `radius_sliding_*` | shared; `composite`←`base` |
| `single_bifolding` | `single_bifolding_*` | shared CAD (no handle) |

After replacing files:

```bash
python3 scripts/install-intake-2d-masters.py
pnpm sync:2d-masters
```
