# Decorative system work plan — 2026-08-12

**Status:** All 8 gate families have definitive packs ingested (double_swing, single_swing, telescopic_sliding, tracked_sliding, cantilever_sliding, bifolding_double_swing, single_bifolding, radius_sliding) — live in configurator Design. See `DEFINITIVE_MASTERS_STATUS_2026-08-13.md`.

**Figma file:** [Steelyes — Decorative System 2026-08](https://www.figma.com/design/SiMiEXobtyfuHpXOs5RDRe) (`SiMiEXobtyfuHpXOs5RDRe`)

**Manual import pack:** [`figma-import-2026-08/`](./figma-import-2026-08/)

**Live definitive (configurator):**
- `docs/frontend/2d-masters/double_swing/definitive/` → 34 SVG (manual + motorised)
- `docs/frontend/2d-masters/single_swing/definitive/` → 34 SVG (manual + motorised)
- `docs/frontend/2d-masters/telescopic_sliding/definitive/` → 10 SVG (no motorised split)
- `docs/frontend/2d-masters/tracked_sliding/definitive/` → 15 SVG (same 2D for manual + automatic)
- `docs/frontend/2d-masters/cantilever_sliding/definitive/` → 17 SVG (same 2D for manual + automatic)
- `docs/frontend/2d-masters/bifolding_double_swing/definitive/` → 31 SVG (manual + motorised; 3 slugs missing)
- `docs/frontend/2d-masters/single_bifolding/definitive/` → 32 SVG (manual + motorised; 2 slugs missing)
- `docs/frontend/2d-masters/radius_sliding/definitive/` → 15 SVG (same 2D for manual + automatic; missing arched_collar_1, dog_bars_collar_1)
- Served from `apps/web/public/2d-masters/{gate}/silhouettes/`

Design resolves baked masters via `silhouette-index.json`; missing telescopic combos fall back to tipology + overlay.

## Locked decisions (Q1–Q6)

| Q | Decision |
|---|---|
| Q1 | Circles toggle = always **upper + lower** together |
| Q2 | Collar spacing = **every 1** or **every 2** long pickets only |
| Q3 | Collar height ≈ **50%** mid-height |
| Q4 | Collar **never** on dog bars |
| Q5 | Railhead crops = **white opaque** product-only |
| Q6 | Motorised = **no** decoration differences |

Also: **CA-17** railheads = model picker only (not drawn on Design masters).

## Architecture

Keep ~55 existing gate masters. Add overlays + 61 RH photo crops. Avoid combinatorial master explosion.

## Wave status

| Wave | Scope | Status |
|------|--------|--------|
| 0 | New Figma file + page skeleton | File created; pages = **manual** (MCP rate-limited) |
| 1 | Circles overlays (straight + arched upper, combined) | **Done** — runtime + `figma-import-2026-08/01-*` |
| 2 | Collar unit + every-1 / every-2 rows | **Done** — runtime + `figma-import-2026-08/02-*` |
| 3 | Crop 61 RH photos + expand picker | **Done** — runtime + `figma-import-2026-08/03-*` |
| 4 | Review mockups in Figma (~48) | **Manual** — masters in `04-gate-masters-reference/` |
| 5 | Engine/UI wire | **Done** — `circles` Q1+arch, `picket_collars`, full RH chooser photos |

## Runtime touchpoints

- Option `circles` → `resolveCircleOverlays` (combined / combined_arched)
- Option `picket_collars` + variant `every_1` \| `every_2` → `resolveCollarOverlays`
- Design stack: `TechnicalMasterPreview` composites circle + collar overlays
- Refine: `RailheadChooserSection` (photos) + `CollarChooserSection`
- Catalog: `packages/gate-engine/src/catalog/railheads.ts` (generated from `docs/frontend/foto-intake/railheads-catalog.json`)

## Next (manual Figma — no MCP)

1. Apri pack: `docs/frontend/2d-masters/figma-import-2026-08/`
2. Per **Telescopic** pagina 08: importa anche i **12** SVG in  
   `04-gate-masters-reference/telescopic_sliding/decorative-baked/`  
   (cerchi ± collar già baked — un file = un disegno leggero)
3. Segui `CHECKLIST_IMPORT.md` per library circles/collar/RH
4. Compose review: preferire masters baked; **no** RH sul Design (CA-17)

### Matrice baked (Victorian only, no composite)

Per tipologica `base` / `arched` / `dog_bars` / `arched_dog_bars`:
- `*_circles`
- `*_circles_collar_1`
- `*_circles_collar_2`

Oggi generato per **telescopic_sliding** (runtime + Figma pack). Altri gate types: stesso schema on request.
