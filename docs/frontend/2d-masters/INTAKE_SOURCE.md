# 2D masters intake source (2026-08-05)

Canonical export folder:

`foto /double swing gates/esport per ora /`

| Pack | Source | Manual vs auto |
|------|--------|----------------|
| `double_swing` | `foto /DS` (esport `DS/` empty) | separate SVG sets |
| `single_swing` | `esport…/SS/` | separate SVG sets |
| `bifolding_double_swing` | `bifloding_double_swing_*` | separate SVG sets |
| `tracked_sliding` | `tracked_sliding_*` | shared CAD + handle overlay |
| `cantilever_sliding` | `cantiliver_sliding_*` | shared CAD + handle overlay |
| `telescopic_sliding` | `telescopis_sliding_*` | shared CAD + handle overlay |
| `radius_sliding` | `radius_sliding_*` | shared; `composite`←`base` |
| `single_bifolding` | `single_bifolding_*` | shared; `arched` from user PNG wrap (2026-08-05) |

After replacing files: `pnpm sync:2d-masters`
