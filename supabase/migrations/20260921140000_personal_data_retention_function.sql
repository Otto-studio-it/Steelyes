-- Migration: personal_data_retention_function
--
-- docs/STACK_RULES.md promises that quote requests are purged at 24 months, but nothing ever
-- implemented it, and leads / design captures / email logs / inbound emails had no retention
-- at all (UK GDPR storage limitation).
--
-- This migration ONLY DEFINES the function. It deletes nothing and schedules nothing.
-- Deleting customer records is an owner decision — review the retention period, take a backup,
-- dry-run it, then schedule it, e.g. with pg_cron:
--
--   select * from public.purge_expired_personal_data('24 months', true);   -- dry run: counts only
--   select cron.schedule('purge-personal-data', '15 3 * * 0',
--     $$select public.purge_expired_personal_data('24 months', false)$$);
--
-- Saved configurations (no personal data) are kept so old share links keep working; only their
-- link to a deleted quote request / capture goes away.

CREATE OR REPLACE FUNCTION public.purge_expired_personal_data(
  retention interval DEFAULT interval '24 months',
  dry_run boolean DEFAULT true
)
RETURNS TABLE (table_name text, expired_rows bigint)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  cutoff timestamptz := now() - retention;
  target record;
  found bigint;
BEGIN
  IF retention < interval '6 months' THEN
    RAISE EXCEPTION 'Refusing a retention period under 6 months (got %)', retention;
  END IF;

  -- Not every environment has every table (production has no inbound_emails yet) — skip missing ones.
  FOR target IN
    SELECT * FROM (VALUES
      ('quote_requests', 'created_at'),
      ('leads', 'created_at'),
      ('design_captures', 'created_at'),
      ('email_deliveries', 'created_at'),
      ('inbound_emails', 'received_at')
    ) AS t(name, stamp)
    WHERE to_regclass('public.' || t.name) IS NOT NULL
  LOOP
    EXECUTE format('SELECT count(*) FROM public.%I WHERE %I < $1', target.name, target.stamp)
      INTO found USING cutoff;
    table_name := target.name;
    expired_rows := found;
    RETURN NEXT;

    IF NOT dry_run THEN
      EXECUTE format('DELETE FROM public.%I WHERE %I < $1', target.name, target.stamp) USING cutoff;
    END IF;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.purge_expired_personal_data(interval, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_expired_personal_data(interval, boolean) TO service_role;
