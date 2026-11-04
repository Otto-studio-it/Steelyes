-- Migration: revoke_anon_crypto_functions_idempotent
-- Revoke EXECUTE on pgcrypto and uuid-ossp extension functions from anon and PUBLIC roles.
-- 
-- Issue: Migration 20261103180100 targeted schema 'extensions', but on this production DB
-- pgcrypto and uuid-ossp functions live in schema 'public'. This migration is idempotent
-- and discovers functions by their extension association, then revokes from anon and PUBLIC.
--
-- Safety: Keep gen_random_uuid() accessible if needed by table defaults under anon role
-- (e.g. quote_requests, configurations inserts by anonymous users). gen_random_uuid is
-- core in PG13+ so it exists in pg_catalog and doesn't need the extension version.
-- We only revoke pgcrypto encryption/hashing functions (digest, hmac, pgp_*, armor, etc.)
-- and uuid-ossp functions (uuid_generate_*) that are never called by anon inserts.

DO $$
DECLARE
  func_rec RECORD;
  func_signature text;
BEGIN
  -- Iterate over all functions belonging to pgcrypto extension, regardless of schema
  FOR func_rec IN
    SELECT 
      p.oid::regprocedure::text AS func_sig,
      n.nspname AS schema_name,
      p.proname AS func_name
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    JOIN pg_depend d ON d.objid = p.oid
    JOIN pg_extension e ON d.refobjid = e.oid
    WHERE e.extname = 'pgcrypto'
      AND d.deptype = 'e'  -- extension dependency
      AND p.proname IN (
        'digest', 'hmac', 'gen_random_bytes',
        'pgp_sym_encrypt', 'pgp_sym_decrypt',
        'pgp_pub_encrypt', 'pgp_pub_decrypt', 'pgp_pub_encrypt_bytea', 'pgp_pub_decrypt_bytea',
        'pgp_key_id', 'armor', 'dearmor',
        'crypt', 'gen_salt'
      )
  LOOP
    BEGIN
      -- Revoke from PUBLIC (includes anon) if not already revoked
      EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', func_rec.func_sig);
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', func_rec.func_sig);
      RAISE NOTICE 'Revoked EXECUTE on % from PUBLIC/anon/authenticated', func_rec.func_sig;
    EXCEPTION WHEN OTHERS THEN
      -- Already revoked or other error, continue
      RAISE NOTICE 'Could not revoke % from PUBLIC: %', func_rec.func_sig, SQLERRM;
    END;
  END LOOP;

  -- Iterate over all functions belonging to uuid-ossp extension, regardless of schema
  FOR func_rec IN
    SELECT 
      p.oid::regprocedure::text AS func_sig,
      n.nspname AS schema_name,
      p.proname AS func_name
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    JOIN pg_depend d ON d.objid = p.oid
    JOIN pg_extension e ON d.refobjid = e.oid
    WHERE e.extname = 'uuid-ossp'
      AND d.deptype = 'e'
      AND p.proname LIKE 'uuid_%'
  LOOP
    BEGIN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', func_rec.func_sig);
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', func_rec.func_sig);
      RAISE NOTICE 'Revoked EXECUTE on % from PUBLIC/anon/authenticated', func_rec.func_sig;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not revoke % from PUBLIC: %', func_rec.func_sig, SQLERRM;
    END;
  END LOOP;

  -- Note: gen_random_uuid() from pg_catalog (core PG 13+) is untouched. Column defaults run
  -- with the caller's privileges, so this is safe only because no default or function uses
  -- the revoked functions (checked on prod 2026-11-04).
END $$;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- ROLLBACK SQL (to restore PUBLIC execute grants if needed):
-- re-run the two loops above with: GRANT EXECUTE ON FUNCTION <sig> TO PUBLIC;
-- (do NOT grant ALL FUNCTIONS IN SCHEMA public, that would also open app functions)
-- NOTIFY pgrst, 'reload schema';
