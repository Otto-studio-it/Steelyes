---
title: Foto Intake Deep Analysis — Phase 2
description: Railhead catalog from Numbers CSV + per-type photo web/ref picks + misfile ledger
owner: Ruben
status: ACTIVE
last_updated: 2026-07-30
depends_on:
  - docs/frontend/foto-intake/FOTO_INTAKE_ANALYSIS_2026-07-30.md
  - docs/frontend/foto-intake/railheads-catalog.json
---

# Foto Intake Deep Analysis — Phase 2

Continues [`FOTO_INTAKE_ANALYSIS_2026-07-30.md`](./FOTO_INTAKE_ANALYSIS_2026-07-30.md) after the Numbers CSV export landed.

Artifacts:

| File | Role |
|---|---|
| [`railheads-catalog.csv`](./railheads-catalog.csv) / [`.json`](./railheads-catalog.json) | Clean provisional SKU catalog |
| [`railheads-export.csv`](./railheads-export.csv) | Same CSV (alias path) |
| This doc | Photo picks + misfiles + next engineering actions |

---

## A. Railheads — catalog unlocked (provisional)

**Source:** `foto /railhead/ordine degli railhead con tutti i loro dati annessi e prezzi.csv`

| Metric | Value |
|---|---|
| Unique SKUs parsed | **61** |
| With EX VAT price | **54** |
| Missing price | RH122, RH45, RH55, RH56, RH62, RH70, RH79 (dims present) |
| EX VAT range | **£0.20 – £3.50** per piece |
| Overlap with photo filenames | ~58 / 59 SKU photos |

### Example confirmed rows

| Code | Size (H×W×D mm) | EX VAT | Incl VAT |
|---|---|---:|---:|
| RH32 | 136×60×14 | £0.55 | £0.66 |
| RH7NP | 110×60×20 (no peg) | £0.29 | £0.35 |
| RH7 | 125×60×12 | £0.35 | — |
| RH6W/B | 100×20×20 (with ball) | £0.50 | — |
| RH114 | 140×65×16 | £3.50 | — |
| RH73 | 138×60×12 | £0.20 | — |

### Engineering rules

1. Store `unit_price_gbp` as **EX VAT**.
2. Status in engine: `provisional` until Marius signs the sheet (WhatsApp paste / OCR noise).
3. Populate `packages/gate-engine/src/catalog/railheads.ts` from `railheads-catalog.json` — do **not** invent missing prices.
4. 7 SKUs without price: show in picker only if photo exists; price line = “quoted after survey”.
5. Count formula (`open.railhead_count_rule`) is still open — unit prices alone do not unlock a final total.

### Still blocked for “final” railhead pricing

- Compatibility: which SKUs on Victorian vs Composite, top vs dog-bar row
- Count rule vs width
- Confirmation that these EX VAT figures are current listino (not old supplier screenshots)

---

## B. Photo classification — verdict by type

Screenshots remain **engineering-only**. Below = non-Screenshot photos.

### Ready / strong

| Type | Accuracy of folder | Best **web** | Best **configurator_ref** |
|---|---|---|---|
| `double_swing` | High (48) | `1000052250.JPG`, `1000048890.JPG` | `1000048810.JPG`, `1000048840.JPG` |
| `tracked_sliding` | High (41) | `1000052259.JPG`, `1000048894.JPG` | `1000048854.JPG`, `1000048837.JPG` |
| `bifolding_double_swing` | Very high (7) | `1000048855.JPG`, `5fc33d83-….JPG` | `8db8be89-….JPG`, `41517b54-….JPG` |
| `single_swing` | Medium–high (19) | `2405bc5a-….JPG`, `53b4ff35-….JPG` | `1000048884.JPG`, `1000048895.JPG` |
| fencing (`recinzioni`) | High (27) | `recinzione giardino.JPG` | `1000048834.JPG` (railhead style) |

### Thin / misfiled — do not treat folder name as truth

| Type | Problem | Action |
|---|---|---|
| `cantilever_sliding` | Most photos are tracked or wrong; **1** clear cantilever (`1000048848.JPG`) | Refile ledger below; use 8848 as primary ref |
| `telescopic_sliding` | Only supplier graphic | Pull misfiled renders into this folder; no Steelyes install |
| `radius_sliding` | Only arch webp is real radius; other photo is bifold | Move bifold out; radius stays enquire |
| `single_bifolding` | 1/2 is single swing | Move misfile; only studio red bifold remains |
| `random/` | Still **96** files | Half are railings/stairs/brand — not gates |

### Confirmed misfile ledger (do these moves)

| File | From | To |
|---|---|---|
| `single swing steel gate.webp.jpg` | single swing | cantilever |
| `traked sliding steel gate.jpg` | tracked | telescopic |
| `steel cantilever sliding gate.jpg` | cantilever | telescopic |
| `1000048862.JPG` | cantilever | tracked |
| `1000048870.JPG` | cantilever | tracked |
| `1000048885.JPG` | cantilever | tracked |
| `1000048880.JPG` | cantilever | double swing |
| `6daccf5a-….JPG` | single bifolding | single swing |
| `2de5ec7c-….JPG` | radius | bifolding double |
| `1000052184.JPG` | random | single swing |
| `1000052148.JPG` | random | recinzioni |

---

## C. Impact on 2-week delivery

| Lane | What this unlocks now |
|---|---|
| **Website** | Strong heroes for double swing, tracked, bifold, fencing; keep screenshots out |
| **Indicative pricing** | Railhead **unit** prices available as provisional; totals still need count rule |
| **2D** | Ref photos for Victorian swing + tracked + bifold mechanism; CAD style still the render target |
| **3D/AR** | Prefer Steelyes installs (`1000048848` cantilever, bifold linkage shots) over Betafence sizes |
| **Enquire-only** | Telescopic, radius, single bifold stay thin — matches readiness doc |

### Immediate engineering queue (after your refiles)

1. Wire provisional railhead catalog from `railheads-catalog.json` (status `provisional`).
2. **2D CAD style — Phase 0–3 done**: tokens/paper/posts + dimension stack + visible clearance gap (`getCadClearancePx`, min 28 px). Parallel D3: CA-05 cantilever 1/3 + site-space note, CA-01 handle, gate-type enquire honesty, `sales@` (CA-06).
3. Copy top `configurator_ref` picks into `docs/frontend/gate-audits/{type}/photos/` where missing.
4. Cantilever: keep CA-05 1/3 rule; use `1000048848.JPG` as visual truth for rack/tail.
5. Do **not** enable configure for telescopic/radius until real installs exist.

---

## D. Gaps still open (not solved by this dump)

- `open.width_meaning` / `height_meaning`
- `open.railhead_count_rule` / dog-bar count
- Finish £55/m² base + area
- Size uplift formula
- Real telescopic / radius / single-bifold Steelyes site photos
- `dati utili` files still empty placeholders
- `random/` unfinished (~96)

---

## E. 2D style reminder

Locked: orthographic elevation, black linework, **red** dimensions, brick-hatch pillars — from [`2d-style-reference-double-swing-cad.png`](./2d-style-reference-double-swing-cad.png).  
Numbers on that CAD (3151 / 1400 / …) are **not** Steelyes listino.
