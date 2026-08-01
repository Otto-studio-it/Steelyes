# Single bifolding — 2D pack

**Status:** `ready`  
**Photo source:** `foto /single bifloding gates`  
**Manifest:** [`manifest.json`](./manifest.json)

## From the photos

| Asset | Lock |
|-------|------|
| `Linea guida single bifloding gates.jpeg` | **Authoritative:** 2 red panels (one leaf) + cyan hinge post |
| Wiki screenshots | Style/hardware context only — not panel-count overrides |

## Silhouettes (5)

| # | Slug | Maps to |
|---|------|---------|
| 1 | `base` | Victorian 2-panel bifold |
| 2 | `arched` | `arched_top` |
| 3 | `dog_bars` | `dog_bars` |
| 4 | `arched_dog_bars` | both |
| 5 | `composite` | `composite_boards` |

## Topology

```txt
[stack] [hinge post] [panel | panel] [receiver post]
                        └── 1 leaf ──┘
```

## Regenerate

```bash
pnpm --filter @steelyes/gate-engine exec vitest run tests/export-figma-single-bifolding-variants.test.ts
```
