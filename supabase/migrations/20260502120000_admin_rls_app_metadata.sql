-- Admin write policies: trust only app_metadata.is_admin (not user-editable via client).
-- Next.js still accepts user_metadata during login until all admins are migrated in Auth UI.
-- Service role bypasses RLS; admin panel writes keep working.

-- Remove unreliable PostgREST reload hook (NOTIFY from migrations is not guaranteed on hosted).
DROP EVENT TRIGGER IF EXISTS pgrst_watch;
DROP FUNCTION IF EXISTS public.pgrst_watch();

DROP POLICY IF EXISTS "gates_admin_update" ON public.gates;
CREATE POLICY "gates_admin_update"
  ON public.gates FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

DROP POLICY IF EXISTS "gate_options_admin_update" ON public.gate_options;
DROP POLICY IF EXISTS "gate_options_admin_insert" ON public.gate_options;

CREATE POLICY "gate_options_admin_update"
  ON public.gate_options FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "gate_options_admin_insert"
  ON public.gate_options FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

DROP POLICY IF EXISTS "fencing_panels_admin_update" ON public.fencing_panels;
DROP POLICY IF EXISTS "fencing_panels_admin_insert" ON public.fencing_panels;

CREATE POLICY "fencing_panels_admin_update"
  ON public.fencing_panels FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "fencing_panels_admin_insert"
  ON public.fencing_panels FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

NOTIFY pgrst, 'reload schema';
