-- Migration: harden_public_non_dml_grants
-- Phase 5 closure follow-up: remove non-DML table privileges from public app
-- roles where they are not part of the application access model.
--
-- anon/authenticated access should be expressed through the minimal DML grants
-- required by PostgREST plus RLS policies. They do not need REFERENCES,
-- TRIGGER, or TRUNCATE on application tables.

REVOKE TRIGGER, TRUNCATE, REFERENCES
ON
  public.configurations,
  public.fencing_panels,
  public.gate_options,
  public.gates,
  public.quote_requests,
  public.service_zones
FROM anon, authenticated;

NOTIFY pgrst, 'reload schema';
