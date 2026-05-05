-- Alcuni progetti hanno ricevuto lo schema prezzi senza la colonna name (migration parziali).
ALTER TABLE public.gates
  ADD COLUMN IF NOT EXISTS name VARCHAR(200) NOT NULL DEFAULT '';

SELECT pg_notify('pgrst', 'reload schema');
