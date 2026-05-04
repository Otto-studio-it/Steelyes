-- ==========================================
-- MIGRATION 005: AUTO POSTGREST SCHEMA RELOAD
-- ==========================================
-- Adds a DDL event trigger so PostgREST schema cache reloads
-- automatically after every migration, without manual intervention.

CREATE OR REPLACE FUNCTION public.pgrst_watch() RETURNS event_trigger
  LANGUAGE plpgsql
  AS $$
BEGIN
  NOTIFY pgrst, 'reload schema';
END;
$$;

CREATE EVENT TRIGGER pgrst_watch ON ddl_command_end
  EXECUTE PROCEDURE public.pgrst_watch();
