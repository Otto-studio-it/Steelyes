-- Migration: revoke_anon_configurations_quote_requests
--
-- The public anon key could list every saved configuration (share tokens included)
-- and insert rows straight into configurations / quote_requests, bypassing Turnstile,
-- the honeypot and server-side validation (turnstile_verified, status and admin_notes
-- were attacker-controlled).
--
-- The app only touches these tables through the service-role client
-- (server actions, quote PDF route, admin, cron), which bypasses RLS, so the
-- anon/authenticated policies and grants are not needed. RLS stays enabled with no
-- policies for anon/authenticated = deny by default.

DROP POLICY IF EXISTS "configurations_anon_select" ON public.configurations;
DROP POLICY IF EXISTS "configurations_anon_insert" ON public.configurations;
DROP POLICY IF EXISTS "quote_requests_anon_insert" ON public.quote_requests;

ALTER TABLE public.configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.configurations FROM anon, authenticated;
REVOKE ALL ON public.quote_requests FROM anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.configurations TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_requests TO service_role;

-- Notify PostgREST to reload schema cache.
NOTIFY pgrst, 'reload schema';
