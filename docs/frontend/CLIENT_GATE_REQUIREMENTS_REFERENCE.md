---
title: Client Gate Requirements Reference
description: Working reference for client-supplied gate categories, provisional prices, decorative options, fencing panels, and related products
owner: Ruben
status: ACTIVE
last_updated: 2026-07-28
source: Client messages supplied by Ruben — verbatim record in docs/client-answers/
---

# Steelyes - Client Gate Requirements Reference

This document records the gate-related requirements and pricing notes supplied by the client. It is a working reference for frontend, configurator, admin catalogue, and future backend pricing work.

Important:

- Prices are provisional and should be treated as `FROM` prices.
- The client explicitly said prices may still change.
- Public marketing pages should avoid presenting these as final.
- Configurator/admin work may use this as a planning reference, but final production pricing requires confirmation.
- **Verbatim client text lives in [`../client-answers/`](../client-answers/README.md).** This file carries the interpretation; cite `CA-NN` ids rather than re-quoting messages.

---

## Confirmed Build Rules

Rules the client has stated unambiguously. These are constraints, not defaults — the customer cannot override them in the configurator.

| Rule | Statement | Source |
|---|---|---|
| Handle presence | Automated gates have **no handle**. Only manual gates carry a handle. Not a priced option — part of the base build. | [CA-01](../client-answers/2026-07-28-marius.md#ca-01--handle-only-on-manual-gates) |
| Cantilever tail | Tail = **1/3 of the clear opening between posts, minimum**. Total assembly = opening + tail. Worked example: 4000mm opening → 1333mm tail → 5333mm total. | [CA-05](../client-answers/2026-07-28-marius.md#ca-05--cantilever-tail--13-of-the-clear-opening-minimum) |
| Cantilever width input | The width the customer enters is the **clear opening only**. The tail is additional and must be shown on top of it. | [CA-05](../client-answers/2026-07-28-marius.md#ca-05--cantilever-tail--13-of-the-clear-opening-minimum) |
| Custom colour pricing | Custom RAL shows **"+ extra charge — powder coating, quoted separately"**, never a number. Marius sets the final figure by email. | [CA-03](../client-answers/2026-07-28-marius.md#ca-03--finish-palette-and-colour-charge) |

---

## Key Interpretation

The homepage marketing cards are not the same thing as the technical configurator categories.

Marketing direction currently used on homepage:

- `Modern`
- `Classic`
- `Privacy`

These are editorial/SEO categories that help users understand visual direction.

Client-supplied technical categories are primarily:

- gate opening/mechanism;
- style/infill;
- decorative options;
- automation/manual choice;
- size;
- fencing panels.

Recommended mapping:

| Marketing category | Client-aligned meaning | Confidence |
|---|---|---|
| Modern | Clean-line, architectural, contemporary examples if photos support it | Internal marketing category, not explicitly client-named |
| Classic | Traditional Victorian Style | High |
| Privacy | Composite Boards / closed or semi-closed designs | Medium-high |

Do not describe `Modern`, `Classic`, and `Privacy` as the official client technical categories unless Marius confirms that wording.

---

## Client Notes Summary

The client wants:

- gate prices shown as `FROM` pricing;
- price to increase with height and width;
- price to increase with selected options;
- fencing panel quantity support;
- each fencing panel to support height and length;
- ideally at least one fencing panel visible next to the gate and matching the gate style;
- AR/visualization categories on the website in the future;
- no separate client creation/visualization platform if website can handle it;
- a future `CASE STUDY` gate project in London.

---

## Configurator Structure

Recommended configurator hierarchy:

1. Gate opening/mechanism
2. Style/infill
3. Dimensions
4. Manual or automated
5. Decorative options
6. Fencing panels
7. Survey-led quote summary

---

## Gate Opening / Mechanism Categories

These are the main technical gate categories supplied by the client.

| Gate type | Notes |
|---|---|
| Double Swing Gates | Vehicle gate with two swing leaves |
| Single Swing Gate | Single-leaf gate, smaller access or driveway use |
| Tracked Sliding Gate | Client wrote `Trucked Sliding Gate`; likely means tracked sliding gate |
| Cantilevered Sliding Gates | Sliding gate without full ground track across entrance |
| Bifolding Double Swing Gates | Double gate with folding leaves |
| Single Bifolding Gate | Single bifold gate |
| Telescopic Sliding Gate | Multi-panel sliding solution |
| Radius Sliding Gate | Curved/radius sliding gate |

Implementation note:

Use the route/SEO slugs already created for marketing pages:

- `/gates/sliding`
- `/gates/cantilever`
- `/gates/bifold`
- `/gates/pedestrian`
- `/gates/telescopic`
- `/gates/architectural`

But the configurator may need a more detailed internal enum than the marketing route list.

---

## Style / Infill Categories

Client-supplied primary styles:

| Style | Meaning |
|---|---|
| Traditional Victorian Style | Open metal bar style with decorative options such as railheads, middle bar, dog bars, bushes, spirals |
| Composite Boards | More closed/filled design, likely privacy-oriented |

Possible internal mapping:

| Internal style | Client style |
|---|---|
| `traditional_victorian` | Traditional Victorian Style |
| `composite_boards` | Composite Boards |

Do not add additional first-class styles until confirmed by the client.

### Composite Boards — aluminium panel upgrade

The client asked for composite panels to be **swappable for aluminium panels** while keeping the composite appearance. This is a material substitution inside `composite_boards`, not a new style.

Stated uplifts:

- **+ GBP 12.75** per panel, over standard composite;
- **+ GBP 12.00** per horizontal bar converted from composite to aluminium.

Possible internal key:

```txt
aluminium_panel_upgrade
```

Status: **not priceable yet.** The source message was truncated and four parameters are missing — whether the rate is per panel or per m², whether the two uplifts are additive, whether the figures include VAT, and how the panel/bar count is derived from gate size. The option may be modelled and shown, but its total must render as "quoted after survey" until those land. See [CA-02](../client-answers/2026-07-28-marius.md#ca-02--aluminium-panel-upgrade-on-composite-boards).

Incompatible with `traditional_victorian` — there are no panels to swap.

---

## Finishes / Colours

The client replaced the earlier generic palette. **`zinc grey`, `bronze` and `pearl white` are withdrawn — do not reintroduce them anywhere, including fallback copy.**

Standard palette (four finishes, all at the same rate):

| Internal code | Client name |
|---|---|
| `black_satin` | Satin black |
| `black_gloss` | Gloss black |
| `black_matt` | Matt black |
| `anthracite_ral7016` | Anthracite RAL 7016 |

Plus a customer-entered custom colour:

| Internal code | Behaviour |
|---|---|
| `other_ral` | Free-text RAL box. Shows **"+ extra charge — powder coating, quoted separately"**. No number on any public surface. |

Rate: **GBP 55/m² plus VAT** for the standard finishes.

Internal note, never to be published: Marius indicated the custom-colour extra sits around GBP 250–300, but explicitly asked to keep it out of the configurator and settle it by email. Treat the range as a sanity check for our own quoting, not as a value to display or store on a quote.

Open on the rate (blocking, `open.finish_uplift_rule`):

- Does the `FROM` price already include one finish, with the others at +GBP 55/m²? Or is every finish +GBP 55/m² on a bare galvanised base?
- What area is the m² — gate face (`width × height`), both faces, or actual painted surface?
- Does the same rate apply to Traditional Victorian? Open bars have a fraction of the painted area of a solid composite panel at the same face dimensions.

Source: [CA-03](../client-answers/2026-07-28-marius.md#ca-03--finish-palette-and-colour-charge).

---

## Provisional Base Prices

All prices below are `FROM` prices and provisional.

### Double Swing Gates

| Style | Height | Width | Automated | Manual |
|---|---:|---:|---:|---:|
| Traditional Victorian Style | 900/1000mm | 1800/1900mm | GBP 3800 | GBP 1800 |
| Composite Boards | Not specified | Not specified | GBP 3800 | GBP 1800 |

### Single Swing Gate

| Style | Height | Width | Automated | Manual |
|---|---:|---:|---:|---:|
| Traditional Victorian Style | 900/1000mm | 800/900mm | GBP 2700 | GBP 850 |
| Composite Boards | Not specified | Not specified | GBP 2700 | GBP 750 |

### Tracked Sliding Gate

| Style | Height | Width | Automated | Manual |
|---|---:|---:|---:|---:|
| Traditional Victorian Style | 900/1000mm | 2500/2600mm | GBP 3600 | GBP 2200 |
| Composite Boards | Not specified | Not specified | GBP 3600 | GBP 2200 |

### Cantilevered Sliding Gates

| Style | Height | Width | Automated | Manual |
|---|---:|---:|---:|---:|
| Traditional Victorian Style | 900/1000mm | 2500/2600mm | GBP 4200 | GBP 2900 |
| Composite Boards | Not specified | Not specified | GBP 4200 | GBP 2900 |

### Bifolding Double Swing Gates

| Style | Minimum height | Width | Automated | Manual |
|---|---:|---:|---:|---:|
| Traditional Victorian Style | 900/1000mm | 2900/3000mm | GBP 4200 | GBP 2500 |
| Composite Boards | 900/1000mm | 2900/3000mm | GBP 4200 | GBP 2500 |

### Single Bifolding Gate

| Style | Minimum height | Width | Automated | Manual |
|---|---:|---:|---:|---:|
| Traditional Victorian Style | 900/1000mm | 1500/1600mm | GBP 3000 | GBP 1900 |
| Composite Boards | 900/1000mm | 1500/1600mm | GBP 3000 | GBP 1900 |

### Telescopic Sliding Gate

| Style | Starting height | Width | Automated | Manual |
|---|---:|---:|---:|---:|
| Traditional Victorian Style | 900/1000mm | 2000/2100mm | GBP 4200 | GBP 3100 |
| Composite Boards | 900/1000mm | 2000/2100mm | GBP 4200 | GBP 3100 |

### Radius Sliding Gate

| Style | Height | Width | Automated | Manual |
|---|---:|---:|---:|---:|
| Traditional Victorian Style | 900/1000mm | 1600/1700mm | GBP 4200 | GBP 2500 |
| Composite Boards | 900/1000mm | 1600/1700mm | GBP 4200 | GBP 2500 |

---

## Pricing Rules

Client notes:

- Prices are `FROM` prices.
- Increasing height increases price.
- Increasing length/width increases price.
- Added options increase price.

Implementation notes:

- Do not publish final totals until pricing logic is confirmed.
- Public pages should use language such as `from price, subject to survey`.
- Admin/configurator can prepare fields, but formulas need explicit confirmation.
- Backend should avoid hard-coding formulas from assumptions.

---

## Decorative Options

### Middle Bar

Client description:

- A middle bar separates the gate lengthwise into two parts.

Price:

- Extra GBP 275

Possible internal key:

```txt
middle_bar
```

### Railheads - Top Row

Client description:

- Railheads can be added to the top of the gate.
- Pricing depends on selected railhead.
- One railhead may cost GBP 25 while another may cost GBP 1.25.
- Client wants railheads to visually appear on the gate if possible, even approximately 70/80% like the photo.

Possible internal key:

```txt
top_railheads
```

Open questions:

- final railhead list;
- exact unit price per railhead;
- spacing/count calculation;
- compatibility with each gate style;
- whether visual replication is required for every railhead type.

### Dog Bars

Client description:

- Double bars in the lower part of the gate.
- Called `DOG BARS`.

Price:

- Standard extra from GBP 75
- Each extra bar with increased width: GBP 4.50

Possible internal key:

```txt
dog_bars
```

Open questions:

- how to count bars based on width;
- whether price is per bar, per pair, or calculated by span;
- compatibility with composite boards.

### Railheads on Dog Bars

Client description:

- Adds a second railhead row on dog bars.
- Works the same as top railheads.

Possible internal key:

```txt
dog_bar_railheads
```

Open questions:

- whether same railhead type must be used on top and dog bars;
- whether different railhead rows can be selected independently.

### Arched / Curved Top

Client description:

- Top of gate can be curved instead of straight.
- Client called it `bolta`.
- Same option for each gate.

Price:

- Extra GBP 850

Possible internal key:

```txt
arched_top
```

### Bushes and Spirals

Client description:

- Bushes and spirals for vertical bars.

Pricing:

- Standard extra cost: GBP 90
- Bushes: minimum GBP 2.50, up to GBP 12.50
- Spirals: minimum GBP 3.80

Possible internal keys:

```txt
bushes
spirals
```

Open questions:

- exact variants;
- exact unit pricing;
- visual placement rules;
- compatibility with composite boards.

---

## Fencing / Railings Panels

Client wants:

- customer can add total number of fencing/railing panels;
- example: choose 2 panels;
- each panel has its own height;
- each panel has its own length;
- ideally at least one panel can appear next to the gate and match the gate.

Client wording:

```txt
Railings panels X NR
```

Recommended data shape for future configurator:

```ts
type FencePanelInput = {
  quantity: number
  panels: {
    heightMm: number
    lengthMm: number
  }[]
}
```

Visualization note:

- If possible, render at least one matching panel next to the selected gate.
- Do not overbuild this before gate visualization basics are stable.

---

## Additional Products

Client listed these related products:

- Metal balconies
- Platforms
- Security grills
- Security walkable grills
- Staircases
- Sliding and swinging openable terraces
- Glass balconies
- Frameless glass terraces
- Stainless steel posts/handrail and glass terraces

Frontend implication:

- `/services` should eventually cover these, but only pages with enough content should be exposed in navigation.
- Current safe service route is `/services/railings`.
- Do not expose unsupported service pages until implemented.

---

## AR / Visualization Notes

Client notes:

- Categories can be created on the website for visualization in AR.
- No separate platform is required for client creation and visualization if the website can handle it.

Interpretation:

- AR/visualization is future scope.
- Current priority is a credible marketing site and quote/configurator path.
- Avoid committing to AR in public copy until implementation is planned.

---

## Case Study Note

Client mentioned:

```txt
CASE STUDY gate project in London
```

Interpretation:

- This may become a future case study.
- Do not publish a fake case study until real project content, location permission, photos, and copy are approved.

---

## Open Questions for Client

Answered on 2026-07-28 — do not ask again:

- What board colours/finishes exist? → four blacks + RAL 7016, see **Finishes / Colours** above ([CA-03](../client-answers/2026-07-28-marius.md#ca-03--finish-palette-and-colour-charge)).
- What is the cantilever tail ratio? → 1/3 of the clear opening, minimum ([CA-05](../client-answers/2026-07-28-marius.md#ca-05--cantilever-tail--13-of-the-clear-opening-minimum)).
- Is the cantilever configurator width the opening or opening + tail? → opening only ([CA-05](../client-answers/2026-07-28-marius.md#ca-05--cantilever-tail--13-of-the-clear-opening-minimum)).
- Official contact email? → `sales@steelyes.co.uk` ([CA-06](../client-answers/2026-07-28-marius.md#ca-06--official-sales-email)).

New questions raised by the 2026-07-28 batch:

- Finishes: does the `FROM` price include a colour, what area is the m², and does the rate apply to open-bar Victorian?
- Aluminium panels: panel/bar count rule, whether the two uplifts are additive, VAT treatment.
- Handle: side/position on single swing, and whether manual sliding gates use the same part.

Pricing:

- Are all listed prices still valid?
- Should public pages show any `FROM` prices, or only configurator/admin?
- What is the exact formula for height and width increments?

Railheads:

- What are the exact railhead variants?
- What is each unit price?
- How should railhead count be calculated?

Dog bars:

- Is GBP 75 a base option price?
- Is GBP 4.50 charged per extra bar or per width increment?

Bushes and spirals:

- What are the exact variants and unit prices?
- Are these available on all Traditional Victorian gates?

Composite boards:

- Are composite board prices always the same as Traditional Victorian for each gate type, except where listed differently?
- How is a composite panel built (thickness, reinforcement, how many horizontal members)? Still unanswered, and it blocks the aluminium upgrade count rule.

Fencing panels:

- Should panels be priced per panel, per metre, or by height/length formula?
- Should panel style always match the selected gate?

Visualization:

- How accurate must railheads/dog bars/panels appear visually in the configurator?
- Is approximate visual matching acceptable for launch?

---

## Implementation Guidance

For public marketing pages:

- Use visual categories such as `Modern`, `Classic`, and `Privacy`.
- Keep claims broad and safe.
- Avoid final prices.
- Avoid technical details not confirmed.

For configurator/admin:

- Use technical gate types.
- Store style/infill separately from opening mechanism.
- Treat decorative options as add-ons.
- Keep prices editable in admin where possible.
- Keep all provisional values clearly marked until confirmed.

For database/backend:

- Do not create new first-class schema for railheads/dog bars/fencing panels without a confirmed model.
- Existing `gate_options` style can hold provisional add-ons until final structure is clear.

---

## Current Recommendation

Use `Modern`, `Classic`, and `Privacy` on the homepage as marketing direction cards.

Use the client-supplied technical categories in the configurator and admin pricing model.

This keeps the public site simple while preserving the detail needed for quoting and future visualization.
