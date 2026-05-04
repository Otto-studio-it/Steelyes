-- ==========================================
-- MIGRATION: CATCH-UP COMPLETO
-- ==========================================
-- Applica tutto ciò che le migrations 000000-000003 avrebbero dovuto fare
-- ma non hanno fatto sul DB reale. Tutto idempotente con IF NOT EXISTS.

-- ------------------------------------------
-- 1. ENUM: aggiungi valori mancanti
-- ------------------------------------------
ALTER TYPE public.gate_style ADD VALUE IF NOT EXISTS 'victorian';
ALTER TYPE public.gate_type  ADD VALUE IF NOT EXISTS 'single-swing';
ALTER TYPE public.gate_type  ADD VALUE IF NOT EXISTS 'bifolding-single';
