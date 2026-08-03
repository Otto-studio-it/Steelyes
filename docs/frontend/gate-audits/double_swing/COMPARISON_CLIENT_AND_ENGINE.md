# Confronto — foto vs cliente vs gate-engine

## Fonti

| Fonte | Path |
|-------|------|
| Foto reference | `photos/02–04` (Victorian), `photos/01` (composite/sliding) |
| Cliente (FROM, dimensioni) | `docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md` |
| Engine preset | `packages/gate-engine/src/types.ts` → `DEFAULT_GATE_PRESETS.double_swing` |
| Geometry | `packages/gate-engine/src/rules/geometry.ts` |
| Renderer 2D | `packages/gate-engine/src/rendering.ts` → `buildSwingFrame` |
| Renderer 3D | `packages/gate-engine/src/mesh/index.ts` |

---

## A. Dati dimensionali (double swing Victorian)

### Cliente — prezzi e dimensioni indicative

| Campo | Valore cliente |
|-------|----------------|
| Gate type | Double Swing Gates |
| Style | Traditional Victorian Style |
| Height (FROM bands) | **900 mm / 1000 mm** |
| Width (FROM bands) | **1800 mm / 1900 mm** |
| Manual FROM | **£1800** |
| Automated FROM | **£3800** |

### Engine — preset default

| Campo | Valore engine |
|-------|---------------|
| `gateType` | `double_swing` |
| `style` | `traditional_victorian` |
| `widthMm` | **1800** |
| `heightMm` | **1000** |
| `motorised` | false |

**Esito preset vs cliente:** MATCH sulle dimensioni default (1800×1000 rientra nei band cliente).

### Foto Victorian — stima visiva (senza metro in foto)

| Campo | Stima da foto 02–04 | vs cliente 1800×1000 | vs engine |
|-------|---------------------|----------------------|-----------|
| Larghezza totale | ~3000–4000 mm (2 auto) | **REVIEW** — più largo di 1900 mm max catalogo | **REVIEW** |
| Altezza al centro arco | ~1500–2000 mm | **REVIEW** — più alto di 1000 mm | **REVIEW** |
| Altezza ai pali | ~1200–1500 mm | **REVIEW** | **REVIEW** |
| Rapporto W:H | ~1.5–2:1 | coerente con driveway | OK qualitativo |

**Interpretazione possibile (da confermare con Marius):**

1. Le foto sono installazioni **fuori banda catalogo FROM** (custom site)
2. Il catalogo 900/1000 mm misura **solo il rettangolo utile**, non l’arco che aggiunge altezza visiva
3. I prezzi FROM si riferiscono a un **size band minimo**, non al massimo visibile in galleria

---

## B. Opzioni decorative

### Cliente — opzioni e prezzi

| Opzione | Prezzo cliente | Visibile foto Victorian |
|---------|---------------|-------------------------|
| `middle_bar` | +£275 | Probabile (lower-mid rail) |
| `top_railheads` | variabile (£1.25–£25 cad.) | **Sì** — finials su ogni picket |
| `dog_bars` | from £75 + £4.50/extra | **Sì** — zona bassa densa |
| `dog_bar_railheads` | come top | **Parziale** — fascia spear, non su dog bar singolo |
| `arched_top` | +£850 | **Sì** — sempre nelle foto 02–04 |
| `bushes` | (non prezzo in excerpt) | **Forse** — anelli circolari |
| `spirals` | (non prezzo in excerpt) | **Forse** — basket twist |

### Engine — geometry @ width 1800 mm

| Formula | Valore @ 1800 mm |
|---------|------------------|
| `top_railheads` max | round(1800/190) = **9** (clamp 6–14) |
| `dog_bar_railheads` max | round(1800/220) = **8** (clamp 4–10) |
| `dog_bars` max | 2+round(1800/850) = **4** (clamp 2–5) |
| decorative capacity (swing) | round(1800/210) = **9** (clamp 8–16) |

### Confronto visivo vs formule

| Elemento foto | Conteggio visivo (per foglio) | Engine | Esito |
|---------------|------------------------------|--------|-------|
| Finials top | ~15–25 per foglio (~30–50 totali) | max 9 railheads **totali**? qty per option | **CONFLICT / REVIEW** — densità foto >> formula |
| Pickets upper | ~12–18 per foglio | upperBars = round(w/210) ≈ 9 total width | **REVIEW** |
| Kick plate bars | doppia densità | lowerBars = round(w/90) ≈ 20 | **PARZIALE** |
| Circle bands | 2 fasce continue | non modellato | **GAP** |
| Basket twists | ogni 2°–3° picket | `spirals` qty? | **REVIEW** |

---

## C. Renderer attuale vs foto

| Feature | Foto Victorian | `buildSwingFrame` oggi | Status |
|---------|---------------|------------------------|--------|
| 2 fogli simmetrici | Sì | Sì (center split) | MATCH |
| Arched top | Sì | Opzione `arched_top` | MATCH (se enabled) |
| 4 traverse | Sì | ~2 zone (upper/lower infill) | **GAP** |
| Finial per picket | Sì | railheads generici | **GAP** |
| Circle scroll bands | Sì | no | **GAP** |
| Basket twist | Sì | no | **GAP** |
| Spear row | Sì | no | **GAP** |
| Doppia densità base | Sì | lowerBars più fitte | **PARZIALE** |
| Center latch plate | Sì | linea tratteggiata | **GAP** |
| Hinges | Sì | no | **GAP** (ok schematic) |
| Drop bolt | Sì (foto 04) | no | **GAP** |
| Tube profile | hollow square | rettangoli pieni | **GAP** |
| 3D mesh | tubi reali | box placeholder | **GAP** |

---

## D. Tabella diff riassuntiva

| Area | Osservato (foto) | Cliente | Engine | Status |
|------|------------------|---------|--------|--------|
| Gate type | double swing | Double Swing | `double_swing` | MATCH |
| Style | Victorian open bar | Traditional Victorian | `traditional_victorian` | MATCH |
| Width band | ~3–4 m visivi | 1800/1900 mm | 1800 default | REVIEW |
| Height band | ~1.5–2 m visivi | 900/1000 mm | 1000 default | REVIEW |
| Arched top | sempre | opzione £850 | `arched_top` | MATCH |
| Top finials | ogni picket | railheads catalog | `top_railheads` | REVIEW |
| Dog zone | zona bassa 25–30% | dog bars | `dog_bars` | PARZIALE |
| Decorative bands | anelli + spear | non esplicito | no layer | GAP |
| Composite foto 01 | sliding+panels | double/sliding separate | partial | CONFLICT tipo |
| Pricing FROM | n/a | £1800 manual | indicative engine | MATCH (domain) |

---

## E. Domande aperte per Marius

1. Le foto 02–04 rappresentano **1800×1000 mm** o installazioni più grandi?
2. L’altezza catalogo include l’**arco** o solo il rettangolo?
3. I **anelli circolari** (top/bottom band) = quale voce listino?
4. I **basket twist** = spirals, bushes, o extra non in configurator?
5. La **fascia spear** centrale = dog_bar_railheads o decorazione fissa?
6. Quanti **top railheads** su un cancello 1800 mm reali? (formula engine dice ~9)
7. Foto 01: conferma **tracked sliding composite**?

---

## F. Calcoli geometry engine @ preset 1800×1000

Per un config `double_swing` + `traditional_victorian` + width 1800:

```
top_railheads max:     9
dog_bar_railheads max: 8
dog_bars max:          4
bushes/spirals max:    9
upper infill bars:     ~9 (rendering.ts round(1800/210))
lower infill bars:     ~20 (rendering.ts round(1800/90))
```

Questi numeri vanno validati contro un cancello reale fotografato con dimensioni note.
