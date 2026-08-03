# Radius sliding — 2D pack

**Status:** `ready`  
**Manifest:** [`manifest.json`](./manifest.json)  
**Photo source:** `foto /radius slidings gates`  
**Export:** `packages/gate-engine/tests/export-figma-radius-sliding-variants.test.ts`

## Photo locks

| Item | Lock |
|------|------|
| Topology | **Articulated train** — hinged panels end-to-end on **one** track |
| Travel path | Always **curved** (~90° park beside wall) — CA-12 |
| Not this product | Telescopic overlap (`Screenshot … 20.13.46` is a misfile) |
| Panel count (schematic) | 4 / 5 (≥2200 mm) / 6 (≥3000 mm) |
| Top profile | Straight **or** curved; when arched → **every** panel |
| Hardware cues | Receiver + corner guide + motor; plan path cue outside posts |

## Silhouettes

| Slug | File | Notes |
|------|------|-------|
| `base` | `silhouettes/base.svg` | Victorian articulated train |
| `arched` | `silhouettes/arched.svg` | Arch on **all** panels |
| `dog_bars` | `silhouettes/dog_bars.svg` | Dog rail + bars |
| `arched_dog_bars` | `silhouettes/arched_dog_bars.svg` | Combined |
| `composite` | `silhouettes/composite.svg` | Composite per panel |

## Figma

Starter plan page limit — import `silhouettes/*.svg` when a page slot is free. Local pack is the source of truth.
