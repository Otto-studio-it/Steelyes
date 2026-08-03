# Tracked sliding — 2D pack

**Status:** `ready`  
**Manifest:** [`manifest.json`](./manifest.json)  
**Figma:** re-import SVGs from `silhouettes/` (MCP may be rate-limited)

## Silhouettes (5)

| # | Slug | Leaf | Always shows |
|---|------|------|--------------|
| 1 | `base` | Victorian pickets | Full opening + ground track + outside runback |
| 2 | `arched` | + `arched_top` | Same |
| 3 | `dog_bars` | + `dog_bars` | Same |
| 4 | `arched_dog_bars` | both | Same |
| 5 | `composite` | 3-bay horizontal | Same (linea guida default look) |

## Layout lock

```txt
[post] [====== LEAF fills clear opening ======] [post] [runback outside]
                 ground track underneath
```

## Regenerate

```bash
pnpm --filter @steelyes/gate-engine exec vitest run tests/export-figma-tracked-sliding-variants.test.ts
```
