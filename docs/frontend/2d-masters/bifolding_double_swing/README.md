# Bifolding double swing — 2D pack

**Status:** `ready`  
**Manifest:** [`manifest.json`](./manifest.json)

## How many silhouettes?

**5** — same option families as double swing, with bifold topology:

| # | Slug | Maps to |
|---|------|---------|
| 1 | `base` | Victorian + 4 panels (2×2) |
| 2 | `arched` | `arched_top` |
| 3 | `dog_bars` | `dog_bars` |
| 4 | `arched_dog_bars` | both |
| 5 | `composite` | `composite_boards` |

## Topology lock (CA-09/10)

```txt
[stack] [post] [panel|panel] [panel|panel] [post] [stack]
              └── leaf L ──┘  └── leaf R ──┘
```

- 2 panels per leaf, 50/50  
- Fold stile mid-leaf  
- Leaves fill clear opening  
- Stack pack outside posts  

## Regenerate

```bash
pnpm --filter @steelyes/gate-engine exec vitest run tests/export-figma-bifolding-double-swing-variants.test.ts
```
