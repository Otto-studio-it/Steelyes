---
title: Marketing Site Audit
description: Current storefront route structure, approved style patterns, missing pages, and implementation risks
owner: Ruben
status: ACTIVE
last_updated: 2026-05-06
---

# Steelyes — Marketing Site Audit

This audit records the current storefront state before Phase 1 frontend work continues.

The current site already reflects the client-approved visual direction. The next work should complete missing pages and replace unsafe placeholders without changing the approved look and feel.

---

## Current visual system

Use the existing implementation as the source of truth:

- `apps/web/src/components/marketing/MarketingShell.tsx`
- `apps/web/src/components/marketing/SiteHeader.tsx`
- `apps/web/src/components/marketing/SiteFooter.tsx`
- `apps/web/src/components/marketing/MediaPlaceholder.tsx`
- `apps/web/src/app/(marketing)/*/page.tsx`

Approved style characteristics:

- industrial editorial tone;
- warm off-white canvas: `#FBF9F6`, `#F5F3F0`, `#EFEEEB`;
- dark steel sections: `#1B1C1A`, near-black overlays;
- red accent: `#9E000C` / `#C41E1E`;
- condensed uppercase headings through `font-heading`;
- small uppercase technical labels through `font-mono`;
- strong section blocks, borders, grids, and technical spec cards;
- rectangular controls and cards, not soft rounded SaaS cards;
- placeholder media via `MediaPlaceholder` until real assets are approved.

Reference prototypes were previously kept in a local export folder outside the product tree. Keep any future visual reference material out of source control unless Ruben explicitly decides to import assets or commit them.

---

## Existing implemented public routes

| Route | File | Current state | Notes |
|---|---|---|---|
| `/` | `apps/web/src/app/(marketing)/page.tsx` | Implemented skeleton | Matches approved homepage structure; still has placeholder copy, placeholder media, non-final stats/pricing. |
| `/gates` | `apps/web/src/app/(marketing)/gates/page.tsx` | Implemented skeleton | Has 6 cards and indicative prices; currently no detail links and no `/gates/[style]/page.tsx`. |
| `/about` | `apps/web/src/app/(marketing)/about/page.tsx` | Implemented skeleton | Strong style; contains placeholder story and unconfirmed numeric claims. |
| `/installation` | `apps/web/src/app/(marketing)/installation/page.tsx` | Implemented skeleton | Strong style; contains unconfirmed UK-wide/service-zone claims. |
| `/contact` | `apps/web/src/app/(marketing)/contact/page.tsx` | Implemented skeleton | Form is static `type="button"`; contact details are placeholders/unconfirmed. |
| `/gallery` | `apps/web/src/app/(marketing)/gallery/page.tsx` | Implemented skeleton | Good layout; depends on photo consent and real project assets. |
| `/configurator` | `apps/web/src/app/(marketing)/configurator/page.tsx` | Implemented preview shell | Phase 2 surface, not Phase 1 core. Contains non-final pricing copy. |
| `/case-study/[slug]` | `apps/web/src/app/(marketing)/case-study/[slug]/page.tsx` | Implemented placeholder dynamic page | Only `the-dream-gate`; no `/case-study` index. |
| `/legal/privacy-policy` | `apps/web/src/app/(marketing)/legal/privacy-policy/page.tsx` | Placeholder | Needs final legal/compliance copy later. |
| `/legal/cookie-policy` | `apps/web/src/app/(marketing)/legal/cookie-policy/page.tsx` | Placeholder | Needs final cookie/CMP copy later. |
| `/legal/terms` | `apps/web/src/app/(marketing)/legal/terms/page.tsx` | Placeholder | Needs final terms later. |

---

## Existing directories without pages

These directories exist but do not currently expose routes because they have no `page.tsx`:

| Intended route | Current directory | Priority | Decision |
|---|---|---|---|
| `/gates/[style]` | `apps/web/src/app/(marketing)/gates/[style]/` | Critical | Add dynamic gate-detail page. |
| `/services` | `apps/web/src/app/(marketing)/services/` | High | Add services overview. |
| `/services/railings` | `apps/web/src/app/(marketing)/services/railings/` | Medium | Add service page or defer with clear owner. |
| `/services/balconies` | `apps/web/src/app/(marketing)/services/balconies/` | Medium | Add service page or defer with clear owner. |
| `/services/security` | `apps/web/src/app/(marketing)/services/security/` | Medium | Add service page or defer with clear owner. |
| `/gates-catalogue` | `apps/web/src/app/(marketing)/gates-catalogue/` | Low | Probably stale alias; redirect to `/gates` or remove directory. |
| `/installation-services` | `apps/web/src/app/(marketing)/installation-services/` | Low | Probably stale alias; redirect to `/installation` or remove directory. |

Missing but useful:

| Route | Priority | Decision |
|---|---|---|
| `/case-study` | Medium | Add index page if case studies remain in nav/content; otherwise hide case-study links until real content exists. |
| `/contact/thank-you` or `/quote/success` | Medium | Add only when quote form submission is wired. |
| `/quote/[shareToken]` or equivalent | Future | Phase 2/share-link app feature; not Phase 1 marketing core. |

---

## Proposed Phase 1 page set

To satisfy the “16 marketing pages” target without inventing unsupported backend scope:

1. `/`
2. `/about`
3. `/gates`
4. `/gates/[style]` with 6 static params or supported slugs
5. `/installation`
6. `/contact`
7. `/gallery`
8. `/services`
9. `/services/railings`
10. `/services/balconies`
11. `/services/security`
12. `/case-study`
13. `/case-study/[slug]`
14. `/legal/privacy-policy`
15. `/legal/cookie-policy`
16. `/legal/terms`

`/configurator` exists but should be counted as Phase 2-adjacent, not as the core Phase 1 marketing deliverable.

---

## Highest priority implementation gaps

### 1. `/gates/[style]`

Why:

- It is the most SEO-relevant missing route.
- It turns the gate catalogue from a card grid into actual detail pages.
- It can be implemented from static local copy and placeholder media.
- It does not require final pricing if copy clearly says “indicative, subject to survey”.

Expected slugs:

- `cantilever`
- `bifold`
- `pedestrian`
- `telescopic`
- `sliding`
- `architectural`

The exact names can be adjusted to match current catalogue copy, but avoid creating slugs that will be hard to support later.

### 2. `/services` and service pages

Why:

- The directories already exist.
- They expand SEO beyond gates.
- They support cross-sell for railings, balconies, and security fabrication.

Risk:

- Do not overclaim real service areas, certifications, or legal guarantees unless confirmed.

### 3. `/case-study`

Why:

- `/case-study/[slug]` exists but has no index.
- If case studies are part of the navigation/story, the index should exist.

Risk:

- Real case study content and photo consent are blocked by Marius. Keep it as a controlled placeholder or hide from nav.

### 4. Contact and CTA path

Why:

- Phase 1 depends on quote funnel credibility.
- Current `/contact` form is static and has placeholder contact details.

Risk:

- Do not wire new backend behavior in the same PR as broad marketing page creation unless ownership is explicit.

---

## Placeholder and claim risks

These should be reviewed before showing staging externally:

- Homepage stats: `500+`, `10yr`, `UK-wide`, `Free`.
- Homepage/configurator prices: `£3,450.00`, `£2,845`.
- `/gates` prices: six hard-coded starting prices.
- `/about` claims: `15+`, `2.4k`, “Built for London”.
- Footer/contact address and phone numbers.
- Gallery project titles and project numbers.
- “UK-wide install team” and service-zone claims.
- Any Gate Safe/certification claims copied from prototypes.

Use fallback rules:

- [`CONTENT_FALLBACKS.md`](./CONTENT_FALLBACKS.md)

---

## Implementation rules

- Keep `MarketingShell`, `SiteHeader`, and `SiteFooter` as shared surface unless a single coordinator owns navigation changes.
- Use `MediaPlaceholder` until approved images are available.
- Keep copy in the approved industrial editorial voice.
- Use existing color and typography conventions.
- Do not introduce a new component library or redesign.
- Do not touch DB, admin actions, or Supabase code during marketing-page work unless explicitly assigned.
- After each work package, run at least:
  - `cd apps/web && pnpm typecheck`
  - `cd apps/web && pnpm lint`
  - `cd apps/web && pnpm build`
