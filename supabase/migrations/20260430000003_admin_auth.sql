-- ==========================================
-- MIGRATION 004: ADMIN AUTH + WRITE POLICIES
-- ==========================================
-- Enables admin users (via Supabase Auth user_metadata.is_admin = true)
-- to update pricing data. Public read stays unrestricted via existing policies.

-- ------------------------------------------
-- 1. WRITE POLICIES — gates
-- ------------------------------------------
CREATE POLICY "gates_admin_update"
  ON public.gates FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- ------------------------------------------
-- 2. WRITE POLICIES — gate_options
-- ------------------------------------------
CREATE POLICY "gate_options_admin_update"
  ON public.gate_options FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "gate_options_admin_insert"
  ON public.gate_options FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- ------------------------------------------
-- 3. WRITE POLICIES — fencing_panels
-- ------------------------------------------
CREATE POLICY "fencing_panels_admin_update"
  ON public.fencing_panels FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "fencing_panels_admin_insert"
  ON public.fencing_panels FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );
