---
title: Project Status
description: Current execution state, ownership, blockers, and next focus
owner: Ruben
status: ACTIVE
last_updated: 2026-07-30
---

# Steelyes — Project Status

This is the current operating snapshot. Use it first when resuming work.

---

## Current position

| Area | Status | Owner | Notes |
|---|---|---|---|
| DB migrations | Closed for current DB/RLS scope | Ruben | 19 local migrations = 19 remote migrations on staging. |
| DB/RLS hardening | Closed on staging | Ruben | Phase 5 grant hardening applied and verified on 2026-05-06. |
| Supabase production auth | Restored | Ruben | `steelyes-prod` admin auth repaired on 2026-05-09 after fixing a broken `auth.users` record. |
| Business/pricing data | Partially unblocked | Marius | Batch 2026-07-28 landed the finish palette, cantilever tail rule, sales email and socials. Final prices, size uplift formula, railheads, finish rate base and real fencing catalogue still missing. 13 of 16 blocking intake questions remain. See [`client-answers/2026-07-28-marius.md`](./client-answers/2026-07-28-marius.md). |
| Client answer record | New canonical folder | Ruben | Verbatim client messages now live in [`docs/client-answers/`](./client-answers/README.md) with `CA-NN` ids. Other docs cite ids instead of re-quoting WhatsApp. |
| Public deployment/domain | Blocked operationally | Ruben + Marius | `steelyes.co.uk` still serves the legacy GoDaddy site; new Next app is not live on the public domain. |
| Share-link route | Confirmed baseline | Ruben | Default public share route is `/quote/[shareToken]`; `/configurator/[id]` is not the baseline path. |
| Configurator MVP | 2-week delivery in progress | Ruben | Authoritative plan: [`frontend/DELIVERY_ROADMAP_2W_2026-07-30.md`](./frontend/DELIVERY_ROADMAP_2W_2026-07-30.md). 2D-first; 3D/AR = phone camera via Quick Look / Scene Viewer after 2D is solid. Older master roadmap remains for file detail. |
| Frontend/content | Week-1 focus of delivery | Ruben | Deploy + claims + legal + honest 2D scope freeze (2 buildable + 2 schematic + 4 enquire). |
| Backend completion | Paused deliberately | Ruben | Resume when frontend requires it or client data arrives. |

---

## What is already done

- Supabase staging is linked and migration history is aligned.
- Supabase production project was identified and verified as separate from staging:
  - `steelyes-staging` → `hgeksaulzomkgqnfuriu`
  - `steelyes-prod` → `reqgfvahdcbmbajjqtve`
- Original blocking RLS bugs are resolved:
  - admin can insert/delete `gates`;
  - admin can delete `gate_options`;
  - anon can select saved `configurations` at DB/RLS layer;
  - duplicate typo policy on `service_zones` removed.
- `quote_requests` service-role read/update path is verified and granted.
- `admin_audit` access model is decided: service-role-only, no client-side admin policy.
- Phase 5 grant hardening is complete:
  - anon catalogue writes removed;
  - anon/authenticated non-DML table privileges removed where not part of the app model;
  - final targeted SQL check returned `unexpected_grant_count = 0`.
- Production auth for the known admin account is now verified working directly against `steelyes-prod`.
- The public domain is not yet serving the new app:
  - `steelyes.co.uk` currently serves the legacy GoDaddy website;
  - `steelyes.vercel.app` currently returns `DEPLOYMENT_NOT_FOUND`.
- App regression for the recorded admin CRUD scope passed earlier:
  - typecheck;
  - lint;
  - build;
  - Playwright admin CRUD 6/6.

Canonical DB references:

- [`docs/db/DB_CLOSURE_PLAN.md`](./db/DB_CLOSURE_PLAN.md)
- [`docs/db/STAGING_DB_BASELINE_2026-05-04.md`](./db/STAGING_DB_BASELINE_2026-05-04.md)
- [`docs/db/RAILHEADS_TBD.md`](./db/RAILHEADS_TBD.md)
- [`docs/db/PRICING_SEMANTICS.md`](./db/PRICING_SEMANTICS.md)
- [`docs/frontend/CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md`](./frontend/CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md)

Canonical client-data references:

- [`docs/client-answers/`](./client-answers/README.md) — verbatim answers, `CA-NN` ids
- [`docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md`](./frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md) — interpreted requirements
- [`docs/frontend/CLIENT_CHANGELOG.md`](./frontend/CLIENT_CHANGELOG.md) — triaged request backlog
- [`docs/frontend/CONFIGURATOR_DATA_READINESS_2026-07-28.md`](./frontend/CONFIGURATOR_DATA_READINESS_2026-07-28.md) — per-gate-type 2D/3D readiness verdict

---

## What remains open

### Open but owned by us

- Put the new app live on Vercel with production env vars pointing at `steelyes-prod`.
- Connect `steelyes.co.uk` (or a temporary Vercel domain) to the active deployment.
- Decide whether to extend the share route beyond `/quote/[shareToken]` or keep the MVP share model as-is.
- Audit UI/content routes and bring the visible product experience up to a client-ready staging baseline.
- Prepare fallback copy for missing catalogue data.
- Implement the 2D-first configurator foundation from `docs/frontend/CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md`.
- Coordinate parallel frontend work across Claude Code, Cursor, and Codex using `docs/frontend/FRONTEND_PARALLEL_WORK_PLAN.md`.
- Re-run frontend checks after UI/content changes.

### Blocked by Marius

- Final gate base prices:
  - `base_price_manual_gbp`;
  - `base_price_auto_gbp`.
- Final option prices and multipliers, including the size-uplift formula.
- Railhead variant list, unit prices, and compatibility rules.
- ~~Finish palette~~ ✅ received 2026-07-28 — what remains is the **finish rate base**: £55/m²+VAT is known, the base and the measured area are not.
- Aluminium panel upgrade count rule (£12.75/panel, £12/bar are known; the counts are not).
- Real `fencing_panels` catalogue data.
- Legal/company details (email ✅ received; company no., VAT, phone, address pending), photo consent, DNS access, and final launch assets.

Detailed blocker tracker:

- [`docs/CLIENT_BLOCKERS.md`](./CLIENT_BLOCKERS.md)

---

## Current execution rule

Do not create speculative DB schema or pricing logic for missing client data.

Proceed with frontend/content using clear fallback states:

- “Indicative, subject to survey” for pricing;
- the confirmed finish palette (four blacks + RAL 7016 + custom RAL) with pricing still marked provisional — **never** the retired zinc-grey/bronze/pearl-white set;
- railheads remain provisional `gate_options`;
- missing gallery/case study assets stay hidden or use workshop/in-progress alternatives;
- missing legal details remain a pre-launch blocker.

---

## Next focus

Execute the 2-week handoff plan:

1. **D0–D1** — Accept [`frontend/DELIVERY_ROADMAP_2W_2026-07-30.md`](./frontend/DELIVERY_ROADMAP_2W_2026-07-30.md); ping Marius; get Vercel prod URL live.
2. **Week 1** — Site truth + indicative pricing + honest 2D (no fiction gate types).
3. **Week 2** — Mesh parity → lazy 3D → GLB/USDZ → “View in your space” (phone camera).
4. Backend only when UI or confirmed client data requires it.

Execution plan:

- [`docs/frontend/DELIVERY_ROADMAP_2W_2026-07-30.md`](./frontend/DELIVERY_ROADMAP_2W_2026-07-30.md) (primary for next 14 days)
- [`docs/NEXT_ACTION_PLAN.md`](./NEXT_ACTION_PLAN.md) (legacy ordered list — defer to delivery roadmap on conflict)
