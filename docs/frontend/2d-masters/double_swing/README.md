# Double swing — 2D pack

**Status:** `ready`  
**Manifest:** [`manifest.json`](./manifest.json)  
**Figma:** [02 — Double Swing Variants](https://www.figma.com/design/HW4O7VfFiRKKyBjQCk8y9Y)  
**Intake:** `foto /DS` (2026-08-05) — manual + automatic exports

## Silhouettes (`silhouettes/`)

| Slug | File | When |
|------|------|------|
| `base` | `base.svg` | Victorian default, **manual** |
| `base_motorised` | `base_motorised.svg` | Victorian default, **motorised** |
| `arched` / `arched_motorised` | … | `arched_top` |
| `dog_bars` / `dog_bars_motorised` | … | `dog_bars` |
| `arched_dog_bars` / `arched_dog_bars_motorised` | … | both options |
| `composite` / `composite_motorised` | … | `composite_boards` |

Handles are **never** baked (CA-01 overlay). Motor/operator kit is **intentionally not shown** on Design drawings — motorised masters differ by omitting the handle.

## Lookup

```txt
composite_boards + motorised → composite_motorised
composite_boards             → composite
arched + dog_bars + motorised → arched_dog_bars_motorised
arched + dog_bars            → arched_dog_bars
arched + motorised           → arched_motorised
arched                       → arched
dog_bars + motorised         → dog_bars_motorised
dog_bars                     → dog_bars
motorised                    → base_motorised
else                         → base
```

## Folders

| Path | Content |
|------|---------|
| `silhouettes/` | Preloaded CAD SVGs |
| `references/` | Linea guida + support photos |
| `notes/` | Type-specific notes |
| `figma-base.svg` | Alias of `silhouettes/base.svg` |

## Regenerate

Prefer hand-authored intake over export tests when updating from `foto /DS`.
After file drops: edit `manifest.json` → `pnpm sync:2d-masters`.
