---
title: Next Action Plan
description: Ordered execution plan after DB/RLS hardening
owner: Ruben
status: ACTIVE
last_updated: 2026-05-09
---

# Steelyes — Next Action Plan

This document controls what we do next. It separates work that can proceed now from work that must wait for Marius.

---

## Guiding decision

The database is in a controlled pause.

Reason:

- DB/RLS hardening is complete on staging.
- Remaining pricing/catalogue work depends on real client data.
- Continuing backend schema/pricing work now would be speculative.
- UI/content work can produce visible value immediately with documented fallbacks.

---

## Phase A — Documentation Alignment

**Status:** in progress

Goal: make the project easy to resume without reconstructing context from commits and scattered notes.

Deliverables:

- [x] Create `docs/PROJECT_STATUS.md` as the current snapshot.
- [x] Create `docs/NEXT_ACTION_PLAN.md` as the operating plan.
- [x] Create `docs/CHANGELOG_INTERNAL.md` as the verified work log.
- [x] Create `docs/frontend/` planning docs for UI/content.
- [ ] Review whether stale phase docs should be archived or updated after the next UI/content audit.

Closure condition:

- A developer can answer “what is done, what is blocked, and what comes next” by reading `PROJECT_STATUS.md` and `NEXT_ACTION_PLAN.md`.

---

## Phase B — UI/Content Inventory

**Status:** in progress

Goal: understand the visible product surface before editing design/content.

Work:

- [x] Inventory actual app routes under `apps/web/src/app`.
- [x] Compare existing routes against intended marketing/configurator/admin pages.
- [x] Identify pages with missing, placeholder, weak, or stale content.
- [ ] Identify visual issues on mobile and desktop with browser screenshots.
- [x] Identify where missing client assets need fallback states.
- [x] Record findings in `docs/frontend/PAGE_INVENTORY.md`.
- [x] Record detailed audit in `docs/frontend/MARKETING_SITE_AUDIT_2026-05-06.md`.
- [x] Record multi-agent work split in `docs/frontend/FRONTEND_PARALLEL_WORK_PLAN.md`.

Closure condition:

- We have a route-by-route list of what to polish, hide, rewrite, or leave alone. Browser visual review remains a separate implementation QA step.

---

## Phase C — Deployment Alignment

**Status:** urgent

Goal: make the repaired production Supabase Auth actually reachable from the public-facing app.

Work:

- [ ] Create or verify the Vercel project for this repo with root `apps/web`.
- [ ] Confirm Production env vars point to `steelyes-prod`:
  - `NEXT_PUBLIC_SUPABASE_URL = https://reqgfvahdcbmbajjqtve.supabase.co`
  - production anon key from `steelyes-prod`
  - production service-role key from `steelyes-prod`
- [ ] Deploy the Next app to a live Vercel production deployment.
- [ ] Verify `/admin/login` works on the active Vercel production URL.
- [ ] Repoint `steelyes.co.uk` from the legacy GoDaddy site to the new deployment when ready.

Closure condition:

- The public app is served by the new Next/Vercel deployment, not the legacy GoDaddy site.
- The public deployment uses `steelyes-prod`.
- `/admin/login` works from the real production frontend.

---

## Phase D — UI/Content Stabilization

**Status:** pending after deployment alignment

Goal: make the staging product feel coherent and credible before backend completion.

Work:

- [ ] Polish high-value public pages first:
  - homepage;
  - gates/catalogue;
  - configurator entry;
  - services/installations;
  - about/contact.
- [ ] Apply fallback copy consistently:
  - pricing is indicative;
  - railheads are provisional;
  - finish palette is generic until confirmed;
  - missing legal/company data is pre-launch TBD.
- [ ] Improve admin UI clarity where it helps Marius edit catalogue data later.
- [ ] Verify responsive behavior on mobile and desktop.
- [ ] Run typecheck, lint, build, and relevant Playwright tests after edits.

Closure condition:

- Staging can be shown as a polished work-in-progress without pretending missing client data is final.

---

## Phase E — Backend Completion

**Status:** paused

Resume when one of these becomes true:

- Marius provides final pricing/catalogue data.
- UI/content work requires a backend route or action.
- We decide share-link is in current scope and implement `/configurator/[id]`.
- Quote requests admin dashboard becomes a current deliverable.

Potential work:

- [ ] Implement `/configurator/[id]` or revised share route.
- [ ] Add share-link E2E.
- [ ] Import final catalogue data.
- [ ] Promote railheads from provisional `gate_options` only if real data justifies first-class schema.
- [ ] Re-run DB/RLS verification after any new migration.

Closure condition:

- Backend work is driven by real product requirements, not assumptions.

---

## Phase F — Pre-Production Closure

**Status:** future

Work:

- [ ] Confirm all critical assets are received or fallback is signed off.
- [ ] Re-run full app checks.
- [ ] Re-run targeted DB checks if any DB changes occurred after Phase 5 hardening.
- [ ] Verify quote funnel and email path.
- [ ] Verify admin access and catalogue workflows.
- [ ] Verify DNS/email/legal launch blockers.

Closure condition:

- All launch blockers are either resolved, explicitly signed off as fallback, or moved to v1.1.
