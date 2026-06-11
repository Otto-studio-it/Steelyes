---
gate_type: tracked_sliding
status: draft
last_updated: 2026-05-20
source_photos: 6
primary_style: traditional_victorian
---

# Tracked sliding — gate photo audit

Audit visivo per `tracked_sliding`, incluse 3 foto nuove + 3 riprese dagli audit single/double swing.

## Contenuto cartella

| File | Scopo |
|------|--------|
| [PHOTO_CATALOG.md](./PHOTO_CATALOG.md) | Indice 6 foto |
| [TOPOLOGY_VICTORIAN.md](./TOPOLOGY_VICTORIAN.md) | Barre verticali + binario (foto 01, 02, 04, 06) |
| [TOPOLOGY_COMPOSITE.md](./TOPOLOGY_COMPOSITE.md) | Slat / vision strip / camelback (foto 03, 05) |
| [COMPARISON_CLIENT_AND_ENGINE.md](./COMPARISON_CLIENT_AND_ENGINE.md) | Diff vs cliente vs engine |
| [RENDERER_RECOMMENDATIONS.md](./RENDERER_RECOMMENDATIONS.md) | Priorità 2D/3D |
| [observed.json](./observed.json) | Dati strutturati |
| [manifest.yaml](./manifest.yaml) | Input tool |
| `photos/` | 6 reference |

## Sintesi rapida

### Meccanismo tracked sliding (comune a tutte le foto)

- **Pannello scorrevole** su **binario a terra** (track embedded in pavimentazione)
- **1 leaf** (o 2 pannelli giunti in composite moderno)
- Si apre **orizzontalmente** parallelo alla recinzione / muro
- **Non** cantilever — nessuna coda counterweight sospesa (→ `tracked_sliding`, non `cantilever_sliding`)

### Match dati cliente

| Campo | Cliente | Engine preset | Foto (stima) | Esito |
|-------|---------|---------------|--------------|-------|
| Tipo | Tracked sliding | `tracked_sliding` | track visibile | MATCH |
| Stile Victorian | Traditional Victorian | `traditional_victorian` | foto 01,02,04,06 | MATCH |
| Larghezza | **2500 / 2600 mm** | **2500 mm** | ~3500–5500 mm | **REVIEW** |
| Altezza | **900 / 1000 mm** | **1000 mm** | ~1400–2000 mm | **REVIEW** |
| Automated FROM | **£3600** | `motorised: true` | motor/rack in foto 04 | MATCH |
| Manual FROM | **£2200** | n/a default motor | — | OK dominio |

### Gap configurator principali

1. **Track** disegnato (linea) ma pannello = rettangolo generico
2. **Zona bassa densa** + mid-rail non modellati come nelle foto Victorian
3. **Finials** (ball vs spear) non distinti
4. **Composite three-tier** (solid / vision / solid) assente
5. **Mesh 3D:** solo track box + panel box — niente carrello/roller
6. **Automazione:** cremagliera, motore, photocell non in preview

## Foto per famiglia

| Famiglia | Foto |
|----------|------|
| Victorian + track | 01, 02, 04, 06 |
| Composite + track | 03, 05 |

## Prossimi passi

1. Marius: conferma banda 2500–2600 vs foto ~4–5 m
2. Renderer: track + panel + mid-rail + dual-density infill
3. Separare visivamente `tracked_sliding` vs `cantilever_sliding` in UI
4. Audit `cantilever_sliding` come tipo distinto (no track a terra)
