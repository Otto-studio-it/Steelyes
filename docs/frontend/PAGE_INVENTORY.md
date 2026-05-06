---
title: Page Inventory
description: Route-by-route UI and content audit tracker
owner: Ruben
status: DRAFT
last_updated: 2026-05-06
---

# Steelyes — Page Inventory

This file is the working tracker for the next UI/content audit. It starts from the current app route structure and should be filled in after visual/code review.

---

## Public marketing routes

| Route | File | Content status | UI status | Decision |
|---|---|---|---|---|
| `/` | `apps/web/src/app/(marketing)/page.tsx` | To audit | To audit | Prioritise |
| `/about` | `apps/web/src/app/(marketing)/about/page.tsx` | To audit | To audit | Prioritise |
| `/contact` | `apps/web/src/app/(marketing)/contact/page.tsx` | To audit | To audit | Prioritise |
| `/gallery` | `apps/web/src/app/(marketing)/gallery/page.tsx` | To audit | To audit | Depends on assets/consent |
| `/gates` | `apps/web/src/app/(marketing)/gates/page.tsx` | To audit | To audit | Prioritise |
| `/installation` | `apps/web/src/app/(marketing)/installation/page.tsx` | To audit | To audit | Prioritise |
| `/case-study/[slug]` | `apps/web/src/app/(marketing)/case-study/[slug]/page.tsx` | To audit | To audit | Hide if no real content |
| `/configurator` | `apps/web/src/app/(marketing)/configurator/page.tsx` | To audit | To audit | Prioritise |

---

## Legal routes

| Route | File | Content status | UI status | Decision |
|---|---|---|---|---|
| `/legal/privacy-policy` | `apps/web/src/app/(marketing)/legal/privacy-policy/page.tsx` | To audit | To audit | Pre-launch required |
| `/legal/cookie-policy` | `apps/web/src/app/(marketing)/legal/cookie-policy/page.tsx` | To audit | To audit | Pre-launch required |
| `/legal/terms` | `apps/web/src/app/(marketing)/legal/terms/page.tsx` | To audit | To audit | Pre-launch required |

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
