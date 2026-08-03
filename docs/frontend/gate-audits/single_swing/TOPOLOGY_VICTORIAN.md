# Topologia — single swing Traditional Victorian

Riferimento primario: **foto 02**.

## 1. Struttura ad alto livello

```
[Palo cerniera] — [Unico foglio] — [Lato libero / meeting post opzionale]
```

- **leaf_count = 1** — differenza fondamentale vs double swing
- **Pivot:** cerniere su un solo palo (lato sinistro in foto 02)
- **Niente** meeting stile centrale tra due ante

## 2. Gerarchia parti

1. **Hinge post** — palo con 2+ cerniere heavy-duty
2. **Outer frame** — tubolare rettangolare perimetrale
3. **Horizontal rails (3):**
   - Top rail — rettilineo in foto 02
   - Middle rail — ~33% altezza dal basso
   - Bottom rail — base strutturale pesante
4. **Vertical pickets** — full height o staggered (vedi sotto)
5. **Finials** — due tier di altezza
6. **Free edge** — lato opposto alle cerniere (latch / drop bolt possibile)

## 3. Regola infill a densità variabile (foto 02)

| Zona | Altezza | Pickets | Finials |
|------|---------|---------|---------|
| Sopra middle rail | ~67% | Primari, passo largo (~12–15 cm) | **Grandi** spear/fleur sopra top rail |
| Tra middle e bottom | ~33% | **Doppia densità** — barre filler tra primari | — |
| Secondary pickets | upper-mid | Partono da middle rail, finiscono sopra middle | **Piccoli** finials |

**Regola engine da validare:** `dog_bars` = zona bassa densa; conteggio attuale `2 + round(width/850)` potrebbe non catturare “100% più barre”.

## 4. Finials staggered (2 altezze)

A differenza del double swing (finials solo in cima):

- **Tier 1:** finial grande su ogni picket primario, sopra top rail (+15–20 cm extension)
- **Tier 2:** finial piccolo su picket secondari, appena sopra middle rail

Mapping opzioni:

| Visivo | Opzione engine | Match |
|--------|----------------|-------|
| Finials top | `top_railheads` | PARZIALE |
| Finials mid | — | **GAP** — nessuna opzione “mid railheads” |
| Zona bassa densa | `dog_bars` | PARZIALE |
| Middle rail | `middle_bar` | MATCH probabile |
| Arched top | `arched_top` | N/A in foto 02 (top dritto) |

## 5. Hardware

| Parte | Foto 02 |
|-------|---------|
| Hinges | Visibili lato palo |
| Gear rack (cremagliera) | Presente su bottom rail — **anomalo per swing** |
| Ground clearance | ~5–8 cm |

**Domanda Marius:** cremagliera = gate convertito / prep automazione sliding / errore?

## 6. Proporzioni stimate

| Misura | Stima foto | Catalogo cliente | Engine |
|--------|------------|------------------|--------|
| Larghezza | 3500–4000 mm | 800–900 mm | 900 mm |
| Altezza | 1500–1600 mm | 900–1000 mm | 1000 mm |
| Middle rail | ~33% da basso | — | — |

## 7. Regole parametriche suggerite

```text
leaf_count = 1
hinge_side = left | right
rail_count = 3
middle_rail_height_ratio = 0.33
lower_infill_density_multiplier = 2
primary_picket_spacing_mm ≈ 120-150
finial_tiers = [top_large, mid_small]
top_profile = straight | arched  # option arched_top
```

## 8. Confronto con double swing (stesso stile)

| Aspetto | Double swing | Single swing |
|---------|--------------|--------------|
| Fogli | 2 mirror | 1 |
| Centro | meeting stile + latch | n/a |
| Larghezza catalogo | 1800–1900 mm | **800–900 mm** |
| Prezzo manual FROM | £1800 | **£850** |
| Arco | comune in foto double | opzionale (foto 02 = dritto) |

## 9. Incertezze

- [ ] Cremagliera su foto 02 — swing o sliding?
- [ ] Larghezza reale vs banda catalogo 800–900 mm
- [ ] Finials mid-height = quale voce listino?
- [ ] Secondary pickets = parte dog_bars o opzione separata?
