# Topologia — cantilever sliding

Riferimento: foto **01** (installazione Steelyes).

## 1. Meccanismo

```
[Tail / counterbalance] — [Carriage post + rollers] — [Clear opening panel] — [Latch post]
         ↑                           ↑
    nascosto dietro              sospende il gate
    recinzione/muro              senza track a terra
```

### Differenza tracked vs cantilever

| Componente | Tracked | Cantilever |
|------------|---------|------------|
| Ground track attraverso passo | Sì | **No** |
| Tail counterbalance | No | **Sì** |
| Bottom rail | rollers in track | **gear rack** + clearance |
| Run-back | ~1× opening | ~**1.3–1.5×** opening |
| Diagonal brace | raro | **spesso** su tail |

## 2. Parti strutturali (foto 01)

| Parte | Descrizione |
|-------|-------------|
| **Carriage post** | Palo sinistro con guide rollers |
| **Tail section** | Trave counterbalance dietro palo, brace diagonale |
| **Opening panel** | Sezione che copre varco driveway |
| **Frame** | Top rail dritto + mid-rail + bottom rail pesante |
| **Pickets** | Verticali, finials spear in cima |
| **Mid-rail** | ~33% da basso — transizione densità |
| **Dense lower** | Barre extra sotto mid-rail |
| **Gear rack** | Cremagliera su bottom rail |
| **Motor** | Attuatore a terra lato sinistro |
| **Latch post** | Palo destro (parzialmente fuori frame) |

## 3. Assembly narrative

Il gate è un'unica trave continua: la coda tail bilancia il peso del pannello aperto. I rollers sul carriage post trattengono il gate sollevato. Il pannello scorre orizzontalmente; la cremagliera trasferisce il moto dal operatore. Il infill Victorian segue le stesse regole barre del tracked, ma la **struttura portante** include tail + sospensione.

## 4. Mapping opzioni engine

| Visivo | Opzione | Match |
|--------|---------|-------|
| Spear finials | `top_railheads` | PARZIALE |
| Mid-rail | `middle_bar` | MATCH probabile |
| Dense lower | `dog_bars` | PARZIALE |
| Straight top | default (no arched) | MATCH |
| Motor + rack | `motorised: true` | MATCH preset |

## 5. Renderer engine oggi

| Elemento | Atteso cantilever | Engine | Status |
|----------|-------------------|--------|--------|
| Tail box | Sì | `cantilever-tail` | MATCH |
| Tail join line | Sì | `cantilever-tail-join` | MATCH |
| No ground track | Sì | **track-line ancora disegnato** | **CONFLICT** |
| Carriage post | Sì | no | GAP |
| Diagonal brace | Sì | no | GAP |
| Gear rack | Sì | no | GAP |
| Panel vs tail split | Sì | panel + tail rects | PARZIALE |

## 6. Regole parametriche suggerite

```text
gate_type = cantilever_sliding
ground_track = false
suspended = true

tail_length_mm = f(opening_width_mm):
  if opening == 4000: opening / 3      # engine rule
  else: opening * tail_ratio            # default 0.28, validate vs 0.33-0.50 web

total_gate_length_mm = opening_width_mm + tail_length_mm
run_back_required_mm = total_gate_length_mm

panel_opening_width_mm = opening_width_mm  # config widthMm
```

## 7. Site requirements (per quote flow)

- Spazio run-back ≥ totale gate length
- Fondazione carriage post / mounting block
- Nessun ostacolo in zona tail quando aperto
- Automazione: power + limit switches
