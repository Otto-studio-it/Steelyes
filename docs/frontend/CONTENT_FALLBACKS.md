---
title: Content Fallbacks
description: Approved fallback rules while client assets and business data are pending
owner: Ruben
status: ACTIVE
last_updated: 2026-07-28
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

**No longer a fallback — the real palette arrived on 2026-07-28** ([CA-03](../client-answers/2026-07-28-marius.md#ca-03--finish-palette-and-colour-charge)).

Confirmed and live in `packages/gate-engine/src/finishes.ts`:

- black satin;
- black matt;
- black gloss;
- anthracite RAL 7016;
- custom RAL (customer-entered).

Still missing:

- what the £55/m² + VAT rate applies to (base included or not, which area, Victorian vs composite);
- finish compatibility per style.

Fallback for the rate only:

- Treat finish pricing as non-final; keep `provisional: true` in the catalog.
- Do not put a colour line item on a quote until the rate base is confirmed.
- Custom RAL shows **"+ extra charge — powder coating, quoted separately"**, never a figure. Marius sets the final price by email — this is his explicit instruction, not our caution.

Do not:

- reintroduce **zinc grey**, **bronze** or **pearl white**. The client withdrew them on 2026-07-28. If you find them in code, copy, tests or seed data, remove them.
- publish the internal £250–300 indication for custom colours on any customer-facing surface.

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

Confirmed 2026-07-28 ([CA-06](../client-answers/2026-07-28-marius.md#ca-06--official-sales-email), [CA-07](../client-answers/2026-07-28-marius.md#ca-07--social-profiles)):

- public email `sales@steelyes.co.uk`;
- Instagram, Facebook and TikTok profile URLs.

Missing:

- company number;
- VAT;
- final address;
- final business phone.

Fallback:

- Keep legal details as a pre-launch blocker.
- Use temporary contact details only if already agreed.
- Never fall back to `steelyes@yahoo.com` — it is superseded.

Do not:

- invent company or VAT details.
- claim DNS/email readiness before records are supplied and verified.
