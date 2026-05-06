---
title: Frontend Parallel Work Plan
description: Work split for Claude Code, Cursor, and Codex on the Phase 1 storefront
owner: Ruben
status: ACTIVE
last_updated: 2026-05-06
---

# Steelyes — Frontend Parallel Work Plan

This plan coordinates multiple AI agents working on the storefront at the same time.

Goal: finish the Phase 1 marketing site without merge conflicts, style drift, or speculative backend work.

---

## Agent roles

| Agent | Role | Primary responsibility |
|---|---|---|
| Claude Code / Sonnet | Page implementation worker A | Build missing gate-detail pages and shared gate copy/data. |
| Cursor / Opus | Page implementation worker B | Build services and case-study index pages. |
| Codex | Supervisor / integrator | Review architecture, prevent scope drift, verify consistency, run checks, merge/integrate. |

Codex should not be the main page factory while the other agents are implementing. Codex should keep the system coherent.

---

## Branch strategy

Recommended:

```text
feat/phase-1-marketing-site
```

If agents cannot share one branch cleanly, use short-lived branches:

```text
feat/marketing-gate-details
feat/marketing-services-pages
feat/marketing-content-polish
```

Integration order:

1. Gate detail pages.
2. Services pages.
3. Case-study index and nav/link cleanup.
4. Shared header/footer changes, if needed.
5. Final polish and verification.

Avoid concurrent edits to the same shared files.

---

## Ownership boundaries

### Worker A — Claude Code / Sonnet

Owns:

- `apps/web/src/app/(marketing)/gates/[style]/page.tsx`
- Optional new local helper/data file if needed:
  - `apps/web/src/app/(marketing)/gates/gate-marketing-data.ts`
  - or `apps/web/src/lib/marketing/gates.ts`

Should do:

- Implement dynamic route with `generateStaticParams`.
- Support 6 approved gate slugs.
- Reuse `MarketingShell` and `MediaPlaceholder`.
- Match current `/gates` visual style.
- Update `/gates` cards to link to the detail pages only if Worker A owns that change.
- Use indicative pricing language, not final prices.

Must not touch:

- `SiteHeader.tsx`
- `SiteFooter.tsx`
- services pages
- DB/Supabase files
- admin files

### Worker B — Cursor / Opus

Owns:

- `apps/web/src/app/(marketing)/services/page.tsx`
- `apps/web/src/app/(marketing)/services/railings/page.tsx`
- `apps/web/src/app/(marketing)/services/balconies/page.tsx`
- `apps/web/src/app/(marketing)/services/security/page.tsx`
- `apps/web/src/app/(marketing)/case-study/page.tsx`

Should do:

- Build service pages in the same industrial editorial style.
- Keep claims conservative where client confirmation is missing.
- Use placeholder media, not external image dependencies.
- Make `/case-study` a controlled index that links to `/case-study/the-dream-gate` only if the placeholder state is explicit.

Must not touch:

- gate detail route
- `SiteHeader.tsx`
- `SiteFooter.tsx`
- DB/Supabase files
- admin files

### Codex — Supervisor / Integrator

Owns:

- docs coordination;
- final review;
- test/build verification;
- route consistency;
- optional shared navigation/footer integration after workers finish.

Should do:

- Check that new pages match the approved style.
- Check that no agent invented final pricing, legal, certifications, or service claims.
- Check route links and no obvious broken paths.
- Run typecheck/lint/build.
- Update `docs/frontend/PAGE_INVENTORY.md` after implementation.
- Commit integration changes separately if needed.

Should avoid:

- Rewriting worker pages unless there is a concrete bug or style drift.
- Touching DB/backend unless frontend work proves it is required.

---

## Shared files lock

Only one agent should touch these at a time:

- `apps/web/src/components/marketing/SiteHeader.tsx`
- `apps/web/src/components/marketing/SiteFooter.tsx`
- `apps/web/src/components/marketing/MarketingShell.tsx`
- `apps/web/src/app/(marketing)/page.tsx`
- `apps/web/src/app/(marketing)/gates/page.tsx`
- `apps/web/src/app/globals.css`

Recommended owner: Codex during integration.

Reason:

- These files affect every page.
- Concurrent edits here create merge conflicts and style drift.

---

## Current page completion target

Minimum target for the next frontend sprint:

- [ ] `/gates/[style]` exists and supports 6 gate styles.
- [ ] `/services` exists.
- [ ] `/services/railings` exists.
- [ ] `/services/balconies` exists.
- [ ] `/services/security` exists.
- [ ] `/case-study` exists or case-study surface is explicitly hidden.
- [ ] `/gates-catalogue` and `/installation-services` are resolved as redirect/remove/ignore.
- [ ] Public pages use consistent placeholder/fallback language.
- [ ] Typecheck, lint, and build pass.

---

## Prompt to give Worker A

```text
You own only the gate-detail marketing route.

Read:
- docs/frontend/MARKETING_SITE_AUDIT_2026-05-06.md
- docs/frontend/CONTENT_FALLBACKS.md
- apps/web/src/app/(marketing)/gates/page.tsx
- apps/web/src/components/marketing/*

Implement:
- apps/web/src/app/(marketing)/gates/[style]/page.tsx
- optional gate marketing data helper if needed

Requirements:
- support 6 slugs: cantilever, bifold, pedestrian, telescopic, sliding, architectural
- use MarketingShell and MediaPlaceholder
- match existing industrial Steelyes style
- no final pricing claims; use indicative/survey language
- do not touch services, admin, DB, SiteHeader, SiteFooter

Return:
- files changed
- routes added
- verification commands run
```

---

## Prompt to give Worker B

```text
You own only services and case-study index marketing pages.

Read:
- docs/frontend/MARKETING_SITE_AUDIT_2026-05-06.md
- docs/frontend/CONTENT_FALLBACKS.md
- apps/web/src/app/(marketing)/installation/page.tsx
- apps/web/src/app/(marketing)/gallery/page.tsx
- apps/web/src/components/marketing/*

Implement:
- apps/web/src/app/(marketing)/services/page.tsx
- apps/web/src/app/(marketing)/services/railings/page.tsx
- apps/web/src/app/(marketing)/services/balconies/page.tsx
- apps/web/src/app/(marketing)/services/security/page.tsx
- apps/web/src/app/(marketing)/case-study/page.tsx

Requirements:
- match existing industrial Steelyes style
- use conservative copy, no unconfirmed certifications/legal/service-area claims
- use MediaPlaceholder for all imagery
- do not touch gates, admin, DB, SiteHeader, SiteFooter

Return:
- files changed
- routes added
- verification commands run
```

---

## Review checklist for Codex

- [ ] No final prices invented.
- [ ] No unsupported legal/company details invented.
- [ ] No photo/customer consent assumptions.
- [ ] No new DB/backend scope.
- [ ] No shared file conflicts.
- [ ] Mobile layout uses stable spacing and readable headings.
- [ ] Buttons/links point to existing routes or intentional future routes.
- [ ] All new pages use `MarketingShell`.
- [ ] `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass.
