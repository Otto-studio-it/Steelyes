-- Migration: inbound_emails
-- P2 of the email UX roadmap: unify direct emails to info@steelyes.co.uk with
-- site-originated leads in one admin view. Rows are written by the
-- /api/inbox/ingest route, called from scripts/gmail-inbox-autoack.gs
-- (Google Apps Script bound to the Workspace mailbox) after it auto-acks and
-- triage-labels a thread in Gmail. No anon/authenticated access — service
-- role only, same posture as client_intake_sessions (20260724100000).

create table if not exists public.inbound_emails (
  id uuid primary key default gen_random_uuid(),
  gmail_thread_id text not null unique,
  from_email text not null,
  subject text not null default '',
  snippet text not null default '',
  category text not null default 'generico'
    check (category in ('preventivo', 'reclamo', 'fattura', 'garanzia', 'generico')),
  received_at timestamptz not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.inbound_emails is
  'Direct emails to info@steelyes.co.uk logged by the Gmail auto-ack Apps Script, for unified triage alongside quote_requests in /admin/inbox.';

create index if not exists inbound_emails_received_at_idx
  on public.inbound_emails (received_at desc);

alter table public.inbound_emails enable row level security;

revoke all on table public.inbound_emails from anon, authenticated;

grant select, insert, update, delete on table public.inbound_emails to service_role;

notify pgrst, 'reload schema';
