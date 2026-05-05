-- Migration: fix_pricing_rls_grants
-- Completes Phase 2 DB closure by adding table privileges required by the
-- admin INSERT/DELETE policies added in fix_pricing_rls_closure.
--
-- RLS policies are not enough on their own: service_role bypasses RLS, but it
-- still needs table grants, and authenticated admins need both grants + policy.

GRANT INSERT, DELETE ON public.gates TO authenticated, service_role;
GRANT DELETE ON public.gate_options TO authenticated, service_role;

NOTIFY pgrst, 'reload schema';
