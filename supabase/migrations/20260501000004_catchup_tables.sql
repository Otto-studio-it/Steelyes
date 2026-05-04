-- ==========================================
-- MIGRATION: CATCH-UP TABELLE + DATI
-- ==========================================
-- Deve essere una migration separata dagli ADD VALUE enum
-- (PostgreSQL: nuovo valore enum non utilizzabile nella stessa transazione)

-- ------------------------------------------
-- 2. GATES: ristruttura colonne
-- ------------------------------------------
ALTER TABLE public.gates
  DROP COLUMN IF EXISTS base_price_per_m2,
  DROP COLUMN IF EXISTS tube_multipliers,
  DROP COLUMN IF EXISTS finish_multipliers,
  DROP COLUMN IF EXISTS motor_surcharge;

ALTER TABLE public.gates
  ADD COLUMN IF NOT EXISTS name               VARCHAR(200) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS finish             VARCHAR(20)  NOT NULL DEFAULT 'metal'
                                              CHECK (finish IN ('metal', 'composite')),
  ADD COLUMN IF NOT EXISTS min_width_mm       INT          NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_height_mm      INT          NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS base_price_manual_gbp NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS base_price_auto_gbp   NUMERIC(10,2);

-- ------------------------------------------
-- 3. RLS POLICIES su gates
-- ------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='gates' AND policyname='gates_anon_select') THEN
    CREATE POLICY "gates_anon_select" ON public.gates FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='gates' AND policyname='gates_admin_update') THEN
    CREATE POLICY "gates_admin_update" ON public.gates FOR UPDATE TO authenticated
      USING ((auth.jwt()->'user_metadata'->>'is_admin')::boolean = true)
      WITH CHECK ((auth.jwt()->'user_metadata'->>'is_admin')::boolean = true);
  END IF;
END $$;

-- ------------------------------------------
-- 4. GATE_OPTIONS
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.gate_options (
  id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               VARCHAR(100) UNIQUE NOT NULL,
  name               VARCHAR(150) NOT NULL,
  flat_price_gbp     NUMERIC(10,2) NOT NULL DEFAULT 0,
  per_unit_price_gbp NUMERIC(10,2),
  unit_type          VARCHAR(50),
  notes              TEXT,
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.gate_options ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='gate_options' AND policyname='gate_options_anon_select') THEN
    CREATE POLICY "gate_options_anon_select" ON public.gate_options FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='gate_options' AND policyname='gate_options_admin_update') THEN
    CREATE POLICY "gate_options_admin_update" ON public.gate_options FOR UPDATE TO authenticated
      USING ((auth.jwt()->'user_metadata'->>'is_admin')::boolean = true)
      WITH CHECK ((auth.jwt()->'user_metadata'->>'is_admin')::boolean = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='gate_options' AND policyname='gate_options_admin_insert') THEN
    CREATE POLICY "gate_options_admin_insert" ON public.gate_options FOR INSERT TO authenticated
      WITH CHECK ((auth.jwt()->'user_metadata'->>'is_admin')::boolean = true);
  END IF;
END $$;

CREATE OR REPLACE TRIGGER set_gate_options_updated_at
  BEFORE UPDATE ON public.gate_options
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------
-- 5. FENCING_PANELS
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.fencing_panels (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  style            public.gate_style NOT NULL,
  finish           VARCHAR(20)  NOT NULL DEFAULT 'metal' CHECK (finish IN ('metal', 'composite')),
  base_price_gbp   NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_per_m2_gbp NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes            TEXT,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.fencing_panels ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='fencing_panels' AND policyname='fencing_panels_anon_select') THEN
    CREATE POLICY "fencing_panels_anon_select" ON public.fencing_panels FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='fencing_panels' AND policyname='fencing_panels_admin_update') THEN
    CREATE POLICY "fencing_panels_admin_update" ON public.fencing_panels FOR UPDATE TO authenticated
      USING ((auth.jwt()->'user_metadata'->>'is_admin')::boolean = true)
      WITH CHECK ((auth.jwt()->'user_metadata'->>'is_admin')::boolean = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='fencing_panels' AND policyname='fencing_panels_admin_insert') THEN
    CREATE POLICY "fencing_panels_admin_insert" ON public.fencing_panels FOR INSERT TO authenticated
      WITH CHECK ((auth.jwt()->'user_metadata'->>'is_admin')::boolean = true);
  END IF;
END $$;

CREATE OR REPLACE TRIGGER set_fencing_panels_updated_at
  BEFORE UPDATE ON public.fencing_panels
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------
-- 6. SEED gate_options (ON CONFLICT skip)
-- ------------------------------------------
INSERT INTO public.gate_options (slug, name, flat_price_gbp, per_unit_price_gbp, unit_type, notes) VALUES
  ('middle-bar',        'Middle Bar',          275.00, NULL, NULL,         'Flat price. Divides gate horizontally.'),
  ('railheads-top',     'Railheads (Top)',       0.00, NULL, 'per_railhead','TBD: £1.25–£25 per railhead. Awaiting Marius.'),
  ('dog-bars',          'Dog Bars',             75.00, 4.50, 'per_extra_bar','Base £75 + £4.50 per additional bar.'),
  ('railheads-dog-bars','Railheads on Dog Bars', 0.00, NULL, 'per_railhead','Same as railheads-top. TBD.'),
  ('arch-bow-top',      'Arch / Bow Top',      850.00, NULL, NULL,         'Curved top rail. Flat price per gate.'),
  ('circles',           'Circles',             275.00, 2.50, 'per_circle', '£275 base + £2.50 per circle.'),
  ('bushes',            'Bushes',               90.00, NULL, 'per_bush',   'Base £90. Per-bush price TBD.'),
  ('spirals',           'Spirals',               0.00, 3.80, 'per_spiral', '£3.80 per spiral minimum.')
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------
-- 7. SEED gates (ON CONFLICT skip via unique on type+style+finish)
-- ------------------------------------------
-- Add unique constraint if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'gates_type_style_finish_key' AND conrelid = 'public.gates'::regclass
  ) THEN
    ALTER TABLE public.gates ADD CONSTRAINT gates_type_style_finish_key UNIQUE (type, style, finish);
  END IF;
END $$;

INSERT INTO public.gates (name, type, style, finish, min_width_mm, min_height_mm, base_price_manual_gbp, base_price_auto_gbp) VALUES
  ('Victorian Double Swing (Metal)',       'double-swing',    'victorian','metal',     1800,900,1800.00,3800.00),
  ('Victorian Double Swing (Composite)',   'double-swing',    'victorian','composite', 1800,900,1800.00,3800.00),
  ('Victorian Single Swing (Metal)',       'single-swing',    'victorian','metal',      800,900, 850.00,2700.00),
  ('Victorian Single Swing (Composite)',   'single-swing',    'victorian','composite',  800,900, 750.00,2700.00),
  ('Victorian Sliding Trucked (Metal)',    'sliding',         'victorian','metal',     2500,900,2200.00,3600.00),
  ('Victorian Sliding Trucked (Composite)','sliding',         'victorian','composite', 2500,900,2200.00,3600.00),
  ('Victorian Cantilevered (Metal)',       'cantilevered',    'victorian','metal',     2500,900,2900.00,4200.00),
  ('Victorian Cantilevered (Composite)',   'cantilevered',    'victorian','composite', 2500,900,2900.00,4200.00),
  ('Victorian Bifolding Double (Metal)',   'bifolding',       'victorian','metal',     2900,900,2500.00,4200.00),
  ('Victorian Bifolding Double (Composite)','bifolding',      'victorian','composite', 2900,900,2500.00,4200.00),
  ('Victorian Bifolding Single (Metal)',   'bifolding-single','victorian','metal',     1500,900,1900.00,3000.00),
  ('Victorian Bifolding Single (Composite)','bifolding-single','victorian','composite',1500,900,1900.00,3000.00),
  ('Victorian Telescopic (Metal)',         'telescopic',      'victorian','metal',     2000,900,3100.00,4200.00),
  ('Victorian Telescopic (Composite)',     'telescopic',      'victorian','composite', 2000,900,3100.00,4200.00),
  ('Victorian Radius Sliding (Metal)',     'sliding-radius',  'victorian','metal',     1600,900,2500.00,4200.00),
  ('Victorian Radius Sliding (Composite)', 'sliding-radius',  'victorian','composite', 1600,900,2500.00,4200.00)
ON CONFLICT (type, style, finish) DO NOTHING;

-- ------------------------------------------
-- 8. GRANTS
-- ------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON public.gates TO anon, authenticated, service_role;
GRANT UPDATE ON public.gates TO authenticated, service_role;
GRANT SELECT, UPDATE, INSERT ON public.gate_options TO anon, authenticated, service_role;
GRANT SELECT, UPDATE, INSERT ON public.fencing_panels TO anon, authenticated, service_role;
GRANT SELECT ON public.service_zones TO anon, authenticated, service_role;
GRANT SELECT, INSERT ON public.configurations TO anon, authenticated, service_role;
GRANT INSERT ON public.quote_requests TO anon, authenticated, service_role;
GRANT SELECT, INSERT ON public.admin_audit TO service_role;

-- ------------------------------------------
-- 9. SCHEMA RELOAD
-- ------------------------------------------
NOTIFY pgrst, 'reload schema';
