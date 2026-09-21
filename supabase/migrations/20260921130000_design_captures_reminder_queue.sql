-- Migration: design_captures_reminder_queue
--
-- The abandoned-design reminder job picked the 25 oldest unsent captures and only marked a row on
-- success, so 25 permanently failing addresses (bounces, typos — the address is never verified)
-- blocked every later capture for 14 days. It also had no way to opt out.
--
--   reminder_attempts — failed sends are counted; the job stops retrying after a few attempts.
--   unsubscribed_at   — set by the one-click unsubscribe link in the reminder email.

ALTER TABLE public.design_captures
  ADD COLUMN IF NOT EXISTS reminder_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unsubscribed_at timestamptz;

DROP INDEX IF EXISTS public.design_captures_reminder_idx;
CREATE INDEX IF NOT EXISTS design_captures_reminder_idx
  ON public.design_captures (reminder_attempts, created_at)
  WHERE reminder_sent_at IS NULL AND unsubscribed_at IS NULL;

CREATE INDEX IF NOT EXISTS design_captures_unsubscribed_email_idx
  ON public.design_captures (email)
  WHERE unsubscribed_at IS NOT NULL;

NOTIFY pgrst, 'reload schema';
