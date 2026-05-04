-- RLS policies for all public tables.
-- Service role key bypasses RLS entirely (used in getServiceRoleClient).

DO $$
BEGIN
  -- gates: public catalogue, read-only for anon
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'gates' AND policyname = 'gates_anon_select'
  ) THEN
    CREATE POLICY "gates_anon_select"
      ON public.gates FOR SELECT
      TO anon
      USING (true);
  END IF;

  -- service_zones: public read (postcode zone check widget)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'service_zones' AND policyname = 'service_zones_anon_select'
  ) THEN
    CREATE POLICY "service_zones_anon_select"
      ON public.service_zones FOR SELECT
      TO anon
      USING (true);
  END IF;

  -- configurations: anon can insert (save quote config), read own row via session id stored client-side
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'configurations' AND policyname = 'configurations_anon_insert'
  ) THEN
    CREATE POLICY "configurations_anon_insert"
      ON public.configurations FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;

  -- quote_requests: anon can insert (submit form), cannot read
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'quote_requests' AND policyname = 'quote_requests_anon_insert'
  ) THEN
    CREATE POLICY "quote_requests_anon_insert"
      ON public.quote_requests FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;

-- admin_audit: no anon access — service role only
-- (no policy needed — RLS enabled + no policy = blocked for anon)
