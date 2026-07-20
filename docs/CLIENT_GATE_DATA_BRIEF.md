---
title: Client Gate Data Brief
description: Consolidated client-supplied gate data, pricing notes, options, and panel requirements for the configurator and future 3D work
owner: Ruben
status: ACTIVE
last_updated: 2026-06-24
source: Marius client message provided in chat
---

# Steelyes - Client Gate Data Brief

This file consolidates the technical and commercial data supplied by the client for the configurator.

Rules:

- Prices are `FROM` prices.
- If height or width increases, price increases.
- Additional options increase price.
- Where the client provided a range or incomplete value, keep it provisional until confirmed.
- Do not invent missing railhead prices or compatibility rules.

---

## Shared configurator requirements

The client wants the configurator to support:

- one selected gate type at a time;
- manual or automated pricing;
- style selection;
- width and height inputs;
- decorative options;
- a total number of railing panels;
- each railing panel with its own `height` and `length`;
- ideally at least one railing panel visible next to the gate and matching the gate style;
- pricing shown as `FROM GBP`.

The client also said the future 3D work should try to match the photos as closely as possible, ideally around `70/80%` visual similarity for the decorative railhead details.

---

## Railing panels

Requested behaviour:

- client can add a total number of panels, for example `2`;
- each panel has:
  - `height`;
  - `length`;
- if possible, show at least one panel next to the gate in the preview;
- the panel should visually match the selected gate.

Recommended data shape:

- `quantity`
- `panels[]`
- each panel:
  - `heightMm`
  - `lengthMm`

---

## Gate types

The client confirmed these gate types:

- `DOUBLE SWING`
- `SINGLE SWING`
- `TRACKED SLIDING`
- `CANTILEVER SLIDING`
- `BIFOLDING DOUBLE SWING`
- `SINGLE BIFOLDING`
- `TELESCOPIC SLIDING`
- `RADIUS SLIDING`

---

## 1. Double Swing

### Traditional Victorian Style

- Height: `900/1000 mm`
- Width: `1800/1900 mm`
- Automated: `FROM GBP 3800`
- Manual: `FROM GBP 1800`

### Composite Boards

- Automated: `FROM GBP 3800`
- Manual: `FROM GBP 1800`

### Notes

- This is a swing gate with two leaves.
- Width and height increases should raise price.
- Decorative Victorian options should be available where compatible.

---

## 2. Single Swing

### Traditional Victorian Style

- Height: `900/1000 mm`
- Width: `800/900 mm`
- Automated: `FROM GBP 2700`
- Manual: `FROM GBP 850`

### Composite Boards

- Automated: `FROM GBP 2700`
- Manual: `FROM GBP 750`

### Notes

- Single-leaf swing gate.
- Suitable for smaller access openings or pedestrian-style use.

---

## 3. Tracked Sliding

### Traditional Victorian Style

- Height: `900/1000 mm`
- Width: `2500/2600 mm`
- Automated: `FROM GBP 3600`
- Manual: `FROM GBP 2200`

### Composite Boards

- Automated: `FROM GBP 3600`
- Manual: `FROM GBP 2200`

### Notes

- Client wrote `Trucked sliding gate`; this is interpreted as `Tracked Sliding`.
- Width and height changes should affect price.
- Sliding mechanism and track details should be available for the 3D plan.

---

## 4. Cantilever Sliding

### Traditional Victorian Style

- Height: `900/1000 mm`
- Width: `2500/2600 mm`
- Automated: `FROM GBP 4200`
- Manual: `FROM GBP 2900`

### Composite Boards

- Automated: `FROM GBP 4200`
- Manual: `FROM GBP 2900`

### Notes

- Cantilevered system.
- 3D preview should reflect the counterbalance / support structure.

---

## 5. Bifolding Double Swing

### Traditional Victorian Style

- Minimum height: `900/1000 mm`
- Width: `2900/3000 mm`
- Automated: `FROM GBP 4200`
- Manual: `FROM GBP 2500`

### Composite Boards

- Automated: `FROM GBP 4200`
- Manual: `FROM GBP 2500`

### Notes

- Bi-folding double swing gate.
- Useful where reduced opening space is needed.

---

## 6. Single Bifolding

### Traditional Victorian Style

- Minimum height: `900/1000 mm`
- Width: `1500/1600 mm`
- Automated: `FROM GBP 3000`
- Manual: `FROM GBP 1900`

### Composite Boards

- Automated: `FROM GBP 3000`
- Manual: `FROM GBP 1900`

### Notes

- Single bifolding gate.
- Dimensions and fold geometry should be captured for future 3D work.

---

## 7. Telescopic Sliding

### Traditional Victorian Style

- Starting height: `900/1000 mm`
- Width: `2000/2100 mm`
- Automated: `FROM GBP 4200`
- Manual: `FROM GBP 3100`

### Composite Boards

- Automated: `FROM GBP 4200`
- Manual: `FROM GBP 3100`

### Notes

- Telescopic multi-panel sliding system.
- 3D preview should ideally show panel overlap and retraction order.

---

## 8. Radius Sliding

### Traditional Victorian Style

- Height: `900/1000 mm`
- Width: `1600/1700 mm`
- Automated: `FROM GBP 4200`
- Manual: `FROM GBP 2500`

### Composite Boards

- Automated: `FROM GBP 4200`
- Manual: `FROM GBP 2500`

### Notes

- Curved / radius sliding gate.
- The top curve should be represented in the preview and later in 3D.

---

## Decorative options

These are the options the client described for Traditional Metal Victorian Style.

### 1. Middle bar

- Description: bar that splits the gate lengthwise into two parts
- Extra price: `GBP 275`

Internal key:

- `middle_bar`

### 2. Top railheads

- Description: railheads only on the top of the gate
- Price: depends on the selected railhead
- Example range given by client:
  - one railhead may cost `GBP 25`
  - another railhead may cost `GBP 1.25`
- Visual request:
  - railheads should appear on the gate as closely as possible to the reference photo;
  - target similarity: `70/80%`

Internal key:

- `top_railheads`

Open item:

- final railhead catalog and exact price per variant are still to be confirmed.

### 3. Double bars at the bottom

- Description: double bars in the lower part, described by the client as `bari duble in partea de jos`
- Standard extra: `GBP 75`
- Additional note from client:
  - each bar increasing width adds `GBP 4.50`

Internal key:

- likely `dog_bars`

Open item:

- confirm exact geometry and whether this is a fixed option or width-based multiplier.

### 4. Railheads on dog bars

- Description: two rows of railheads:
  - one row at the top of the gate;
  - one row in the middle / on the dog bars;
- Pricing behaves the same as top railheads

Internal key:

- likely `dog_bar_railheads`

Open item:

- confirm whether the second row uses the same variant catalog and count rules as the top row.

### 5. Arched top / curved top

- Description: the top of the gate is curved instead of straight
- Extra price: `GBP 850`
- Applies to each gate type

Internal key:

- `arched_top`

### 6. Circles between vertical bars

- Description: circles inserted between the vertical bars
- Requires one extra horizontal bar
- Extra bar price: `GBP 275`
- Circle unit price: `GBP 2.50`
- Circle count increases with gate width

Internal key:

- likely a dedicated decorative option or a geometry-derived quantity

Open item:

- define the exact count formula from gate width.

### 7. Bushes

- Description: decorative bushes on the vertical bars
- Standard extra: `GBP 90`
- Bush unit price:
  - minimum `GBP 2.50`
  - larger bushes up to `GBP 12.50`

Internal key:

- `bushes`

Open item:

- confirm bush sizes, count rules, and visual variants.

### 8. Spirals

- Description: decorative spirals on the vertical bars
- Spiral unit price minimum: `GBP 3.80`

Internal key:

- `spirals`

Open item:

- confirm sizes, variants, and count rules.

---

## Pricing rules to preserve

- All prices are `FROM` prices.
- Increasing height increases price.
- Increasing width / length increases price.
- Added options increase price.
- If the exact motorised price or option price is not confirmed, do not invent it.
- Public copy should stay aligned with `FROM GBP` and `subject to survey` language where needed.

---

## Data still to confirm

For each gate type, the client should still confirm:

- exact width and height ranges;
- width and height steps if any;
- compatible finishes;
- option compatibility by gate type;
- exact railhead variant list;
- exact railhead prices;
- exact count rules for railheads, bushes, spirals, circles, and dog bars;
- whether each gate should be visually represented as:
  - schematic;
  - realistic;
  - close to reference photo;
- any installation constraints that change the preview or pricing.

---

## Recommended next step

Use this brief as the single intake document for:

- configurator pricing;
- admin catalogue setup;
- 2D preview rules;
- 3D mesh planning.

