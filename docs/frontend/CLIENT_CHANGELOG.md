---
title: Client Change Log
description: Structured intake and prioritized backlog for client-requested site changes
owner: Ruben
status: ACTIVE
last_updated: 2026-05-19
---

# Steelyes — Client Change Log

Single backlog for every client-facing change request, polish item, and launch blocker.

Use this file before editing the site. Do not scatter requests across chat, email, or unlinked notes.

**Related docs**

- [`../CLIENT_BLOCKERS.md`](../CLIENT_BLOCKERS.md) — assets Marius must supply
- [`CONTENT_FALLBACKS.md`](./CONTENT_FALLBACKS.md) — safe copy while data is missing
- [`UI_UX_ROADMAP.md`](./UI_UX_ROADMAP.md) — detailed UI fix specs (May 2026)
- [`MARKETING_SITE_AUDIT_2026-05-06.md`](./MARKETING_SITE_AUDIT_2026-05-06.md) — route and claim risks
- [`PAGE_INVENTORY.md`](./PAGE_INVENTORY.md) — per-route content/UI tracker

---

## How to add a new request

Copy this block under **Inbox — new from Ruben** and fill every field:

```markdown
### CL-XXX — Short title
| Field | Value |
|---|---|
| Route / area | e.g. `/contact`, `SiteHeader`, configurator |
| Type | copy · layout · functionality · SEO · legal · asset · deploy |
| Priority | P0 launch blocker · P1 high · P2 medium · P3 low |
| Source | client call / WhatsApp / email / internal audit |
| Depends on | none · Marius data · deploy · senior review |
| Status | inbox · triaged · in_progress · done · blocked · wontfix |
| Notes | What to change, acceptance criteria, screenshots |
```

**Triage rules**

1. **P0** — legal/compliance, broken funnel, misleading pricing, domain not live.
2. **P1** — visible client feedback, mobile UX, conversion path, missing pages linked in nav.
3. **P2** — polish, accessibility, SEO fine-tuning, doc alignment.
4. **P3** — post-launch, nice-to-have, blocked on client assets.

**Status meanings**

| Status | Meaning |
|---|---|
| `done` | Shipped and verified locally or in staging |
| `in_progress` | Active branch / uncommitted work |
| `triaged` | Scoped, ready for implementation batch |
| `blocked` | Waiting on Marius or deploy |
| `inbox` | Recorded, not yet prioritized |
| `superseded` | Replaced by newer homepage/configurator work |

---

## Summary (2026-05-19)

| Priority | Done | Triaged | Blocked | In progress |
|---|---|---|---|---|
| P0 launch | 2 | 4 | 6 | 0 |
| P1 client UX | 18 | 8 | 2 | 1 |
| P2 polish | 4 | 12 | 0 | 0 |
| P3 later | 1 | 5 | 4 | 0 |

**Next implementation batches** (for Phase 2 cleanup)

1. **Batch A — Launch blockers** — deploy, legal footer, contact details, unsafe claims audit.
2. **Batch B — Remaining UI roadmap** — hero overlay, image `unoptimized`, microcopy `text-[10px]`.
3. **Batch C — Content truth** — pricing disclaimers, gallery consent, case study visibility.
4. **Batch D — Repo hygiene** — stale dirs, doc drift, `.gitignore` artifacts (see Phase 2 audit).

---

## Inbox — new from Ruben

_Add client requests here as Ruben provides them. Items move to numbered sections once triaged._

| ID | Title | Status |
|---|---|---|
| — | _No new verbatim client notes captured yet in this session. Paste the next batch below._ | inbox |

---

## P0 — Launch blockers

| ID | Route / area | Type | Request | Depends on | Status | Source |
|---|---|---|---|---|---|---|
| CL-001 | Vercel + `steelyes.co.uk` | deploy | Put Next app live; point domain away from GoDaddy legacy site | Marius DNS / Vercel project | blocked | `CLIENT_BLOCKERS.md`, `PROJECT_STATUS.md` |
| CL-002 | Footer + `/contact` | legal | Company number, VAT, real business email, phone, registered address | Marius | blocked | `CLIENT_BLOCKERS.md` |
| CL-003 | `/legal/*` | legal | Final privacy, cookie, terms copy + CMP alignment (Iubenda) | legal review | triaged | `MARKETING_SITE_AUDIT` |
| CL-004 | Pricing surfaces | copy | All public prices must say indicative / subject to survey; no invented motorised prices | Marius price list | triaged | `CONTENT_FALLBACKS.md`, `PRICING_SEMANTICS.md` |
| CL-005 | `/gallery` | asset | Publish only photos with property-owner consent | Marius consent | blocked | `CLIENT_BLOCKERS.md` |
| CL-006 | Configurator catalogue | functionality | Final gate prices, finishes, railheads for accurate quotes | Marius | blocked | `CLIENT_BLOCKERS.md` |
| CL-007 | Email deliverability | deploy | SPF/DKIM/DMARC for Resend on production domain | Marius DNS | blocked | `CLIENT_BLOCKERS.md` |
| CL-008 | Global claims audit | copy | Remove or soften unconfirmed stats (`500+`, `10yr`, `UK-wide`, Gate Safe, fixed £ amounts) | Marius confirmation | triaged | `MARKETING_SITE_AUDIT` |
| CL-009 | `/contact` form | functionality | Quote/contact submission must reach Steelyes (Resend + DB) | env vars on deploy | done | `ContactForm.tsx` + server actions |
| CL-010 | Admin production | functionality | Marius can log in to prod admin and manage catalogue | prod Supabase auth | done | `CHANGELOG_INTERNAL` 2026-05-09 |

---

## P1 — Client UX & conversion (documented requests)

Consolidated from [`UI_UX_ROADMAP.md`](./UI_UX_ROADMAP.md), homepage refresh, and marketing audit. Many original May-08 specs are **done** or **superseded** by the current homepage (`page.tsx`, `HomeWeldingHero.tsx`).

### Header, shell, mobile

| ID | Route / area | Type | Request | Status | Source |
|---|---|---|---|---|---|
| CL-101 | `SiteHeader` | accessibility | `aria-haspopup="menu"` on nav dropdowns | done | UI roadmap §1.1 |
| CL-102 | `SiteHeader` | accessibility | `aria-expanded` driven by React state, not hardcoded | done | UI roadmap §1.2 |
| CL-103 | `SiteHeader` | layout | Mobile drawer `100dvh` + `overscroll-contain` | done | UI roadmap §1.3 |
| CL-104 | `globals.css` | UX | `touch-action: manipulation` on links/buttons | done | UI roadmap §1.4 |
| CL-105 | `MarketingShell` | conversion | Sticky mobile quote CTA; hidden on `/configurator` | done | UI roadmap §6 |
| CL-106 | `MarketingShell` | conversion | WhatsApp help toast — mobile placement | done | commit `13dc831` |
| CL-107 | `SiteFooter` | UX | Replace duplicate Contact link with About | done | UI roadmap §3.7 |
| CL-108 | `SiteFooter` | accessibility | Footer muted text contrast (`text-zinc-400`) | done | UI roadmap §3.7 |

### Homepage & hero

| ID | Route / area | Type | Request | Status | Source |
|---|---|---|---|---|---|
| CL-201 | `/` hero | asset | Use real installed gate photo, not workshop/welding stock | done | `HOMEPAGE_IMAGE_SELECTION_2026-05-08` |
| CL-202 | `/` hero | layout | Full-viewport mobile height (`100svh`) | done | UI roadmap §2.1 |
| CL-203 | `/` hero | copy | Overline must not duplicate H1 | done | hero uses distinct overline |
| CL-204 | `/` hero | layout | Progressive H1 scale / `clamp()` typography | done | `HomeWeldingHero.tsx` |
| CL-205 | `/` hero | layout | Lighten overlay so product photo stays visible | triaged | Current `bg-black/45` + strong gradient; roadmap target ~45% combined |
| CL-206 | `/` hero | performance | Remove `unoptimized` on hero `next/image` after format check | triaged | `HomeWeldingHero.tsx` |
| CL-207 | `/` | layout | Gate style cards linked + browse CTAs | done | `page.tsx` gate styles section |
| CL-208 | `/` | layout | Mobile gate cards — horizontal scroll vs stacked giants | done | `page.tsx` scroll row |
| CL-209 | `/` | conversion | Configurator CTA + “subject to survey” disclaimer | triaged | Homepage redesigned; verify configurator section copy |
| CL-210 | `/` | conversion | Dedicated trust/proof strip (no fake stats) | superseded | Replaced by editorial intro + fabrication sections |
| CL-211 | `/` | asset | Client photo set on homepage mosaic / fabrication | done | `client-uploads/selected` |
| CL-212 | `/` | copy | Broader steel fabrication story (not gates-only) | done | Current homepage copy |

### Pages & routes

| ID | Route / area | Type | Request | Status | Source |
|---|---|---|---|---|---|
| CL-301 | `/gates/[style]` | SEO | Six gate detail pages with static params | done | `gates/[style]/page.tsx` |
| CL-302 | `/services` + children | SEO | Services overview + railings, balconies, security, structures, staircases | done | route files exist |
| CL-303 | `/case-study` | content | Index page linking to case studies | done | `case-study/page.tsx` |
| CL-304 | `/case-study/the-dream-gate` | content | Real case study content | blocked | Marius |
| CL-305 | `/gates` | copy | Indicative pricing language; link to detail pages | triaged | audit + `gates/page.tsx` |
| CL-306 | `/installation` | copy | Conservative service-area claims | triaged | audit |
| CL-307 | `/about` | copy | Remove unconfirmed numeric claims until Marius confirms | triaged | audit |
| CL-308 | Stale dirs | hygiene | Remove or redirect `gates-catalogue/`, `installation-services/` | triaged | `PAGE_INVENTORY` |

### Configurator (client-visible)

| ID | Route / area | Type | Request | Status | Source |
|---|---|---|---|---|---|
| CL-401 | `/configurator` | functionality | 2D-first wizard, live indicative price, save/share | done | configurator commits May 2026 |
| CL-402 | `/quote/[shareToken]` | functionality | Public share route for saved configurations | done | ADR-002 baseline |
| CL-403 | `/configurator` | layout | Mobile-first wizard + preview panel | in_progress | uncommitted local changes |
| CL-404 | `/configurator` | copy | Clear non-final pricing; survey-led handoff | triaged | `CONTENT_FALLBACKS` |
| CL-405 | `/configurator` | functionality | Finish catalog + style-aware pricing | done | Phase 2.5 commits |
| CL-406 | `/configurator` | functionality | On-demand 3D preview foundation | done | Phase 8 commit |
| CL-407 | `/configurator` | functionality | Railhead variants blocked until Marius data | blocked | Phase 9 + `RAILHEADS_TBD` |

---

## P2 — Polish & quality

| ID | Route / area | Type | Request | Status | Source |
|---|---|---|---|---|---|
| CL-501 | Global | a11y | Audit `text-[10px]` labels for mobile legibility (min 12px where possible) | triaged | UI roadmap, gallery, footer |
| CL-502 | `/` + gallery | performance | Image `sizes` attributes tuned per breakpoint | triaged | UI roadmap §7.3 |
| CL-503 | `public/images` | hygiene | Semantic filenames; WebP/AVIF where beneficial | triaged | UI roadmap §7 |
| CL-504 | `/` hero | layout | Safe-area insets for landscape iPhone | triaged | UI roadmap §2.5 |
| CL-505 | `layout.tsx` | build | Local fonts (no Google Fonts fetch at build) | done | commit `d13b08a` |
| CL-506 | `PAGE_INVENTORY.md` | docs | Sync route table with implemented pages | done | Phase 2 audit 2026-05-19 |
| CL-507 | `MARKETING_SITE_AUDIT` | docs | Mark missing routes as implemented | triaged | doc drift |
| CL-508 | E2E | quality | Configurator + admin CRUD Playwright green before handoff | triaged | `ci.yml`, local WIP |
| CL-509 | Repo | hygiene | `.gitignore` for `graphify-out/`, worktrees; untrack `graphify-out/` | done | Phase 2 audit 2026-05-19 |
| CL-510 | `docs/adr/` | hygiene | Remove stray screenshot file from adr folder | done | Phase 2 audit 2026-05-19 |
| CL-511 | Process section | layout | Desktop connector line between process steps | superseded | homepage redesign uses list layout |
| CL-512 | Gallery section | layout | Single column mobile + bottom-left captions | triaged | partial in `GalleryClient.tsx` |

---

## P3 — Client assets & post-launch

| ID | Asset / area | Type | Request | Status | Owner |
|---|---|---|---|---|---|
| CL-601 | Brand | asset | Logo SVG for nav/footer | blocked | Marius |
| CL-602 | Pricing | data | Confirmed manual + motorised base prices per gate | blocked | Marius |
| CL-603 | Railheads | data | Variant list + per-unit GBP | blocked | Marius |
| CL-604 | Finishes | data | Official palette + multipliers | blocked | Marius |
| CL-605 | Service zones | data | Postcode prefixes for install check widget | blocked | Marius |
| CL-606 | Gallery | asset | Telescopic install video | blocked | Marius |
| CL-607 | Gallery | asset | Workshop-only fallback until residential consent | triaged | fallback in `CLIENT_BLOCKERS` |
| CL-608 | CMP | legal | Iubenda cookie consent production config | triaged | `PROJECT_BRIEF` |
| CL-609 | SEO | content | Sitemap, structured data, meta audit all 16 pages | triaged | `DEFINITION_OF_DONE` |
| CL-610 | Handoff | docs | `docs/handover-marius.md` + Loom for admin | triaged | `DEFINITION_OF_DONE` |

---

## Claim & copy safety checklist

Review before sharing staging with Marius or going live. Tick when verified.

- [ ] No exact final prices without “indicative / subject to survey”
- [ ] No motorised price invented where DB value is NULL
- [ ] No project counts, years, or warranty unless Marius approved
- [ ] No “UK-wide” or zone claims beyond confirmed coverage
- [ ] No Gate Safe / certification badges without proof
- [ ] Gallery images cleared for publication (faces, plates, house numbers)
- [ ] Footer legal block complete or intentionally blank with internal flag
- [ ] Contact details match Marius-approved business info
- [ ] Configurator share links use `/quote/[shareToken]` baseline
- [ ] WhatsApp / quote CTAs do not promise instant final pricing

---

## Implementation log (this backlog)

| Date | Action |
|---|---|
| 2026-05-19 | Phase 1 intake: created backlog from `UI_UX_ROADMAP`, `MARKETING_SITE_AUDIT`, `CLIENT_BLOCKERS`, `PAGE_INVENTORY`, and current `apps/web` route scan. |
| 2026-05-19 | Phase 2 audit: CI baseline, `REPO_HEALTH.md`, `HANDOFF.md`, `.env.example`, route inventory sync, `graphify-out` untracked. |

_When an item ships, update Status here and add a line to [`../CHANGELOG_INTERNAL.md`](../CHANGELOG_INTERNAL.md) with commit hash._

---

## Open questions for Ruben

1. Paste the **verbatim client change list** (even small items) into **Inbox** — this file currently reflects documented/planned work, not a new WhatsApp thread.
2. Confirm whether **hero overlay** (CL-205) should be lightened further per original roadmap (~38% vs current ~45%+ gradient).
3. Confirm **case study** strategy: keep placeholder visible, or hide from nav until Marius delivers (CL-304).
4. Priority for **deploy** (CL-001) vs **more UI polish** before senior handoff.
