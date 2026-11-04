-- Migration: fix_admin_audit_policy_app_metadata
-- Fix admin_audit RLS to use app_metadata.is_admin instead of user_metadata (user-editable).
-- 
-- Issue: Migration 20261103180000 created a policy using user_metadata.is_admin, which users
-- can edit via signUp/updateUser with the anon key. This allows privilege escalation.
-- Pre-existing "Admin only logs" policy also had USING (true) for any authenticated user.
-- 
-- Fix: Drop both insecure policies and create a correct policy checking app_metadata.is_admin
-- (only writable by service_role or via Auth admin UI). Service role access is unaffected;
-- authenticated users without admin flag get no access.

-- Drop the incorrect policy created in 20261103180000
DROP POLICY IF EXISTS "admin_audit_admin_select" ON public.admin_audit;

-- Drop the pre-existing "Admin only logs" policy if it exists
DROP POLICY IF EXISTS "Admin only logs" ON public.admin_audit;

-- Create correct admin-only SELECT policy using app_metadata
CREATE POLICY "admin_audit_admin_select"
  ON public.admin_audit FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- No SELECT grant to authenticated: the app reads admin_audit only server-side with the
-- service role, so the policy is defence in depth if a grant is ever added later.

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- ROLLBACK SQL (to reverse this migration if needed):
-- DROP POLICY IF EXISTS "admin_audit_admin_select" ON public.admin_audit;
-- CREATE POLICY "admin_audit_admin_select"
--   ON public.admin_audit FOR SELECT
--   TO authenticated
--   USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
-- NOTIFY pgrst, 'reload schema';
