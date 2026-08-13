---
title: Figma decorative polish — inventory & rename map (2026-08-11)
description: What was changed per gate type in Figma file HW4O7VfFiRKKyBjQCk8y9Y + proposed clean names
owner: Ruben
status: ACTIVE
last_updated: 2026-08-11
figma: https://www.figma.com/design/HW4O7VfFiRKKyBjQCk8y9Y
---

# Figma — cosa è stato fatto (cancello per cancello)

File: [Steelyes 2D Gate Masters](https://www.figma.com/design/HW4O7VfFiRKKyBjQCk8y9Y)

Convenzione proposta (pulita):

```
{DS|SS|TS} / {slug}                    → master ufficiale live
{DS|SS|TS} / {slug} · archive-2026-08  → versione pre-fix (opacità bassa)
Overlay / circles-{upper|lower|combined}
RH / {RH32|RH7|…}                      → solo catalogo (NON sul Design)
```

---

## 1. Double swing (2 ante) — pagina `02 — Double Swing Variants manual`

**Link:** https://www.figma.com/design/HW4O7VfFiRKKyBjQCk8y9Y?node-id=6-2

### Master già presenti (catalogo originale)

| Nome attuale (circa) | Ruolo |
|---|---|
| `DS / base` | Victorian base — **non toccato** |
| `DS / dog_bars` | Zona dog bars — **non toccato** |
| `DS / composite` | Composite boards — **non toccato** |
| `DS / arched` → rinominato in `… · OLD (pre CA-14 picket fix)` | Arco **vecchio**: picket dritti a y piatta, non seguivano la curva |
| `DS / arched_dog_bars` → `… · OLD …` | Stesso problema + dog bars |

### Cosa abbiamo aggiunto / modificato

| Nome attuale | Cosa è |
|---|---|
| `DS / arched · FIXED 2026-08-11` | **Nuovo SVG** importato: stessi archi, ma i **picket verticali arrivano sotto la curva** (fix Marius “arches not ok”) |
| `DS / arched_dog_bars · FIXED 2026-08-11` | Come sopra + dog bars |
| `DEMO · Circles overlay on base` | Istanza overlay cerchi (CA-16) sopra un master — **demo**, non un nuovo tipo cancello |
| Label testo `PAGE 02 UPDATES…` | Nota di lavoro |

### Rename consigliato (manuale)

| Da | A |
|---|---|
| `DS / arched · OLD (pre CA-14 picket fix)` | `DS / arched · archive-2026-08` |
| `DS / arched_dog_bars · OLD …` | `DS / arched_dog_bars · archive-2026-08` |
| `DS / arched · FIXED 2026-08-11` | `DS / arched` *(poi elimina o nascondi l’archive se ok)* |
| `DS / arched_dog_bars · FIXED …` | `DS / arched_dog_bars` |
| `DEMO · Circles overlay on base` | `Overlay / circles-combined · demo-on-base` |

**Codice runtime:** i file in `apps/web/public/2d-masters/double_swing/silhouettes/arched*.svg` sono già i FIXED (non serve riesportare da Figma per il sito, a meno che non ritocchi ancora in Figma).

---

## 2. Single swing (1 anta) — pagina `03 — Single Swing Variants manual`

**Link:** https://www.figma.com/design/HW4O7VfFiRKKyBjQCk8y9Y?node-id=8-2

Pagina era vuota; ci abbiamo messo solo i due master corretti.

| Nome attuale | Cosa è |
|---|---|
| `SS / arched · FIXED 2026-08-11` | Arco single: picket allineati alla **curva di questo** master (non quella del double) |
| `SS / arched_dog_bars · FIXED 2026-08-11` | Arco + dog bars |
| Label `PAGE 03 — Single Swing…` | Nota |

### Rename consigliato

| Da | A |
|---|---|
| `SS / arched · FIXED 2026-08-11` | `SS / arched` |
| `SS / arched_dog_bars · FIXED …` | `SS / arched_dog_bars` |

**Runtime:** `apps/web/public/2d-masters/single_swing/silhouettes/arched*.svg`

---

## 3. Tracked sliding (scorrevole su binario) — pagina `04 — Tracked Sliding Variants`

**Link:** https://www.figma.com/design/HW4O7VfFiRKKyBjQCk8y9Y?node-id=13-2

Stesso pattern del single: pagina popolata con i FIXED.

| Nome attuale | Cosa è |
|---|---|
| `TS / arched · FIXED 2026-08-11` | Arco tracked: picket sulla curva tracked |
| `TS / arched_dog_bars · FIXED 2026-08-11` | Arco + dog bars |
| Label `PAGE 04 — Tracked Sliding…` | Nota |

### Rename consigliato

| Da | A |
|---|---|
| `TS / arched · FIXED …` | `TS / arched` |
| `TS / arched_dog_bars · FIXED …` | `TS / arched_dog_bars` |

**Runtime:** `apps/web/public/2d-masters/tracked_sliding/silhouettes/arched*.svg`

---

## 4. Railheads + Circles (NON sono cancelli) — pagina `10 - railhead catalog variants`

**Link:** https://www.figma.com/design/HW4O7VfFiRKKyBjQCk8y9Y?node-id=24-6437

Qui abbiamo **spostato** i componenti importati (prima erano sparsi in fondo a p02).

### Railheads (6 SKU) — CA-17: solo scelta modello, **non** disegnati sul Design 2D

| Nome | Forma |
|---|---|
| `RH32` | Classic spear |
| `RH7` | Fleur + peg |
| `RH7NP` | Fleur no peg |
| `RH6WB` | Ball on taper |
| `RH14` | Ball + collar |
| `RH100` | Ornate fleur |

Rename: `RH / RH32`, `RH / RH7`, …

### Circle bands — CA-16: overlay Design quando opzione Circles ON

| Nome | Uso |
|---|---|
| `Circle band — upper` | Fascia cerchi alta |
| `Circle band — lower` | Fascia cerchi bassa |
| `Circle bands — combined` | Entrambe (usato dal sito) |

Rename: `Overlay / circles-upper`, `…-lower`, `…-combined`

**Runtime:** `apps/web/public/2d-masters/overlays/circles/*.svg`

---

## Tipologie NON toccate in Figma in questo batch

Cantilever, bifold double, single bifold, telescopic, radius — **nessun** arched FIXED caricato. Solo i tre tipici usati da Marius (double / single / tracked).

---

## Regole prodotto (ricordo)

| Id | Regola |
|---|---|
| CA-14 | Capuri: 1 per baia, auto |
| CA-15 | Dog bars: densità auto, solo on/off |
| CA-16 | Circles: opzione sì/no a bande |
| CA-17 | Design 2D: si sceglie solo il **modello** RH, non si disegna sul cancello |

---

## Quando torna la quota MCP Figma

Script di rename automatico (da rieseguire): rinominare secondo le tabelle “Rename consigliato” sopra, raggruppare gli `archive-*` in una sezione in basso a destra, tenere i master live con nomi corti `DS / arched` allineati al catalogo runtime.
