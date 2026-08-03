---
gate_type: single_swing
status: draft
last_updated: 2026-05-20
source_photos: 4
primary_style: traditional_victorian
---

# Single swing — gate photo audit

Audit visivo delle 4 foto fornite, confrontato con:

- `docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md`
- `packages/gate-engine` (preset `single_swing`, renderer, geometry)

## Contenuto cartella

| File | Scopo |
|------|--------|
| [PHOTO_CATALOG.md](./PHOTO_CATALOG.md) | Indice foto e classificazione |
| [TOPOLOGY_VICTORIAN.md](./TOPOLOGY_VICTORIAN.md) | Victorian single leaf (foto 02, riferimento primario) |
| [TOPOLOGY_COMPOSITE.md](./TOPOLOGY_COMPOSITE.md) | Composite privacy single swing (foto 04) |
| [TOPOLOGY_SLIDING_VARIANTS.md](./TOPOLOGY_SLIDING_VARIANTS.md) | Foto 01 e 03 — non single swing |
| [COMPARISON_CLIENT_AND_ENGINE.md](./COMPARISON_CLIENT_AND_ENGINE.md) | Diff foto vs cliente vs engine |
| [RENDERER_RECOMMENDATIONS.md](./RENDERER_RECOMMENDATIONS.md) | Priorità 2D/3D |
| [observed.json](./observed.json) | Dati strutturati |
| [manifest.yaml](./manifest.yaml) | Input per gate-photo-audit tool |
| `photos/` | Copie reference |

## Sintesi rapida

### Tre famiglie nelle 4 foto

| Foto | Tipo reale probabile | Stile | Ruolo audit |
|------|---------------------|-------|-------------|
| 02 | **Single swing** (1 foglio, cerniere) | Victorian | **Riferimento primario Victorian** |
| 04 | **Single swing** (cerniera visibile) | Composite | **Riferimento composite** |
| 01 | Sliding (binario, pannello unico) | Victorian arched | → audit `tracked_sliding` |
| 03 | Sliding motorizzato (cremagliera + motore) | Victorian | → audit `tracked_sliding` |

### Match dati cliente (single swing Victorian)

| Campo | Cliente | Engine | Foto 02 (stima) | Esito |
|-------|---------|--------|-----------------|-------|
| Tipo | Single swing | `single_swing` | 1 foglio | MATCH |
| Stile | Traditional Victorian | `traditional_victorian` | Barre + finials | MATCH |
| Larghezza | **800 / 900 mm** | **900 mm** | ~3500–4000 mm | **REVIEW** |
| Altezza | **900 / 1000 mm** | **1000 mm** | ~1500–1600 mm | **REVIEW** |
| Manual FROM | **£850** | indicative | n/a | OK dominio |
| Automated FROM | **£2700** | n/a | motor prep visibile | REVIEW |

### Differenza chiave vs double swing

- **1 foglio** invece di 2 — niente meeting stile centrale
- **Cerniera su un solo palo** — hinge line sul lato palo in renderer
- **Larghezza catalogo più stretta** (800–900 mm vs 1800–1900 mm double)
- Stesse opzioni decorative Victorian (railheads, dog bars, arched top, ecc.)

### Gap configurator

1. Single leaf non differenziato visivamente abbastanza dal double (manca chiarezza “one leaf”)
2. Tri-rail + finials doppia altezza (foto 02) non modellati
3. Composite single (foto 04) = slat orizzontali + 3 bay — renderer oggi è fill piatto
4. Foto sliding nel set single swing — rischio confusione tipo prodotto

## Prossimi passi

1. Confermare con Marius: foto 02 è **900 mm** catalogo o installazione larga?
2. Chiarire foto 02: cremagliera = sliding futuro o accessorio su swing?
3. Spostare foto 01/03 in `gate-audits/tracked_sliding/` quando creato
4. Renderer: fidelity pass `single_swing` con 1 foglio + tri-rail + dog zone
