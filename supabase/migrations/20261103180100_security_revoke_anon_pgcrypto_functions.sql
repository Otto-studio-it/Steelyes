-- Migration: security_revoke_anon_pgcrypto_functions
-- Revoke EXECUTE on pgcrypto and uuid helper functions from anon role.
--
-- Issue: pgcrypto functions (digest, hmac, gen_random_uuid, etc.) are exposed
-- via PostgREST /rpc when anon has EXECUTE grants. While the app doesn't call
-- these via RPC, they're unnecessarily exposed. This migration revokes public
-- execute access to tighten the attack surface without breaking app usage
-- (server-side code uses service_role which bypasses grants).

-- Revoke EXECUTE on pgcrypto extension functions from public (which includes anon)
-- These are only needed server-side via service_role, never via PostgREST RPC.
DO $$
DECLARE
  func_name text;
  func_schema text := 'extensions';
BEGIN
  -- pgcrypto functions commonly exposed
  FOR func_name IN 
    SELECT proname 
    FROM pg_proc 
    WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'extensions')
      AND proname IN (
        'digest', 'hmac', 'gen_random_uuid', 'gen_random_bytes',
        'pgp_sym_encrypt', 'pgp_sym_decrypt', 
        'pgp_pub_encrypt', 'pgp_pub_decrypt',
        'armor', 'dearmor'
      )
  LOOP
    BEGIN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION extensions.%I FROM public', func_name);
    EXCEPTION WHEN OTHERS THEN
      -- Function might not exist or already revoked, continue
      NULL;
    END;
  END LOOP;
END $$;

-- Revoke EXECUTE on uuid-ossp functions (if enabled)
DO $$
DECLARE
  func_name text;
BEGIN
  FOR func_name IN 
    SELECT proname 
    FROM pg_proc 
    WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'extensions')
      AND proname LIKE 'uuid_%'
  LOOP
    BEGIN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION extensions.%I FROM public', func_name);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END LOOP;
END $$;

-- Note: gen_random_uuid() is actually in pg_catalog and used by default UUID columns.
-- We only revoke the extensions schema version if it exists. The pg_catalog version
-- is built-in and not exposed via PostgREST RPC.

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
