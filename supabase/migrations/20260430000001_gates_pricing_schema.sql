-- ==========================================
-- MIGRATION 002: GATES PRICING SCHEMA
-- ==========================================
-- Restructure gates table for real client pricing data.
-- Add gate_options and fencing_panels tables.
-- Seed all known prices from Marius (2026-04-30).
-- Note: dimension-based price increments TBD — Marius to confirm.
-- Note: railhead per-unit price TBD (£1.25–£25 range, awaiting confirmation).
-- Note: bush per-unit price TBD — Marius to confirm.
-- Note: fencing_panels pricing TBD — no data received yet.

-- ------------------------------------------
-- 1. EXTEND ENUMS
-- ------------------------------------------

ALTER TYPE public.gate_type ADD VALUE IF NOT EXISTS 'single-swing';
ALTER TYPE public.gate_type ADD VALUE IF NOT EXISTS 'bifolding-single';
ALTER TYPE public.gate_style ADD VALUE IF NOT EXISTS 'victorian';

-- ------------------------------------------
-- 2. RESTRUCTURE gates TABLE
-- ------------------------------------------
-- Drop old placeholder columns, add real pricing columns.

ALTER TABLE public.gates
  DROP COLUMN IF EXISTS base_price_per_m2,
  DROP COLUMN IF EXISTS tube_multipliers,
  DROP COLUMN IF EXISTS finish_multipliers,
  DROP COLUMN IF EXISTS motor_surcharge;

ALTER TABLE public.gates
  ADD COLUMN IF NOT EXISTS finish         VARCHAR(20)    NOT NULL DEFAULT 'metal'
                                          CHECK (finish IN ('metal', 'composite')),
  ADD COLUMN IF NOT EXISTS min_width_mm   INT            NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_height_mm  INT            NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS base_price_manual_gbp  NUMERIC(10,2)  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS base_price_auto_gbp    NUMERIC(10,2);

-- ------------------------------------------
-- 3. SEED gates — moved to 20260430000002_gates_seed.sql
-- (ALTER TYPE ADD VALUE cannot be used in same transaction as INSERT)
-- ------------------------------------------

-- ------------------------------------------
-- 4. CREATE gate_options TABLE
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

CREATE POLICY "gate_options_anon_select"
  ON public.gate_options FOR SELECT
  TO anon
  USING (true);

CREATE TRIGGER set_gate_options_updated_at
  BEFORE UPDATE ON public.gate_options
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------
-- 5. SEED gate_options
-- ------------------------------------------
-- TBD fields marked with NULL and noted.

INSERT INTO public.gate_options (slug, name, flat_price_gbp, per_unit_price_gbp, unit_type, notes) VALUES

  ('middle-bar',
   'Middle Bar (horizontal divider)',
   275.00, NULL, NULL,
   'Separates gate lengthwise into 2 sections. Flat price.'),

  ('railheads-top',
   'Railheads (top only)',
   0.00, NULL, 'per_railhead',
   'TBD: per-unit price between £1.25–£25 depending on type. Awaiting Marius confirmation.'),

  ('dog-bars',
   'Dog Bars (double bottom bars)',
   75.00, 4.50, 'per_extra_bar',
   'Base £75. Each additional bar as width increases: +£4.50.'),

  ('railheads-dog-bars',
   'Railheads on Dog Bars (mid-level)',
   0.00, NULL, 'per_railhead',
   'Same pricing as railheads-top. TBD awaiting Marius confirmation.'),

  ('arch-bow-top',
   'Arch / Bow Top (curved top)',
   850.00, NULL, NULL,
   'Replaces straight top rail with curved arch. Per gate, flat price.'),

  ('circles',
   'Circles Between Vertical Bars',
   275.00, 2.50, 'per_circle',
   '£275 covers required extra horizontal bar. Then £2.50 per circle; qty depends on gate width.'),

  ('bushes',
   'Bushes on Vertical Bars',
   90.00, NULL, 'per_bush',
   'Base £90. Per-bush price TBD — awaiting Marius confirmation.'),

  ('spirals',
   'Spirals on Vertical Bars',
   0.00, 3.80, 'per_spiral',
   'Minimum £3.80 per spiral. No flat base price.');

-- ------------------------------------------
-- 6. CREATE fencing_panels TABLE
-- ------------------------------------------
-- Pricing TBD — table ready for when Marius provides panel prices.

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

CREATE POLICY "fencing_panels_anon_select"
  ON public.fencing_panels FOR SELECT
  TO anon
  USING (true);

CREATE TRIGGER set_fencing_panels_updated_at
  BEFORE UPDATE ON public.fencing_panels
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
