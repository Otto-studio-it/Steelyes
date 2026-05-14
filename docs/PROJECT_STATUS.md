---
title: Project Status
description: Current execution state, ownership, blockers, and next focus
owner: Ruben
status: ACTIVE
last_updated: 2026-05-09
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
| Business/pricing data | Blocked | Marius | Final prices, railheads, finishes, and real fencing catalogue still missing. |
| Public deployment/domain | Blocked operationally | Ruben + Marius | `steelyes.co.uk` still serves the legacy GoDaddy site; new Next app is not live on the public domain. |
| Share-link route | Pending app feature | Ruben | DB allows anon read of saved configurations, but `/configurator/[id]` does not exist yet. |
| Frontend/content | Next focus | Ruben | UI/content can proceed with documented fallbacks while client data is pending. |
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

---

## What remains open

### Open but owned by us

- Put the new app live on Vercel with production env vars pointing at `steelyes-prod`.
- Connect `steelyes.co.uk` (or a temporary Vercel domain) to the active deployment.
- Decide whether to implement `/configurator/[id]` now or move share-link E2E out of DB technical closure.
- Audit UI/content routes and bring the visible product experience up to a client-ready staging baseline.
- Prepare fallback copy for missing catalogue data.
- Coordinate parallel frontend work across Claude Code, Cursor, and Codex using `docs/frontend/FRONTEND_PARALLEL_WORK_PLAN.md`.
- Re-run frontend checks after UI/content changes.

### Blocked by Marius

- Final gate base prices:
  - `base_price_manual_gbp`;
  - `base_price_auto_gbp`.
- Final option prices and multipliers.
- Railhead variant list, unit prices, and compatibility rules.
- Finish palette and finish multipliers.
- Real `fencing_panels` catalogue data.
- Legal/company details, photo consent, DNS access, and final launch assets.

Detailed blocker tracker:

- [`docs/CLIENT_BLOCKERS.md`](./CLIENT_BLOCKERS.md)

---

## Current execution rule

Do not create speculative DB schema or pricing logic for missing client data.

Proceed with frontend/content using clear fallback states:

- “Indicative, subject to survey” for pricing;
- generic finish palette where needed;
- railheads remain provisional `gate_options`;
- missing gallery/case study assets stay hidden or use workshop/in-progress alternatives;
- missing legal details remain a pre-launch blocker.

---

## Next focus

The next project phase is:

1. Documentation cleanup and alignment.
2. Public deployment alignment.
3. UI/content implementation and polish.
4. Backend completion only when driven by real UI needs or client data.

Execution plan:

- [`docs/NEXT_ACTION_PLAN.md`](./NEXT_ACTION_PLAN.md)
