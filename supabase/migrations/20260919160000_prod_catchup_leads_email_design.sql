-- Idempotent catch-up for production (reqgfvahdcbmbajjqtve).
-- Live REST returned 404/PGRST205 for leads, email_deliveries, design_captures.

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  project_type text,
  postcode text,
  message text,
  phone text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS project_type text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS postcode text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS message text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS status text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS created_at timestamptz;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'leads' AND policyname = 'leads_service_role_only'
  ) THEN
    CREATE POLICY "leads_service_role_only"
      ON public.leads
      FOR ALL
      USING (false);
  END IF;
END $$;

ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS phone text;

CREATE TABLE IF NOT EXISTS public.design_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  configuration_id uuid REFERENCES public.configurations (id) ON DELETE CASCADE,
  share_token text NOT NULL,
  reminder_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS design_captures_reminder_idx
  ON public.design_captures (created_at)
  WHERE reminder_sent_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS design_captures_email_configuration_key
  ON public.design_captures (email, configuration_id);

ALTER TABLE public.design_captures ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.email_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resend_email_id text UNIQUE,
  kind text NOT NULL,
  recipient text NOT NULL,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'delivered', 'delayed', 'bounced', 'complained', 'failed', 'suppressed')),
  error_message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_event_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_deliveries_created_at_idx
  ON public.email_deliveries (created_at DESC);

CREATE INDEX IF NOT EXISTS email_deliveries_status_idx
  ON public.email_deliveries (status, created_at DESC);

ALTER TABLE public.email_deliveries ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS set_email_deliveries_updated_at ON public.email_deliveries;
CREATE TRIGGER set_email_deliveries_updated_at
  BEFORE UPDATE ON public.email_deliveries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

REVOKE ALL ON TABLE public.leads FROM anon, authenticated;
REVOKE ALL ON TABLE public.design_captures FROM anon, authenticated;
REVOKE ALL ON TABLE public.email_deliveries FROM anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.design_captures TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_deliveries TO service_role;

NOTIFY pgrst, 'reload schema';
