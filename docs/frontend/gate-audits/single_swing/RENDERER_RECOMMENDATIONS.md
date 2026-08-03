# Raccomandazioni renderer — single swing

## P0 — Victorian single leaf (foto 02)

- [ ] **1 foglio chiaro** — rimuovere linea centro; enfatizzare hinge side + free edge
- [ ] **3 horizontal rails** — top, middle (~33%), bottom
- [ ] **Dual-density infill** — raddoppio barre sotto middle rail
- [ ] **Staggered finials** — tier grande (top) + tier piccolo (mid) — nuova regola o estensione railheads
- [ ] **Middle bar** — allineare a middle rail visiva quando opzione attiva

## P1 — Composite single (foto 04)

- [ ] **Vertical bays** — 1/3/5 campi parametrici o fisso 3
- [ ] **Horizontal slat infill** — linee orizzontali, non fill piatto
- [ ] **Mullions** — montanti interni tra campi
- [ ] **Full privacy** — zero gap tra listelli

## P2 — Condiviso con double swing

- [ ] Tube profile doppia linea su frame
- [ ] Dog bar zone height ratio esplicito
- [ ] Geometry recipe con `leaf_count=1` branch

## P3 — UX / product

- [ ] Copy: distinguere **single swing** vs **single-panel sliding** (foto 01/03)
- [ ] Preset showcase: `single_swing` 900×1000 Victorian + composite
- [ ] Width slider fino a 6000 mm engine max — prezzo scala, preview scala bar count

## File da toccare

- `packages/gate-engine/src/rendering.ts` — `buildSwingFrame` quando `leafCount === 1`
- `packages/gate-engine/src/mesh/index.ts` — un solo leaf box set
- `packages/gate-engine/src/rules/geometry.ts` — validate mid-tier finials se aggiunti

## Non in scope v1

- Testo custom “BEECH WOOD” su composite
- Gear rack / motor su preview swing
