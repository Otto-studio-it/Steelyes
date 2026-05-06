---
title: Page Inventory
description: Route-by-route UI and content audit tracker
owner: Ruben
status: ACTIVE
last_updated: 2026-05-06
---

# Steelyes — Page Inventory

This file is the working tracker for the next UI/content audit. It starts from the current app route structure and should be updated as pages are implemented.

---

## Public marketing routes

| Route | File | Content status | UI status | Decision |
|---|---|---|---|---|
| `/` | `apps/web/src/app/(marketing)/page.tsx` | Skeleton, placeholder copy | Approved style present | Polish copy/claims later |
| `/about` | `apps/web/src/app/(marketing)/about/page.tsx` | Skeleton, placeholder story | Approved style present | Replace unsafe claims later |
| `/contact` | `apps/web/src/app/(marketing)/contact/page.tsx` | Skeleton, static form | Approved style present | Needs real submit path later |
| `/gallery` | `apps/web/src/app/(marketing)/gallery/page.tsx` | Skeleton, placeholder projects | Approved style present | Depends on assets/consent |
| `/gates` | `apps/web/src/app/(marketing)/gates/page.tsx` | Skeleton, hard-coded catalogue | Approved style present | Add links/details and safe pricing copy |
| `/installation` | `apps/web/src/app/(marketing)/installation/page.tsx` | Skeleton, placeholder process copy | Approved style present | Review service-area claims |
| `/case-study/[slug]` | `apps/web/src/app/(marketing)/case-study/[slug]/page.tsx` | Placeholder dynamic page | Basic approved style present | Needs index or hide strategy |
| `/configurator` | `apps/web/src/app/(marketing)/configurator/page.tsx` | Phase 2 preview shell | Approved style present | Do not prioritise for Phase 1 |
| `/gates/[style]` | `apps/web/src/app/(marketing)/gates/[style]/page.tsx` | Missing | Missing | Critical: Worker A |
| `/services` | `apps/web/src/app/(marketing)/services/page.tsx` | Missing | Missing | High: Worker B |
| `/services/railings` | `apps/web/src/app/(marketing)/services/railings/page.tsx` | Missing | Missing | Medium: Worker B |
| `/services/balconies` | `apps/web/src/app/(marketing)/services/balconies/page.tsx` | Missing | Missing | Medium: Worker B |
| `/services/security` | `apps/web/src/app/(marketing)/services/security/page.tsx` | Missing | Missing | Medium: Worker B |
| `/case-study` | `apps/web/src/app/(marketing)/case-study/page.tsx` | Missing | Missing | Medium: Worker B |

---

## Legal routes

| Route | File | Content status | UI status | Decision |
|---|---|---|---|---|
| `/legal/privacy-policy` | `apps/web/src/app/(marketing)/legal/privacy-policy/page.tsx` | To audit | To audit | Pre-launch required |
| `/legal/cookie-policy` | `apps/web/src/app/(marketing)/legal/cookie-policy/page.tsx` | To audit | To audit | Pre-launch required |
| `/legal/terms` | `apps/web/src/app/(marketing)/legal/terms/page.tsx` | To audit | To audit | Pre-launch required |

---

## Alias/stale directories

| Path | Status | Decision needed |
|---|---|---|
| `apps/web/src/app/(marketing)/gates-catalogue/` | Directory exists, no page | Redirect/remove/ignore after route plan is final. |
| `apps/web/src/app/(marketing)/installation-services/` | Directory exists, no page | Redirect/remove/ignore after route plan is final. |

---

## Admin routes

| Route | File | Content status | UI status | Decision |
|---|---|---|---|---|
| `/admin` | `apps/web/src/app/admin/page.tsx` | To audit | To audit | Keep protected |
| `/admin/dashboard` | `apps/web/src/app/admin/dashboard/page.tsx` | To audit | To audit | Internal utility |
| `/admin/gates` | `apps/web/src/app/admin/gates/page.tsx` | Tested for CRUD scope | To audit | Keep functional |
| `/admin/gate-options` | `apps/web/src/app/admin/gate-options/page.tsx` | Tested for CRUD scope | To audit | Clarify provisional options |
| `/admin/fencing` | `apps/web/src/app/admin/fencing/page.tsx` | Tested for CRUD scope | To audit | Clarify incomplete catalogue |
| `/admin/login` | `apps/web/src/app/admin/login/page.tsx` | To audit | To audit | Mobile usability |

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
