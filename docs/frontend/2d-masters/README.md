# 2D masters — photo-guided CAD elevations

**Start here for implementation:** [`CATALOG.md`](./CATALOG.md) · [`catalog.json`](./catalog.json) · [`PACK_STRUCTURE.md`](./PACK_STRUCTURE.md)

Runtime Design preview, mismatch inventory, and the plan to stop using this matrix as the only customer renderer: [`../2d-CONFIGURATOR_FIDELITY_AND_MIGRATION_PLAN.md`](../2d-CONFIGURATOR_FIDELITY_AND_MIGRATION_PLAN.md).

Source photos live in `/Volumes/SSDRubb/Steelyes/foto ` (trailing space).  
Canonical packs live here — **one folder per gate type**.

## Pack layout (every gate)

## Pack layout (every gate)

```txt
{gateType}/
  README.md
  manifest.json          ← lookup for configurator
  silhouettes/*.svg      ← preloaded CAD (no client mm)
  references/            ← linea guida + photos
  notes/
  figma-base.svg         ← alias of silhouettes/base.svg
```

## Status

Definitive packs are ingested (10–34 SVGs per gate, not five). See [`DEFINITIVE_MASTERS_STATUS_2026-08-13.md`](./DEFINITIVE_MASTERS_STATUS_2026-08-13.md). The table below is the original Phase 0 snapshot and is **not** the runtime matrix.

| Gate type | Status |
|-----------|--------|
| `double_swing` | **ready** (5 silhouettes) |
| `single_swing` | **ready** (5 silhouettes) |
| `tracked_sliding` | **ready** (5 silhouettes) |
| `cantilever_sliding` | **ready** (5 silhouettes) |
| `bifolding_double_swing` | **ready** (5 silhouettes) |
| `single_bifolding` | **ready** (5 silhouettes) |
| others | `base_only` (topology SVG only) |

## Figma

[Steelyes 2D Gate Masters](https://www.figma.com/design/HW4O7VfFiRKKyBjQCk8y9Y)

| Page | Content |
|------|---------|
| `01 — CAD Elevation Bases` | One CAD base per gate type (+ tracked frames uploaded — layout pending) |
| `02 — Double Swing Variants` | Five double-swing silhouettes |
| `03 — Single Swing Variants` | Five single-swing silhouettes |

**Note:** Figma Starter = max 3 pages + MCP rate limits. Tracked SVGs are in-file (`12:*`); label/grid pass when MCP resets.

## Dimension policy

Client mm appear only in the UI strip under the image. Silhouette SVGs stay clean.

## Colour convention (*linea guida*)

| Colour | Meaning |
|--------|---------|
| **Red** | Moving gate |
| **Cyan** | Fixed technical |

## Style target

`_style/cad-elevation-no-dims-target.png`

## Related

- [`ARCHITECT_GAP_LOCK.md`](./ARCHITECT_GAP_LOCK.md)
- [`TOPOLOGY.md`](./TOPOLOGY.md)
- Engine: `packages/gate-engine/src/rendering/cad-base-elevation.ts`

## Regenerate

```bash
pnpm --filter @steelyes/gate-engine exec vitest run tests/export-figma-bases.test.ts
pnpm --filter @steelyes/gate-engine exec vitest run tests/export-figma-double-swing-variants.test.ts
pnpm --filter @steelyes/gate-engine exec vitest run tests/export-figma-single-swing-variants.test.ts
pnpm --filter @steelyes/gate-engine exec vitest run tests/export-figma-tracked-sliding-variants.test.ts
pnpm --filter @steelyes/gate-engine exec vitest run tests/export-figma-cantilever-sliding-variants.test.ts
pnpm --filter @steelyes/gate-engine exec vitest run tests/export-figma-bifolding-double-swing-variants.test.ts
pnpm --filter @steelyes/gate-engine exec vitest run tests/export-figma-single-bifolding-variants.test.ts
```
