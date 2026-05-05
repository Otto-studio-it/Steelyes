-- ==========================================
-- MIGRATION 003: GATES SEED DATA
-- ==========================================
-- Separate migration from enum ADD VALUE (PostgreSQL constraint).
-- Prices from Marius — Victorian style, all 8 types × metal/composite.

ALTER TABLE public.gates
  ADD COLUMN IF NOT EXISTS name VARCHAR(200) NOT NULL DEFAULT '';

INSERT INTO public.gates (name, type, style, finish, min_width_mm, min_height_mm, base_price_manual_gbp, base_price_auto_gbp) VALUES

  ('Victorian Double Swing (Metal)',      'double-swing',    'victorian', 'metal',     1800, 900,  1800.00, 3800.00),
  ('Victorian Double Swing (Composite)',  'double-swing',    'victorian', 'composite', 1800, 900,  1800.00, 3800.00),

  ('Victorian Single Swing (Metal)',      'single-swing',    'victorian', 'metal',      800, 900,   850.00, 2700.00),
  ('Victorian Single Swing (Composite)',  'single-swing',    'victorian', 'composite',  800, 900,   750.00, 2700.00),

  ('Victorian Sliding Trucked (Metal)',   'sliding',         'victorian', 'metal',     2500, 900,  2200.00, 3600.00),
  ('Victorian Sliding Trucked (Composite)','sliding',        'victorian', 'composite', 2500, 900,  2200.00, 3600.00),

  ('Victorian Cantilevered (Metal)',      'cantilevered',    'victorian', 'metal',     2500, 900,  2900.00, 4200.00),
  ('Victorian Cantilevered (Composite)',  'cantilevered',    'victorian', 'composite', 2500, 900,  2900.00, 4200.00),

  ('Victorian Bifolding Double (Metal)',  'bifolding',       'victorian', 'metal',     2900, 900,  2500.00, 4200.00),
  ('Victorian Bifolding Double (Composite)','bifolding',     'victorian', 'composite', 2900, 900,  2500.00, 4200.00),

  ('Victorian Bifolding Single (Metal)',  'bifolding-single','victorian', 'metal',     1500, 900,  1900.00, 3000.00),
  ('Victorian Bifolding Single (Composite)','bifolding-single','victorian','composite',1500, 900,  1900.00, 3000.00),

  ('Victorian Telescopic (Metal)',        'telescopic',      'victorian', 'metal',     2000, 900,  3100.00, 4200.00),
  ('Victorian Telescopic (Composite)',    'telescopic',      'victorian', 'composite', 2000, 900,  3100.00, 4200.00),

  ('Victorian Radius Sliding (Metal)',    'sliding-radius',  'victorian', 'metal',     1600, 900,  2500.00, 4200.00),
  ('Victorian Radius Sliding (Composite)','sliding-radius',  'victorian', 'composite', 1600, 900,  2500.00, 4200.00);
