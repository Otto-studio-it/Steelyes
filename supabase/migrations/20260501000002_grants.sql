-- ==========================================
-- MIGRATION: GRANTS + MISSING TABLES FIX
-- ==========================================
-- 1. Create missing tables if they don't exist (idempotent)
-- 2. Add missing GRANTs (migrations don't auto-grant unlike Studio)
-- 3. Reload PostgREST schema cache

-- ------------------------------------------
-- 1. ENSURE gate_options EXISTS
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.gate_options (
  id                    UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  VARCHAR(100)  UNIQUE NOT NULL,
  name                  VARCHAR(150)  NOT NULL,
  flat_price_gbp        NUMERIC(10,2) NOT NULL DEFAULT 0,
  per_unit_price_gbp    NUMERIC(10,2),
  unit_type             VARCHAR(50),
  notes                 TEXT,
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

ALTER TABLE public.gate_options ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'gate_options' AND policyname = 'gate_options_anon_select'
  ) THEN
    CREATE POLICY "gate_options_anon_select"
      ON public.gate_options FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'gate_options' AND policyname = 'gate_options_admin_update'
  ) THEN
    CREATE POLICY "gate_options_admin_update"
      ON public.gate_options FOR UPDATE TO authenticated
      USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true)
      WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'gate_options' AND policyname = 'gate_options_admin_insert'
  ) THEN
    CREATE POLICY "gate_options_admin_insert"
      ON public.gate_options FOR INSERT TO authenticated
      WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
  END IF;
END $$;

-- ------------------------------------------
-- 2. ENSURE fencing_panels EXISTS
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.fencing_panels (
  id                    UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  style                 public.gate_style NOT NULL,
  finish                VARCHAR(20)   NOT NULL DEFAULT 'metal'
                                      CHECK (finish IN ('metal', 'composite')),
  base_price_gbp        NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_per_m2_gbp      NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes                 TEXT,
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

ALTER TABLE public.fencing_panels ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'fencing_panels' AND policyname = 'fencing_panels_anon_select'
  ) THEN
    CREATE POLICY "fencing_panels_anon_select"
      ON public.fencing_panels FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'fencing_panels' AND policyname = 'fencing_panels_admin_update'
  ) THEN
    CREATE POLICY "fencing_panels_admin_update"
      ON public.fencing_panels FOR UPDATE TO authenticated
      USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true)
      WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'fencing_panels' AND policyname = 'fencing_panels_admin_insert'
  ) THEN
    CREATE POLICY "fencing_panels_admin_insert"
      ON public.fencing_panels FOR INSERT TO authenticated
      WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);
  END IF;
END $$;

-- ------------------------------------------
-- 3. GRANTS — migrations don't auto-grant
-- ------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT, UPDATE ON public.gates TO anon, authenticated, service_role;
GRANT SELECT, UPDATE, INSERT ON public.gate_options TO anon, authenticated, service_role;
GRANT SELECT, UPDATE, INSERT ON public.fencing_panels TO anon, authenticated, service_role;
GRANT SELECT ON public.service_zones TO anon, authenticated, service_role;
GRANT SELECT, INSERT ON public.configurations TO anon, authenticated, service_role;
GRANT INSERT ON public.quote_requests TO anon, authenticated, service_role;
GRANT SELECT, INSERT ON public.admin_audit TO service_role;

-- ------------------------------------------
-- 4. FORCE SCHEMA RELOAD
-- ------------------------------------------
NOTIFY pgrst, 'reload schema';
