-- Migration: fix_pricing_rls_closure
-- Closes BUG-1, BUG-2, BUG-3, BUG-4 from STAGING_DB_BASELINE_2026-05-04.md
-- No table/column schema changes. Grant + policy DDL only.

-- Table grants are required in addition to RLS policies:
-- service_role bypasses RLS, but it still needs table privileges.
GRANT INSERT, DELETE ON public.gates TO authenticated, service_role;
GRANT DELETE ON public.gate_options TO authenticated, service_role;

DO $$
BEGIN

  -- BUG-1a: gates_admin_insert
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'gates'
      AND policyname = 'gates_admin_insert'
  ) THEN
    CREATE POLICY "gates_admin_insert"
      ON public.gates
      FOR INSERT TO authenticated
      WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
      );
  END IF;

  -- BUG-1b: gates_admin_delete
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'gates'
      AND policyname = 'gates_admin_delete'
  ) THEN
    CREATE POLICY "gates_admin_delete"
      ON public.gates
      FOR DELETE TO authenticated
      USING (
        (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
      );
  END IF;

  -- BUG-2: gate_options_admin_delete
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'gate_options'
      AND policyname = 'gate_options_admin_delete'
  ) THEN
    CREATE POLICY "gate_options_admin_delete"
      ON public.gate_options
      FOR DELETE TO authenticated
      USING (
        (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
      );
  END IF;

  -- BUG-3: configurations_anon_select
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'configurations'
      AND policyname = 'configurations_anon_select'
  ) THEN
    CREATE POLICY "configurations_anon_select"
      ON public.configurations
      FOR SELECT TO anon
      USING (true);
  END IF;

END $$;

-- BUG-4: drop typo duplicate policy on service_zones
DROP POLICY IF EXISTS "service.
_zones_anon_select" ON public.service_zones;

-- Notify PostgREST to reload schema cache.
NOTIFY pgrst, 'reload schema';
