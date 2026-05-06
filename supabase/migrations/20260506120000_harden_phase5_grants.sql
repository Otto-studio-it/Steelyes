-- Migration: harden_phase5_grants
-- Phase 5 closure follow-up: tighten table privileges to match the intended
-- RLS access model before production.
--
-- RLS already blocks the anon writes below because no matching anon write
-- policies exist. These REVOKEs reduce the table-grant surface so privileges
-- also reflect the intended public read-only catalogue model.

REVOKE TRIGGER, TRUNCATE, REFERENCES
ON public.admin_audit
FROM anon, authenticated;

REVOKE UPDATE
ON public.gates
FROM anon;

REVOKE INSERT, UPDATE
ON public.gate_options
FROM anon;

REVOKE INSERT, UPDATE
ON public.fencing_panels
FROM anon;

NOTIFY pgrst, 'reload schema';
