---
title: Architecture Rules
description: Technical architecture, routing, state management, database, security, deployment
owner: Ruben (architect)
status: APPROVED for execution
last_updated: 2026-04-20
---

# Steelyes — Architecture Rules

> Single source of truth for technical design and decision log.
> All architectural decisions locked. Deviations require an ADR.

---

## High-level architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (mobile-first)                         │
│  Next.js 14 — RSC for static, Client Components for interactivity      │
│  Zustand (configurator) · TanStack Query (server state cache)          │
└───────────┬──────────────────────────────────────────────┬─────────────┘
            │                                              │
            │ HTTPS / Server Actions                       │ Realtime (WebSocket)
            ▼                                              ▼
┌───────────────────────────┐   ┌──────────────────────────────────────┐
│ Coolify + Next.js Node.js │   │         Supabase (EU region)         │
│  ─ Next.js Server Actions │   │  ─ Postgres (operational data)       │
│  ─ API route handlers     │◄──┤  ─ Auth (admin only, JWT)            │
│  ─ ISR revalidation       │   │  ─ Realtime (postgres_changes)       │
│  ─ Image optimisation     │   │  ─ Row Level Security (default deny)  │
└───────────────────────────┘   └──────────────────────────────────────┘
            │                                              │
            ▼                                              ▼
┌───────────────────────────┐   ┌──────────────────────────────────────┐
│      AWS S3 + CDN         │   │       External services (HTTP)       │
│  ─ /products/gates/…      │   │  ─ Resend  (transactional email)     │
│  ─ /gallery/…             │   │  ─ Turnstile (anti-bot)              │
│  ─ /ar-models/{hash}.glb  │   │  ─ Iubenda (cookie banner + ToS)     │
│  ─ /ar-models/{hash}.usdz │   │  ─ Sentry (errors)                   │
└───────────────────────────┘   └──────────────────────────────────────┘
```

---

## Layer separation

```
PRESENTATION LAYER
  Next.js App Router · RSC (marketing) + Client Components (configurator/admin)
  Tailwind + custom marketing components · shadcn/ui for forms/tables

STATE LAYER
  Zustand    — configurator UI state (fine-grained subscriptions via selectors)
  TanStack Query  — Supabase data caching + realtime revalidation
  Server Actions  — mutations, always validated server-side

BUSINESS LOGIC LAYER
  packages/gate-engine  — pricing + 3D mesh generation (pure TypeScript, testable)
  lib/validation        — Zod schemas shared client+server

DATA LAYER
  Supabase Postgres — gates catalogue, configurations, quote requests, zones
  MDX/JSON in repo  — marketing copy, FAQ, legal

INFRASTRUCTURE LAYER
  Coolify     — Next.js build, deployment and container lifecycle
  Cloudflare  — DNS, edge proxy and CDN
  AWS S3      — binary assets (photos, 3D exports)
  CloudFront  — CDN in front of S3 public assets
  Resend      — email
  Sentry      — error tracking
```

---

## Routing strategy

### App Router layout

```
apps/web/src/app/
├── (marketing)/                    # SSG/ISR, RSC-first
│   ├── page.tsx                    # Homepage
│   ├── gates/
│   │   ├── page.tsx                # Gate type index
│   │   └── [style]/page.tsx        # Modern | Classic | Privacy | ...
│   ├── [service-pages]/            # Railings, Security, Balconies, etc.
│   ├── gallery/page.tsx
│   ├── installation/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── case-study/[slug]/page.tsx
│   └── legal/
│       ├── privacy-policy/page.tsx
│       ├── cookie-policy/page.tsx
│       └── terms/page.tsx
├── (configurator)/                 # Client-heavy, CSR + realtime
│   ├── configurator/
│   │   ├── page.tsx                # Type picker entry
│   │   └── [type]/page.tsx         # One flow per gate type
│   └── quote/[shareToken]/page.tsx # Read-only share page
├── (admin)/                        # Behind Supabase Auth
│   ├── admin/
│   │   ├── layout.tsx              # Auth gate
│   │   ├── page.tsx                # Dashboard
│   │   ├── requests/page.tsx       # Quote requests Kanban
│   │   └── gates/page.tsx          # Catalogue editor
└── api/
    ├── webhooks/resend/route.ts    # Email delivery events
    └── og/[slug]/route.ts          # Dynamic OG image generation
```

### Rendering strategy per route

| Route                                        | Strategy      | Why                                                      |
| -------------------------------------------- | ------------- | -------------------------------------------------------- |
| `/`, `/gates`, `/gates/[style]`, services   | **SSG+ISR**   | Content changes rarely; paid Ads landing pages instant   |
| `/installation`, `/contact`, `/gallery`      | **SSG**       | Purely static                                             |
| `/case-study/[slug]`                         | **SSG**       | One-off hero content                                      |
| `/legal/*`                                   | **SSG**       | Iubenda embedded script, static shell                    |
| `/configurator/*`                            | **CSR**       | Three.js canvas has no SSR value; lazy-loaded            |
| `/quote/[shareToken]`                        | **SSR**       | Fetch Supabase on each request with token                |
| `/admin/*`                                   | **SSR+auth**  | Session validated edge-side on each nav                  |

---

## State management

### Three distinct tools for three concerns

1. **UI ephemeral state** → `useState` / `useReducer`
   - Form inputs, modal open/close, current step
   - Dies on unmount

2. **Configurator state** → **Zustand**
   - Source of truth: gate type, dimensions, tube size, finish, motorized, etc.
   - Why: configurator updates dozens of times/second during slider drag
   - Context would cause whole-subtree re-renders; Zustand gives fine-grained selectors
   - Example: `const price = store((s) => s.price)` re-renders only when price changes

3. **Server state** → **TanStack Query**
   - Quote list in admin, gate catalogue on configurator entry, zones for postcode check
   - Built-in dedupe, cache, refetch-on-focus
   - Realtime: `postgres_changes` from Supabase invalidates the query cache

---

## Database schema & security

### Core tables

- **gates**: Gate types, styles, base prices, multipliers (editorial + pricing source of truth)
- **configurations**: Saved configurations, shareable via token, no account required
- **quote_requests**: Lead funnel — customer name, email, postcode, status, admin notes
- **service_zones**: UK installation zones (postcode prefixes), surcharges
- **admin_audit**: Audit trail (every admin action logged via PostgreSQL trigger)

### Row Level Security (RLS) — the security story in SQL

**Principle**: database refuses unauthorised reads/writes even if frontend is compromised.

- **gates**: `SELECT` by anyone (public catalogue), `ALL` (write) by admin only
- **configurations**: `INSERT` by anyone (anon saves), `SELECT` by token holder or admin
- **quote_requests**: `INSERT` by anyone with valid Turnstile, `ALL` (read/write) by admin
- **service_zones**: `SELECT` by anyone (public zone check), `ALL` (write) by admin
- **admin_audit**: `SELECT` by admin only (read-only from client, writes via trigger)

### Price calculation — server-side only

```ts
// packages/gate-engine/src/pricing.ts — pure TypeScript, 0 deps
export function calculatePrice(gate: Gate, config: GateConfig): number {
  // Reject invalid input (Zod runs before, but be paranoid)
  if (config.widthMm < 600 || config.widthMm > 6000) throw new Error("width_out_of_range");

  // Base area
  const areaM2 = (config.widthMm / 1000) * (config.heightMm / 1000) * config.leafCount;

  // Apply multipliers from the gate record (DB-driven)
  let price = gate.basePricePerM2 * areaM2;
  price *= gate.tubeMultipliers[config.tubeSize];
  price *= gate.finishMultipliers[config.finish];

  // Type-specific surcharges
  if (config.motorized) price += gate.motorSurcharge ?? 0;
  if (gate.type === "telescopic") price *= 1.15;
  if (gate.type === "cantilevered") price *= 1.2;

  return Math.round(price);
}
```

**Client shows preview price computed locally. Authoritative price comes from Server Action that re-runs the calculation in Node and writes to `configurations`. Client value is never trusted.**

### Realtime in the admin panel

```ts
// Hook: subscribe to postgres_changes, invalidate TanStack Query cache
export function useLiveRequests() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["quote_requests"],
    queryFn: () => supabase.from("quote_requests").select("*"),
  });

  useEffect(() => {
    const channel = supabase
      .channel("quote_requests_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "quote_requests" }, () =>
        qc.invalidateQueries({ queryKey: ["quote_requests"] }),
      )
      .subscribe();
    return () => supabase.removeChannel(channel); // CLEANUP REQUIRED
  }, [qc]);

  return query;
}
```

**No polling. Channel cleanup in `useEffect return` to prevent memory leak.**

---

## Gate Engine — shared business logic

`packages/gate-engine/` is pure TypeScript (zero runtime dependencies) imported by:
- Next.js frontend (client preview)
- Server Actions (authoritative calculation)

### Structure

```
packages/gate-engine/src/
├── types.ts           # GateConfig, GateType, FinishCode, etc.
├── pricing.ts         # calculatePrice() with all type surcharges
├── mesh/
│   ├── index.ts       # buildGateMesh(type, config) — dispatcher
│   ├── double-swing.ts
│   ├── sliding.ts
│   ├── bifolding.ts
│   ├── cantilevered.ts
│   ├── sliding-radius.ts
│   ├── telescopic.ts
│   └── shared.ts      # buildFrame, buildInfill, applyFinish, materials
└── export/
    ├── glb.ts         # THREE.GLTFExporter wrapper
    └── usdz.ts        # THREE.USDZExporter wrapper
```

### Why procedural geometry (not prefab GLB files)

A gate is parametric: each combination of `(width, height, tubeSize, style, motorized, leafCount)` produces a different mesh. Pre-baking every combination = tens of thousands of GLB files, killing the "any dimension" value prop.

**Cost**: one builder function per type (6 total), 80–200 lines of Three.js primitives each. Each independently unit-tested.

**Performance**: benchmark target **< 30 ms** per rebuild on Galaxy A54. Slider drag debounced at 50 ms. `BufferGeometry.dispose()` called explicitly every rebuild.

---

## Three.js constraints in configurator

- **Dynamic import**: `dynamic(() => import('./Canvas'), { ssr: false })`
- **Lazy-loaded**: not in critical path, not in bundle until route navigates to `/configurator`
- **Dispose pattern**: every rebuild calls `geometry.dispose()` on previous mesh (no GC thrashing)
- **Rebuild time**: < 30 ms non-negotiable
- **Bundle**: never imported outside configurator/AR routes

---

## Asset storage (AWS S3 + CloudFront)

### Bucket layout

```
steelyes-assets/
├── products/gates/{type}/{hero,thumb,detail-N}.webp
├── services/{railings,security,staircases}/{...}.webp
├── gallery/{projectId}/{main,detail-N}.webp
├── case-study/{caseSlug}/{hero,detail-N}.webp
├── ar-models/{configHash}.{glb,usdz}
└── uploads/{adminUserId}/{...} # temp before promoted
```

### Access strategy

| Asset class          | Access              | TTL          | Why                                |
| -------------------- | ------------------- | ------------ | ---------------------------------- |
| Product photos       | Public via CDN      | 1 year cache | Drives SEO, LCP; CDN edge-cached   |
| Gallery/case photos  | Public via CDN      | 1 year cache | Marketing                          |
| AR 3D models         | Signed URLs         | 15 min       | Single-use per session             |
| Admin uploads (temp) | Signed PUT URLs     | 1 hour       | Direct browser → S3; no proxy      |

### Image pipeline

**Phase 1 shortcut**: `next/image` handles resize on-demand against original. First request slow, subsequent requests CDN-cached.

**Phase 2 plan**: Lambda on S3 `Object Created` event → resize to 4 widths (400/800/1600/2400) + convert to WebP.

---

## AR export flow

```
1. User completes configuration in /configurator/[type]
2. User taps "View in your driveway"
3. Client computes hash = sha256(JSON.stringify(config))
4. Client calls Server Action getOrGenerateARModel(configId, platform)
5. Server Action:
   a. Check configurations.ar_model_key — if present, return signed URL
   b. Else: import gate-engine, call buildGateMesh(type, config)
   c. Export to GLB (Android) or USDZ (iOS) using THREE exporters
   d. PUT to S3://steelyes-assets/ar-models/{hash}.{glb|usdz}
   e. Update configurations.ar_model_key = hash
   f. Return signed URL (TTL 15 min)
6. Client opens URL in:
   - iOS Safari: <a rel="ar" href="signedUrl.usdz"> → Quick Look
   - Android Chrome: intent://arvr.google.com/scene-viewer/1.0?file=...
```

**Scale**: Three.js uses arbitrary units; AR viewers expect metres. Divide all mm dimensions by 1000 in exporter. Verified on physical devices.

---

## Content management

**Decision: no headless CMS in v1.** Marius has not delivered final copy, photos, pricing, or logo. Installing a CMS before there is content is premature.

Content lives in repo:

```
apps/web/content/
├── home.mdx
├── about.mdx
├── installation.mdx
├── gates/{type}.mdx
├── services/{category}.mdx
├── case-studies/{slug}.mdx
├── faq.json
├── testimonials.json
└── seo-meta.json
```

- MDX parsed by `@next/mdx` at build time
- Content changes go through git PR (reviewable, reversible, version-controlled)
- When Marius proves weekly update need, re-evaluate for v2 CMS (Payload / Sanity EU)

---

## Security model

### Threat model & mitigation

| Threat                        | Likelihood | Impact | Mitigation                                                  |
| ----------------------------- | ---------- | ------ | ----------------------------------------------------------- |
| Form spam / quote flood       | High       | Medium | Turnstile + rate limit (5/IP/day) + honeypot               |
| Configurator price tampering  | Medium     | High   | Price always recomputed server-side; client is display-only |
| Unauthorised admin access     | Low        | Critical | Supabase Auth + RLS + MFA + allowlist (`@steelyes.co.uk`)   |
| Unauthorised S3 uploads       | Medium     | Medium | Signed PUT URLs only, 1h TTL, Content-Length + Content-Type |
| Customer PII leakage          | Low        | Critical | RLS, audit log, no PII in logs, Sentry scrubbing            |
| Property photo without consent | Medium     | Medium | Written consent required; PII blur (plates, faces, numbers) |
| Dependency supply-chain       | Medium     | High   | Dependabot, `pnpm audit` in CI, `--frozen-lockfile` deploys |

### Auth setup

- **Supabase Auth**: Email+password, magic link, JWT-based
- **Admin allowlist**: Only `marius@steelyes.co.uk` can log in
- **MFA**: TOTP-based, optional but recommended
- **RLS**: Default deny on all tables; explicit allow policies only

### Iubenda integration

- **CMP**: Iubenda Cookie Solution, GCM v2 for Google Ads
- **Blocking**: Turnstile + Resend scripts deferred until "Marketing" consent
- **Documents**: Privacy Policy, Cookie Policy, Terms embedded via Iubenda iframe on `/legal/*`
- **DPA**: Iubenda-generated; signed between Steelyes Ltd (controller) and Otto Studio (processor)

### UK-GDPR checklist

- ✅ Data residency: Supabase EU region
- ✅ Lawful basis: contract (pre-contractual steps)
- ✅ Retention: quote_requests auto-purged at 24 months
- ✅ Right to erasure: admin panel "Delete customer data" action (soft-delete + PII-null)
- ✅ DPA: signed and active
- ✅ Subprocessors: Supabase, Hetzner, AWS, Resend, Cloudflare, Iubenda, Sentry, PostHog
- ✅ Incident response: Sentry alert → Ruben + Marius within 1h → ICO within 72h if PII breach

---

## Deployment

### Environments

| Env         | Purpose     | URL                      | Supabase             | S3 bucket        |
| ----------- | ----------- | ------------------------ | -------------------- | ---------------- |
| **Local**   | Dev machine | `localhost:3000`         | `supabase start`     | `steelyes-dev-*` |
| **Staging** | Pre-release | `staging.steelyes.co.uk` | `steelyes-staging` | `steelyes-staging` |
| **Prod**    | Live        | `steelyes.co.uk`         | `steelyes-prod`      | `steelyes-prod`  |

### CI/CD pipeline

```
Developer: git push origin feat/xyz
  │
  ▼
GitHub Actions:
  ├── pnpm install --frozen-lockfile
  ├── pnpm typecheck
  ├── pnpm lint
  ├── pnpm test (gate-engine unit tests)
  ├── pnpm build
  └── pnpm test:e2e --project=chromium (Playwright smoke)
  │
  ▼ (green)
Coolify: staging deploy → staging URL
  │
  ▼
gh pr create --auto-merge
  │
  ▼ (auto-merge after CI)
Main branch push:
  ├── Coolify: production deploy
  ├── Supabase: apply new migrations via CLI
  └── Sentry: upload source maps for release
```

**Production deployment follows the branch configured in Coolify. Before launch, pin this to the approved release branch. Rollback uses the previous known-good Coolify deployment or a reviewed git revert.**

### Database migrations

- Managed by Supabase CLI in `supabase/migrations/`
- Every schema change = new timestamped SQL file, PR-reviewed
- Forward-only; no `DROP TABLE` in prod migrations without confirmed separate PR
- Pre-deploy in CI: `supabase db lint` + dry-run against shadow DB

---

## Mobile-first strategy

1. **Wireframes start at 375 × 667** (iPhone SE 2)
2. **Touch targets ≥ 44 × 44 CSS px** (Apple HIG)
3. **Configurator layout on mobile**:
   - Top 60% viewport: sticky Three.js canvas
   - Bottom 40%: vertical stepper with step controls
   - Bottom bar: "Previous · Next · £ price" — always visible sticky
4. **Hover states have tap equivalents** (no hover-only affordances)
5. **Input types right for mobile**: `inputmode="numeric"`, `autocomplete` tags
6. **Forms single-column**, label above input, error inline below
7. **No horizontal scroll** (enforced via Playwright check at 320 px)
8. **AR is mobile-only**: desktop shows QR code

---

## Critical path

1. **Phase 0 (Week 1)**: Repo scaffold, Supabase EU, CI/CD live
2. **Phase 1 (Weeks 2–5)**: Marketing site + quote funnel live
3. **Phase 2 (Weeks 6–9)**: Gate-engine (pricing + all 6 mesh builders) → configurator
4. **Phase 3 (Weeks 10–11)**: AR export + frontend integration
5. **Stabilise (Weeks 12–13)**: Polish, performance, launch

**Bottleneck**: gate-engine mesh builders (Weeks 6–8). Any delay here delays AR and stabilisation.

---

**Locked document.** All deviations require an ADR.

_Last reviewed: 20 April 2026 · Next review: After any routing or data model change_
