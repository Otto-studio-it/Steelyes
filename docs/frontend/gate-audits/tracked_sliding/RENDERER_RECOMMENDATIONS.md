# Raccomandazioni renderer — tracked sliding

## P0 — Victorian tracked (foto 01, 02)

- [ ] **Track schematic** — binario a terra più leggibile (doppia linea + markers roller)
- [ ] **Panel ≠ rettangolo pieno** — vertical pickets dentro frame
- [ ] **Mid-rail** a ~33% quando `middle_bar` o sempre su tracked Victorian?
- [ ] **Dual-density lower zone** sotto mid-rail
- [ ] **Finial variants** — almeno ball vs spear (catalog tokens)
- [ ] Posizione panel: chiuso vs stack (hint direzione scorrimento)

## P1 — Victorian arched sliding (foto 06)

- [ ] `arched_top` su `buildSlidingFrame` — arco + ring bands
- [ ] Non riusare path swing verbatim — larghezza pannello ≠ vano

## P2 — Automazione (foto 04)

- [ ] Icona schematic motore + rack quando `motorised: true` (optional layer)
- [ ] Photocell su palo (site layer, non gate mesh)

## P3 — Composite tracked (foto 03, 05)

- [ ] **Horizontal slats** non vertical boards in sliding composite
- [ ] **Three-tier** param: top solid / mid vision / bottom solid
- [ ] Variant camelback lattice (05) — path separato o style sub-variant
- [ ] Doppio pannello giunto (03) — vertical seam line

## P4 — 3D mesh

- [ ] Track + panel + optional infill bars (non single box)
- [ ] `tracked_sliding` **senza** counterweight tail (già OK)
- [ ] Wheel gap sotto bottom rail

## P5 — Product / UX

- [ ] Copy: “Tracked sliding — runs on ground track”
- [ ] Confronto side-by-side tracked vs cantilever in gate setup
- [ ] Preset 2500×1000 motorised Victorian per demo

## File da toccare

- `packages/gate-engine/src/rendering.ts` — `buildSlidingFrame`
- `packages/gate-engine/src/mesh/index.ts` — `buildSlidingMeshBoxes`
- `packages/gate-engine/tests/rendering.test.ts`
- `packages/gate-engine/tests/mesh.test.ts`

## Non in scope v1

- Animazione slide open/close
- Induction loop in pavimentazione
- Intercom / mailbox (site props)
