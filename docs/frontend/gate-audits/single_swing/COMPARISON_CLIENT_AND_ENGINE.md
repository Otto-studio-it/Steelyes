# Confronto — foto vs cliente vs gate-engine (single swing)

## Fonti

| Fonte | Path |
|-------|------|
| Foto Victorian | `photos/02-victorian-single-panel-driveway.png` |
| Foto composite | `photos/04-composite-single-swing-privacy.png` |
| Foto sliding (exclude) | `photos/01`, `photos/03` |
| Cliente | `CLIENT_GATE_REQUIREMENTS_REFERENCE.md` → Single Swing Gate |
| Engine | `types.ts` preset, `rendering.ts` `buildSwingFrame`, `geometry.ts` |

---

## A. Dati dimensionali — Victorian

### Cliente

| Campo | Valore |
|-------|--------|
| Type | Single Swing Gate |
| Style | Traditional Victorian |
| Height | **900 / 1000 mm** |
| Width | **800 / 900 mm** |
| Manual FROM | **£850** |
| Automated FROM | **£2700** |

### Engine preset

| Campo | Valore |
|-------|--------|
| `gateType` | `single_swing` |
| `widthMm` | **900** |
| `heightMm` | **1000** |
| `motorised` | false |

**Preset vs catalogo:** MATCH (900×1000 nel band cliente).

### Foto 02 — stima visiva

| Campo | Stima | vs catalogo | vs engine |
|-------|-------|-------------|-----------|
| Larghezza | 3500–4000 mm | **REVIEW** (4× catalogo max) | **REVIEW** |
| Altezza | 1500–1600 mm | **REVIEW** | **REVIEW** |
| Leaf count | 1 | MATCH | MATCH |

**Interpretazione:** foto 02 = driveway gate largo; catalogo 800–900 mm = probabile **accesso pedonale / narrow** band FROM, non max install size.

---

## B. Dati dimensionali — Composite

### Cliente

| Campo | Valore |
|-------|--------|
| Manual FROM | **£750** |
| Automated FROM | **£2700** |
| Dimensions | not specified |

### Foto 04

| Campo | Stima | Esito |
|-------|-------|-------|
| Mechanism | hinge swing | MATCH `single_swing` |
| Style | horizontal slat privacy | MATCH `composite_boards` |
| Width | 3500–4500 mm | REVIEW vs preset 900 mm |
| Height | 1800–2000 mm | REVIEW vs preset 1000 mm |

---

## C. Geometry engine @ width 900 mm

| Formula | @ 900 mm |
|---------|----------|
| top_railheads max | round(900/190)=5 (clamp 6–14) → **6** |
| dog_bar_railheads max | round(900/220)=4 |
| dog_bars max | 2+round(900/850)=3 |
| decorative capacity | round(900/210)=4 (clamp 8–16) → **8** |
| upper infill bars (render) | round(900/210)=4 |
| lower infill bars (render) | round(900/90)=10 |

**Nota:** a 900 mm width le formule producono meno barre che nella foto 02 (installazione ~4 m). Le formule scalano con width — OK se width config = larghezza reale foto.

---

## D. Renderer vs foto 02 (Victorian single)

| Feature | Foto 02 | Engine oggi | Status |
|---------|---------|-------------|--------|
| 1 foglio | Sì | `leafCount=1`, hinge line | MATCH base |
| 3 rails | Sì | ~2 zone infill | **GAP** |
| Finials 2 tier | Sì | solo top railheads | **GAP** |
| Dog zone densa | Sì | lowerBars formula | **PARZIALE** |
| Secondary pickets | Sì | no | **GAP** |
| Straight top | Sì | default (no arched) | MATCH |
| Hinges drawn | Sì | single-hinge line faint | **PARZIALE** |
| Gear rack | Sì | no | N/A sliding? |

---

## E. Renderer vs foto 04 (composite)

| Feature | Foto 04 | Engine oggi | Status |
|---------|---------|-------------|--------|
| 1 foglio | Sì | leafCount=1 | MATCH |
| 3 vertical bays | Sì | no | **GAP** |
| Horizontal slats | Sì | flat panelSoft | **GAP** |
| Privacy closed | Sì | partial | **PARZIALE** |
| Hinge side | Sì | generic | **PARZIALE** |

---

## F. Tabella diff riassuntiva

| Area | Foto Victorian | Cliente | Engine | Status |
|------|----------------|---------|--------|--------|
| Gate type | 1 leaf swing | Single swing | `single_swing` | MATCH |
| Width | ~4 m | 800–900 mm | 900 default | REVIEW |
| Height | ~1.5 m | 900–1000 mm | 1000 default | REVIEW |
| Manual FROM | — | £850 | indicative | MATCH domain |
| Middle rail | yes | middle_bar £275 | option | MATCH |
| Dog zone | yes | dog_bars | option | PARZIALE |
| Mid finials | yes | not in catalog | — | GAP |
| Foto 01/03 | sliding | tracked sliding cat. | `tracked_sliding` | WRONG bucket |

---

## G. Domande per Marius

1. Single swing catalogo **800–900 mm** = pedonale stretto o esempio FROM minimo?
2. Foto 02 larga (~4 m): prezzo FROM scala con width — conferma formula?
3. Cremagliera su cancello a cerniere (foto 02): errore o prep motor?
4. Finials a **due altezze** = due righe railheads o decorazione fissa?
5. Composite foto 04: 3 campi verticali = standard Steelyes o custom “Beech Wood”?

---

## H. Confronto single vs double (catalogo)

| | Single swing | Double swing |
|--|--------------|--------------|
| Width FROM | 800–900 mm | 1800–1900 mm |
| Manual FROM Victorian | £850 | £1800 |
| Leaf count | 1 | 2 |
| Meeting stile | no | yes |
| Foto tipica larghezza | ~4 m (foto 02) | ~3–4 m (audit precedente) |

Entrambi i set foto mostrano installazioni **più larghe** dei band FROM — pattern comune da validare con cliente.
