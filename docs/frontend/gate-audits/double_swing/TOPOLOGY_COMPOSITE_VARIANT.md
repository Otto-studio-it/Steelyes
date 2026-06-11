# Topologia — variante composite (foto 01)

**File:** `photos/01-composite-sliding-camelback.png`

Questa foto **non** è il riferimento primario per `double_swing` + `traditional_victorian`. Documentata qui perché inclusa nel set, ma va auditata sotto altra combinazione tipo/stile.

## Classificazione

| Campo | Valore osservato | Engine suggerito |
|-------|------------------|------------------|
| Meccanismo | Binario a terra visibile → **sliding** | `tracked_sliding` |
| Estetica | Due metà simmetriche | aspetto “double” ma non swing |
| Stile | Pannelli composite + griglia | `composite_boards` |
| Top | Camelback (arco max al centro) | opzione `arched_top` se supportata su composite |

## Zone verticali (3 tier)

| Zona | % altezza | Contenuto |
|------|-----------|-----------|
| Top | ~25–40% (variabile per arco) | Griglia diamante nera + finials piccoli sul bordo arco |
| Middle | ~50–60% | Pannelli verticali effetto legno, emblem centrale per foglio |
| Bottom | ~10–15% | Griglia diamante (base) |

## Confronto con dati cliente

| Campo | Cliente double swing | Cliente tracked sliding | Foto 01 |
|-------|---------------------|-------------------------|---------|
| Tipo catalogo | double_swing | tracked_sliding | **tracked_sliding** |
| Stile | Victorian / Composite | Victorian / Composite | **composite_boards** |
| Larghezza FROM | 1800/1900 mm | 2500/2600 mm | ~driveway 2 auto (stima >2600) |
| Altezza FROM | 900/1000 mm | 900/1000 mm | camelback, centro più alto |

## Gap configurator

- Nessun renderer composite con griglia diamante + pannelli 3-tier
- `composite_boards` in engine = fill piatto, non plank + lattice
- Camelback + sliding non testato insieme

## Azione

Spostare foto 01 in audit futuro: `docs/frontend/gate-audits/tracked_sliding/` quando creato.
