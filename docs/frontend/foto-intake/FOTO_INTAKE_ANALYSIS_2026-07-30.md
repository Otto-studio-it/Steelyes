---
title: Foto Intake Analysis — organised dump 2026-07-30
description: Inventory of foto/ (trailing space), screenshots vs web photos, 3D models, railheads Numbers, 2D CAD style lock, client-measure supremacy
owner: Ruben
status: ACTIVE
last_updated: 2026-07-30
source: /Volumes/SSDRubb/Steelyes/foto 
related:
  - docs/frontend/DELIVERY_ROADMAP_2W_2026-07-30.md
  - docs/frontend/CONFIGURATOR_DATA_READINESS_2026-07-28.md
  - docs/frontend/gate-catalog/
  - docs/db/RAILHEADS_TBD.md
---

# Foto Intake Analysis — 2026-07-30

Root folder (note trailing space):

```text
/Volumes/SSDRubb/Steelyes/foto 
```

Machine inventory: [`INVENTORY.json`](./INVENTORY.json)  
2D style lock image: [`2d-style-reference-double-swing-cad.png`](./2d-style-reference-double-swing-cad.png)

---

## Rules locked from this batch

| Rule | Meaning |
|---|---|
| **Client measures win** | Never copy Betafence / SketchUp / BIM vendor sizes into Steelyes pricing or validation. Internet/3D models are geometry *hints* only. |
| **2D style = CAD elevation** | Orthographic front view, black linework, **red** dimension arrows/text, brick-hatch pillars, solid ground bar. Not photoreal, not three-quarter product renders. |
| **Screenshots ≠ website** | Any file named `Screenshot …` is **configurator engineering reference only**. Do not put on home/gallery/gates. |
| **Photos in type folders** | Candidates for `web` and/or `configurator_ref` after your manual pass + consent. |
| **`random/` + `railhead/`** | Still need sorting; railhead folder mixes catalogue SKUs + phone dumps. |

The CAD drawing you attached is a **style + gap-logic** reference. Its example numbers (3151 / 1400 / 30 / pillar min–max) are **not** Steelyes catalogue sizes. Steelyes widths/heights stay from client listino + CA answers (e.g. double swing FROM bands **1800/1900 × 900/1000**, cantilever tail **1/3 opening** from CA-05).

---

## Inventory summary

| Folder | Engine type | Photos | Screenshots (eng only) | 3D models | Notes |
|---|---|---:|---:|---:|---|
| `double swing gates` | `double_swing` | 48 | 3 | SKP + Betafence IFC/RFA | Strongest photo set |
| `single swing steel gate` | `single_swing` | 18 | 3 | Betafence Securifor IFC/RFA | Good |
| `traked sliding steel gate` | `tracked_sliding` | 41 | 3 | Betafence Egidia IFC/RFA | Typo in folder name |
| `steel cantilever sliding gate` | `cantilever_sliding` | 14 | 5 | Egidia IFC/RFA + `sliding_gate.igs` | Tail/runback visible in shots |
| `bifolding double swing gates ` | `bifolding_double_swing` | 7 | 4 | Heras sGate IFC/RFA + Wiki bifold RFA | Sparse photos |
| `single bifloding gates` | `single_bifolding` | 2 | 2 | — | Very thin |
| `telescopic slidings gates` | `telescopic_sliding` | 1 | 5 | — | Almost only screenshots |
| `radius slidings gates` | `radius_sliding` | 2 | 3 | — | Thin; product definition still open |
| `railhead` | railheads | 258 | 0 | — | + Numbers price book |
| `recinzioni giardino` | fencing | 27 | 0 | — | Site / fencing, not gate mechanism |
| `random` | unsorted | 98 | 0 | — | Needs your manual sort |

**Approx totals:** ~571 files · ~516 photo candidates · ~28 screenshots · ~14 model files · 1 Numbers workbook.

Empty placeholders (fill later): `dati utili` / `dati aggiuntivi` in radius, telescopic, cantilever, bifold folders.

---

## 2D configurator style (from your CAD)

Target look for SVG / canvas preview:

1. Flat front elevation (no perspective).
2. Gate + posts in black strokes; optional light fill.
3. Brick pillars as hatch pattern (not photos).
4. Ground as a thick horizontal bar.
5. Dimensions in **red**: extension lines, arrows, mm labels.
6. Show structural gaps explicitly when known:
   - centre meeting gap
   - hinge / pillar clearance ranges
   - ground clearance
7. Drive numbers from `GateConfig` / client rules — **not** from the CAD sample 3151×1400.

Suggested dimension set for double swing (client-driven, schematic until `width_meaning` closes):

- leaf height = `heightMm` (client)
- ground clearance = provisional constant until Marius confirms (CAD shows 30 mm as *style example only*)
- width = `widthMm` per client meaning
- side / centre gaps = engine/posts rules when confirmed

---

## Screenshots — what they teach (engineering only)

Copied samples live under `docs/frontend/foto-intake/shot-*.png`.

| Shot set | Useful for | Do **not** use for |
|---|---|---|
| Cantilever studio + driveway renders | Tail / counterbalance / guide posts silhouette | Web gallery; copying vendor proportions |
| Tracked / telescopic panel stacks | Multi-leaf overlap, track line, guide posts | Assuming Steelyes builds that exact panel |
| Bifold open / aerial | Fold hinge count, leaf split | Claiming we have confirmed `panels_per_leaf` |
| Radius corner | Curved travel / segmented leaf concept | Defining Steelyes radius product (still open intake) |
| Green bifold in “double swing” folder | Mechanism contrast (fold vs swing) | Mis-labelling as double swing on the site |

**Note:** some screenshots appear filed under the wrong gate type (e.g. bifold-looking shot in `double swing gates`). Trust mechanism, not folder, when studying them — and keep them out of marketing.

---

## 3D models already in `foto `

| Asset | Format | Use |
|---|---|---|
| `Dual Swing Driveway Gate.skp` (SketchupBox ID101664) | `.skp` | Topology study for swing leaves/posts; **re-scale to client mm** before AR |
| Betafence Egidia SC | `.ifc` / `.rfa` + size table `.txt` | Cantilever/sliding BIM vocabulary (span vs total space). **Vendor sizes — not Steelyes listino** |
| Betafence Securifor single leaf | `.ifc` / `.rfa` | Single swing post/leaf study |
| Heras sGate Trackless double leaf 7000–8000 | `.ifc` / `.rfa` | Bifold trackless articulation reference |
| Wiki bi-fold single leaf | `.rfa` | Single bifold mesh study |
| `sliding_gate.igs` | IGES | Dense CAD surface — inspect in CAD, do not ship raw to web |

**AR path for delivery (unchanged):** procedural mesh from `gate-engine` → GLB/USDZ. Vendor BIM is for understanding members, not for shipping Betafence geometry as Steelyes.

---

## External 3D references worth consulting (research)

Use for silhouette / mechanism only. Always remap to Steelyes dimensions.

| Type | Sources |
|---|---|
| Double swing | [SketchupBox dual swing](https://www.sketchupbox.com/202509190650178/), [3D Warehouse Metal Swing Gate](https://3dwarehouse.sketchup.com/model/625bff0b-ff89-4fde-b771-1be0c0f6cc02/Metal-Swing-Gate-Double-Panel), already downloaded SKP |
| Cantilever | [BIMobject Delta cantilever](https://www.bimobject.com/en-us/wallace-perimeter-security/product/delta-cantilever-sliding-gate), [Heras Delta](https://www.bimobject.com/en/heras/product/sliding-gate-delta-single-leaf), [Wisniowski Vega B](https://3dwarehouse.sketchup.com/model/5b940e12-c330-40c6-9ab8-be95029f2c9f/Modest-Vega-B-Automatic-cantilever-sliding-gate) |
| Tracked sliding | Betafence Egidia family already local; same Heras Delta set |
| Bifold | [Heras sGate Trackless](https://www.bimobject.com/en/heras/product/double-leaf-sgate-7000-8000) (already downloaded) |
| Telescopic | Search BIMobject / ARCAT “telescopic sliding gate” — few good free GLB; prefer procedural multi-box until client confirms panel count |
| Radius | Scarce honest models; keep schematic until `gate.radius.definition` answered |

---

## Railheads

### Numbers file

```text
foto /railhead/ordine degli railhead con tutti i loro dati annessi e prezzi.numbers
```

This **unblocks** the long-standing `RAILHEADS_TBD` data gap in principle. Numbers.app was not running at analysis time, so a clean CSV export is still needed.

Partial strings recovered from the package (lossy — verify in Numbers):

| Code (examples) | Fragments seen |
|---|---|
| `RH32` | 136 × 60 × 14 mm, “With Ball”, ~£0.55 ex VAT |
| `RH7NP` / `BRH7NP` | No peg, 110 × 60 × 20 mm, ~£0.29 ex / £0.35 inc |
| `RH13`, `RH126`, `Rh7`, `Rh102`, `Rh151`, `RH56`, `RH157` | Present in workbook strings |
| Currency | GBP, Ex VAT / Incl VAT mixed |

Filenames already encode many SKUs (`RH32.JPG`, `Rh1.JPG`, …). Full list in `INVENTORY.json` → `railhead_codes_from_filenames`.

**Action for you:** open Numbers → File → Export to CSV → save as:

```text
docs/frontend/foto-intake/railheads-export.csv
```

Then we can populate `packages/gate-engine/src/catalog/railheads.ts` as `provisional` (still survey-flagged until Marius signs off).

---

## Client data supremacy (do not override)

Still authoritative over anything in `foto `/internet:

| Source | Keeps winning |
|---|---|
| Gate catalog PDFs / MD | Mechanism definitions, FROM bands |
| CA-01…CA-07 | Handle rule, finish palette, cantilever 1/3, sales email, socials |
| Intake open questions | `width_meaning`, size uplift, finish £/m² base, bifold/telescopic/radius geometry |
| Delivery roadmap | 2 buildable + 2 schematic + 4 enquire for handoff |

Betafence `TotalSpaceNeeded` (e.g. 4000 span → 9600 total in their table) is **their** runback model — do **not** replace CA-05’s `tail = opening/3`.

---

## Recommended next steps (aligned to 2-week delivery)

1. **You (manual):** finish sorting `random/` into the 8 types + fencing; mark each photo `web` / `ref` / `discard`.
2. **You:** export Numbers → CSV (railheads).
3. **Engineering:** implement 2D SVG style pass matching the CAD (red dims, elevation).
4. **Engineering:** fix cantilever 1/3 + site-space note; quarantine invented count copy.
5. **Engineering:** study local SKP/IFC for mesh member names; keep procedural AR on Steelyes mm.
6. **Do not** publish Screenshot files on the site.

---

## Graphify

This analysis folder is the durable text corpus for agents. Prefer querying / updating graphify against `docs/frontend/foto-intake/` + gate-catalog rather than ingesting hundreds of JPGs raw.
