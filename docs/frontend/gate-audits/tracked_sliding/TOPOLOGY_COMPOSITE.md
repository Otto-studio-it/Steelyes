# Topologia — tracked sliding Composite Boards

Riferimenti: foto **03**, **05**.

## Foto 03 — Three-tier vision strip (modern)

### Meccanismo
- Tracked sliding, pannello **doppio** (2 sezioni unite visivamente)
- Binario silver in fascia pavimentazione grigia

### Layout verticale (regola a 3 fasce)

| Fascia | % approx | Contenuto |
|--------|----------|-----------|
| Top | ~40% | 4 listelli orizzontali grigio scuro **solidi** |
| Middle | ~15% | **Vision strip** — 5 barre nere sottili con gap (vedere attraverso) |
| Bottom | ~40% | 4 listelli solidi come top |

### Frame
- Telaio nero spesso
- Montante centrale verticale sul pannello scorrevole
- Pilastri bianchi; recinzione matching a destra

### Automazione / site
- Intercom su palo
- Mailbox
- Photocell basse su palo chiusura

---

## Foto 05 — Camelback composite lattice

### Meccanismo
- Tracked sliding (binario visibile)
- Estetica **2 metà** simmetriche ma **1 pannello** scorrevole

### Layout verticale (3 tier diverso)

| Fascia | Contenuto |
|--------|-----------|
| Top arched | Griglia diamante nera + finials piccoli su arco |
| Middle | Pannelli verticali effetto legno + emblem centrale |
| Bottom | Griglia diamante |

### vs foto 03
- 05 = privacy piena centro (legno) + decorative lattice
- 03 = vision strip orizzontale (modern)

---

## Confronto cliente / engine

| Campo | Cliente tracked composite | Engine | Foto |
|-------|---------------------------|--------|------|
| Width | not specified | 2500 preset | 4,5–5,5 m |
| Height | not specified | 1000 mm | 1,8–2 m |
| Manual FROM | £2200 | — | — |
| Auto FROM | £3600 | motorised default | sì |
| Victorian options | blocked on composite | compatibility | OK |

---

## Gap renderer composite sliding

| Feature | Foto 03/05 | `buildSlidingFrame` oggi |
|---------|------------|--------------------------|
| Ground track | Sì | track-line only |
| Horizontal slats | Sì (03) | boardCount vertical slices wrong orientation |
| Vision strip | Sì (03) | no |
| 3-tier layout | Sì | single panel fill |
| Camelback arch | Sì (05) | no (arched_top swing-oriented) |
| Diamond lattice | Sì (05) | no |
| Double panel join | Sì (03) | single rect |

**Nota engine:** `buildSlidingFrame` usa `boardCount` con rettangoli verticali (`sliding-board-*`) — foto 03 ha listelli **orizzontali**.

---

## Regole parametriche composite sliding

```text
style = composite_boards
gate_type = tracked_sliding
infill_layout = three_tier | camelback_lattice  # variant SKUs

three_tier = {
  top: horizontal_solid_slat,
  mid: horizontal_vision_bars,
  bottom: horizontal_solid_slat
}

camelback_lattice = {
  top: arched_diamond_lattice,
  mid: vertical_wood_panels,
  bottom: diamond_lattice
}
```

## Domande Marius

- [ ] Vision strip = standard composite sliding o upgrade?
- [ ] Foto 05 camelback = tracked o bifolding/swing hybrid?
- [ ] Prezzo composite sliding = stesso FROM Victorian (£3600 auto)?
