---
title: Content Fallbacks
description: Approved fallback rules while client assets and business data are pending
owner: Ruben
status: ACTIVE
last_updated: 2026-05-06
---

# Steelyes — Content Fallbacks

Use these rules when Marius has not supplied final content, prices, or assets.

The purpose is to keep progress moving without presenting provisional information as final.

---

## Pricing

Missing:

- final gate base prices;
- motorised prices;
- option prices;
- multipliers;
- railhead unit prices;
- finish multipliers.

Fallback:

- Use “Indicative, subject to survey” wherever totals or price-sensitive choices are shown.
- If a motorised price is `NULL`, do not invent a number.
- Prefer “Price on request” or “Survey required” for missing automated pricing.
- Keep admin gaps visible so missing catalogue data can be filled later.

Do not:

- publish placeholder prices as final;
- hard-code pricing logic outside the agreed DB/gate-engine path;
- create new pricing tables without confirmed business structure.

---

## Railheads

Missing:

- final variant list;
- unit prices;
- compatibility rules;
- ordering/install notes.

Fallback:

- Keep railheads as provisional `gate_options` rows.
- Describe railhead pricing as provisional or survey-dependent where public-facing.
- Do not create `railhead_variants` or equivalent first-class schema until the real catalogue arrives.

Reference:

- [`../db/RAILHEADS_TBD.md`](../db/RAILHEADS_TBD.md)

---

## Finish palette

Missing:

- final palette;
- finish multipliers;
- finish compatibility.

Fallback:

- Use a small generic palette only where needed for UI continuity:
  - matte black;
  - zinc grey;
  - bronze;
  - pearl white.
- Treat finish pricing as non-final.

Do not:

- imply these are the complete or official Steelyes finishes unless Marius confirms.

---

## Fencing panels

Missing:

- real catalogue data beyond the current minimal staging row.

Fallback:

- Show fencing as available/managed internally only if the page makes the incompleteness clear.
- Prefer “range being finalised” style copy over fake catalogue depth.

Do not:

- build a rich public fencing catalogue from a single staging row.

---

## Logo and brand assets

Missing:

- final logo SVG/vector package.

Fallback:

- Use text wordmark “STEELYES” or “Steelyes” depending on context.
- Keep typography clean and industrial.

Do not:

- create a new permanent logo mark without explicit approval.

---

## Gallery and case studies

Missing:

- property-owner photo consent;
- final case study content;
- showcase video.

Fallback:

- Use workshop/in-progress imagery only if available and appropriate.
- Hide case study navigation if there is no real story.
- Leave video slot out rather than showing empty media.

Do not:

- publish identifiable private properties without consent.

---

## Company/legal details

Missing:

- company number;
- VAT;
- final address;
- final business phone/email if not confirmed.

Fallback:

- Keep legal details as a pre-launch blocker.
- Use temporary contact details only if already agreed.

Do not:

- invent company or VAT details.
- claim DNS/email readiness before records are supplied and verified.
