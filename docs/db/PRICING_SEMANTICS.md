# Pricing semantics — gates catalogue

This document describes how **gate base pricing** is modelled in Postgres and how product surfaces should interpret it. It does **not** replace migrations or generated types; it records agreed meaning for humans and implementers.

---

## Source of truth

**`public.gates`** is the authoritative catalogue row for each gate product variant used in pricing. Base amounts for the gate itself (before options, finishes multipliers where applicable, survey adjustments, etc.) live on each gate row.

All monetary fields discussed here are **GBP (£)**. Values seeded or edited before final client sign-off should be treated as **indicative** until Marius confirms the live price list.

---

## Column meanings

| Column | Meaning |
|--------|---------|
| `base_price_manual_gbp` | Base price for a **manual / non-motorised** installation of this gate. Required for catalogue integrity; use **0** or explicit placeholder only when the business intentionally has no manual baseline yet (still subject to client confirmation). |
| `base_price_auto_gbp` | Base price for the **motorised / automated** equivalent of the same gate. **May be `NULL`** when no automated price exists yet or the variant is manual-only until data arrives. |

The admin panel should **show both** columns side by side so staff can see gaps (e.g. manual priced, auto missing) at a glance.

The public configurator should select **manual vs auto** base price according to the user’s **`motorised`** (or equivalent) choice:

- **Not motorised** → use `base_price_manual_gbp`.
- **Motorised** → use `base_price_auto_gbp` when present; if `NULL`, the UI must not invent a number — show a clear “price on request / subject to survey” style state consistent with product copy.

---

## Relationship to other tables

Add-ons (railheads, infills, etc.) are **not** part of these two base columns. They are modelled separately (e.g. `gate_options` with their own `unit_price_gbp` and `unit_type`). See [`RAILHEADS_TBD.md`](./RAILHEADS_TBD.md) for railhead-specific uncertainty.

---

## Finish (colour) charge

Client-stated rate, 2026-07-28 ([CA-03](../client-answers/2026-07-28-marius.md#ca-03--finish-palette-and-colour-charge)): **GBP 55 per m², plus VAT**, for the four standard finishes.

This is **not yet implementable as a total.** Three inputs to the calculation are undefined:

| Missing input | Effect on the total |
|---|---|
| Whether the `FROM` price already includes one finish | Decides whether the charge applies to 1 or 4 of the standard finishes |
| What surface the m² measures — face area (`W × H`), both faces, or actual painted area | Changes the result by 2× or more |
| Whether open-bar Traditional Victorian pays the same rate as solid Composite Boards | Victorian has a fraction of the painted area at identical face dimensions |

Until those are confirmed:

- do **not** add a finish price column or a `gate_finishes` table;
- keep `FINISH_CATALOG` entries `provisional: true` in `packages/gate-engine/src/finishes.ts`;
- render no colour line item on quotes.

`other_ral` (customer-entered colour) is priced **off-system by design** — the client asked for "+ extra charge — powder coating" with the figure settled by email. It must carry no amount in the database or on a quote PDF.

## Aluminium panel upgrade

Client-stated uplifts, 2026-07-28 ([CA-02](../client-answers/2026-07-28-marius.md#ca-02--aluminium-panel-upgrade-on-composite-boards)): **+GBP 12.75 per panel** and **+GBP 12.00 per horizontal bar** converted from composite to aluminium, on `composite_boards` only.

Modelled as a per-unit `gate_options`-style add-on. It cannot produce a total because there is no rule for deriving the panel or bar count from gate dimensions, and the composite panel build itself (`open.composite_build`) has never been described. Show the option, state "quoted after survey", store no computed amount.

---

## Client confirmation

Any seed data, admin-entered figures, or copy that presents prices to end users remains **subject to Marius’s confirmed price list** and installation rules. Until then, prefer disclaimers such as “Indicative, subject to survey” where the product exposes totals.

---

## Dependencies

- **Row Level Security** and policy correctness on `public.gates` (and related tables) are owned by the security/schema audit track (Agent 1). This document does not assert RLS completeness.
