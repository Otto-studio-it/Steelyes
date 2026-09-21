---
title: Release runbook — security, AR, mobile, engine, ops (Sept 2026)
owner: Ruben
status: ACTIVE
last_updated: 2026-09-21
---

# Release runbook — Phases 0–5

Production deploys **automatically from `main`** (Coolify `auto_deploy`). Merging a PR *is* a deploy,
so the order below matters. Steps marked **NOW** need no deploy and close holes that are open today.

Stacked PRs (merge strictly in this order, each into the previous one's base after it lands):

| # | Branch | Base | Content |
|---|--------|------|---------|
| 1 | `release/1-tests` | `main` | Phase 0 security + hardening migration, Phase 1 test/CI hygiene |
| 2 | `release/2-ar` | `release/1-tests` | AR rebuild (visible model, server-side generation) |
| 3 | `release/3-mobile` | `release/2-ar` | Mobile selectors |
| 4 | `release/4-engine` | `release/3-mobile` | Cut list, railhead pricing, arch, validation |
| 5 | `release/5-ops` | `release/4-engine` | CSP report-only, embed, PDF/webhook/cron, retention fn |

## Step 1 — NOW: close open signup (no deploy)

Production audit: GoTrue has `disable_signup=false` and `mailer_autoconfirm=true`. Any signed-up user
can read every quote request ("Only authenticated admins can see requests" is `USING (true)`), and
with the code currently live a user who signs up with `user_metadata.is_admin = true` becomes admin.

- Supabase auth service (Coolify → `steelyes-supabase-api` → auth): set `GOTRUE_DISABLE_SIGNUP=true`, restart **auth only**.
- Verify: `GET https://supabase.steelyes.co.uk/auth/v1/settings` → `"disable_signup": true`.
- Verify the admin can still log in at `/admin/login`.
- While there: `GOTRUE_SITE_URL` points at staging — set it to `https://www.steelyes.co.uk`.

The only existing user already has `is_admin` in `app_metadata` (audited), so Phase 0 will not lock them out.

## Step 2 — NOW: apply the hardening migration (no deploy)

`supabase/migrations/20260921120000_revoke_anon_configurations_quote_requests.sql` — idempotent, touches
no rows, safe with the code currently live (the app uses the service role for every table).

```sql
BEGIN;
\i 20260921120000_revoke_anon_configurations_quote_requests.sql
-- expect: permission denied
SET ROLE anon;          SELECT count(*) FROM public.configurations;  RESET ROLE;
SET ROLE authenticated; SELECT count(*) FROM public.quote_requests;  RESET ROLE;
SET ROLE authenticated; SELECT count(*) FROM public.admin_audit;     RESET ROLE;
-- expect: a number
SET ROLE anon;          SELECT count(*) FROM public.gates;           RESET ROLE;
ROLLBACK;   -- dry run. Re-run with COMMIT once the four checks behave as expected.
```

After COMMIT, from outside with the anon key only:
`GET /rest/v1/configurations?select=share_token&limit=1` must no longer return rows (401/403 or empty).
Then smoke-test the live site: save a design, open its `/quote/<token>` page, download the PDF, submit the contact form.

Rollback (restores the previous, insecure state — only if the site breaks):
`GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;` and re-create the dropped policies from the audit list.

## Step 3 — before merging PR 1

| Setting | Where | Why |
|---|---|---|
| `TURNSTILE_SECRET_KEY` | Coolify runtime env | Without it production now **rejects every form submission** (fail closed) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | build-time env / build arg | Widget does not render without it |
| `TURNSTILE_ALLOW_UNVERIFIED=true` | Coolify runtime env | Temporary escape hatch **only** if the keys are not ready |
| `CRON_SECRET` | Coolify runtime env | Reminder job returns 503 without it; also signs unsubscribe links |

Create the Turnstile widget in Cloudflare → Turnstile → add `steelyes.co.uk` + `www.steelyes.co.uk`.

GitHub → repo secrets: add `E2E_SUPABASE_URL`, `E2E_SUPABASE_ANON_KEY`, `E2E_SUPABASE_SERVICE_ROLE_KEY`
pointing at a **non-production** Supabase. Today every PR's E2E run writes quote requests / leads into
production and sends mail through Resend (the two "failed" deliveries to `@example.com` are those runs).

## Step 4 — merge PR 1, verify

- `/healthz` 200; admin login works; contact form and configurator quote submit succeed (Turnstile widget visible).
- 21st rapid request to `/api/quote/<token>/pdf` from one IP → 429.

## Step 5 — PR 2 (AR), then real-device test

Needs the public HTTPS site. Test matrix — for each: opens straight into AR? scale locked? gate sits on the floor? pickets visible?

1. iPhone · Safari  2. iPhone · Chrome  3. Android with ARCore · Chrome  4. Android without ARCore (must fall back to 3D view)

Desktop: QR code opens the share page on the phone.

## Step 6 — PRs 3 and 4

No configuration. After PR 4 the workshop cut list and railhead prices change (see CHANGELOG_INTERNAL) — tell the workshop.

## Step 7 — before / after PR 5

Before: apply `20260921130000_design_captures_reminder_queue.sql` and `20260921140000_personal_data_retention_function.sql`
(the second only defines a function; it deletes nothing and schedules nothing).

After:
- Coolify → Scheduled Task, daily: `curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://www.steelyes.co.uk/api/cron/abandoned-designs`
- Watch container logs for `[csp-report]` for a week, then promote the CSP header to enforcing.
- Optional: `EMBED_ALLOWED_ORIGINS` (build-time) when a partner embeds the configurator.
- Retention: `select * from public.purge_expired_personal_data('24 months', true);` (dry run). Scheduling real deletion is the owner's call.

## Separate follow-ups

- Origin firewall: allow 80/443 only from Cloudflare ranges (`supabase.steelyes.co.uk` resolves straight to the droplet, so the origin IP is public).
- GHCR image: keep the package **private**; give Coolify a `read:packages` token instead of making it public.
- Client decisions still open: width datum (clear opening vs leaf), circles count rule, middle bar standard vs option, pricing of fence panels / posts / custom RAL.
