-- Contact form leads
CREATE TABLE IF NOT EXISTS leads (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  email      text        NOT NULL,
  project_type text,
  postcode   text,
  message    text,
  status     text        NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Only service role can read/write; anon gets nothing
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_service_role_only"
  ON leads
  FOR ALL
  USING (false);
