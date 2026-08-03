---
title: Definition of Done
description: Acceptance criteria and checklists for tasks, PRs, phases, and releases
owner: Ruben (QA lead)
status: APPROVED for execution
last_updated: 2026-04-20
---

# Steelyes — Definition of Done

> Checklists for closing issues, PRs, phases, and the entire launch.
> Non-negotiable. Nothing ships without all items green.

---

## Task-level (GitHub issue)

A task is **done** when:

### Code quality
- [ ] No `console.log`, `debugger`, or `any` types left in code
- [ ] TypeScript strict mode compliant (`pnpm typecheck` green)
- [ ] ESLint clean (`pnpm lint` green)
- [ ] No TODOs without GitHub issue reference (`TODO: fix #123`)
- [ ] No hardcoded secrets, API keys, or credentials

### Functionality
- [ ] Acceptance criteria on the issue pass locally
- [ ] Tested on **both** iPhone 12 (Safari) and Galaxy A54 (Chrome) via DevTools or real device
- [ ] No new console errors or warnings
- [ ] Network requests validated (no failed API calls)

### Testing
- [ ] Unit tests written if logic is non-trivial
  - gate-engine functions must have ≥ 95% coverage
  - Utility functions should have edge case tests
- [ ] E2E test updated if user flow affected (Playwright)
- [ ] Manual smoke test on staging URL (if UI-visible)
- [ ] Tested with expected data + edge cases (empty, null, max values)

### Performance
- [ ] Lighthouse Performance unchanged or **improved** on affected routes
- [ ] Bundle size not increased (check bundle analyzer if new deps)
- [ ] No Three.js code outside configurator/AR routes
- [ ] Three.js rebuild time < 30 ms (if mesh-related)
- [ ] No memory leaks (if Three.js: dispose() verified)

### Security
- [ ] No PII in logs or error messages
- [ ] Server-side validation on all Server Actions
- [ ] RLS policies tested (if DB change)
  - anon cannot read/write restricted tables
  - admin can read/write own resources
- [ ] Rate limiting respected (if form submission)
- [ ] No SQL injection vectors

### Accessibility
- [ ] Keyboard navigation works (if interactive)
- [ ] Screen reader friendly (axe DevTools scan, no errors)
- [ ] Colour contrast 4.5:1 minimum (if new colour)
- [ ] Touch targets ≥ 44px (if mobile interactive)
- [ ] `prefers-reduced-motion: reduce` respected (if animation added)

### Dependencies
- [ ] No new npm packages without approval from Ruben (Slack OK message)
- [ ] `pnpm audit` passes (no known vulnerabilities)
- [ ] Lock file (`pnpm-lock.yaml`) committed
- [ ] Version pinned (no `^` or `~` in package.json)

### Documentation
- [ ] Architecture docs updated (if design changed)
- [ ] Conventions docs updated (if new pattern introduced)
- [ ] Code comments added where "why" is non-obvious
- [ ] ADR created (if deviation from locked rules)
- [ ] CHANGELOG or release notes updated (if user-facing)

### Git & PR
- [ ] Branch follows naming convention: `{type}/{kebab-case}`
- [ ] Commits follow Conventional Commits format
- [ ] PR linked to issue (`Closes #123`)
- [ ] PR description explains what changed and why
- [ ] PR passed all CI checks (type, lint, test, build, Lighthouse, E2E)
- [ ] PR approved by Ruben (one approval required)
- [ ] Auto-merged and main branch build succeeded
- [ ] Issue closed with link to merge commit

---

## PR-level

A PR is **ready to merge** when:

- [ ] All task-level checklist items are green
- [ ] CI pipeline 100% green
  - typecheck ✅
  - lint ✅
  - unit test ✅
  - build ✅
  - Lighthouse CI (Performance ≥ 90 on `/`, affects routes pass threshold) ✅
  - E2E smoke (Playwright on preview URL) ✅
- [ ] Preview URL manually tested for 5 minutes (no visible regressions)
- [ ] No merge conflicts
- [ ] Approver signed off (Ruben)
- [ ] Auto-merge enabled, merges cleanly to main
- [ ] Approved release deployment succeeded in Coolify

---

## Phase-level

A phase is **complete** when:

- [ ] All issues in the phase milestone are closed (`Done` column in GitHub Projects)
- [ ] Phase gate checklist (below) is 100% green
- [ ] Client has seen the staging URL and given explicit thumbs-up (WhatsApp/email, archived in `docs/client-signoff/PHASE_{X}.md`)
- [ ] ADRs written for any deviation from locked rules (PROJECT_BRIEF, STACK_RULES, ARCHITECTURE_RULES, DESIGN_RULES)
- [ ] No P0 or P1 bugs open
- [ ] Lighthouse on all marketing pages ≥ 90 Performance, ≥ 95 Accessibility
- [ ] E2E smoke test 100% green on key user flows

### Phase 0 — Setup (Week 1)

- [ ] `git push` → preview URL generated automatically
- [ ] Preview URL shows branded "STEELYES" wordmark
- [ ] Supabase EU project created (`steelyes-staging` and `steelyes-prod`)
- [ ] Schema migrations `001_init.sql` applied (all tables, RLS enabled, no policies yet)
- [ ] CI pipeline green (typecheck, lint, test, build, Lighthouse)
- [ ] Sentry project created and receiving test errors
- [ ] Coolify production and staging applications linked to the intended Git branches
- [ ] README.md rewritten (dev instructions, deploy info, architecture overview)

### Phase 1 — Marketing site (Weeks 2–5)

- [ ] All 16 marketing pages live with real or placeholder content
- [ ] Quote form end-to-end: submit → email to customer + admin → appears in DB
- [ ] Turnstile invisible mode working (> 95% pass rate on real users, not just tests)
- [ ] Honeypot field silently rejects bot submissions
- [ ] Rate limiting: 6th submit from same IP returns 429
- [ ] Iubenda CMP live, cookie banner visible, consent tracked
- [ ] RLS policies tested:
  - anon can read `gates`, cannot write `quote_requests` without Turnstile
  - admin can read/write all tables
- [ ] Lighthouse:
  - `/` Performance ≥ 90, Accessibility ≥ 95
  - `/gates` Performance ≥ 90, Accessibility ≥ 95
  - `/contact` Performance ≥ 90, Accessibility ≥ 95
- [ ] E2E: quote submission flow passes on staging URL
- [ ] Client sign-off documented in `docs/client-signoff/PHASE_1.md`

### Phase 2 — Configurator (Weeks 6–9)

- [ ] All 6 gate types configurable end-to-end
- [ ] Golden tests pass: price client = price server for 20 sample configs
- [ ] Configuration persisted to DB, shareable via token
- [ ] Quote form from configurator: saves `configuration_id`, email fires, admin sees config
- [ ] Mesh rebuild time < 30 ms on Galaxy A54 (all 6 types)
- [ ] Memory stability: 200 consecutive rebuilds without heap growth
- [ ] Three.js only imported via `dynamic(..., { ssr: false })`
- [ ] Lighthouse on `/configurator` Performance ≥ 85, Accessibility ≥ 95
- [ ] Accessibility audit:
  - Keyboard nav through all steps
  - VoiceOver announces price changes (aria-live)
  - Focus management between steps
  - Form labels + error messages accessible
- [ ] E2E: full configurator flow (load → configure → save → share → quote) passes
- [ ] Client sign-off documented in `docs/client-signoff/PHASE_2.md`

### Phase 3 — AR (Weeks 10–11)

- [ ] iPhone 12 (iOS 17+): Quick Look opens USDZ with correct gate mesh
- [ ] Samsung Galaxy A54 (Android 13+): Scene Viewer opens GLB with correct gate mesh
- [ ] Scale physically accurate: 3.6 m gate in config = 3.6 m ± 2 cm measured in AR viewer with tape
- [ ] Generation time end-to-end < 5 seconds (export + S3 upload + signed URL)
- [ ] Material delta documented: known differences between canvas + USDZ preview accepted
- [ ] Desktop fallback: QR code generated, links to share page
- [ ] Device without AR support: canvas fullscreen as fallback, no errors
- [ ] AR button visible on `/quote/[shareToken]` and configurator step 6
- [ ] Pre-AR disclosure dialog shown (camera permission microcopy)
- [ ] Signed URLs expire in 15 min, regeneration works
- [ ] Client sign-off documented in `docs/client-signoff/PHASE_3.md`

### Phase 4 — Launch & Stabilise (Weeks 12–13)

- [ ] All P0 and P1 bugs closed
- [ ] WebPageTest on real 4G:
  - LCP < 2.0 s (`/`, `/gates`, `/contact`)
  - CLS = 0 (all pages)
  - INP < 200 ms (all pages)
- [ ] Lighthouse final audit:
  - All marketing pages Performance ≥ 90, Accessibility ≥ 95
  - Configurator Performance ≥ 85, Accessibility ≥ 95
  - Admin Performance ≥ 80, Accessibility ≥ 95
- [ ] VoiceOver walkthrough (macOS) + TalkBack (Android): full site accessible
- [ ] PII blur pass: all gallery images have faces, plates, house numbers blurred where needed
- [ ] SEO ready:
  - sitemap.xml generated and submitted to GSC + Bing Webmaster
  - robots.txt correct (`/admin` disallowed)
  - Canonicals verified (no duplicate content)
  - Structured data validated (JSON-LD, OG tags)
- [ ] DNS cutover plan documented and tested
- [ ] Email DNS live: SPF + DKIM + DMARC passing, deliverability verified (Gmail, Apple, Outlook)
- [ ] Backups verified: Supabase daily backups enabled, S3 versioning ON
- [ ] Monitoring live: Sentry alerts active, consent-gated PostHog enabled, Lighthouse CI configured
- [ ] Handover doc created: `docs/handover-marius.md` (admin panel, catalogue updates, contact info)
- [ ] Video tutorial recorded (Loom 5 min): Marius logs in and manages a quote start-to-finish
- [ ] v2 backlog documented: `docs/v2-backlog.md` (CMS, accounts, Stripe, blog, PWA, etc.)
- [ ] Client final sign-off: `docs/client-signoff/FINAL.md` (Marius approval email)
- [ ] Invoice sent and archived

---

## Launch day checklist

🚀 **Go-live criteria (must be 100% true before DNS switch)**

- [ ] All 16 marketing pages live with final content
- [ ] Configurator works for all 6 types on target devices (iPhone 12, Galaxy A54)
- [ ] AR "View in your driveway" works on iOS + Android
- [ ] Admin panel functional, Marius has logged in and managed a request
- [ ] Iubenda CMP live, consent flow verified end-to-end
- [ ] No PII logged anywhere; Sentry scrubbing verified
- [ ] No unscrubbed `email`, `phone`, `postcode` fields in error tracking
- [ ] Lighthouse Performance ≥ 90 on all marketing pages
- [ ] Turnstile blocking > 95% of bot traffic in staging
- [ ] Supabase daily backups enabled
- [ ] S3 versioning ON, CloudFront cache cleared
- [ ] Sentry releases configured, source maps uploaded
- [ ] Coolify and Sentry alerts configured (P0 error → Slack/email to Ruben + Marius)
- [ ] DNS cutover plan ready, rollback strategy documented
- [ ] CDN edge caching verified (headers, TTL)
- [ ] All team members briefed on launch day SLA (Ruben + 48h monitoring)

---

## Post-launch (Weeks 12–13)

### First 48 hours
- [ ] Monitor Sentry continuously (no new P0s)
- [ ] Monitor PostHog/Web Vitals (LCP, CLS, INP green)
- [ ] Check Core Web Vitals in Google Search Console (28-day window starts)
- [ ] Email deliverability: send test quote, verify inbox (not spam)
- [ ] Admin dashboard: any Kanban issues?
- [ ] User feedback: any high-impact bugs from real traffic?
- [ ] Hotfix same-day if P0 (deploy + rollback ready)

### First week
- [ ] Core Web Vitals stable in CrUX
- [ ] No escalations from Marius
- [ ] Sentry error rate low (acceptable baseline established)
- [ ] Handover session with Marius completed (video + doc)
- [ ] v2 backlog prioritized by Marius

---

## Continuous CI (every commit)

Each `git push` triggers:

1. **Type check** (`pnpm typecheck`) — pass or fail
2. **Lint** (`pnpm lint`) — pass or fail
3. **Unit test** (`pnpm test`) — pass or fail
4. **Build** (`pnpm build`) — pass or fail
5. **Lighthouse CI** — Performance ≥ 90 on `/` or fail
6. **E2E smoke** (Playwright) — pass or fail

**If any step fails**: build blocked, PR cannot merge.

---

## Branch protection rules

- ✅ Require PR reviews (1 approval)
- ✅ Require status checks (all 6 CI steps must pass)
- ✅ Dismiss stale PR approvals (code changed after approval)
- ✅ Auto-merge enabled (merges when all checks pass + approval)
- ✅ No force push allowed

> **Nota Operativa (Solo dev)**: se per ora stai lavorando completamente da solo, abbassa temporaneamente la branch protection togliendo "Require approvals", lascia però attivi i required status checks, e più avanti riattiva la review obbligatoria quando il flusso repo sarà completo.

---

**Locked document.** No exceptions, no shortcuts.

_Last reviewed: 20 April 2026 · Next review: After first PR or when phase-level criteria conflict_
