---
title: UI and Content Plan
description: Plan for stabilising the visible product surface before backend completion
owner: Ruben
status: ACTIVE
last_updated: 2026-05-06
---

# Steelyes — UI and Content Plan

This plan starts after DB/RLS hardening. It defines how to improve the visible product without inventing missing business data.

---

## Goal

Make the staging app credible, coherent, and easy to review before returning to backend completion.

The UI should communicate:

- Steelyes is a bespoke UK steel gate manufacturer and installer.
- Pricing and catalogue details are not final where Marius has not confirmed them.
- Quote/survey remains the commercial conversion path.
- Admin screens are functional tools, not marketing pages.

---

## Scope now

Work that can proceed immediately:

- Marketing page structure and copy polish.
- Mobile-first layout cleanup.
- Configurator entry page clarity.
- Admin catalogue UI clarity and empty/error states.
- Fallback copy for missing assets and non-final prices.
- Route inventory and content status tracking.
- Missing marketing route implementation:
  - `/gates/[style]`;
  - `/services`;
  - `/services/railings`;
  - `/services/balconies`;
  - `/services/security`;
  - `/case-study`.

Work that should not proceed yet:

- Final pricing claims.
- First-class railhead schema.
- Final finish catalogue.
- Final fencing panel catalogue.
- Public claims requiring legal/company details not yet supplied.

---

## Route inventory starting point

Observed app routes/files:

| Area | Route/file | Current planning status |
|---|---|---|
| Marketing | `/` via `apps/web/src/app/(marketing)/page.tsx` | Audit first; likely highest priority. |
| Marketing | `/about` | Audit content credibility and company detail gaps. |
| Marketing | `/contact` | Audit form/contact placeholders and legal/company gaps. |
| Marketing | `/gallery` | Audit asset consent/fallback state. |
| Marketing | `/gates` | Audit catalogue content and pricing disclaimers. |
| Marketing | `/installation` | Audit service-zone copy vs incomplete client data. |
| Marketing | `/case-study/[slug]` | Hide or fallback if real case study content is missing. |
| Marketing | `/configurator` | Audit entry flow and non-final pricing messaging. |
| Legal | `/legal/privacy-policy`, `/legal/cookie-policy`, `/legal/terms` | Audit placeholder/legal readiness. |
| Admin | `/admin`, `/admin/dashboard` | Keep utilitarian and protected. |
| Admin | `/admin/gates` | Already covered by CRUD tests; polish after public pages. |
| Admin | `/admin/gate-options` | Needs clear provisional railhead/option semantics. |
| Admin | `/admin/fencing` | Needs clear “catalogue incomplete” state. |
| Admin | `/admin/login` | Audit mobile usability and auth error copy. |

Full route findings should be recorded in `docs/frontend/PAGE_INVENTORY.md` after visual/code audit.

Detailed current audit:

- [`MARKETING_SITE_AUDIT_2026-05-06.md`](./MARKETING_SITE_AUDIT_2026-05-06.md)

Parallel work split:

- [`FRONTEND_PARALLEL_WORK_PLAN.md`](./FRONTEND_PARALLEL_WORK_PLAN.md)

Homepage copy draft:

- [`HOMEPAGE_COPY_DRAFT_2026-05-06.md`](./HOMEPAGE_COPY_DRAFT_2026-05-06.md)

Header and footer navigation plan:

- [`HEADER_FOOTER_UX_PLAN_2026-05-06.md`](./HEADER_FOOTER_UX_PLAN_2026-05-06.md)

Client gate requirements reference:

- [`CLIENT_GATE_REQUIREMENTS_REFERENCE.md`](./CLIENT_GATE_REQUIREMENTS_REFERENCE.md)

---

## Priority order

1. Homepage: first impression, proposition, quote CTA.
2. Gates/catalogue: product clarity and non-final pricing state.
3. Configurator entry: expectation setting before backend/share-link work.
4. Contact/quote path: conversion path must remain credible.
5. Installation/services: service area copy must not overpromise missing zone data.
6. Admin catalogue screens: make future Marius edits understandable.
7. Gallery/case study/legal: hide, fallback, or mark pre-launch depending on asset readiness.

---

## UI principles for this phase

- Build the actual product surface, not a landing-page-only shell.
- Keep operational/admin screens quiet, dense, and work-focused.
- Use restrained fallback language instead of fake certainty.
- Make missing data visible to the internal team but not sloppy to public users.
- Avoid adding backend dependencies unless the route cannot be reviewed without them.
- Keep mobile layout professional at 375 px before desktop refinement.

---

## Verification after implementation

For meaningful UI/content changes:

- `cd apps/web && pnpm typecheck`
- `cd apps/web && pnpm lint`
- `cd apps/web && pnpm build`
- Playwright route smoke where affected
- Browser screenshot review for key public pages on mobile and desktop

Record verification in `docs/CHANGELOG_INTERNAL.md` when the change is committed.
