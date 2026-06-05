---
title: Deployment Guide
description: Vercel deployment steps for the Steelyes Next.js app
owner: Ruben
status: ACTIVE
last_updated: 2026-05-19
---

# Steelyes — Deployment Guide

## Vercel project settings

| Setting | Value |
|---|---|
| Framework | Next.js |
| Root Directory | `apps/web` |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |
| Build Command | `cd ../.. && pnpm turbo run build --filter=web` |

`apps/web/vercel.json` encodes the install/build commands for the monorepo.

## Required environment variables

Copy from [`apps/web/.env.example`](../apps/web/.env.example). Minimum for production:

| Variable | Environment |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production + Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production + Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Production + Preview (server only) |
| `RESEND_API_KEY` | Production + Preview (server only) |
| `NEXT_PUBLIC_SITE_URL` | Production (`https://steelyes.co.uk` or Vercel URL) |

**Supabase projects**

- Staging: `hgeksaulzomkgqnfuriu` (`steelyes-staging`)
- Production: `reqgfvahdcbmbajjqtve` (`steelyes-prod`)

Point production Vercel env vars at **steelyes-prod**.

## DNS cutover (blocked on Marius)

1. Deploy successfully to Vercel preview URL.
2. Verify contact form, admin login, configurator share links.
3. Add `steelyes.co.uk` domain in Vercel.
4. Update GoDaddy DNS to Vercel records.
5. Configure Resend SPF/DKIM/DMARC on production domain.

## Post-deploy smoke test

- [ ] `/` loads, no console errors
- [ ] `/contact` form submits
- [ ] `/admin/login` works for allowlisted email
- [ ] `/configurator` → save → `/quote/[token]` loads
- [ ] Legal pages render with draft notice
