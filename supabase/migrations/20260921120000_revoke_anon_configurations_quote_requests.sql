-- Migration: revoke_anon_configurations_quote_requests
--
-- The public anon key could list every saved configuration (share tokens included) and insert
-- rows straight into configurations / quote_requests, bypassing Turnstile, the honeypot and
-- server-side validation (turnstile_verified, status and admin_notes were attacker-controlled).
-- On the live database any signed-up user (`authenticated`) could also SELECT every quote
-- request: the policy is named "Only authenticated admins…" but its USING clause is `true`.
--
-- The app touches EVERY table through the service-role client only (server actions, routes,
-- admin, cron) — the anon / authenticated roles are used for login, nothing else. So the
-- posture is deny-by-default:
--   1. configurations + quote_requests: drop every policy (live names differ from the repo).
--   2. every public table: anon / authenticated lose ALL privileges…
--   3. …except SELECT on the public catalogue (gates, gate_options, fencing_panels,
--      service_zones), whose read policies stay as they are.
-- This also closes admin_audit ("Admin only logs" is SELECT … USING (true) for any signed-up
-- user) and makes every old write policy irrelevant.
-- Idempotent, touches no rows, and safe to apply BEFORE the app release.

DO $$
DECLARE
  target record;
  catalogue constant text[] := ARRAY['gates', 'gate_options', 'fencing_panels', 'service_zones'];
BEGIN
  FOR target IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename IN ('configurations', 'quote_requests')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', target.policyname, target.tablename);
  END LOOP;

  FOR target IN
    SELECT c.relname AS tablename, NULL::text AS policyname
    FROM pg_class c
    WHERE c.relnamespace = 'public'::regnamespace AND c.relkind IN ('r', 'p')
  LOOP
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', target.tablename);
    IF target.tablename = ANY (catalogue) THEN
      EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', target.tablename);
    END IF;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target.tablename);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO service_role', target.tablename);
  END LOOP;
END $$;

-- New tables must not inherit broad grants again.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;

-- Notify PostgREST to reload schema cache.
NOTIFY pgrst, 'reload schema';
