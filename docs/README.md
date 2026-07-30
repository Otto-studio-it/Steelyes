---
title: Documentation Index
description: Entry point for Steelyes project documentation
owner: Ruben
status: ACTIVE
last_updated: 2026-07-30
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
| [`client-answers/`](./client-answers/README.md) | **What Marius actually said.** Verbatim answer batches with `CA-NN` ids. Source of truth for client data. |
| [`CLIENT_BLOCKERS.md`](./CLIENT_BLOCKERS.md) | Missing client inputs, fallback strategy, escalation. |
| [`frontend/CLIENT_CHANGELOG.md`](./frontend/CLIENT_CHANGELOG.md) | Prioritized backlog of client-requested site changes. |
| [`HANDOFF.md`](./HANDOFF.md) | Senior developer 30-minute onboarding. |
| [`REPO_HEALTH.md`](./REPO_HEALTH.md) | CI status, hygiene audit, deploy readiness. |
| [`DEPLOY.md`](./DEPLOY.md) | Vercel monorepo deployment checklist. |

---

## Active work areas

| Area | Documents |
|---|---|
| DB/RLS | [`db/DB_CLOSURE_PLAN.md`](./db/DB_CLOSURE_PLAN.md), [`db/STAGING_DB_BASELINE_2026-05-04.md`](./db/STAGING_DB_BASELINE_2026-05-04.md) |
| Pricing semantics | [`db/PRICING_SEMANTICS.md`](./db/PRICING_SEMANTICS.md), [`db/RAILHEADS_TBD.md`](./db/RAILHEADS_TBD.md) |
| Client data | [`client-answers/`](./client-answers/README.md), [`CLIENT_INTAKE.md`](./CLIENT_INTAKE.md), [`frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md`](./frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md) |
| Configurator readiness | [`frontend/CONFIGURATOR_DATA_READINESS_2026-07-28.md`](./frontend/CONFIGURATOR_DATA_READINESS_2026-07-28.md) — which gate types can be drawn honestly today, and what blocks the rest |
| **2-week delivery** | [`frontend/DELIVERY_ROADMAP_2W_2026-07-30.md`](./frontend/DELIVERY_ROADMAP_2W_2026-07-30.md) — **authoritative sequencing** for site + indicative pricing + 2D + 3D/AR handoff (wins over older roadmaps for the next 14 days) |
| **Foto intake (2026-07-30)** | [`frontend/foto-intake/FOTO_INTAKE_ANALYSIS_2026-07-30.md`](./frontend/foto-intake/FOTO_INTAKE_ANALYSIS_2026-07-30.md) + deep pass [`frontend/foto-intake/FOTO_DEEP_ANALYSIS_2026-07-30.md`](./frontend/foto-intake/FOTO_DEEP_ANALYSIS_2026-07-30.md) — railheads catalog + web/ref picks |
| UI/content | [`frontend/UI_CONTENT_PLAN.md`](./frontend/UI_CONTENT_PLAN.md), [`frontend/UI_UX_ROADMAP.md`](./frontend/UI_UX_ROADMAP.md), [`frontend/HOMEPAGE_IMAGE_SELECTION_2026-05-08.md`](./frontend/HOMEPAGE_IMAGE_SELECTION_2026-05-08.md), [`frontend/MARKETING_SITE_AUDIT_2026-05-06.md`](./frontend/MARKETING_SITE_AUDIT_2026-05-06.md), [`frontend/FRONTEND_PARALLEL_WORK_PLAN.md`](./frontend/FRONTEND_PARALLEL_WORK_PLAN.md), [`frontend/PAGE_INVENTORY.md`](./frontend/PAGE_INVENTORY.md), [`frontend/CONTENT_FALLBACKS.md`](./frontend/CONTENT_FALLBACKS.md) |
| Gate catalog | [`frontend/gate-catalog/`](./frontend/gate-catalog/) | Technical sheet per gate type with confirmed and provisional data |
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
- Business/pricing data: partially unblocked — batch 2026-07-28 closed 3 of 16 blocking questions (finish palette, cantilever tail rule, sales email); 13 remain.
- Share-link app route: pending.
- Next focus: **2-week delivery** per [`frontend/DELIVERY_ROADMAP_2W_2026-07-30.md`](./frontend/DELIVERY_ROADMAP_2W_2026-07-30.md) — site live, honest 2D, then on-demand phone-camera AR.
- Backend completion: paused until driven by real requirements or client data.
