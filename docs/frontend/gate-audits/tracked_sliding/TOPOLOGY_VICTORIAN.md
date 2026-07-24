# Topologia — tracked sliding Traditional Victorian

Riferimenti: foto **01**, **02**, **04**, **06**.

## 1. Meccanismo (regola fondamentale)

```
[Track a terra] ← [Pannello scorrevole] → [Stack / recinzione quando aperto]
        ↑
   rollers / wheels (non visibili, sotto bottom rail)
```

- **NO** counterweight tail sospesa → **non** cantilever
- Binario **incassato** o montato su fascia pavimentazione
- Pannello **single leaf** (un blocco che scorre)
- Chiusura: pannello copre vano tra due pali

## 2. Struttura pannello Victorian

### Foto 01 (ball finials)

| Parte | Descrizione |
|-------|-------------|
| Frame | Rettangolo tubolare nero |
| Top | Top rail + finial **sferico** per barra |
| Mid rail | Traversa orizzontale ~33% da basso |
| Bottom rail | Base spessa (alloggia rollers) |
| Upper infill | Barre verticali passo regolare |
| Lower infill | **Barre aggiuntive** tra mid e bottom → densità ↑ |

### Foto 02 (spear finials)

| Parte | Descrizione |
|-------|-------------|
| Top finials | Spear / fleur-de-lis |
| Mid-rail finials | **Seconda fila** finials più piccoli sulla mid-rail |
| Lower zone | Barre fitte sotto mid-rail |
| Retraction | Scorre dietro muro/recinzione lato destro |

### Foto 06 (arched + rings)

| Parte | Descrizione |
|-------|-------------|
| Top | **Arco** convesso + finials |
| Bands | 2 fasce **anelli circolari** (alto e basso) |
| Bottom rail | Pesante (sliding) |

### Foto 04 (automated)

| Parte | Descrizione |
|-------|-------------|
| Gear rack | Cremagliera su bottom rail |
| Motor | Attuatore a terra lato binario |
| Tail brace | Diagonale su coda pannello |
| Infill | Spear + dual density |

## 3. Elementi fuori pannello (site)

- Pilastri con coping
- Photocell / safety sensor su palo
- Induction loop (foto 01, taglio pavimento)
- Recinzione fissa matching (foto 02)

## 4. Mapping opzioni engine

| Visivo | Opzione | Match |
|--------|---------|-------|
| Mid horizontal rail | `middle_bar` | MATCH probabile |
| Top finials (ball/spear) | `top_railheads` | PARZIALE |
| Mid-rail finials (foto 02) | — | **GAP** |
| Dense lower bars | `dog_bars` | PARZIALE |
| Arched top (foto 06) | `arched_top` | MATCH |
| Circle bands (foto 06) | `bushes`? | REVIEW |
| Motor + rack | `motorised: true` | MATCH (preset engine) |

## 5. Regole parametriche suggerite

```text
gate_type = tracked_sliding
mechanism = ground_track
leaf_count = 1
panel_travel = horizontal
cantilever_tail = false

rails = [top, mid_optional, bottom_heavy]
mid_rail_height_ratio = 0.33
lower_density_multiplier = 2

track = {
  visible: true,
  position: ground_embedded,
  length >= opening_width
}

automation_optional = {
  gear_rack: bottom_rail,
  motor: ground_mount,
  photocell: gate_posts
}
```

## 6. Confronto tracked vs cantilever (engine)

| | tracked_sliding | cantilever_sliding |
|--|-----------------|---------------------|
| Supporto | Binario a terra | Rail overhead / ground guide |
| Counterweight tail | No | **Sì** |
| Renderer oggi | track-line + panel | + cantilever-tail |
| Cliente width band | 2500–2600 mm | 2500–2600 mm (stesso!) |

**Importante:** stesse bande dimensionali cliente — distinguere per **meccanismo**, non per size.

## 7. Incertezze

- [ ] Ball vs spear finials = stesso SKU railhead o famiglie diverse?
- [ ] Mid-rail finials = dog_bar_railheads o riga dedicata?
- [ ] Altezza foto 02 (~1,4 m) vs catalogo 900–1000 mm
- [ ] Diagonal brace (foto 04) = sempre su tracked o solo cantilever?
