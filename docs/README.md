---
title: Documentation Index
description: Entry point for Steelyes project documentation
owner: Ruben
status: ACTIVE
last_updated: 2026-05-19
---

# Steelyes — Documentation Index

Start here when resuming the project.

---

## Read first

| Document | Use it for |
|---|---|
| [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) | Current state: done, blocked, next focus. |
| [`NEXT_ACTION_PLAN.md`](./NEXT_ACTION_PLAN.md) | Ordered execution plan from here. |
| [`CHANGELOG_INTERNAL.md`](./CHANGELOG_INTERNAL.md) | Verified work history and commits. |
| [`CLIENT_BLOCKERS.md`](./CLIENT_BLOCKERS.md) | Missing client inputs, fallback strategy, escalation. |
| [`frontend/CLIENT_CHANGELOG.md`](./frontend/CLIENT_CHANGELOG.md) | Prioritized backlog of client-requested site changes. |

---

## Active work areas

| Area | Documents |
|---|---|
| DB/RLS | [`db/DB_CLOSURE_PLAN.md`](./db/DB_CLOSURE_PLAN.md), [`db/STAGING_DB_BASELINE_2026-05-04.md`](./db/STAGING_DB_BASELINE_2026-05-04.md) |
| Pricing semantics | [`db/PRICING_SEMANTICS.md`](./db/PRICING_SEMANTICS.md), [`db/RAILHEADS_TBD.md`](./db/RAILHEADS_TBD.md) |
| UI/content | [`frontend/UI_CONTENT_PLAN.md`](./frontend/UI_CONTENT_PLAN.md), [`frontend/UI_UX_ROADMAP.md`](./frontend/UI_UX_ROADMAP.md), [`frontend/HOMEPAGE_IMAGE_SELECTION_2026-05-08.md`](./frontend/HOMEPAGE_IMAGE_SELECTION_2026-05-08.md), [`frontend/MARKETING_SITE_AUDIT_2026-05-06.md`](./frontend/MARKETING_SITE_AUDIT_2026-05-06.md), [`frontend/FRONTEND_PARALLEL_WORK_PLAN.md`](./frontend/FRONTEND_PARALLEL_WORK_PLAN.md), [`frontend/PAGE_INVENTORY.md`](./frontend/PAGE_INVENTORY.md), [`frontend/CONTENT_FALLBACKS.md`](./frontend/CONTENT_FALLBACKS.md) |
| Phase gates | [`DEFINITION_OF_DONE.md`](./DEFINITION_OF_DONE.md), [`phases/README.md`](./phases/README.md) |

---

## Locked reference docs

These define approved project constraints. Do not rewrite casually.

- [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md)
- [`STACK_RULES.md`](./STACK_RULES.md)
- [`ARCHITECTURE_RULES.md`](./ARCHITECTURE_RULES.md)
- [`DESIGN_RULES.md`](./DESIGN_RULES.md)
- [`CODEBASE_CONVENTIONS.md`](./CODEBASE_CONVENTIONS.md)
- [`AI_WORKFLOW_RULES.md`](./AI_WORKFLOW_RULES.md)
- [`adr/`](./adr/)

---

## Current high-level status

- DB/RLS hardening: closed on staging.
- Business/pricing data: blocked by Marius.
- Share-link app route: pending.
- Next focus: deployment alignment, then UI/content audit and stabilization.
- Backend completion: paused until driven by real requirements or client data.
