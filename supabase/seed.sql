-- ==========================================
-- DATABASE SEED (Dati Test Completi Phase 0)
-- ==========================================
-- 6 gate types × 3 stili = 18 gates
-- UK service zones (20 postcode prefixes)
-- Conforme a ARCHITECTURE_RULES.md + DESIGN_RULES.md

-- ------------------------------------------
-- SERVICE ZONES (UK Installation Coverage)
-- ------------------------------------------
INSERT INTO public.service_zones (id, postcode_prefix, surcharge, created_at, updated_at)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'SW', 0, NOW(), NOW()),      -- London SW
  ('22222222-2222-2222-2222-222222222202', 'W1', 0, NOW(), NOW()),      -- London W1
  ('22222222-2222-2222-2222-222222222203', 'E1', 0, NOW(), NOW()),      -- London E1
  ('22222222-2222-2222-2222-222222222204', 'N1', 0, NOW(), NOW()),      -- London N1
  ('22222222-2222-2222-2222-222222222205', 'SE', 0, NOW(), NOW()),      -- London SE
  ('22222222-2222-2222-2222-222222222206', 'M1', 5, NOW(), NOW()),      -- Manchester
  ('22222222-2222-2222-2222-222222222207', 'B1', 5, NOW(), NOW()),      -- Birmingham
  ('22222222-2222-2222-2222-222222222208', 'LS', 8, NOW(), NOW()),      -- Leeds
  ('22222222-2222-2222-2222-222222222209', 'G1', 12, NOW(), NOW()),     -- Glasgow
  ('22222222-2222-2222-2222-222222222210', 'BT', 15, NOW(), NOW()),     -- Belfast
  ('22222222-2222-2222-2222-222222222211', 'EH', 10, NOW(), NOW()),     -- Edinburgh
  ('22222222-2222-2222-2222-222222222212', 'CF', 8, NOW(), NOW()),      -- Cardiff
  ('22222222-2222-2222-2222-222222222213', 'OX', 3, NOW(), NOW()),      -- Oxford
  ('22222222-2222-2222-2222-222222222214', 'CB', 3, NOW(), NOW()),      -- Cambridge
  ('22222222-2222-2222-2222-222222222215', 'RG', 5, NOW(), NOW()),      -- Reading
  ('22222222-2222-2222-2222-222222222216', 'BR', 2, NOW(), NOW()),      -- Bromley
  ('22222222-2222-2222-2222-222222222217', 'CR', 2, NOW(), NOW()),      -- Croydon
  ('22222222-2222-2222-2222-222222222218', 'SM', 2, NOW(), NOW()),      -- Sutton
  ('22222222-2222-2222-2222-222222222219', 'TW', 3, NOW(), NOW()),      -- Twickenham
  ('22222222-2222-2222-2222-222222222220', 'KT', 3, NOW(), NOW())       -- Kingston
ON CONFLICT (postcode_prefix) DO NOTHING;

-- ------------------------------------------
-- GATES (6 Types × 3 Styles = 18 Records)
-- ------------------------------------------

-- 1. DOUBLE-SWING (3 styles)
INSERT INTO public.gates (id, type, style, base_price_per_m2, tube_multipliers, finish_multipliers, motor_surcharge, created_at, updated_at)
VALUES
  -- Modern double-swing
  ('33333333-3333-3333-3333-333333333301', 'double-swing', 'modern', 250.00,
   '{"50mm": 1.0, "75mm": 1.15, "100mm": 1.3}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   500.00, NOW(), NOW()),
  -- Classic double-swing
  ('33333333-3333-3333-3333-333333333302', 'double-swing', 'classic', 280.00,
   '{"50mm": 1.0, "75mm": 1.15, "100mm": 1.3}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   550.00, NOW(), NOW()),
  -- Privacy double-swing
  ('33333333-3333-3333-3333-333333333303', 'double-swing', 'privacy', 290.00,
   '{"50mm": 1.0, "75mm": 1.15, "100mm": 1.3}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   600.00, NOW(), NOW()),

-- 2. SLIDING (3 styles)
  ('33333333-3333-3333-3333-333333333304', 'sliding', 'modern', 220.00,
   '{"50mm": 1.0, "75mm": 1.12, "100mm": 1.25}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   450.00, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333305', 'sliding', 'classic', 240.00,
   '{"50mm": 1.0, "75mm": 1.12, "100mm": 1.25}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   500.00, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333306', 'sliding', 'privacy', 260.00,
   '{"50mm": 1.0, "75mm": 1.12, "100mm": 1.25}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   550.00, NOW(), NOW()),

-- 3. BIFOLDING (3 styles)
  ('33333333-3333-3333-3333-333333333307', 'bifolding', 'modern', 310.00,
   '{"50mm": 1.0, "75mm": 1.18, "100mm": 1.35}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   650.00, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333308', 'bifolding', 'classic', 340.00,
   '{"50mm": 1.0, "75mm": 1.18, "100mm": 1.35}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   700.00, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333309', 'bifolding', 'privacy', 360.00,
   '{"50mm": 1.0, "75mm": 1.18, "100mm": 1.35}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   750.00, NOW(), NOW()),

-- 4. CANTILEVERED (3 styles)
  ('33333333-3333-3333-3333-333333333310', 'cantilevered', 'modern', 290.00,
   '{"50mm": 1.0, "75mm": 1.16, "100mm": 1.32}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   580.00, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333311', 'cantilevered', 'classic', 320.00,
   '{"50mm": 1.0, "75mm": 1.16, "100mm": 1.32}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   630.00, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333312', 'cantilevered', 'privacy', 350.00,
   '{"50mm": 1.0, "75mm": 1.16, "100mm": 1.32}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   680.00, NOW(), NOW()),

-- 5. SLIDING-RADIUS (3 styles)
  ('33333333-3333-3333-3333-333333333313', 'sliding-radius', 'modern', 270.00,
   '{"50mm": 1.0, "75mm": 1.14, "100mm": 1.28}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   520.00, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333314', 'sliding-radius', 'classic', 300.00,
   '{"50mm": 1.0, "75mm": 1.14, "100mm": 1.28}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   570.00, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333315', 'sliding-radius', 'privacy', 330.00,
   '{"50mm": 1.0, "75mm": 1.14, "100mm": 1.28}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   620.00, NOW(), NOW()),

-- 6. TELESCOPIC (3 styles)
  ('33333333-3333-3333-3333-333333333316', 'telescopic', 'modern', 280.00,
   '{"50mm": 1.0, "75mm": 1.13, "100mm": 1.27}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   540.00, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333317', 'telescopic', 'classic', 310.00,
   '{"50mm": 1.0, "75mm": 1.13, "100mm": 1.27}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   590.00, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333318', 'telescopic', 'privacy', 340.00,
   '{"50mm": 1.0, "75mm": 1.13, "100mm": 1.27}'::jsonb,
   '{"powder-black": 1.0, "powder-grey": 1.05, "stainless": 1.3, "galvanised": 0.95}'::jsonb,
   640.00, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
