-- Migration: quote_requests_service_role_grants
-- Phase 3: allow server-side admin quote workflows to read and update leads.
--
-- quote_requests contains PII, so only service_role receives read/update grants.
-- No anon SELECT. No authenticated SELECT/UPDATE.
-- No RLS policy needed: service_role bypasses RLS, but still needs table grants.

GRANT SELECT, UPDATE ON public.quote_requests TO service_role;

NOTIFY pgrst, 'reload schema';
