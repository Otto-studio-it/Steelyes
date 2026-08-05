-- Transactional email audit trail. The application writes one row per send
-- attempt and Resend webhooks update the provider delivery state.
create table if not exists public.email_deliveries (
  id uuid primary key default gen_random_uuid(),
  resend_email_id text unique,
  kind text not null,
  recipient text not null,
  subject text not null,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'delivered', 'delayed', 'bounced', 'complained', 'failed', 'suppressed')),
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  last_event_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists email_deliveries_created_at_idx
  on public.email_deliveries (created_at desc);
create index if not exists email_deliveries_status_idx
  on public.email_deliveries (status, created_at desc);

alter table public.email_deliveries enable row level security;
revoke all on table public.email_deliveries from anon, authenticated;
grant select, insert, update, delete on public.email_deliveries to service_role;

create trigger set_email_deliveries_updated_at
  before update on public.email_deliveries
  for each row execute function public.handle_updated_at();

notify pgrst, 'reload schema';
