-- Migration: security_harden_admin_audit
-- Restrict admin_audit table to admin-only access.
-- 
-- Issue: Any authenticated user can currently SELECT from admin_audit via PostgREST
-- because the table has a SELECT grant to authenticated role, even though RLS blocks
-- anon access. This migration ensures only admins (users with is_admin = true in 
-- user_metadata) can read the audit log.

-- Revoke existing SELECT grant from authenticated role
REVOKE SELECT ON public.admin_audit FROM authenticated;

-- Create RLS policy: only admins can SELECT
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' 
      AND tablename = 'admin_audit' 
      AND policyname = 'admin_audit_admin_select'
  ) THEN
    CREATE POLICY "admin_audit_admin_select"
      ON public.admin_audit FOR SELECT
      TO authenticated
      USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
  END IF;
END $$;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
