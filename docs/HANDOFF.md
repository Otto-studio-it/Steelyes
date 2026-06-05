---
title: Senior Developer Handoff
description: Fast onboarding for engineers joining the Steelyes repo
owner: Ruben
status: ACTIVE
last_updated: 2026-05-19
---

# Steelyes — Senior Developer Handoff

Read this first, then [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) and [`frontend/CLIENT_CHANGELOG.md`](./frontend/CLIENT_CHANGELOG.md).

---

## 30-minute setup

```bash
cd /path/to/Steelyes
pnpm install
cp apps/web/.env.example apps/web/.env.local   # fill Supabase + Resend keys
pnpm dev                                       # http://localhost:3000
```

**Monorepo layout**

| Path | Purpose |
|---|---|
| `apps/web/` | Next.js 14 app (marketing + configurator + admin) |
| `packages/gate-engine/` | Pricing, validation, 2D rendering, serialization |
| `supabase/migrations/` | DB schema + RLS (staging aligned; prod separate project) |

**Quality gates** (run before PR):

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
cd apps/web && pnpm e2e   # needs .env.local + E2E creds
```

---

## What is done

- Supabase staging DB/RLS hardened (19 migrations aligned).
- Production Supabase auth repaired for known admin account (`steelyes-prod`).
- Marketing site: 20 public routes live with approved industrial editorial style.
- Configurator: 2D-first wizard, indicative pricing, save/share at `/quote/[shareToken]`.
- Admin: gates, gate-options, fencing CRUD tested (Playwright 6/6 historically).
- CI: typecheck, lint, test, build on push/PR (`.github/workflows/ci.yml`).

---

## What is blocked (do not invent data)

| Blocker | Owner | Fallback |
|---|---|---|
| Final price list + motorised prices | Marius | “Indicative, subject to survey” |
| Railhead variants + unit prices | Marius | Provisional `gate_options` rows |
| Finish palette + multipliers | Marius | 4 generic finishes in UI |
| Company number, VAT, contact details | Marius | Placeholders flagged pre-launch |
| Photo consent for gallery | Marius | Workshop photos only |
| DNS / domain cutover | Marius + Ruben | `steelyes.co.uk` still on GoDaddy legacy |

Full tracker: [`CLIENT_BLOCKERS.md`](./CLIENT_BLOCKERS.md).

---

## Deploy checklist (not yet live)

1. Vercel project root: **`apps/web`** (not repo root).
2. Env vars: see `apps/web/.env.example` + [`STACK_RULES.md`](./STACK_RULES.md).
3. Production Supabase project: `reqgfvahdcbmbajjqtve` (`steelyes-prod`).
4. Staging Supabase project: `hgeksaulzomkgqnfuriu` (`steelyes-staging`).
5. Point `steelyes.co.uk` DNS to Vercel when Marius provides registrar access.

---

## Where to work next

1. **Client changes** — [`frontend/CLIENT_CHANGELOG.md`](./frontend/CLIENT_CHANGELOG.md) (prioritized backlog).
2. **Repo health** — [`REPO_HEALTH.md`](./REPO_HEALTH.md) (CI status, hygiene, WIP).
3. **Configurator scope** — [`frontend/CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md`](./frontend/CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md).

---

## Conventions (non-negotiable)

- [`CODEBASE_CONVENTIONS.md`](./CODEBASE_CONVENTIONS.md) — folders, naming, commits.
- [`DESIGN_RULES.md`](./DESIGN_RULES.md) — tokens, typography, industrial tone.
- [`ARCHITECTURE_RULES.md`](./ARCHITECTURE_RULES.md) — Supabase, RLS, no CMS in v1.
- Deviations from locked docs → ADR in `docs/adr/`.

---

## Branch note

Active feature work may be on `feat/configurator-mobile-first`. Confirm `main` vs feature branch before merging.
