---
gate_type: cantilever_sliding
status: draft
last_updated: 2026-05-20
source_photos: 1
primary_style: traditional_victorian
steelyes_branded_photo: true
---

# Cantilever sliding — gate photo audit

Audit per `cantilever_sliding` con **foto Steelyes** + **ricerca dimensioni web** + confronto cliente/engine.

## Contenuto cartella

| File | Scopo |
|------|--------|
| [PHOTO_CATALOG.md](./PHOTO_CATALOG.md) | Foto installazione Steelyes |
| [TOPOLOGY.md](./TOPOLOGY.md) | Anatomia cantilever |
| [DIMENSIONS_RESEARCH.md](./DIMENSIONS_RESEARCH.md) | **Dimensioni da web + foto + engine + cliente** |
| [COMPARISON_CLIENT_AND_ENGINE.md](./COMPARISON_CLIENT_AND_ENGINE.md) | Diff completo |
| [RENDERER_RECOMMENDATIONS.md](./RENDERER_RECOMMENDATIONS.md) | Priorità 2D/3D |
| [observed.json](./observed.json) | Dati strutturati |
| [manifest.yaml](./manifest.yaml) | Input tool |

## Sintesi — cos’è un cantilever

| | Cantilever | Tracked sliding |
|--|------------|---------------|
| Binario a terra attraverso passo | **No** | Sì |
| Coda counterbalance | **Sì** (~28–50% opening) | No |
| Pannello sospeso | Sì (rollers/carriage) | Ruote su track |
| Run-back totale | ~**130–150%** clear opening | ~**100%** opening |

## Foto Steelyes (01)

- Cancello **Victorian** nero, finials spear, mid-rail, zona bassa densa
- **Nessun track** attraversante il passo carraio
- **Coda counterbalance** a sinistra + brace diagonale
- **Cremagliera** + motore grigio (automated)
- Van **SteelYes Ltd** (steelyes.co.uk) — installazione brand

## Dimensioni — quadro riassuntivo

| Fonte | Clear opening | Altezza | Tail / counterbalance | Totale gate |
|-------|---------------|---------|----------------------|-------------|
| **Cliente FROM band** | 2500–2600 mm | 900–1000 mm | non specificato | — |
| **Engine preset** | 2500 mm | 1000 mm | 28% → **700 mm** (default) | ~3200 mm* |
| **Engine regola 4 m** | 4000 mm | — | **33% → 1333 mm** | ~5333 mm* |
| **Foto 01 (stima van)** | **4000–5000 mm** | **1800–2100 mm** | **1500–2000 mm** (~37–50%) | ~5500–7000 mm |
| **Web UK rule of thumb** | custom | 1.8–2.4 m std | 30–50% opening | **1.3–1.5×** opening |
| **Steelyes.co.uk** | *survey* | *survey* | *survey* | — |

\*Totale = opening + tail (interpretazione `widthMm` = clear opening — da confermare con Marius)

## Gap principali

1. Renderer disegna ancora `track-line` anche su cantilever — **errato**
2. Tail ratio engine (28% default) **<** molti standard web (33–50%)
3. Foto Steelyes ~4–5 m vs catalogo FROM 2,5 m
4. Altezza foto ~2 m vs catalogo 900–1000 mm
5. Brace diagonale + carriage post non modellati

## Prossimi passi

1. Marius: confermare `widthMm` = clear opening o lunghezza totale gate
2. Confermare tail ratio produzione Steelyes (28% vs 33% vs 50%)
3. Fix renderer: no ground track su cantilever; tail + carriage visibili
4. Chiedere disegno tecnico Steelyes per installazione foto 01
