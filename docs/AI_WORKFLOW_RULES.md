---
title: AI Workflow Rules
description: Guidelines for using Cursor, Claude, Antigravity in controlled collaboration
owner: Ruben (project lead)
status: APPROVED for execution
last_updated: 2026-04-20
---

# Steelyes — AI Workflow Rules

> How to use AI tools (Cursor AI, Claude Code, Antigravity Pro, CloudCode Pro) without losing coherence.
> Locked framework. Deviations require discussion with Ruben.

---

## Pre-work checklist

Before every task, read in this order:

1. **docs/PROJECT_BRIEF.md** — business context, scope, timeline
2. **docs/STACK_RULES.md** — what's allowed, what's forbidden
3. **docs/ARCHITECTURE_RULES.md** — design patterns, layer separation
4. **docs/CODEBASE_CONVENTIONS.md** — file naming, folder structure
5. **docs/DEFINITION_OF_DONE.md** — acceptance criteria, testing
6. **docs/DESIGN_RULES.md** — UI/UX rules, brand identity
7. Run `git log --oneline -20` to understand recent context

Then proceed.

---

## Four task types

### 1. Small fix (< 100 lines, single file)

**Threshold**: typo, UI tweak, one function change, simple bug.

**Flow**:
- Read the affected file
- Propose the change (2–3 sentences, no lengthy explanations)
- Wait for Ruben's `OK` / `adjust this` / `no`
- Implement and commit

**Tools**: Cursor AI (fast, low ceremony).

---

### 2. Feature (< 500 lines, multi-file)

**Threshold**: new page, new component, new API route, new admin feature.

**Flow**:
1. Read docs/PROJECT_BRIEF, ARCHITECTURE_RULES, CODEBASE_CONVENTIONS
2. **Propose a plan** (file structure, state flow, integration points):
   ```
   # Proposal: Add testimonials section to homepage

   ## Files to create/modify
   - apps/web/content/testimonials.json (data)
   - apps/web/src/components/marketing/Testimonial.tsx (component)
   - apps/web/src/app/(marketing)/page.tsx (integrate into homepage)
   - tests/e2e/homepage.spec.ts (update E2E)

   ## State flow
   Fetch testimonials from JSON at build time (SSG), render as carousel.

   ## Integration
   Homepage layout: add testimonial section below Trust Bar, above Reviews section.

   ## Design
   Align with Testimonial component from DESIGN_RULES: hard edges, no shadow, left-aligned text.
   ```
3. **Wait for Ruben's approval** (`LGTM`, `adjust X`, or `discuss`)
4. Implement
5. Self-review against **DEFINITION_OF_DONE.md** checklist
6. Commit and create PR

**Tools**: Cursor AI (main), Claude Code for security-critical sections (auth, RLS, Server Actions).

---

### 3. Architecture or refactor (> 500 lines)

**Threshold**: new layer, new state pattern, major refactor, module restructure.

**Flow**:
1. Write a proposal (ADR-style):
   ```
   # Proposal: Move gate-engine types to shared package

   ## Problem
   Gate types are duplicated between frontend types.ts and gate-engine types.ts.

   ## Solution
   Single source of truth: export all types from @steelyes/gate-engine, import in frontend.

   ## Impact
   - 3 files modified (frontend imports, gate-engine exports, tests)
   - No runtime behavior change
   - Backward compatible (week 6+ only)

   ## Trade-offs
   None.
   ```
2. **Wait for Ruben's decision** (ADR approval)
3. Create a separate branch for the refactor (don't bundle with features)
4. Implement
5. Verify all tests pass, Lighthouse unchanged
6. Commit separately with reason: `refactor(types): centralize in gate-engine`

**Tools**: Claude Code (architecture), Cursor AI (implementation).

---

### 4. Bug fix (diagnosis → proposal → implementation)

**Threshold**: unexpected behavior, regression, crash.

**Flow**:
1. **Diagnose** — read error logs, test reproduction steps, understand root cause
2. **Propose fix** — explain what's broken, why, and the fix:
   ```
   ## Bug: Configurator canvas crashes on second load

   Root cause: Three.js scene not disposed on unmount; memory accumulates.

   Fix: Add useEffect cleanup that calls `renderer.dispose()` and `geometry.dispose()`
   on each rebuild.

   Risk: none; dispose is standard Three.js pattern.
   ```
3. **Wait for Ruben's approval** (if RLS, auth, security, or big change)
4. Implement, test locally (especially if performance/security bug)
5. Commit with fix details: `fix(configurator): dispose Three.js scene on unmount`

**Tools**: Cursor AI + DevTools (debugging), Claude Code (security implications).

---

## Approval gates (always require explicit OK)

These **must** be approved before implementation:

- ✅ New npm package (size + rationale + alternatives)
- ✅ Database schema change (migration + RLS policy implications)
- ✅ Security change (RLS policy, auth, rate limiting, secrets)
- ✅ Breaking change (API, component interface, data format)
- ✅ Performance-impacting change (bundle size, Lighthouse impact, Three.js rebuild time)
- ✅ Architecture change (new layer, new pattern, refactor > 500 lines)
- ✅ Infrastructure change (CI/CD, monitoring, deployment)

**No approval needed** for:
- Bug fixes (if diagnosis clear)
- Small features (< 500 lines, multi-file but isolated)
- UI tweaks, copy changes
- Tests, docs

---

## Self-review checklist

Before marking a task done:

### Code quality
- [ ] No `console.log` or `debugger` left in code
- [ ] TypeScript strict: no `any` types, all return types explicit
- [ ] No TODOs without GitHub issue reference
- [ ] No hardcoded secrets

### Functionality
- [ ] Acceptance criteria met
- [ ] Tested locally on target device (iPhone 12 + Galaxy A54 if UI)
- [ ] No new console errors or warnings

### Testing
- [ ] Unit tests written (if logic non-trivial)
- [ ] E2E test updated (if user flow affected)
- [ ] Manual smoke test on staging URL (if UI-visible)

### Performance
- [ ] Lighthouse unchanged or improved on affected routes
- [ ] Bundle size checked if new dependencies
- [ ] No Three.js outside configurator route

### Security
- [ ] No PII in logs
- [ ] Server-side validation on Server Actions
- [ ] RLS policies tested (if DB change)
- [ ] Rate limiting respected

### Accessibility
- [ ] Keyboard navigation works (if interactive)
- [ ] Screen reader friendly (if UI)
- [ ] Colour contrast 4.5:1 (if new colour)
- [ ] Touch targets 44px+ (if mobile)

### Dependencies
- [ ] No new packages without approval
- [ ] `pnpm audit` passes
- [ ] Lock file committed

### Documentation
- [ ] Architecture docs updated (if design change)
- [ ] Conventions docs updated (if pattern change)
- [ ] Created ADR (if deviation from locked rules)

---

## Red flags (stop and escalate)

If you hit any of these, **stop and ask Ruben before proceeding**:

🛑 **Uncertain architecture** — "I'm not sure if this should be in the backend or frontend"

🛑 **Potential security issue** — "What if someone modifies the config in DevTools?"

🛑 **Performance concern** — "This might make LCP worse, but I'm not sure how to test it"

🛑 **Missing understanding** — "I don't understand why we chose Zustand over Context for this"

🛑 **Scope creep** — "This feature asks for [new thing], should we add it?"

🛑 **Blocked by client** — "We need the price list to proceed"

🛑 **Trade-off unclear** — "I can do this two ways; both have pros and cons"

---

## Tool AI assignment per phase

Quick reference on which tool to use in which phase:

| Phase | Primary | Secondary | Notes |
|-------|---------|-----------|-------|
| **0 — Setup** | Cursor AI + CloudCode Pro | Claude Code (SQL) | Scaffolding speed + infrastructure |
| **1 — Marketing** | Antigravity Pro → Cursor AI | Claude Code | Visual prototyping → production |
| **2 — Configurator** | Cursor AI + Claude Code | Antigravity (layout) | Heavy logic + Three.js |
| **3 — AR** | Claude Code + Cursor AI | Xcode (iOS debug) | Export algorithms + platform specifics |
| **4 — Launch** | Cursor AI + CloudCode Pro | All tools (hotfix) | Performance + ops |

---

## Prompt guidelines

When using Claude Code or Cursor AI:

1. **Be specific** — "Add testimonial carousel to homepage" ✅ vs "Make the homepage better" ❌
2. **Reference docs** — "Follow CODEBASE_CONVENTIONS.md for naming"
3. **State constraints** — "No new packages", "Must be < 30ms", "WCAG 2.1 AA"
4. **Provide context** — Link relevant ADRs, architecture decisions, past PRs
5. **Ask for a plan first** — "Outline the file structure before coding"

---

## Version control

- **Branches**: `{type}/{kebab-case}` (e.g. `feat/add-testimonial-carousel`, `fix/canvas-memory-leak`)
- **Commits**: Conventional Commits (feat:, fix:, docs:, chore:, refactor:)
- **PRs**: Link issue, describe changes, include acceptance criteria validation
- **Merge**: Auto-merge on green CI + one approval

---

## Communication norms

- **Plan discussion**: GitHub issue or discussion thread (async, documented)
- **Urgent questions**: DM Ruben (real-time)
- **Code review**: PR comments (searchable, archived)
- **Decisions**: Documented in ADR or locked docs (not Slack)

---

**Locked framework.** Changes require team discussion.

_Last reviewed: 20 April 2026 · Next review: After first bug or blocked task_
