# 2D masters catalog

Implementation entry points:

| File | Use |
|------|-----|
| [`catalog.json`](./catalog.json) | Machine index of all packs |
| [`PACK_STRUCTURE.md`](./PACK_STRUCTURE.md) | Folder contract |
| `{gateType}/manifest.json` | Silhouette lookup for one gate |

## Status

| Gate type | Status | Silhouettes |
|-----------|--------|-------------|
| [`double_swing`](./double_swing/) | **ready** | 5 |
| [`single_swing`](./single_swing/) | **ready** | 5 |
| [`tracked_sliding`](./tracked_sliding/) | **ready** | 5 |
| [`cantilever_sliding`](./cantilever_sliding/) | **ready** | 5 |
| [`bifolding_double_swing`](./bifolding_double_swing/) | **ready** | 5 |
| [`single_bifolding`](./single_bifolding/) | **ready** | 5 |
| [`telescopic_sliding`](./telescopic_sliding/) | **ready** | 5 |
| [`radius_sliding`](./radius_sliding/) | **ready** | 5 |
| [`railheads`](./railheads/) | **ready** (overlays) | 6 |

`ready` = full silhouette catalog + Figma page.  
`base_only` = topology CAD base present; variant pack still to do (same process as double swing).  
`railheads` = overlay components (not a gate type) — import as Figma components on top of gate masters.

## Figma

[Steelyes 2D Gate Masters](https://www.figma.com/design/HW4O7VfFiRKKyBjQCk8y9Y)

**Railheads — import now:** `docs/frontend/2d-masters/railheads/silhouettes/*.svg` (RH32, RH7, RH7NP, RH6WB, RH14, RH100).

## Runtime

- Phase 0 contract: [`PHASE0_RUNTIME.md`](./PHASE0_RUNTIME.md)  
- Phase 1 Technical UI: [`PHASE1_TECHNICAL_UI.md`](./PHASE1_TECHNICAL_UI.md)  
- Sync: `pnpm sync:2d-masters` → `apps/web/public/2d-masters/`  
- Configurator **Technical** tab uses preloaded masters + mm strip (never invented CAD).

## Dimension policy

Client mm appear **only under** the 2D image. Silhouette SVGs stay clean CAD paper.

## Colour convention (*linea guida* photos)

| Colour | Meaning |
|--------|---------|
| **Red** | Moving gate |
| **Cyan** | Fixed technical (posts, track, motor) |

## Related

- [`ARCHITECT_GAP_LOCK.md`](./ARCHITECT_GAP_LOCK.md)
- [`TOPOLOGY.md`](./TOPOLOGY.md)
- Engine: `packages/gate-engine/src/rendering/cad-base-elevation.ts`
