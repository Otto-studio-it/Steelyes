---
title: Stack Rules
description: Tech stack definition, constraints, performance budgets, dependency policy
owner: Ruben (tech lead)
status: APPROVED for execution
last_updated: 2026-04-20
---

# Steelyes — Stack Rules

> Locked technology choices and non-negotiable constraints.
> Changes require ADR + approval.

---

## Tech stack table

| Layer                | Technology                          | Version    | Rationale                                                       |
| -------------------- | ----------------------------------- | ---------- | --------------------------------------------------------------- |
| Framework            | Next.js 14 (App Router)             | 14.x       | SSG + ISR + RSC + edge, SEO-native, zero config                 |
| Language             | TypeScript                          | 5.x strict | End-to-end type safety, no `any` permitted                      |
| Styling              | Tailwind CSS                        | 3.x        | Utility-first, performance, not 4.x (incompatible with shadcn)  |
| Component primitives | shadcn/ui (copied)                  | latest     | Unstyled, headless, copied into repo (no npm dep)               |
| Marketing UI         | Custom components                   | —          | Brand-specific, bespoke, not shadcn                             |
| Client state         | Zustand                             | 4.x        | Configurator state only, fine-grained subscriptions             |
| Server state         | TanStack Query                      | 5.x        | Caching + realtime revalidation on top of Supabase JS           |
| 3D rendering         | Three.js                            | r165+      | Procedural geometry + AR export, dynamic import only            |
| AR viewer            | Apple Quick Look + Google Scene     | native     | Zero install, platform-native, free                             |
| Backend + DB         | Supabase                            | latest     | Postgres + Auth + Realtime + Storage, EU region (London/FRA)    |
| Hosting              | Vercel                              | —          | Edge network + Next.js-native, auto-preview per PR              |
| Asset storage        | AWS S3 + CloudFront                 | eu-west-2  | Client requested, tooling maturity, IAM granularity             |
| Content management   | MDX + JSON in repo                  | —          | No headless CMS in v1, content changes through git PR            |
| Email                | Resend + React Email                | —          | Transactional email, typed templates, domain customization      |
| Anti-bot             | Cloudflare Turnstile                | —          | Privacy-first CAPTCHA, no Google tracking                       |
| Privacy/consent      | Iubenda                             | —          | CMP + Privacy/Cookie/ToS generator, UK-GDPR ready               |
| CI/CD                | GitHub Actions + Vercel + Supabase  | —          | Type check, lint, test, preview, auto-merge, migrations         |
| Monitoring           | Sentry + Vercel Analytics           | —          | Error tracking + Web Vitals                                      |
| Build orchestration  | Turborepo (task caching only)       | latest     | Not multi-app architecture, only task parallelization           |
| Package manager      | pnpm                                | 9.x        | Workspace support, lockfile discipline, `--frozen-lockfile`     |
| Test framework       | Vitest                              | latest     | Unit tests only (gate-engine), fast, ESM-native                 |
| E2E testing          | Playwright                          | latest     | Smoke tests per PR, CI gate, target devices (iPhone + Android)  |

---

## Forbidden list

The following are **explicitly NOT allowed** without an ADR:

- **Vite** — current codebase uses Vite; we are migrating to Next.js and discarding it
- **Next.js Pages Router** — App Router only
- **Convex** — US-hosted by default; UK-GDPR violation
- **Firebase** — proprietary query layer, not portable
- **Clerk** — redundant auth plane, paid service for one admin user
- **Sanity / Contentful / Strapi** — no headless CMS in v1; content in repo until Marius proves weekly update need
- **Turborepo as architecture** — we use it for task caching only, not for multi-app monorepo semantics
- **Redux** — we use Zustand for client state
- **WebXR / Babylon.js** — Three.js only; native AR viewers only (Quick Look / Scene Viewer)
- **Feature flags / FF systems** — no LaunchDarkly, no feature gating; all features ship or don't
- **User accounts / login** — share tokens only for config persistence
- **Online payment** — quote funnel only, no Stripe/PayPal in v1
- **Cloudflare Workers for application logic** — Vercel serverless only
- **R2 / any other object store** — AWS S3 only (client requested)

---

## Environment variables

### Public (safe to expose to browser)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[project].eu-west-1.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-public-key]
NEXT_PUBLIC_TURNSTILE_SITE_KEY=[public-key]
NEXT_PUBLIC_SITE_URL=https://steelyes.co.uk
NEXT_PUBLIC_SENTRY_DSN=[sentry-dsn-url]
```

### Server-only (NEVER prefix with `NEXT_PUBLIC_`)

```bash
SUPABASE_SERVICE_ROLE_KEY=[admin-key] # JWT with role=admin
TURNSTILE_SECRET_KEY=[secret-key]
RESEND_API_KEY=[api-key]
AWS_ACCESS_KEY_ID=[key]
AWS_SECRET_ACCESS_KEY=[secret]
AWS_S3_BUCKET=steelyes-prod
AWS_S3_REGION=eu-west-2
IUBENDA_SITE_ID=[id]
SENTRY_AUTH_TOKEN=[token]
ADMIN_EMAIL_ALLOWLIST=marius@steelyes.co.uk
```

Managed in Vercel project settings (separate values per environment). Never in git.

---

## Performance budgets

### Target devices + conditions

- **iPhone 12** on 4G
- **Samsung Galaxy A54** on 4G
- Chrome DevTools Slow 4G profile (1.6 Mbps down, 750 Kbps up, 150 ms RTT)

### Core Web Vitals targets

| Metric  | Target            | How                                                        |
| ------- | ----------------- | ---------------------------------------------------------- |
| **LCP** | < 2.0 s           | Hero image `priority`, AVIF/WebP, preconnect to CDN       |
| **CLS** | = 0               | All images have `width`/`height`; no late-loading fonts   |
| **INP** | < 200 ms          | No blocking JS; Three.js lazy-loaded; Zustand selectors   |
| **FCP** | < 1.4 s           | SSG, RSC for above-the-fold                               |
| **TBT** | < 200 ms          | Route-level code splitting; deferred analytics            |

### Lighthouse targets

| Route                 | Min Performance | Min Accessibility |
| --------------------- | --------------- | ------------------ |
| `/` and marketing     | 90              | 95                 |
| `/configurator/*`     | 85              | 95                 |
| `/admin/*`            | 80              | 95                 |

### Bundle budgets

| Route               | Max JS (gzip) | Rationale                                    |
| ------------------- | ------------- | -------------------------------------------- |
| `/` and marketing   | 120 KB        | RSC-heavy, small hydration island            |
| `/configurator/*`   | 600 KB        | Lazy-loaded after route, not critical path   |
| `/admin/*`          | 400 KB        | Acceptable, single user                      |

**Three.js lazy-loading is non-negotiable**: never imported outside configurator/AR routes.

---

## Three.js constraints

- **Rebuild time**: < 30 ms per rebuild on Galaxy A54 (mid-range Android 2023)
- **Dispose pattern**: `BufferGeometry.dispose()` called explicitly every rebuild (no memory leaks)
- **Dynamic import**: `dynamic(() => import('./Canvas'), { ssr: false })` for all Three.js components
- **Bundle**: never included in critical path or marketing bundle

---

## Dependency policy

New packages require **approval + rationale + size estimate + alternatives**:

1. **Decision**: Propose in an ADR or GitHub issue, not a commit message
2. **Rationale**: Why this pkg over alternatives? What problem does it solve?
3. **Size**: `npm bundle-phobia` size — must not exceed 50 KB gzip for client deps
4. **Alternatives**: What else did you consider? Why not?
5. **Security**: Run `npm audit` and document any known vulns accepted

Example:

```
Proposal: Add `qrcode` npm package for desktop AR fallback
Size: 4.8 KB gzip
Rationale: Desktop users get a QR code to continue AR on mobile
Alternatives: Implement QR generation from scratch (2 days), external API (rate limited)
Security: No known issues in latest version
Approval: Ruben ✅
```

---

## Supabase constraints

- **Region**: EU (London if available, Frankfurt as fallback)
- **RLS**: Default deny on all tables; explicit allow policies only
- **Auth roles**: `anon` (public), `admin` (JWT claim `role: 'admin'`)
- **Type generation**: `npx supabase gen types typescript --db-url $URL` after every migration
- **Migrations**: Forward-only, version-controlled, no manual schema changes in dashboard

---

## Database constraints

- **No unauthenticated mutations**: all INSERT/UPDATE/DELETE require either Turnstile + rate limit or admin JWT
- **Price calculation**: Server-side only, never client-trusted
- **Audit trail**: Every admin action logged to `admin_audit` table via trigger
- **Retention**: `quote_requests` auto-purged at 24 months via `pg_cron`

---

## Security constraints

- **Secrets**: Never in `.env.local`, GitHub, or Sentry logs
- **API keys**: Service Role Key only on server, never exposed to browser
- **Rate limiting**: IP hash + Supabase counter, 5 form submissions per IP per day
- **Honeypot**: Hidden field on all forms; filled requests silently rejected (200 OK, not saved)
- **Turnstile**: Required on all public forms, invisible mode preferred
- **PII**: No email, phone, postcode in Sentry before send; error messages never expose PII
- **CORS**: Supabase CORS configured for `steelyes.co.uk` + preview URLs only

---

## Content constraints

- **MDX**: Frontmatter validated with Zod at build time
- **JSON**: Flat structure, no deeply nested objects
- **Images**: Served via `next/image` with CloudFront domain, never direct S3 URL
- **Fonts**: Via `next/font` with subsetting; no `<link rel="preload">`

---

## Code constraints

- **TypeScript**: Strict mode enabled, no `any` types permitted
- **Import organization**: External → internal → relative; no `@/index` barrel exports
- **Naming**:
  - Files: `camelCase` for logic, `PascalCase` for React components
  - Folders: `kebab-case`
  - Constants: `UPPER_SNAKE_CASE`
- **Console**: No `console.log` in production code; debug via DevTools only
- **Comments**: Explain "why", not "what"

---

## CI/CD constraints

- **Branch protection**: No direct push to `main`; all changes via PR with passing CI
- **Status checks required**:
  - `typecheck` ✅
  - `lint` ✅
  - `test` ✅
  - `build` ✅
  - `lighthouse-ci` ✅ (Performance ≥ 90 on `/`)
  - `e2e` ✅ (Playwright smoke on preview)
- **Auto-merge**: PRs auto-merge after all checks pass and one approval
- **Rollback**: `git revert` + push to `main` = instant production rollback

---

## Accessibility constraints

- **WCAG 2.1 AA** minimum, AAA where practical
- **Keyboard nav**: All interactive elements reachable and operable via keyboard
- **Color contrast**: 4.5:1 for body text, 3:1 for large text (AAA)
- **Screen reader**: `aria-live`, `aria-label`, `role` attributes where needed
- **Motion**: `prefers-reduced-motion: reduce` disables all animations globally
- **Touch targets**: ≥ 44 × 44 CSS px (Apple HIG)

---

## Monitoring constraints

- **Sentry**: Enabled on all environments, errors sent with 10-second debounce
- **Scrubbing**: Email, phone, postcode fields scrubbed before send
- **Source maps**: Uploaded per release to Sentry for stack trace accuracy
- **Analytics**: Vercel Analytics enabled, no third-party analytics (privacy-first)
- **Logging**: No logs with PII; use IP hash for rate limiting

---

## Deployment constraints

- **Environments**: dev-local, staging (per PR), production
- **Promotion**: `main` branch = production; no manual promotion workflow
- **Supabase**: Migrations run via Supabase CLI in CI before Vercel deploys
- **Secrets rotation**: Every 90 days for Resend, Turnstile, Sentry tokens
- **Backups**: Supabase daily backups enabled, S3 versioning ON

---

## Version pinning

- Lock all versions in `package.json` (no `^` or `~`)
- `pnpm install --frozen-lockfile` in CI and production deploys
- `pnpm update` manually after security audit

---

**Locked document.** All deviations require an ADR.

_Last reviewed: 20 April 2026 · Next review: After dependency additions or version updates_
