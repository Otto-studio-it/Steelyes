# Steelyes web application

Next.js 14 App Router application for the Steelyes marketing site, configurator, quote flow and administration area.

Run commands from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm e2e
```

Copy `apps/web/.env.example` to `apps/web/.env.local` for local development. Never commit credentials.

Production and staging are deployed as separate Coolify applications behind Cloudflare. See `docs/DEPLOY.md` for the current topology, required variables and scheduled-job runbook.
