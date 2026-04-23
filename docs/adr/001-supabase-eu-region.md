---
adr_number: 001
title: Supabase EU Region for GDPR Compliance
status: Accepted
date_proposed: 2026-02-01
date_accepted: 2026-02-01
author: Ruben (locked decision, documented from STEELYES_ARCHITECTURE.md)
supersedes: null
superseded_by: null
---

# 001. Supabase EU Region for GDPR Compliance

## Status

**Accepted** — Approved and locked in STACK_RULES.md and ARCHITECTURE_RULES.md

## Context

Steelyes is a gate-design software company serving UK and European customers. Our primary customer (confidential) is UK-based but operates across EU markets. GDPR regulations require that personal data (customer names, contact info, project details) must be stored and processed within the EU, with explicit data residency guarantees.

Our technology choice is **Supabase** (managed PostgreSQL + auth + realtime). Supabase offers multiple region options:
- **US-East-1** (Virginia) — lowest latency from US, many API replicas
- **EU-West-1** (Frankfurt, Germany) — EU data residency, GDPR compliant, slower than US

We evaluated self-hosted PostgreSQL and other alternatives. The trade-off decision: managed service (faster go-to-market, less DevOps) vs. data control (self-hosted compliance). Given our 13-week timeline and small team, Supabase EU is the pragmatic choice.

## Decision

**We will use Supabase with EU region (Frankfurt, Germany) for all Steelyes environments (dev, staging, production).**

All database connections, authentication, and realtime subscriptions route through the EU region. This is non-negotiable for GDPR compliance and is locked in STACK_RULES.md and ARCHITECTURE_RULES.md.

### Configuration
- **Connection string:** `postgresql://[user]:[password]@db.eu-west-1.supabase.com:[port]/postgres`
- **.env files:** `NEXT_PUBLIC_SUPABASE_URL` and server-side secrets point to EU region
- **Type generation:** `npx supabase gen types` connects to EU region
- **Migrations:** All `supabase/migrations/` run against EU region only
- **No region switching:** Once data is created in EU, we do not migrate to US or multi-region (too costly)

## Consequences

### Positive
- ✅ **GDPR compliant by default** — customer data never leaves EU
- ✅ **Managed service** — Supabase handles patching, backups, scaling (no DBA required)
- ✅ **Realtime subscriptions** — postgres_changes subscriptions reduce API latency
- ✅ **Fast deployment** — Supabase CLI (`supabase link`, `supabase migration up`) faster than manual RDS setup
- ✅ **Auth included** — JWT tokens and RLS policies built-in (no Auth0 or Clerk dependency)

### Negative
- ⚠️ **Latency +10ms from UK** — Frankfurt to UK ~10ms round-trip (acceptable for configurator workload; confirmed in load test)
- ⚠️ **Fewer API replicas in EU** — higher risk if Frankfurt region has incident (US has 4+ replicas)
- ⚠️ **Vendor lock-in** — Supabase proprietary extensions (pgsodium, JWT templates); self-hosting not straightforward
- ⚠️ **Cost baseline** — managed service costs more than self-hosted, but DevOps savings offset

### Effort Required
- **Initial:** 2 hours to set up Supabase EU project, link CLI, create migrations
- **Verification:** 4 hours to load test latency (confirmed acceptable)
- **Ongoing:** Monitor Supabase status page for EU incidents, alert if unavailable
- **Migration cost (future):** If we ever need to move to US or self-host, data export/import will take 2–3 days

## Alternatives Considered

### Option 1: US-region Supabase (Virginia)
| Aspect | Eval |
|--------|------|
| **Latency** | Lower (5ms from UK) |
| **Resilience** | Higher (4+ replicas) |
| **Cost** | Slightly lower |
| **GDPR** | ❌ Non-compliant — violates data residency |
| **Effort** | Easier (US region more stable) |
| **Decision** | **Rejected** — GDPR requirement is non-negotiable |

**Why rejected:** Customer is EU-based; GDPR fines are €20M or 4% of global revenue. Using US region is not legally defensible.

### Option 2: Self-hosted Postgres on AWS RDS (EU-West-1)
| Aspect | Eval |
|--------|------|
| **Latency** | ✅ Similar to Supabase EU (~10ms) |
| **Resilience** | ✅ High (AWS Multi-AZ) |
| **Cost** | ~$200/month (cheaper than Supabase) |
| **GDPR** | ✅ Compliant |
| **Auth** | ❌ Must build JWT, RLS policies manually |
| **Ops burden** | ❌ Patching, backups, scaling require DBA |
| **Effort** | 3–4 weeks to set up securely |
| **Decision** | **Rejected** — DevOps burden too high for 13-week timeline |

**Why rejected:** Team (Ruben + contractor) lacks Postgres DBA expertise. Supabase managed service is better ROI for our timeline.

### Option 3: Multi-region Supabase (EU + US failover with replication)
| Aspect | Eval |
|--------|------|
| **Latency** | ✅ EU customers see 10ms, US customers see 5ms |
| **Resilience** | ✅ Highest (failover to US if EU down) |
| **Cost** | ❌ 2–3x higher (bidirectional replication) |
| **Complexity** | ❌ Replication logic, conflict resolution |
| **GDPR** | ⚠️ Requires careful consent for US fallback |
| **Effort** | 4+ weeks to implement + test |
| **Decision** | **Rejected** — Over-engineered for phase A; revisit post-launch |

**Why rejected:** Early-stage product; no evidence of US demand yet. Multi-region adds cost/complexity without revenue justification. Revisit in Q4 2026 if we expand to North America.

## Implementation Notes

### Setup (one-time)
```bash
# Create Supabase project at https://app.supabase.com, select EU region (Frankfurt)
pnpm install supabase@latest
supabase link --project-id <PROJECT_ID>
supabase migration up  # Applies all migrations to EU region
npx supabase gen types typescript --db-url $SUPABASE_DB_URL > types/database.types.ts
```

### Environment Variables
All `.env` files (local, staging, production) include:
```bash
# EU region endpoint
NEXT_PUBLIC_SUPABASE_URL=https://<project>.eu-west-1.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public-key>  # Safe to expose

# Server-only secrets
SUPABASE_SERVICE_ROLE_KEY=<secret>  # Admin JWT, keep secret
```

### CI/CD Integration
- GitHub Actions: `supabase migration up` runs in staging deploy step
- Verify: health check `SELECT NOW()` from EU region before deploying
- Rollback: `supabase migration revert` if migration fails

### Monitoring
- **Status page:** https://status.supabase.com (watch EU-West-1)
- **Alerts:** Sentry if `NEXT_PUBLIC_SUPABASE_URL` is unreachable
- **Latency:** Log query times; alert if p95 > 500ms
- **Backup:** Supabase automated backups daily; verify restore procedure quarterly

### No Region Switching
Once production data exists, **do not migrate regions**. Cost and risk are prohibitive:
- Data export: ~1–2GB per week → 10–50GB total by Q4
- Downtime: 4–8 hours to export, validate, import
- Verification: Must audit all RLS policies after migration

If we need US presence (post-launch), use Supabase Edge Functions (regional) or Vercel regional API routes, not database replication.

## Related Documents

- **docs/STACK_RULES.md** — Supabase tech stack requirement, EU region locked
- **docs/ARCHITECTURE_RULES.md** — Database layer, Supabase client patterns, RLS policies
- **STEELYES_ARCHITECTURE.md** — Original source decision (Section: Database)
- **STEELYES_WEEKLY_ROADMAP.md** — Phase B Week 2: Supabase EU setup

## Revision History

| Date       | Author  | Status   | Change                                       |
|------------|---------|----------|----------------------------------------------|
| 2026-02-01 | Ruben   | Accepted | Initial: documented locked decision from architecture spec |
| 2026-04-22 | Ruben   | —        | Migrated to ADR format, added alternatives analysis |

---

**This decision is locked.** Deviations (e.g., US region, self-hosted Postgres, multi-region) require ADR and explicit approval from Ruben.
