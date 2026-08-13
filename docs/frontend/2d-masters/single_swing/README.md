# Single swing — 2D pack

**Status:** `ready`  
**Manifest:** [`manifest.json`](./manifest.json)  
**Figma:** [03 — Single Swing Variants](https://www.figma.com/design/HW4O7VfFiRKKyBjQCk8y9Y)  
**Intake:** `foto /SS` (2026-08-05) — full manual + automatic set

Same **5 silhouette families** as double swing (± motorised), drawn as **one hinged leaf** (hinges left; latch/handle overlay on the right when manual).

## Silhouettes (`silhouettes/`)

| Slug | File | When |
|------|------|------|
| `base` / `base_motorised` | … | Victorian default |
| `arched` / `arched_motorised` | … | `arched_top` |
| `dog_bars` / `dog_bars_motorised` | … | `dog_bars` |
| `arched_dog_bars` / `arched_dog_bars_motorised` | … | both |
| `composite` / `composite_motorised` | … | `composite_boards` |

Handles are **never** baked (CA-01 overlay). Motor/operator kit is **intentionally not shown**.

## Lookup

```txt
composite_boards + motorised → composite_motorised
composite_boards             → composite
arched + dog_bars + motorised → arched_dog_bars_motorised
…
motorised                    → base_motorised
else                         → base
```

## Notes

- Linea guida in `references/` is **rejected for topology** (mis-tagged sliding) — use `support-install.jpg` / `photo-A.jpg`.
- See [`notes/README.md`](./notes/README.md).

## Sync

After file drops: edit `manifest.json` → `pnpm sync:2d-masters`.
