---
title: Deployment Guide
description: Coolify deployment and operations runbook for the Steelyes Next.js app
owner: Ruben
status: ACTIVE
last_updated: 2026-08-03
---

# Steelyes — Deployment Guide

This is the current deployment source of truth. Historical Vercel references in dated plans and changelogs describe the former platform and are not operational instructions.

## Verified topology

Cloudflare proxies the public domains to a single Coolify server. Coolify runs the Next.js applications behind Traefik on port `3000`.

| Environment | Domain | Coolify application | Git branch |
|---|---|---|---|
| Production | `https://steelyes.co.uk`, `https://www.steelyes.co.uk` | `steelyes-production` | `staging` (must be reviewed before final launch) |
| Staging | `https://staging.steelyes.co.uk` | `steelyes-staging` | `feat/configurator-mobile-first` |

Both applications currently use the Nixpacks build pack with:

- install: `corepack enable && pnpm install --frozen-lockfile`
- build: `pnpm turbo run build --filter=web`
- start: `pnpm --filter web start`
- health check: HTTP `GET /` on port `3000`

The repository `Dockerfile` is a tested alternative for standalone Next.js builds, but is not the build method currently selected in Coolify.

## Required environment variables

Configure these separately on each Coolify application. Never copy production secrets into staging or vice versa.

| Variable | Scope |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | build + runtime |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | build + runtime |
| `SUPABASE_SERVICE_ROLE_KEY` | runtime only where possible |
| `RESEND_API_KEY` | runtime only where possible |
| `NEXT_PUBLIC_SITE_URL` | build + runtime; environment-specific |
| `CRON_SECRET` | runtime only; required for scheduled reminders |

Production and staging must use distinct Supabase projects before final launch. Confirm the hostname only; do not expose keys in tickets or logs.

## Abandoned-design scheduled task

The endpoint is `GET /api/cron/abandoned-designs`. It fails closed with `503` if `CRON_SECRET` is absent and returns `401` unless the request supplies `Authorization: Bearer <CRON_SECRET>`.

After setting a unique `CRON_SECRET` in the target application, create a Coolify scheduled task with frequency `0 9 * * *` (Coolify server timezone is UTC) and this command:

```sh
node -e "fetch('http://localhost:3000/api/cron/abandoned-designs',{headers:{authorization:'Bearer '+process.env.CRON_SECRET}}).then(r=>{if(!r.ok)process.exit(1)})"
```

Keep the command and secret inside Coolify. Verify one execution in staging before creating the production task. Do not use the public URL or place the secret in the command text.

## Release procedure

1. Require green CI and review the migration diff.
2. Verify staging smoke tests and environment-specific Supabase hostname.
3. Confirm the intended production Git branch and commit SHA.
4. Deploy through Coolify; do not change DNS during the same operation.
5. Verify `/`, `/contact`, `/admin/login`, configurator save/share, headers and application logs.
6. Roll back to the previous known-good commit if health checks or smoke tests fail.

Infrastructure changes, secret rotation, database migrations and production deploys require an explicit risk review before execution.
