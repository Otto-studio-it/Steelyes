---
title: Prompt Templates
description: Reusable prompt starters for Claude to work on Steelyes tasks
owner: Ruben (AI workflow lead)
status: Active
last_updated: 2026-04-22
---

# Prompt Templates

Locked reference prompts for Claude collaboration. Copy the full context + prompt block when requesting work. Do not summarize or simplify—the full context is required for coherent output.

---

## Template 1: Feature Implementation

**When to use:** New feature <500 lines, multi-file scope (needs design review)

```
# Context
You are implementing a feature for Steelyes (a parametric architectural gatewear configurator).
Read these locked documents first:
- docs/PROJECT_BRIEF.md (business priorities, timeline, success criteria)
- docs/STACK_RULES.md (forbidden tech, performance budgets, dependency policy)
- docs/ARCHITECTURE_RULES.md (layer separation, state patterns, RLS policies, Three.js patterns)
- docs/DESIGN_RULES.md (visual brand, layout principles, motion rules)
- docs/AI_WORKFLOW_RULES.md (approval gates, red flags, self-review)
- docs/CODEBASE_CONVENTIONS.md (file naming, folder structure, import organization, TypeScript strict)
- docs/DEFINITION_OF_DONE.md (code quality, testing, performance, security checklist)

Then run: `git log --oneline -20` to see recent commits and style.

# Prompt
Implement: [FEATURE_NAME]

**Acceptance Criteria:**
[PASTE AC FROM ISSUE]

**Scope Notes:**
- Files affected: [LIST ROUGH PATHS]
- Dependencies: [ANY NEW PACKAGES, MIGRATIONS?]
- Breaking changes: [YES/NO, IF YES EXPLAIN]

**Constraints:**
- Must follow ARCHITECTURE_RULES.md layer pattern
- TypeScript strict, no `any` types
- Zod validation for external input
- RLS policies if touching Supabase
- Lighthouse targets must not degrade

Before writing code: Propose your implementation plan (file structure, state flow, key decisions). Wait for approval before proceeding.

After implementation: Run self-review checklist from AI_WORKFLOW_RULES.md.
```

---

## Template 2: Limited Refactor

**When to use:** Refactor <500 lines, single file or tightly coupled pair

```
# Context
You are refactoring code in the Steelyes project.
Read these documents:
- docs/CODEBASE_CONVENTIONS.md (naming, structure, import rules)
- docs/ARCHITECTURE_RULES.md (layer separation, state patterns)
- docs/DEFINITION_OF_DONE.md (code quality checklist)

Then read the target file(s) and `git log -p --follow [FILE]` to understand evolution.

# Prompt
Refactor: [FILE_PATH or FUNCTION_NAME]

**Goal:**
[SPECIFIC OUTCOME: "extract validation logic", "split component", "simplify state", etc.]

**Constraints:**
- Behavior unchanged
- No new dependencies
- Must not degrade performance (no new Lighthouse issues)
- All tests pass before/after
- TypeScript strict maintained

Before refactoring: Show the before/after structure and explain why each change.
Wait for approval if uncertain.

After completion: Verify all tests pass and Lighthouse targets are met.
```

---

## Template 3: Supabase Migration

**When to use:** Schema changes, policy updates, seed data, realtime config

```
# Context
You are working on Supabase (EU region) for Steelyes.
Read these documents:
- docs/ARCHITECTURE_RULES.md (RLS policies, auth roles, Supabase client patterns)
- docs/DEFINITION_OF_DONE.md (security audit section: RLS tested, no PII in errors)

Then check:
- Current schema: `supabase/migrations/` folder
- Current policies: Supabase dashboard (by table)
- Type generation: `npx supabase gen types typescript --db-url [URL] > types/database.types.ts`

# Prompt
Create Supabase migration: [DESCRIPTION]

**Changes:**
[TABLE STRUCTURE, POLICIES, OR SEED DATA]

**Example:**
- Create table `finishes` with columns: id, name, color_hex, created_at
- Add RLS policies: anon can SELECT, admin can SELECT/INSERT/UPDATE/DELETE
- Seed: 6 finishes (rustic, polished, weathered, etc.)

**Steps:**
1. Write migration file: `supabase/migrations/[TIMESTAMP]_[snake_case_name].sql`
2. Test locally: `supabase migration up`
3. Type generation: `npx supabase gen types typescript --db-url [URL] > types/database.types.ts`
4. Commit both migration + types file
5. Verify RLS policies block unauthenticated mutation (anon can read, not write)
6. Test in staging before production

Do NOT apply migrations directly in dashboard. Use migration files for version control.
```

---

## Template 4: Admin Panel Work

**When to use:** Admin routes, dashboards, backend forms, realtime features

```
# Context
You are building admin features for Steelyes (internal tools only, not customer-facing).
Read these documents:
- docs/ARCHITECTURE_RULES.md (admin layer: SSR+auth-gate, server-only admin client, realtime subscriptions)
- docs/DESIGN_RULES.md (brand apply to admin: industrial aesthetic, no soft UI)
- docs/CODEBASE_CONVENTIONS.md (admin route group: apps/web/src/app/(admin)/)
- docs/DEFINITION_OF_DONE.md (no memory leaks in realtime subscriptions, channel cleanup)

Then read: `apps/web/src/app/(admin)/` for existing patterns.

# Prompt
Build: [ADMIN_FEATURE]

**Requirements:**
[LIST: what data, what actions, realtime or batch?]

**Technical Notes:**
- Route group: `(admin)` directory
- Auth: Server-side validation that user is admin (JWT claim check)
- Realtime: If using postgres_changes, must unsubscribe on unmount (cleanup)
- Form validation: Zod schemas, server-side recalculation (e.g., pricing)
- Performance: No N+1 queries, batch operations if bulk update

**Constraints:**
- Admin-only: No leakage to public routes
- Type-safe: Use database.types.ts types
- Accessible: WCAG 2.1 AA, 44px buttons, keyboard nav
- Tested: E2E test if critical workflow

Before implementation: Show the route structure and state flow. Wait for approval.

After completion: Verify realtime cleanup (no console warnings on remount), Lighthouse passes.
```

---

## Template 5: Configurator Work

**When to use:** 3D mesh manipulation, form controls, state management, export

```
# Context
You are working on the Steelyes configurator (Three.js procedural geometry tool).
Read these documents:
- docs/ARCHITECTURE_RULES.md (configurator layer: CSR, Zustand state, Three.js <30ms rebuild, dynamic import + dispose)
- docs/DESIGN_RULES.md (mobile-first: 60% sticky canvas + 40% controls, async loading indicator)
- docs/CODEBASE_CONVENTIONS.md (gate-engine structure: src/types.ts, mesh/{type}.ts, export/{glb,usdz}.ts)
- docs/DEFINITION_OF_DONE.md (Three.js <30ms rebuild, LCP <2.0s real 4G, Lighthouse ≥85)

Then read:
- `packages/gate-engine/src/` (mesh generation, export logic)
- `apps/web/src/app/(configurator)/` (UI layer, Zustand store, form sync)

# Prompt
Add/modify: [CONFIGURATOR_FEATURE]

**What needs to change:**
[E.g., "add material selector dropdown", "export as USDZ for AR", "adjust gate height control range"]

**Technical details:**
- Mesh logic: `packages/gate-engine/src/mesh/`
- State management: Zustand store (derive from gate config, not free-form)
- Form control: Input synced to state, Zod schema validation
- Export: gate-engine exports (GLB for preview, USDZ for AR)
- Performance: Three.js rebuild must complete <30ms; if slower, defer mesh recreation

**Constraints:**
- No Three.js outside configurator
- Dynamic import + proper dispose (no memory leak)
- Mobile-first layout (test on real device)
- Lighthouse: ≥85 for configurator route
- Unit tests for gate-engine logic (≥95% coverage)

Before coding: Sketch the state flow (what changes, when rebuild happens). Wait for approval.

After completion: Test rebuild time with DevTools, verify no console errors, mobile smoke test.
```

---

## Template 6: Performance & Accessibility Audit

**When to use:** Diagnose slowness, WCAG issues, or pre-launch review

```
# Context
You are auditing Steelyes for performance and accessibility issues.
Read these documents:
- docs/STACK_RULES.md (performance budgets: LCP <2.0s, CLS=0, INP <200ms, Lighthouse ≥90 marketing / ≥85 configurator)
- docs/ARCHITECTURE_RULES.md (Three.js <30ms rebuild, rendering strategy per route)
- docs/DESIGN_RULES.md (colour contrast verified: 15.8:1, 11.2:1, 7.1:1)
- docs/DEFINITION_OF_DONE.md (full accessibility audit section)

Then run:
- Lighthouse: `next build && npx lighthouse https://localhost:3000 --view`
- Axe DevTools: scan each route (marketing, configurator, admin preview)
- Chrome DevTools: Performance tab, measure render times
- Mobile real device: test LCP/INP on real 4G network

# Prompt
Audit: [ROUTE or FEATURE]

**What to measure:**
- Lighthouse scores (target per STACK_RULES.md)
- Core Web Vitals: LCP, CLS, INP
- 3D rebuild time (if Three.js)
- Memory usage (DevTools: detached DOM, event listeners)
- Accessibility: WCAG 2.1 AA, colour contrast, keyboard nav, screen reader

**Known issues (if any):**
[PASTE SPECIFIC PERFORMANCE/A11Y COMPLAINTS]

**Deliverable:**
1. Report: which metrics fail, root cause analysis
2. Fix proposals: code changes with estimated impact
3. Verification: before/after Lighthouse runs

After fixes: Verify on real mobile device (not just DevTools), 3G connection if applicable.
Commit with evidence (Lighthouse screenshots, DevTools traces).
```

---

## Template 7: Architecture Decision Record (ADR)

**When to use:** Deviate from locked rules, make trade-off decisions, document context for future work

```
# Context
You are writing an ADR (Architecture Decision Record) for Steelyes.
Read these documents:
- docs/ARCHITECTURE_RULES.md (layer separation, rendering strategy, state patterns, RLS policies)
- docs/STACK_RULES.md (tech stack, forbidden list, performance budgets)
- docs/PROJECT_BRIEF.md (business priorities, timeline, success criteria)
- docs/AI_WORKFLOW_RULES.md (approval gates for breaking changes)

Read existing ADRs: `docs/adr/` folder (understand format and numbering).

# Prompt
Write ADR: [DECISION_TITLE]

**Context:**
[WHY THIS DECISION NEEDED: problem, constraint, or opportunity]

**Proposed Decision:**
[WHAT YOU ARE DECIDING: specific choice, trade-offs, alternatives considered]

**Expected Consequences:**
[IMPACT: what changes, what stays the same, effort/risk]

**Example ADR:**
- **Title:** 001-supabase-eu-region
- **Status:** Accepted
- **Context:** GDPR compliance, customer in EU, data residency requirement
- **Decision:** Use Supabase EU region (Frankfurt), not US-east
- **Consequences:** Latency +10ms from UK, explicit region in .env, cannot easily migrate to multi-region
- **Alternatives:** (1) US region + VPN—complex, slow; (2) self-hosted Postgres—DevOps burden

**Format:**
- File: `docs/adr/NNN-kebab-case-title.md` (auto-increment number)
- Status: Accepted (approved by Ruben) | Proposed (under review) | Superseded (by NNN)
- Sections: Status | Context | Decision | Consequences | Alternatives

Self-approved by Ruben for deviations from locked rules. If uncertain, escalate to project owner.
After writing: Add entry to `docs/adr/README.md` index.
```

---

## Usage Rules

1. **Copy the full template** into your prompt to Claude—do not paraphrase
2. **Fill in bracketed sections** [LIKE_THIS] with your specific details
3. **Do not remove constraint sections**—they are non-negotiable
4. **Do not simplify the context**—read the documents listed
5. **Always wait for approval** before implementation on features/refactors/architecture
6. **Self-review before marking done**—use the DEFINITION_OF_DONE.md checklist

---

**Last reviewed:** 2026-04-22
**Next review:** Quarterly or after major phase completion
**Owner:** Ruben (final approver)
