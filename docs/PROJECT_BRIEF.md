---
title: Project Brief
description: Business overview, scope, timeline, success criteria
owner: Ruben + Marius (Steelyes Ltd)
status: APPROVED for execution
last_updated: 2026-04-20
---

# Steelyes Ltd — Project Brief

> Otto Studio · Business overview and execution scope
> Status: **APPROVED** — all decisions locked. Deviations require an ADR.

---

## What we're building

**Steelyes Ltd** is a UK manufacturer and installer of bespoke steel gates. We're building a digital platform to:

1. **Phase 1 — Marketing site**: SEO-optimised storefront (gates catalogue, services, gallery, about, contact, quote request)
2. **Phase 2 — Configurator**: Real-time parametric configurator for all 6 gate types. 2D preview by default, live indicative price, shareable configuration, and on-demand 3D/AR export
3. **Phase 3 — AR Preview**: "View in your driveway" — generates GLB+USDZ on demand, hands off to Apple Quick Look / Google Scene Viewer

**Timeline**: 13 weeks from kickoff (20 April 2026) to post-launch stabilisation.

---

## Three non-negotiable qualities

| Quality          | Why it matters                                            | How we deliver                                                                                                |
| ---------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Mobile-first** | 80% of traffic is mobile (UK consumer, Google Ads driven) | Every layout designed at 375 px first; touch targets ≥ 44 px; LCP < 2.0s on iPhone 12 / Galaxy A54 on real 4G |
| **SEO-native**   | Client runs paid Ads and needs organic lift               | SSG/ISR for all marketing pages, structured data, server-rendered HTML, sitemap + robots                      |
| **UK-GDPR safe** | UK consumer data, photos of clients' properties           | EU data residency, RLS, Turnstile, Iubenda CMP, PII blur on gallery assets                                    |

---

## Business model & constraints

- **No online payment** in v1. Steelyes' sales cycle is consultative (survey → quote → install). Quote funnel is the critical path.
- **No user accounts** in v1. Share tokens are enough for configuration persistence.
- **Single language**: EN-UK only.
- **No headless CMS** in v1. Content lives in the repo (MDX + JSON).
- **One deployable app** (marketing + configurator + admin in one Next.js instance, not three separate services).

---

## Phase overview (macro)

| Phase | Weeks | What | Gate |
|-------|-------|------|------|
| **Phase 0** | 1 | Setup: repo, Supabase, CI/CD | Preview URL + styled skeleton live |
| **Phase 1** | 2–5 | Marketing site + quote funnel | 16 pages live, quote E2E works |
| **Phase 2** | 6–9 | Configurator for 6 gate types | 2D preview works, price golden tests pass, 3D/AR handoff available |
| **Phase 3** | 10–11 | AR "View in your driveway" | iPhone + Android, scale accurate |
| **Phase 4** | 12–13 | Polish + launch | DNS live, Lighthouse green, client sign-off |

**Detailed success criteria per phase**: See `docs/DEFINITION_OF_DONE.md` (Phase-level section)

---

**Technology stack**: Next.js 14, TypeScript 5.x strict, Tailwind 3.x, Zustand, TanStack Query, Three.js, Supabase EU, Vercel, AWS S3.
See `docs/STACK_RULES.md` for full stack and constraints.

---

## Phasing and milestones

```
Week:        1    2    3    4    5    6    7    8    9   10   11   12   13
             ─────────────────────────────────────────────────────────────
Phase 0:     ██
Phase 1:          ████████████████
Phase 2:                               ████████████████
Phase 3:                                                  ████
Stabilise:                                                     ████████████
```

**Phase gates**: each phase must pass its milestone before the next begins.

---

## Who's involved

- **Ruben** (Otto Studio): Fullstack developer, UI/UX designer, security lead, DevOps
- **Marius** (Steelyes): Business owner, content provider, customer contact
- **Tool AI**: Cursor AI, Claude Code, Antigravity Pro (for visual prototyping)

---

## Critical path

1. **Phase 0 (Week 1)**: Repo scaffold, Supabase EU, CI/CD live
2. **Phase 1 (Weeks 2–5)**: Marketing site + quote funnel
3. **Phase 2 (Weeks 6–9)**: Gate engine (pricing + 2D renderer + on-demand 3D export) → configurator
4. **Phase 3 (Weeks 10–11)**: AR export + frontend integration
5. **Stabilise (Weeks 12–13)**: Polish, performance, launch

**Bottleneck**: shared configurator model + 2D renderer foundation (Weeks 6–8). Any delay here slows the usable configurator and the later AR handoff.

---

## What we're NOT doing in v1

Scope discipline. Post-launch candidates:

- Public user accounts (customers log in to see past configurations)
- Online payment / deposit collection
- Multi-language support
- Headless CMS (Sanity, Payload)
- WebXR / custom AR (native Quick Look / Scene Viewer only)
- Mobile app (responsive web only)
- Lambda image pipeline (S3 resize on-demand in Phase 1)

---

## Decision log (quick reference)

See `docs/adr/` for full architectural decision records.

| # | Decision | Rejected | Root reason |
|---|----------|----------|-------------|
| 1 | Next.js 14 App Router | Vite SPA | SEO is existential; paid Ads demand instant paint |
| 2 | Supabase EU | Convex | UK-GDPR data residency + Postgres portability |
| 3 | MDX content in repo | Sanity CMS | No content yet, premature complexity |
| 4 | Supabase Auth | Clerk | Single auth plane, zero extra cost |
| 5 | AWS S3 + CloudFront | Cloudflare R2 | Client request, tooling maturity |
| 6 | Procedural Three.js | Prefab GLB files | Parametric object — infinite combinations |
| 7 | Zustand | Redux/Context | Fine-grained subscriptions for high-frequency updates |
| 8 | TanStack Query | Raw fetch | Realtime invalidation with Supabase |
| 9 | Turnstile | reCAPTCHA | Privacy-first, no Google tracking |
| 10 | Iubenda | DIY consent | UK-GDPR done-for-you, GCM v2 ready |

---

## Open items awaiting client

| Item | Needed by | Impact | Fallback |
|------|-----------|--------|----------|
| Logo SVG | Week 2 | Nav/footer polish | Wordmark text only |
| Price list (6 gates × multipliers) | Week 6 | Configurator pricing | Placeholder with disclaimer |
| Finish palette + multipliers | Week 6 | Configurator options | 4 generic finishes |
| Company details (number, VAT, address) | Week 4 | Legal footer | Placeholder, flag pre-launch |
| Installation zones (postcode prefixes) | Week 4 | Zone check widget | "UK-wide coverage" |
| Case study content | Week 3 | Case study page | Hidden from nav |
| Photo consent from property owners | Week 12 | Gallery publication | Workshop/in-progress photos only |
| DNS registrar access | Week 13 | Domain cutover | Deploy to `steelyes.vercel.app` |

---

## How to use this document

- **For business context**: Start here. Skim the table of contents and phasing.
- **For technical decisions**: Go to `docs/ARCHITECTURE_RULES.md` and `docs/adr/`.
- **For roadmap and milestones**: Go to `docs/phases/README.md`.
- **For day-to-day execution**: Go to `docs/DEFINITION_OF_DONE.md`.
- **For code style and structure**: Go to `docs/CODEBASE_CONVENTIONS.md`.

---

**Locked document.** Changes require an ADR entry and Ruben + Marius approval.

_Last reviewed: 20 April 2026 · Next review: End of Phase 1_
