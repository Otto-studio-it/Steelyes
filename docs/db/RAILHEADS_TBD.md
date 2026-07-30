# Railheads — schema and data TBD

Railhead variants (decorative tops, dog-bar rows, etc.) **do not** have a dedicated first-class DB table yet.

**Update 2026-07-30:** Marius Numbers workbook was exported to CSV and normalised into:

- [`docs/frontend/foto-intake/railheads-catalog.json`](../frontend/foto-intake/railheads-catalog.json)
- [`docs/frontend/foto-intake/railheads-catalog.csv`](../frontend/foto-intake/railheads-catalog.csv)

**61 SKUs**, **54 with EX VAT unit prices** (£0.20–£3.50). Status = **provisional** (WhatsApp product cards). Safe to populate `packages/gate-engine/src/catalog/railheads.ts` as `provisional` and keep quote totals survey-flagged until count rules + Marius sign-off.

Still missing before “final”:

- Count / compatibility rules (`open.railhead_count_rule`)
- Confirmation prices are current listino
- 7 SKUs with dims but no price in the export (RH122, RH45, RH55, RH56, RH62, RH70, RH79)

See also [`docs/frontend/foto-intake/FOTO_DEEP_ANALYSIS_2026-07-30.md`](../frontend/foto-intake/FOTO_DEEP_ANALYSIS_2026-07-30.md).

---

## Owner input required (Marius)

Marius must still confirm / complete:

- Sign-off that the Numbers sheet is the live sell list.
- Prices for SKUs missing EX VAT in the export.
- **Count rules** (how many top / dog-bar railheads vs width).
- Compatibility (Victorian vs Composite; top row vs dog-bar row).

Until count rules land, engineering may show the variant picker with provisional unit prices but must not present a hard final railhead line total.

---

## Current representation

Today, railheads are carried as rows in **`public.gate_options`** with:

- `unit_type = 'per_railhead'` (and related slugs such as `railheads-top`, `railheads-dog-bars` in seed/migration scripts).
- Placeholder or **non-final** `unit_price_gbp` / notes where the business has only rough guidance.

Treat seed rows as staging placeholders until replaced by the provisional catalog above.

### Engine catalog module

- `packages/gate-engine/src/catalog/railheads.ts` — next step: load provisional entries from `railheads-catalog.json`
- `packages/gate-engine/src/catalog/variants.ts` — validation / listing / pricing hooks
- `packages/gate-engine/src/catalog/types.ts` — shared types

**When wiring the export:** populate `DEFAULT_RAILHEAD_VARIANT_CATALOG.entries` from the JSON, set `status` to `provisional`, keep survey disclaimer on totals.

---

## Minimum fields before a dedicated table

| Field | Purpose |
|-------|---------|
| `slug` | Stable id (e.g. `rh32`) |
| `name` | Human label |
| `unit_price_gbp` | EX VAT per railhead |
| `height_mm` / footprint | From catalog dims |
| `compatibility` | Gate type / style / row |
| `notes` | Survey / lead time |

---

## Dependencies

- Final DB table still waits on count/compatibility sign-off.
- RLS/admin policies on `gate_options` (and any future railhead table) are separate from this data note.
