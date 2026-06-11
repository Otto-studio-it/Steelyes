---
gate_type: double_swing
status: draft
last_updated: 2026-05-20
source_photos: 4
primary_style: traditional_victorian
---

# Double swing — gate photo audit

Audit visivo delle 4 foto fornite, confrontato con:

- `docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md` (dati cliente / prezzi FROM)
- `packages/gate-engine` (preset, opzioni, formule geometry, renderer)

## Contenuto cartella

| File | Scopo |
|------|--------|
| [PHOTO_CATALOG.md](./PHOTO_CATALOG.md) | Indice foto e classificazione |
| [TOPOLOGY_VICTORIAN.md](./TOPOLOGY_VICTORIAN.md) | Anatomia cancello Victorian (foto 02–04) |
| [TOPOLOGY_COMPOSITE_VARIANT.md](./TOPOLOGY_COMPOSITE_VARIANT.md) | Variante composite + track (foto 01) |
| [COMPARISON_CLIENT_AND_ENGINE.md](./COMPARISON_CLIENT_AND_ENGINE.md) | Diff foto vs cliente vs configurator |
| [RENDERER_RECOMMENDATIONS.md](./RENDERER_RECOMMENDATIONS.md) | Cosa cambiare in 2D/3D |
| [observed.json](./observed.json) | Dati strutturati (Victorian, riferimento primario) |
| [manifest.yaml](./manifest.yaml) | Input per `tools/gate-photo-audit` |
| `photos/` | Copie foto reference |

## Sintesi rapida

### Due famiglie nelle 4 foto

1. **Victorian arched double swing** (foto 02, 03, 04) — **riferimento primario** per `double_swing` + `traditional_victorian`
2. **Composite camelback su binario** (foto 01) — stile `composite_boards`, meccanismo probabile **sliding** (track a terra visibile); non è il caso base double swing Victorian

### Match con dati cliente

| Campo | Cliente (reference) | Engine preset | Foto Victorian (stima visiva) | Esito |
|-------|---------------------|---------------|-------------------------------|-------|
| Tipo | Double swing | `double_swing` | Double swing 2 ante | MATCH |
| Stile | Traditional Victorian | `traditional_victorian` | Barre + decorazioni | MATCH |
| Larghezza | **1800 / 1900 mm** | **1800 mm** | ~3000–4000 mm (driveway intero) | **REVIEW** — foto più larghe del catalogo |
| Altezza | **900 / 1000 mm** | **1000 mm** | ~1500–2000 mm al centro arco | **REVIEW** — foto più alte del catalogo |
| Arco top | Opzione `arched_top` (+£850) | Opzione supportata | Sempre presente nelle foto 02–04 | MATCH (se opzione attiva) |
| Prezzo FROM manual | £1800 | indicative pricing | n/a | dati cliente OK |

### Gap principali configurator vs realtà foto

1. Renderer 2D: barre uniformi, niente fasce decorative (anelli, spear row, basket twist)
2. Renderer 2D: niente chiavistello / meeting stile centrale
3. Renderer 2D: arco disegnato ma non con finials per picket
4. Opzioni engine: `bushes` / `spirals` non mappano 1:1 alle decorazioni visibili (anelli, basket twist)
5. Formule geometry: conteggio barre ≠ picket count reale con doppia densità in zona bassa
6. Foto 01: variante composite+sliding non coperta da un solo preset `double_swing`

## Prossimi passi

1. Chiedere a Marius: le foto sono **900/1000 mm** o installazioni **più alte** (standard site)?
2. Confermare mapping decorazioni → opzioni catalogo (railheads vs anelli vs basket twist)
3. Implementare fidelity pass Victorian su `rendering.ts` usando [TOPOLOGY_VICTORIAN.md](./TOPOLOGY_VICTORIAN.md)
4. Tenere foto 01 per audit separato `tracked_sliding` + `composite_boards`
