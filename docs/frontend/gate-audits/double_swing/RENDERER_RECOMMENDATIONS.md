# Raccomandazioni renderer — double swing Victorian

Priorità per avvicinare preview 2D/3D alle foto 02–04.

## P0 — Impatto visivo immediato (2D)

- [ ] **Center meeting stile** — piastra centrale + linea incontro (non solo dash)
- [ ] **Arched top fedele** — curva swan-neck con finials che seguono l’arco
- [ ] **4 horizontal rails** — top, upper-mid, lower-mid, bottom (non 2 zone generiche)
- [ ] **Finials su picket** — quando `top_railheads` enabled, posizionare su ogni barra top (o qty reale da Marius)
- [ ] **Zona bassa distinta** — kick plate con densità 2× e altezza ~25–30% (non solo “more lower bars”)

## P1 — Decorazioni (2D)

- [ ] **Circle band** — fascia anelli tra rail 1–2 e 3–4 (nuovo layer o mappa `bushes`)
- [ ] **Spear row** — punte sopra lower-mid rail
- [ ] **Basket twist** — marker su ogni N° picket (mappa `spirals` o nuovo token)
- [ ] **Tube profile** — pali/telai a doppia linea (spessore vs infill)

## P2 — Geometry recipe (condiviso 2D/3D)

- [ ] Estrarre `buildSwingFrame` → `geometry/swing-recipe.ts`
- [ ] Parametri: `rail_count`, `zone_heights[]`, `picket_spacing`, `kick_density_multiplier`
- [ ] Allineare formule `geometry.ts` ai conteggi reali post-Marius

## P3 — 3D mesh

- [ ] Sostituire box con `ExtrudeGeometry` per telai
- [ ] `CylinderGeometry` per pickets
- [ ] Foglio SX + mirror DX
- [ ] Material PBR da `finishes.ts`

## P4 — Configurator UX

- [ ] Preset “Victorian arched showcase” con opzioni foto attive (arched_top, railheads, dog_bars)
- [ ] Label schematic: “Technical drawing — proportions indicative”

## Cosa NON fare subito

- Fotorealismo texture mattoni/pavimento
- Catalogo completo 150 varianti railhead
- Modificare prezzi FROM senza conferma Marius

## Riferimento implementazione

File attuali:

- `packages/gate-engine/src/rendering.ts` — `buildSwingFrame`
- `packages/gate-engine/src/rules/geometry.ts` — count formulas
- `packages/gate-engine/src/mesh/index.ts` — `buildSwingMeshBoxes`

Test da estendere:

- `packages/gate-engine/tests/rendering.test.ts`
- `packages/gate-engine/tests/mesh.test.ts`
