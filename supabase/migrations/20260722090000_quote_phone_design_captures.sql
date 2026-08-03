-- Quote flow completion: customer phone on quote_requests/leads,
-- plus design_captures for "email me my design" + abandoned-design reminders.

alter table public.quote_requests
  add column if not exists phone text;

alter table public.leads
  add column if not exists phone text;

create table if not exists public.design_captures (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  configuration_id uuid references public.configurations (id) on delete cascade,
  share_token text not null,
  reminder_sent_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.design_captures is
  'Email captures from the configurator "email me my design" flow. Service-role only; drives abandoned-design reminder emails.';

create index if not exists design_captures_reminder_idx
  on public.design_captures (created_at)
  where reminder_sent_at is null;

create unique index if not exists design_captures_email_configuration_key
  on public.design_captures (email, configuration_id);

-- Service-role only access, consistent with Phase 5 grant hardening.
alter table public.design_captures enable row level security;
revoke all on table public.design_captures from anon, authenticated;
