-- fencing_panels was missing DELETE grant and policy.
-- service_role bypasses RLS but not GRANT; authenticated admins also need a DELETE policy.

GRANT DELETE ON public.fencing_panels TO service_role, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'fencing_panels' AND policyname = 'fencing_panels_admin_delete'
  ) THEN
    CREATE POLICY "fencing_panels_admin_delete"
      ON public.fencing_panels FOR DELETE TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);
  END IF;
END $$;
