# Topologia — single swing Composite Boards

Riferimento: **foto 04**.

## Struttura

- **1 foglio** con cerniera su palo destro (visibile in foto)
- **Top rettilineo** — nessun arco
- **Telaio:** profilo nero spesso, rettangolare
- **3 campi verticali** separati da 2 montanti (mullions) interni
- **Infill:** listelli orizzontali grigio effetto legno, full privacy (zero gap)
- **Branding:** testo “BEECH WOOD” su piastra in campo centrale (custom, non in engine)

## Proporzioni stimate

| Elemento | Stima |
|----------|-------|
| Larghezza totale | 3500–4500 mm |
| Altezza | 1800–2000 mm |
| Campi verticali | 3 uguali |
| Altezza listello | ~15–20 cm ciascuno |
| Clearance terra | 10–15 cm |

## Confronto cliente / engine

| Campo | Cliente single swing composite | Engine | Foto 04 |
|-------|-------------------------------|--------|---------|
| Width | not specified | 900 mm preset | >>900 mm |
| Height | not specified | 1000 mm | >>1000 mm |
| Manual FROM | £750 | indicative | n/a |
| Automated FROM | £2700 | n/a | n/a |
| Victorian options | blocked on composite | compatibility rules | OK (no bar infill) |

## Gap renderer

| Feature | Foto | `buildSwingFrame` composite oggi |
|---------|------|-----------------------------------|
| 3 bay vertical | Sì | fill unico rettangolo |
| Horizontal slats | Sì | no |
| Mullions | Sì | no |
| Privacy closed | Sì | panelSoft fill |
| Custom text | Sì | out of scope v1 |

## Regole suggerite per composite single

```text
leaf_count = 1
style = composite_boards
vertical_bays = 3  # parametric?
infill = horizontal_slat
slat_orientation = horizontal
privacy = full
top_profile = straight
```

## Nota

Foto 04 conferma **single swing meccanismo** (cerniera). Larghezza visiva resta fuori banda catalogo — probabile installazione driveway wide, non pedonale 800 mm.
