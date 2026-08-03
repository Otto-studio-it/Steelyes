---
title: Repository Health Report
description: Baseline technical audit after Phase 2 cleanup (2026-05-19)
owner: Ruben
status: ACTIVE
last_updated: 2026-05-19
---

# Steelyes — Repository Health Report

Baseline audit for senior handoff. Re-run checks after major merges.

**Handoff companion:** [`HANDOFF.md`](./HANDOFF.md)

---

## CI health (local run 2026-05-19)

| Check | Result | Notes |
|---|---|---|
| `pnpm typecheck` | ✅ pass | `web` + `@steelyes/gate-engine` |
| `pnpm lint` | ✅ pass | Fixed unused imports blocking build |
| `pnpm test` | ✅ pass | 61 tests in `gate-engine` |
| `pnpm build` | ✅ pass | 35+ static/SSG routes compiled |
| `pnpm e2e` | ⏸ not run | Requires live Supabase + `E2E_ADMIN_*` creds |

**Fixes applied this audit**

- Removed unused `PricingCopyVariant` import in `ConfiguratorActionBar.tsx`.
- Removed unused `SocialLinks` import in `SiteFooter.tsx` (partial WIP).

---

## Uncommitted work (resolved in this phase)

~310 lines of configurator mobile polish were sitting uncommitted:

| Area | Change |
|---|---|
| `ConfiguratorShell.tsx` | Mobile layout / step flow |
| `ConfiguratorPreview*.tsx` | Preview panel behaviour |
| `ConfiguratorActionBar.tsx` | Mobile pricing bar copy |
| `ConfiguratorPriceSummary.tsx` | Desktop/mobile pricing display |
| `labels.ts` | Shared pricing copy helpers (`formatPricingDisplay*`) |
| `configurator.spec.ts` | E2E selectors aligned |

**Action:** committed with Phase 2 hygiene pass so `main`/feature branch is not dirty.

---

## Route audit vs documentation

**Public marketing routes (20 `page.tsx` files)**

| Route | Status | Doc drift |
|---|---|---|
| `/` | live | OK |
| `/about`, `/contact`, `/gallery`, `/installation` | live | copy audit pending (CL-008) |
| `/gates`, `/gates/[style]` | live | `PAGE_INVENTORY` was stale — updated |
| `/services` + 5 children | live | was marked “missing” in May-06 inventory |
| `/case-study`, `/case-study/[slug]` | live | content blocked on Marius |
| `/configurator` | live | active development |
| `/quote/[shareToken]` | live | share baseline |
| `/legal/*` (3) | live | placeholder legal copy |

**Admin routes (6)** — functional; not client-facing.

**Stale directories** — `gates-catalogue/`, `installation-services/` no longer exist on disk. Removed from inventory.

---

## Repo hygiene

### Fixed in Phase 2

| Item | Action |
|---|---|
| `graphify-out/` (~100 files) | Untracked via `git rm --cached`; added to `.gitignore` |
| `docs/adr/Screenshot*.png` | Deleted stray file; `docs/**/*.png` ignored (except photo-browser) |
| `.claude/worktrees/` | Added to `.gitignore` |
| `apps/web/.env.example` | Created for onboarding |
| `docs/HANDOFF.md` | Created for senior dev quickstart |

### Deferred (separate PR recommended)

| Item | Size | Risk | Recommendation |
|---|---|---|---|
| `.agents/skills/` (~230 tracked files) | Large | Low functional risk | Evaluate: keep for team tooling OR move to external skill pack and `git rm --cached` |
| `turbo.json` test outputs | Config | CI cache warnings | Add `dist/**` output for `gate-engine#build` |
| `.claude/worktrees/frosty-swartz` | Submodule? | Git noise | `git submodule deinit` or remove worktree |

---

## Deploy readiness

| Requirement | Status |
|---|---|
| Vercel root = `apps/web` | ✅ `apps/web/vercel.json` + [`DEPLOY.md`](./DEPLOY.md) |
| `.env.example` documented | ✅ added |
| Production domain live | ❌ `steelyes.co.uk` → GoDaddy legacy |
| `steelyes.vercel.app` | ❌ `DEPLOYMENT_NOT_FOUND` (per PROJECT_STATUS) |
| Supabase prod project | ✅ `steelyes-prod` auth verified |
| Required env vars in CI | ✅ GitHub secrets wired in `ci.yml` |

---

## Priority actions (post Phase 2)

### Immediate (engineering)

1. Merge/commit configurator WIP + hygiene (this phase).
2. Run `pnpm e2e` locally before external staging share.
3. Update `PAGE_INVENTORY` audit checkboxes route-by-route.

### Before senior handoff

4. Untrack `.agents/` if not required in repo (optional large cleanup).
5. Deploy preview to Vercel with prod env → validate contact form + admin login.

### Before client launch

6. Batch A from `CLIENT_CHANGELOG.md` — legal footer, claims audit, deploy + DNS.
7. Marius data for pricing/catalogue (cannot fake).

---

## Re-run commands

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
cd apps/web && pnpm e2e
git status --short
```

Update this file when checks or deploy status change.

### Graphify output

`graphify-out/` is generated, not source-controlled.

Use these commands to rebuild it from the repo root:

```bash
graphify update /Volumes/SSDRubb/Steelyes
```

If files were deleted or renamed and you want the graph refreshed even with a smaller node count:

```bash
graphify update /Volumes/SSDRubb/Steelyes --force
```

If you only want to regenerate clustering and HTML from an existing `graphify-out/graph.json`:

```bash
graphify cluster-only /Volumes/SSDRubb/Steelyes
```
