# Cantilever sliding — 2D pack

**Status:** `ready`  
**Manifest:** [`manifest.json`](./manifest.json) — read this before wiring the configurator  
**Figma:** SVGs ready locally; MCP Starter rate-limited — import manually if needed

## How many silhouettes?

**5** (same option families as tracked, but topology includes **counterbalance tail**):

| # | Slug | Leaf language | Always shows |
|---|------|---------------|--------------|
| 1 | `base` | Victorian pickets | Triangular tail + dashed opening/tail divider |
| 2 | `arched` | + `arched_top` | Same |
| 3 | `dog_bars` | + `dog_bars` | Same |
| 4 | `arched_dog_bars` | both | Same |
| 5 | `composite` | 3-bay boards | Same |

## Critical — do not mislead (CA-05 + photos)

| Concept | Meaning |
|---------|---------|
| Customer `widthMm` | **Clear opening between posts only** |
| Leaf on CAD | **Fills 100%** of that opening |
| Triangle | **After** the parking/guide post — support beyond the gate, not inside the opening |
| Min tail | `round(opening / 3)` |
| Min parking run | `opening + tail` (example 4000 → 1333 → **5333**) |

Live mm belong in the UI strip under the image — never as rulers on the drawing.

## Import into Figma (manual while MCP limited)

Folder: `silhouettes/`

| File | Frame name |
|------|------------|
| `base.svg` | `CL / base` |
| `arched.svg` | `CL / arched` |
| `dog_bars.svg` | `CL / dog_bars` |
| `arched_dog_bars.svg` | `CL / arched_dog_bars` |
| `composite.svg` | `CL / composite` |

## Regenerate

```bash
pnpm --filter @steelyes/gate-engine exec vitest run tests/export-figma-cantilever-sliding-variants.test.ts
```
