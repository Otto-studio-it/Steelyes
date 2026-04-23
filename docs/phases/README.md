---
title: Phase Documentation Index
description: Quick reference for phase gates, deliverables, and success criteria
owner: Ruben (project lead)
status: Active
last_updated: 2026-04-20
---

# Phase Documentation

> Quick-reference guides for each project phase. Locked gates, milestones, and success criteria.
> Extracted from PROJECT_BRIEF.md, DEFINITION_OF_DONE.md, and weekly roadmap.

**Master timeline:** 13 weeks from Week 1 (20 April 2026) to Week 13 (launch)

---

## Phase Overview

| Phase | Duration | Goal | Gate |
|-------|----------|------|------|
| **Phase 0** | Week 1 | Repo scaffold, Supabase EU, CI/CD | Preview URL shows styled "Hello Steelyes" |
| **Phase 1** | Weeks 2–5 | Marketing site + quote funnel | 16 pages live, quote E2E works, Lighthouse ≥90 |
| **Phase 2** | Weeks 6–9 | 3D Configurator (all 6 types) | All types configurable, price golden tests, Lighthouse ≥85 |
| **Phase 3** | Weeks 10–11 | AR "View in your driveway" | iPhone + Android, physically accurate scale |
| **Stabilisation** | Weeks 12–13 | Polish + launch | All P0/P1 closed, Core Web Vitals green, DNS live |

---

## Phase Execution Pattern

Each phase has a **gate checklist** (DEFINITION_OF_DONE.md, phase-level section):
1. ✅ All issues closed
2. ✅ Gate checklist 100% (CI, Lighthouse, security, accessibility)
3. ✅ ADRs written for any deviations
4. ✅ Client sign-off documented in `docs/client-signoff/`
5. ✅ Merge to main, tag release (e.g., `v0.1.0-phase-b`)

---

## Client asset dependencies

**Critical assets per phase**: See `docs/CLIENT_BLOCKERS.md` for full tracker, fallback strategies, and weekly escalation process.

---

## Client Sign-Offs

At end of each phase, create `docs/client-signoff/PHASE_[X]_SIGN_OFF.md` with:
- ✅ Features completed and tested
- ✅ No critical bugs
- ✅ Mobile device validation passed
- ✅ Signature / approval email from client

Example:
```markdown
# Phase B Sign-Off

**Date:** 2026-05-22
**Phase:** B (Quote Funnel)

## Completed
- [x] Quote form (5 dimensions, materials, finishes)
- [x] Price calculation
- [x] Email delivery
- [x] Mobile test on iPhone 14 / Samsung S24

## Issues Found
- None critical
- Minor: button spacing on ultra-wide screens → defer to Phase C

## Approved By
Steelyes Ltd. (client) — email approval attached
```

---

## Testing Matrix Per Phase

Extracted from DEFINITION_OF_DONE.md:

### Phase B
- ✅ Unit tests: gate-engine pricing ≥95%
- ✅ E2E: quote form submit → email received
- ✅ Manual smoke: real iPhone + Samsung, 4G network
- ✅ Accessibility: WCAG 2.1 AA, axe scan, keyboard nav
- ✅ Performance: Lighthouse ≥90 (marketing routes)

### Phase C
- ✅ Unit tests: gate-engine mesh generation ≥95%
- ✅ E2E: configurator (load preset → tweak dims → export GLB)
- ✅ Manual smoke: real ARView device, real 4G
- ✅ Performance: Lighthouse ≥85 (configurator route), Three.js <30ms rebuild
- ✅ Security: RLS policies tested (anon can read config schema, not write)

### Phase D
- ✅ E2E: full funnel (landing → quote → configurator → order → admin)
- ✅ Load test: 10 concurrent users on Vercel staging
- ✅ Sentry: live monitoring, error log clean
- ✅ Performance: Lighthouse final audit, no regressions
- ✅ Security: admin panel access control verified, rate limiting active

---

## How to Use Phase Docs

1. **Start of phase:** Read the corresponding week range in STEELYES_WEEKLY_ROADMAP.md
2. **During execution:** Refer to DEFINITION_OF_DONE.md phase-level checklist
3. **End of phase:** Verify all gate items, get client sign-off, create `docs/client-signoff/` file
4. **Handoff to next phase:** ADRs up-to-date, no blocked issues, CI green

---

## Deviations

If a phase will miss deadline or scope changes:
1. **Create ADR** with new timeline / altered scope (e.g., defer configurator to Phase C.5)
2. **Notify client** (docs/CLIENT_BLOCKERS.md weekly check-in)
3. **Update STEELYES_WEEKLY_ROADMAP.md** with revised dates
4. **Do not merge** until approval from Ruben + client sign-off

---

**Last reviewed:** 2026-04-22
**Next review:** End of each phase or if timeline slips
**Owner:** Ruben (phase gatekeeper)
