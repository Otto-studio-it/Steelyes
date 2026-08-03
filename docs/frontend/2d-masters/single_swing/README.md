# Single swing — 2D pack

**Status:** `ready`  
**Manifest:** [`manifest.json`](./manifest.json)  
**Figma:** [03 — Single Swing Variants](https://www.figma.com/design/HW4O7VfFiRKKyBjQCk8y9Y)

Same **5 silhouette families** as double swing, drawn as **one hinged leaf** (hinges left, latch/handle right when manual).

## Silhouettes (`silhouettes/`)

| Slug | File | Maps to |
|------|------|---------|
| `base` | `base.svg` | Victorian default |
| `arched` | `arched.svg` | `arched_top` (centered arch) |
| `dog_bars` | `dog_bars.svg` | `dog_bars` |
| `arched_dog_bars` | `arched_dog_bars.svg` | both |
| `composite` | `composite.svg` | `composite_boards` |

## Lookup

```txt
composite_boards            → composite
arched_top + dog_bars       → arched_dog_bars
arched_top                  → arched
dog_bars                    → dog_bars
else                        → base
```

## Notes

- Linea guida in `references/` is **rejected for topology** (mis-tagged sliding) — use `support-install.jpg` / `photo-A.jpg`.
- See [`notes/README.md`](./notes/README.md).

## Regenerate

```bash
pnpm --filter @steelyes/gate-engine exec vitest run tests/export-figma-single-swing-variants.test.ts
```
