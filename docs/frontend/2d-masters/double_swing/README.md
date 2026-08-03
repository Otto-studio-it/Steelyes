# Double swing — 2D pack

**Status:** `ready`  
**Manifest:** [`manifest.json`](./manifest.json)  
**Figma:** [02 — Double Swing Variants](https://www.figma.com/design/HW4O7VfFiRKKyBjQCk8y9Y)

## Silhouettes (`silhouettes/`)

| Slug | File | Maps to |
|------|------|---------|
| `base` | `base.svg` | Victorian default |
| `arched` | `arched.svg` | `arched_top` |
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

## Folders

| Path | Content |
|------|---------|
| `silhouettes/` | Preloaded CAD SVGs |
| `references/` | Linea guida + support photos |
| `notes/` | Type-specific notes |
| `figma-base.svg` | Alias of `silhouettes/base.svg` |

## Regenerate

```bash
pnpm --filter @steelyes/gate-engine exec vitest run tests/export-figma-double-swing-variants.test.ts
```
