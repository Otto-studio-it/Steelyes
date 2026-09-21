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
BEGIN
  IF retention < interval '6 months' THEN
    RAISE EXCEPTION 'Refusing a retention period under 6 months (got %)', retention;
  END IF;

  RETURN QUERY
    SELECT 'quote_requests'::text, count(*) FROM public.quote_requests WHERE created_at < cutoff
    UNION ALL SELECT 'leads', count(*) FROM public.leads WHERE created_at < cutoff
    UNION ALL SELECT 'design_captures', count(*) FROM public.design_captures WHERE created_at < cutoff
    UNION ALL SELECT 'email_deliveries', count(*) FROM public.email_deliveries WHERE created_at < cutoff
    UNION ALL SELECT 'inbound_emails', count(*) FROM public.inbound_emails WHERE received_at < cutoff;

  IF dry_run THEN
    RETURN;
  END IF;

  DELETE FROM public.quote_requests WHERE created_at < cutoff;
  DELETE FROM public.leads WHERE created_at < cutoff;
  DELETE FROM public.design_captures WHERE created_at < cutoff;
  DELETE FROM public.email_deliveries WHERE created_at < cutoff;
  DELETE FROM public.inbound_emails WHERE received_at < cutoff;
END;
$$;

REVOKE ALL ON FUNCTION public.purge_expired_personal_data(interval, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_expired_personal_data(interval, boolean) TO service_role;
