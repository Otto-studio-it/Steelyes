# Confronto — foto vs cliente vs web vs engine (cantilever)

## A. Prezzi e bande cliente

| | Victorian | Engine |
|--|-----------|--------|
| Manual FROM | **£2900** | indicative |
| Auto FROM | **£4200** | motorised default ✅ |
| Width band | 2500 / 2600 mm | 2500 mm |
| Height band | 900 / 1000 mm | 1000 mm |

Cantilever **+£700 manual / +£600 auto** vs tracked sliding (stessa width band) — premium meccanismo.

---

## B. Dimensioni — matrice completa

| Fonte | Opening W | Height | Tail | Totale |
|-------|-----------|--------|------|--------|
| Cliente FROM | 2500–2600 | 900–1000 | — | — |
| Engine @ 2500 | 2500 | 1000 | 700 (28%) | ~3200 |
| Engine @ 4000 | 4000 | 1000 | 1333 (33%) | ~5333 |
| Web UK ~1.5× | — | 1800–2400 std | 33–50% | 130–150% opening |
| **Foto Steelyes 01** | **4000–5000** | **1800–2100** | **1500–2000** | **5500–7000** |
| steelyes.co.uk | survey | survey | survey | survey |

Vedi [DIMENSIONS_RESEARCH.md](./DIMENSIONS_RESEARCH.md) per fonti URL e calcoli.

---

## C. Tail ratio — engine vs industry vs foto

| Opening | Engine 28% | Engine 33% @4m | Web 40% | Web 50% | Foto ~45% @4.5m |
|---------|------------|----------------|---------|---------|-----------------|
| 2500 | 700 | — | 1000 | 1250 | — |
| 4000 | 1120 | **1333** | 1600 | 2000 | ~1800 |

**Rischio:** tail 28% default **sottostima** tail reali (foto e molti fabbricanti 33–50%).

---

## D. Renderer / mesh vs foto

| Feature | Foto 01 | Engine | Status |
|---------|---------|--------|--------|
| Cantilever tail | ✅ | `cantilever-tail` | MATCH |
| No ground track | ✅ | track-line drawn | **CONFLICT** |
| Carriage + brace | ✅ | no | GAP |
| Gear rack + motor | ✅ | no | GAP |
| Victorian infill | ✅ | sliding bars partial | PARZIALE |
| 3D counterweight role | ✅ | box tail | PARZIALE |

---

## E. vs tracked_sliding (stesso cliente width band)

| | tracked_sliding | cantilever_sliding |
|--|-----------------|---------------------|
| Width FROM | 2500–2600 | 2500–2600 |
| Auto FROM | £3600 | **£4200** |
| Ground track | yes | **no** |
| Tail | no | **yes** |
| Run-back | ~1× W | ~**1.3–1.5×** W |

---

## F. Domande Marius

1. `widthMm` = clear opening o lunghezza totale?
2. Tail ratio produzione Steelyes per 2,5 m vs 4 m?
3. Foto van Steelyes — misure as-built?
4. Altezza catalogo 900/1000 include finials?
5. Rimuovere track-line dal renderer cantilever?

---

## G. Azioni configurator

| Priorità | Azione |
|----------|--------|
| P0 | Non disegnare ground track su `cantilever_sliding` |
| P0 | Validare tail ratio con Marius (28% vs 33–50%) |
| P1 | Label run-back in summary quando cantilever |
| P1 | Carriage + brace schematic |
| P2 | Dimensioni showcase 4000 mm case study Steelyes |
