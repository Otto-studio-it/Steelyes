---
title: Page Inventory
description: Route-by-route UI and content audit tracker
owner: Ruben
status: ACTIVE
last_updated: 2026-05-19
---

# Steelyes — Page Inventory

Synced with live routes under `apps/web/src/app` on **2026-05-19**.

Use with [`CLIENT_CHANGELOG.md`](./CLIENT_CHANGELOG.md) for change requests and [`CONTENT_FALLBACKS.md`](./CONTENT_FALLBACKS.md) for safe copy rules.

---

## Public marketing routes

| Route | File | Content status | UI status | Decision |
|---|---|---|---|---|
| `/` | `(marketing)/page.tsx` | Real photos; some claims need Marius | Approved style | Polish copy/claims (CL-008) |
| `/about` | `(marketing)/about/page.tsx` | Skeleton; unconfirmed stats | Approved style | Review claims |
| `/contact` | `(marketing)/contact/page.tsx` | Form wired (server action) | Approved style | Update contact details when Marius provides |
| `/gallery` | `(marketing)/gallery/page.tsx` | Client photos; consent TBD | Approved style | Consent gate before launch |
| `/gates` | `(marketing)/gates/page.tsx` | Catalogue + indicative prices | Approved style | Disclaimer audit |
| `/gates/[style]` | `(marketing)/gates/[style]/page.tsx` | 6 static slugs | Approved style | Keep indicative pricing language |
| `/installation` | `(marketing)/installation/page.tsx` | Process copy | Approved style | Review service-area claims |
| `/services` | `(marketing)/services/page.tsx` | Implemented | Approved style | Conservative claims OK |
| `/services/railings` | `(marketing)/services/railings/page.tsx` | Implemented | Approved style | — |
| `/services/balconies` | `(marketing)/services/balconies/page.tsx` | Implemented | Approved style | — |
| `/services/security` | `(marketing)/services/security/page.tsx` | Implemented | Approved style | — |
| `/services/structures` | `(marketing)/services/structures/page.tsx` | Implemented | Approved style | — |
| `/services/staircases` | `(marketing)/services/staircases/page.tsx` | Implemented | Approved style | — |
| `/case-study` | `(marketing)/case-study/page.tsx` | Index links placeholder | Basic style | Hide or wait for Marius content |
| `/case-study/[slug]` | `(marketing)/case-study/[slug]/page.tsx` | Placeholder (`the-dream-gate`) | Basic style | Blocked on Marius |
| `/configurator` | `(marketing)/configurator/page.tsx` | Phase 2 live | Mobile polish ongoing | Indicative pricing disclaimers |
| `/quote/[shareToken]` | `(marketing)/quote/[shareToken]/page.tsx` | Share view live | Approved style | Baseline share route |

---

## Legal routes

| Route | File | Content status | UI status | Decision |
|---|---|---|---|---|
| `/legal/privacy-policy` | `(marketing)/legal/privacy-policy/page.tsx` | Placeholder | To audit | Pre-launch required (CL-003) |
| `/legal/cookie-policy` | `(marketing)/legal/cookie-policy/page.tsx` | Placeholder | To audit | Pre-launch required |
| `/legal/terms` | `(marketing)/legal/terms/page.tsx` | Placeholder | To audit | Pre-launch required |

---

## Admin routes

| Route | File | Content status | UI status | Decision |
|---|---|---|---|---|
| `/admin` | `admin/page.tsx` | Redirect/dashboard | Protected | Keep |
| `/admin/dashboard` | `admin/dashboard/page.tsx` | Utility | Internal | Keep |
| `/admin/gates` | `admin/gates/page.tsx` | CRUD tested | Functional | Keep |
| `/admin/gate-options` | `admin/gate-options/page.tsx` | CRUD tested | Functional | Clarify provisional options |
| `/admin/fencing` | `admin/fencing/page.tsx` | CRUD tested | Incomplete catalogue | Wait for Marius data |
| `/admin/login` | `admin/login/page.tsx` | Prod auth verified | Functional | Keep |

---

## Removed / never shipped

| Path | Notes |
|---|---|
| `gates-catalogue/` | Was empty alias; directory removed |
| `installation-services/` | Was empty alias; directory removed |

---

## Audit checklist per route

- [ ] Does the page explain its purpose quickly?
- [ ] Is the copy credible with current client data?
- [ ] Are placeholders clearly marked or hidden?
- [ ] Does mobile layout work at 375 px?
- [ ] Does desktop layout avoid oversized marketing filler?
- [ ] Are CTAs clear and not misleading?
- [ ] Are loading, empty, and error states professional?
- [ ] Are external claims legally safe?
- [ ] Are missing assets covered by documented fallback rules?
