---
title: Internal Changelog
description: Verified implementation log for project work
owner: Ruben
status: ACTIVE
last_updated: 2026-05-06
---

# Steelyes — Internal Changelog

This is an internal implementation log. It records what changed, how it was verified, and which commit contains the work.

It is not a public product changelog.

---

## 2026-05-06 — Marketing site audit and parallel frontend plan

Commit: `docs: document marketing frontend work split`

Changed:

- Added `docs/frontend/MARKETING_SITE_AUDIT_2026-05-06.md`.
- Added `docs/frontend/FRONTEND_PARALLEL_WORK_PLAN.md`.
- Updated `docs/frontend/PAGE_INVENTORY.md` with current route status.
- Updated `docs/frontend/UI_CONTENT_PLAN.md` with missing Phase 1 route targets.
- Updated project docs to point to the new frontend coordination files.

Why:

- The project is ready to shift from DB/RLS closure to finishing the approved storefront.
- Multiple AI agents can work in parallel only if ownership boundaries are explicit.
- The current site has approved visual patterns, but several route directories are missing pages.

Result:

- Claude Code/Sonnet can own gate-detail pages.
- Cursor/Opus can own services and case-study index pages.
- Codex can supervise, review, run checks, and integrate shared navigation/footer changes.

---

## 2026-05-06 — Documentation operating layer

Commit: `docs: organize project documentation`

Changed:

- Added `docs/README.md` as the documentation entry point.
- Added `docs/PROJECT_STATUS.md` as the current project snapshot.
- Added `docs/NEXT_ACTION_PLAN.md` as the ordered execution plan.
- Added `docs/CHANGELOG_INTERNAL.md` as the internal verified work log.
- Added frontend planning docs:
  - `docs/frontend/UI_CONTENT_PLAN.md`;
  - `docs/frontend/CONTENT_FALLBACKS.md`;
  - `docs/frontend/PAGE_INVENTORY.md`.
- Updated `docs/CLIENT_BLOCKERS.md` to distinguish UI/content progress from business-data blockers.
- Marked `docs/phases/PHASE_0_ACTION_PLAN.md` as historical so it no longer conflicts with current status.
- Updated `docs/phases/README.md` to point readers to the current status and action plan first.

Why:

- The project is changing focus from DB/RLS closure to UI/content stabilization.
- The docs needed a clear entry point and separation between status, plan, blockers, fallback rules, and historical phase notes.

Result:

- A developer can now resume from `docs/README.md`, then read `PROJECT_STATUS.md` and `NEXT_ACTION_PLAN.md` without reconstructing context from DB-specific files.

---

## 2026-05-06 — Phase 5 DB grant hardening

Commit: `c07fd6c fix(db): harden Phase 5 grants`

Changed:

- Added `supabase/migrations/20260506120000_harden_phase5_grants.sql`.
- Added `supabase/migrations/20260506121000_harden_public_non_dml_grants.sql`.
- Applied both migrations to Supabase staging.
- Updated `docs/db/DB_CLOSURE_PLAN.md`.
- Updated `docs/db/STAGING_DB_BASELINE_2026-05-04.md`.

Why:

- RLS already blocked the dangerous operations, but table grants were broader than the intended access model.
- Production-facing security should be easy to reason about at both grant and RLS levels.

Verified:

- Dry-run detected each new migration as pending before apply.
- `supabase db push --linked` applied the first migration.
- Direct grant query found additional non-DML grants on other public app tables.
- Second migration removed those non-DML grants from `anon` and `authenticated`.
- Final `supabase db push --linked --dry-run` returned `Remote database is up to date`.
- Final targeted SQL check returned `unexpected_grant_count = 0`.

Result:

- Phase 5 is closed for DB/RLS and grant-hardening scope on staging.
- Final technical closure remains partial only because share-link app route is not implemented.
- Phase 9 remains blocked on Marius business data.

---

## 2026-05-06 — Phase 8 DB documentation refresh

Commit: `fa8ac8d docs(db): Phase 8 refresh staging baseline`

Changed:

- Updated staging DB baseline to match verified migration state at that time.
- Preserved remaining open items:
  - Phase 5 grant hardening;
  - share-link E2E pending;
  - Phase 9 business data.

Result:

- DB docs stopped reporting original RLS bugs as open after they had been fixed.

---

## 2026-05-06 — Generated database types refresh

Commit: `f2474e5 chore(types): regenerate database types for Phase 7`

Changed:

- Regenerated `apps/web/src/types/database.types.ts` from staging.

Verified:

- Typecheck passed after regeneration.

Result:

- TypeScript DB types match staging-generated shape.

---

## 2026-05-05 — App regression for DB/RLS closure

Commit: `6dffb45 docs(db): Phase 6 complete — app regression passed`

Verified:

- Typecheck passed.
- Lint passed.
- Build passed.
- Playwright admin CRUD passed 6/6.
- Manual admin route smoke recorded.

Result:

- App-level regression was closed for the recorded admin CRUD scope.
