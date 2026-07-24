-- Intake data safety: append-only answer history + session activity events.
-- History is written by a trigger on client_intake_answers so no code path
-- (server action, manual SQL, future bug) can lose a previous value.
-- Same service-role-only posture as the intake tables.

-- ── Answer history (append-only) ─────────────────────────────────────────────

create table if not exists public.client_intake_answer_history (
  id uuid primary key default gen_random_uuid(),
  answer_id uuid not null,
  session_id uuid not null references public.client_intake_sessions (id) on delete cascade,
  question_id text not null,
  section text not null,
  value_json jsonb,
  status text not null,
  source text not null,
  -- 'insert' captures the first value, 'update' captures the value being replaced
  change_kind text not null check (change_kind in ('insert', 'update')),
  changed_at timestamptz not null default now()
);

comment on table public.client_intake_answer_history is
  'Append-only snapshots of client_intake_answers, written by trigger. Never updated or deleted by app code.';

create index if not exists client_intake_answer_history_session_idx
  on public.client_intake_answer_history (session_id, changed_at desc);

create index if not exists client_intake_answer_history_question_idx
  on public.client_intake_answer_history (session_id, question_id, changed_at desc);

create or replace function public.client_intake_answers_track_history()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.client_intake_answer_history
      (answer_id, session_id, question_id, section, value_json, status, source, change_kind)
    values
      (new.id, new.session_id, new.question_id, new.section, new.value_json, new.status, new.source, 'insert');
    return new;
  end if;

  -- UPDATE: only snapshot when something meaningful changed
  if new.value_json is distinct from old.value_json
     or new.status is distinct from old.status
     or new.source is distinct from old.source then
    insert into public.client_intake_answer_history
      (answer_id, session_id, question_id, section, value_json, status, source, change_kind)
    values
      (old.id, old.session_id, old.question_id, old.section, old.value_json, old.status, old.source, 'update');
  end if;
  return new;
end;
$$;

drop trigger if exists client_intake_answers_history_trg on public.client_intake_answers;
create trigger client_intake_answers_history_trg
  before insert or update on public.client_intake_answers
  for each row execute function public.client_intake_answers_track_history();

-- ── Session activity events ──────────────────────────────────────────────────

create table if not exists public.client_intake_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.client_intake_sessions (id) on delete cascade,
  event_type text not null check (event_type in (
    'session_created',
    'intake_opened',
    'answer_saved',
    'session_submitted',
    'session_locked',
    'session_unlocked',
    'pdf_exported'
  )),
  actor text not null check (actor in ('client', 'admin', 'system')),
  question_id text,
  meta jsonb,
  created_at timestamptz not null default now()
);

comment on table public.client_intake_events is
  'Activity log for intake sessions (who did what, when). Append-only.';

create index if not exists client_intake_events_session_idx
  on public.client_intake_events (session_id, created_at desc);

-- ── Grants: service-role only, mirroring intake tables ──────────────────────

alter table public.client_intake_answer_history enable row level security;
alter table public.client_intake_events enable row level security;

revoke all on table public.client_intake_answer_history from anon, authenticated;
revoke all on table public.client_intake_events from anon, authenticated;

-- History is trigger-written; the app only ever reads it.
grant select on table public.client_intake_answer_history to service_role;
grant select, insert on table public.client_intake_events to service_role;
