-- Client product-data intake: Marius answers open questions from a token link.
-- Service-role only (same pattern as quote_requests / design_captures).

create table if not exists public.client_intake_sessions (
  id uuid primary key default gen_random_uuid(),
  access_token text not null unique,
  client_name text not null default 'Marius',
  status text not null default 'in_progress'
    check (status in ('in_progress', 'submitted', 'locked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_client_activity_at timestamptz,
  last_notified_at timestamptz
);

comment on table public.client_intake_sessions is
  'Token-gated intake sessions for client product-data confirmation. Service-role only.';

create table if not exists public.client_intake_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.client_intake_sessions (id) on delete cascade,
  question_id text not null,
  section text not null,
  value_json jsonb,
  status text not null default 'missing'
    check (status in ('proposed', 'confirmed', 'provisional', 'missing')),
  source text not null default 'seed'
    check (source in ('seed', 'client', 'admin')),
  updated_at timestamptz not null default now(),
  unique (session_id, question_id)
);

comment on table public.client_intake_answers is
  'Per-question answers for a client intake session. Autosaved from intake UI or admin.';

create index if not exists client_intake_answers_session_idx
  on public.client_intake_answers (session_id);

create index if not exists client_intake_answers_section_idx
  on public.client_intake_answers (session_id, section);

alter table public.client_intake_sessions enable row level security;
alter table public.client_intake_answers enable row level security;

revoke all on table public.client_intake_sessions from anon, authenticated;
revoke all on table public.client_intake_answers from anon, authenticated;

grant select, insert, update, delete on table public.client_intake_sessions to service_role;
grant select, insert, update, delete on table public.client_intake_answers to service_role;
