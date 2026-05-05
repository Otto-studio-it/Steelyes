# Railheads — schema and data TBD

Railhead variants (decorative tops, dog-bar rows, etc.) **do not** have a dedicated first-class table yet. Shipping a proper `railhead_variants` (or similar) model **waits on real catalogue data** from the client.

---

## Owner input required (Marius)

Marius must supply:

- The **variant list** (what is sold, named, and priced).
- **Unit prices** per variant (and whether they differ by gate type/size if applicable).
- Any **compatibility / range rules** (which gates or size bands each variant applies to).
- **Notes** for install or ordering constraints.

Until that arrives, engineering should **not** add migrations solely to guess railhead structure.

---

## Current representation

Today, railheads are carried as rows in **`public.gate_options`** with:

- `unit_type = 'per_railhead'` (and related slugs such as `railheads-top`, `railheads-dog-bars` in seed/migration scripts).
- Placeholder or **non-final** `unit_price_gbp` / notes where the business has only rough guidance (e.g. wide per-railhead £ ranges called out in seed comments).

Treat these rows as **staging placeholders**: good for wiring the admin UI and configurator flows, **not** as signed-off retail pricing.

---

## Minimum fields to collect before a dedicated table

When promoting railheads out of `gate_options`, plan for at least:

| Field | Purpose |
|-------|---------|
| `slug` | Stable machine id for URLs, config JSON, and FKs. |
| `name` | Human label in admin and configurator. |
| `unit_price_gbp` | Confirmed GBP unit price (per railhead unless business defines another unit). |
| `compatibility` / range | Which gate types, styles, or size bands may select this variant. |
| `notes` | Survey, lead time, or upsell caveats. |

---

## Dependencies

- Final schema for railheads and migrations is **blocked on client data** above.
- **RLS and admin write policies** on `gate_options` (and any future railhead tables) remain part of the Agent 1 security audit; this note does not certify policy completeness.
