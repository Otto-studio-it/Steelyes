# Raccomandazioni — cantilever sliding

## P0 — Correzioni meccanismo

- [ ] **Rimuovere `track-line`** da `buildSlidingFrame` quando `cantilever_sliding`
- [ ] Label: "Counterbalance tail — no ground track across driveway"
- [ ] Validare **tail ratio** con Marius (28% vs 33% @4m vs 40–50% industry)

## P1 — Fidelity foto Steelyes

- [ ] **Carriage post** + roller schematic a sinistra
- [ ] **Diagonal brace** su tail
- [ ] **Gear rack** hint su bottom rail se motorised
- [ ] Mid-rail + dual-density pickets (come tracked Victorian)

## P2 — Dimensioni prodotto

- [ ] Summary field: **run-back required** = opening × (1 + tail_ratio)
- [ ] Documentare in UI che FROM 2500×1000 è band minimo, non max install
- [ ] Case study preset 4000×1900 con tail 33% per match foto brand

## P3 — 3D mesh

- [ ] Tail box separato da opening panel (già parziale)
- [ ] No `sliding-track` ground box — o role diverso `carriage_rail`
- [ ] Wheel clearance gap sotto panel

## File

- `packages/gate-engine/src/rendering.ts` — `buildSlidingFrame` cantilever branch
- `packages/gate-engine/src/mesh/index.ts` — tail vs track
- `packages/gate-engine/tests/rendering.test.ts` — assert NO track-line for cantilever
