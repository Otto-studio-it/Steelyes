-- ==========================================
-- MIGRATION 001_INIT (PART A: FOUNDATIONS)
-- ==========================================
-- Questo file inizializza il vocabolario del database (Enums) e i trigger di base.
-- Segue rigorosamente le specifiche di ARCHITECTURE_RULES.md

-- ------------------------------------------
-- 1. ENUMS (Tipi Custom)
-- ------------------------------------------

-- Tipo: Stato della Richiesta Preventivo (Lead Funnel)
-- Motivazione: Stati per la Kanban board admin. 
-- Regola: Placeholder basato su best practices approvato da Ruben/Marius per la v1.
CREATE TYPE public.quote_status AS ENUM (
  'new', 
  'contacted', 
  'quote_sent', 
  'won', 
  'lost'
);

-- Tipo: Tipologia Costruttiva del Cancello
-- Motivazione: I 6 tipi fisici di cancello, mappati 1:1 con i mesh builders di gate-engine.
-- Regola: Lista bloccata da ARCHITECTURE_RULES.md, nessuna deviazione ammessa.
CREATE TYPE public.gate_type AS ENUM (
  'double-swing', 
  'sliding', 
  'bifolding', 
  'cantilevered', 
  'sliding-radius', 
  'telescopic'
);

-- Tipo: Stile Estetico del Cancello
-- Motivazione: Categorie per il catalogo e per il routing di frontend (/gates/style/...).
-- Regola: Solo 3 stili previsti per la Phase 1/2, facili e robusti.
CREATE TYPE public.gate_style AS ENUM (
  'modern', 
  'classic', 
  'privacy'
);

-- ------------------------------------------
-- 2. FUNZIONI DI UTILITÀ
-- ------------------------------------------

-- Funzione: handle_updated_at()
-- Motivazione: Trigger PostgreSQL per automatizzare il timestamp di aggiornamento.
-- Regola: Garantisce l'integrità del dato "updated_at" a livello DB, senza fidarsi del client.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- MIGRATION 001_INIT (PART B: CORE TABLES)
-- ==========================================
-- Creazione delle 5 tabelle core con UUID e foreign keys corrette.

-- ------------------------------------------
-- Tabella 1: gates
-- Motivazione: Catalogo base e prezziari. Indipendente.
-- ------------------------------------------
CREATE TABLE public.gates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.gate_type NOT NULL,
  style public.gate_style NOT NULL,
  base_price_per_m2 NUMERIC(10, 2) NOT NULL,
  tube_multipliers JSONB NOT NULL DEFAULT '{}'::jsonb,
  finish_multipliers JSONB NOT NULL DEFAULT '{}'::jsonb,
  motor_surcharge NUMERIC(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------
-- Tabella 2: service_zones
-- Motivazione: Zone di installazione. Indipendente.
-- ------------------------------------------
CREATE TABLE public.service_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postcode_prefix VARCHAR(10) UNIQUE NOT NULL,
  surcharge NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------
-- Tabella 3: configurations
-- Motivazione: Salvataggi configurazioni utenti 3D. 
-- Regola: Indipendente da utente loggato (anonimo). JSONB permette flessibilità per i parametri 3D.
-- ------------------------------------------
CREATE TABLE public.configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_token VARCHAR(50) UNIQUE NOT NULL,
  gate_type public.gate_type NOT NULL,
  parameters JSONB NOT NULL,
  ar_model_key VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------
-- Tabella 4: quote_requests
-- Motivazione: Lead funnel. Relazionata a 'configurations'.
-- Regola: first_name e last_name separati come concordato.
-- ------------------------------------------
CREATE TABLE public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  postcode VARCHAR(20) NOT NULL,
  configuration_id UUID REFERENCES public.configurations(id) ON DELETE SET NULL,
  status public.quote_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  turnstile_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------
-- Tabella 5: admin_audit
-- Motivazione: Log delle azioni admin (audit trail). Semplice append-only, niente trigger update.
-- ------------------------------------------
CREATE TABLE public.admin_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email VARCHAR(255) NOT NULL,
  action VARCHAR(255) NOT NULL,
  entity VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------
-- 3. APPLICAZIONE TRIGGER 'updated_at'
-- Motivazione: Attacchiamo la funzione di utility creata in Part A alle 4 tabelle mutabili.
-- ------------------------------------------
CREATE TRIGGER set_gates_updated_at BEFORE UPDATE ON public.gates FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_service_zones_updated_at BEFORE UPDATE ON public.service_zones FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_configurations_updated_at BEFORE UPDATE ON public.configurations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_quote_requests_updated_at BEFORE UPDATE ON public.quote_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================
-- MIGRATION 001_INIT (PART C: SECURITY)
-- ==========================================
-- Abilitazione della Row Level Security (RLS) su tutte le tabelle.
-- Come da architettura, senza policy esplicite questo blocca ogni accesso pubblico.
-- Solo l'Admin (Service Role) può aggirare la RLS.

ALTER TABLE public.gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit ENABLE ROW LEVEL SECURITY;
