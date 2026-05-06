# Staging DB Baseline — 2026-05-04

**Progetto:** steelyes-staging (`hgeksaulzomkgqnfuriu`)
**Data audit:** 2026-05-04
**Agente:** Agent 1 — DB audit scope

---

## 1. Migration Status

**Stato: ALLINEATO ✅**

19 migration locali = 19 remote, tutte applicate in ordine.

| Version | Name |
|---|---|
| 20260423120000 | init |
| 20260430000000 | rls_policies |
| 20260430000001 | gates_pricing_schema |
| 20260430000002 | gates_seed |
| 20260430000003 | admin_auth |
| 20260501000000 | auto_schema_reload |
| 20260501000001 | notify_schema_reload |
| 20260501000002 | grants |
| 20260501000003 | catchup |
| 20260501000004 | catchup_tables |
| 20260502120000 | admin_rls_app_metadata |
| 20260502130000 | ensure_gates_name_column |
| 20260504150000 | cleanup_client_pricing_seed |
| 20260504160000 | fencing_delete_grant |
| 20260505154435 | fix_pricing_rls_closure |
| 20260505160000 | fix_pricing_rls_grants |
| 20260505161000 | quote_requests_service_role_grants |
| 20260506120000 | harden_phase5_grants |
| 20260506121000 | harden_public_non_dml_grants |

Nessun mismatch. Nessuna migration "applied" senza SQL locale.
Phase 5 hardening verification note: `supabase db push --linked --dry-run` returned `Remote database is up to date` on 2026-05-06 after applying `20260506120000_harden_phase5_grants.sql` and `20260506121000_harden_public_non_dml_grants.sql`. macOS `._*` AppleDouble files are ignored by Supabase CLI and are not real migrations.

---

## 2. Tabelle — Row Count e RLS

| Tabella | RLS | Rows | Note |
|---|---|---|---|
| `gates` | ✅ | 16 | Seeded da Marius |
| `gate_options` | ✅ | 8 | Seeded |
| `fencing_panels` | ✅ | 1 | ⚠️ Seed incompleto — TBD Marius |
| `service_zones` | ✅ | 20 | Seeded (columns: `postcode_prefix`, `surcharge`) |
| `configurations` | ✅ | 0 | Atteso vuoto su staging |
| `quote_requests` | ✅ | 0 | Atteso vuoto su staging |
| `admin_audit` | ✅ | 0 | Atteso vuoto |

---

## 3. Policy RLS per tabella

### `gates`
| Policy | Role | Cmd | Condition |
|---|---|---|---|
| `gates_anon_select` | anon | SELECT | `true` |
| `gates_admin_update` | authenticated | UPDATE | `app_metadata.is_admin = true` |
| `gates_admin_insert` | authenticated | INSERT | `app_metadata.is_admin = true` |
| `gates_admin_delete` | authenticated | DELETE | `app_metadata.is_admin = true` |

### `gate_options`
| Policy | Role | Cmd | Condition |
|---|---|---|---|
| `gate_options_anon_select` | anon | SELECT | `true` |
| `gate_options_admin_insert` | authenticated | INSERT | `app_metadata.is_admin = true` |
| `gate_options_admin_update` | authenticated | UPDATE | `app_metadata.is_admin = true` |
| `gate_options_admin_delete` | authenticated | DELETE | `app_metadata.is_admin = true` |

### `fencing_panels`
| Policy | Role | Cmd | Condition |
|---|---|---|---|
| `fencing_panels_anon_select` | anon | SELECT | `true` |
| `fencing_panels_admin_insert` | authenticated | INSERT | `app_metadata.is_admin = true` |
| `fencing_panels_admin_update` | authenticated | UPDATE | `app_metadata.is_admin = true` |
| `fencing_panels_admin_delete` | authenticated | DELETE | `app_metadata.is_admin = true` |

### `configurations`
| Policy | Role | Cmd | Condition |
|---|---|---|---|
| `configurations_anon_insert` | anon | INSERT | `true` |
| `configurations_anon_select` | anon | SELECT | `true` |

### `quote_requests`
| Policy | Role | Cmd | Condition |
|---|---|---|---|
| `quote_requests_anon_insert` | anon | INSERT | `true` |

### `service_zones`
| Policy | Role | Cmd | Condition |
|---|---|---|---|
| `service_zones_anon_select` | anon | SELECT | `true` |

### `admin_audit`
_Nessuna policy. RLS abilitato = blocco totale via PostgREST per tutti i ruoli tranne service_role (bypass)._

---

## 4. Grants (anon / authenticated / service_role)

| Tabella | anon | authenticated | service_role |
|---|---|---|---|
| `gates` | SELECT | SELECT, INSERT, UPDATE, DELETE | SELECT, INSERT, UPDATE, DELETE |
| `gate_options` | SELECT | SELECT, INSERT, UPDATE, DELETE | SELECT, INSERT, UPDATE, DELETE |
| `fencing_panels` | SELECT | SELECT, INSERT, UPDATE, DELETE | SELECT, INSERT, UPDATE, DELETE |
| `configurations` | SELECT, INSERT | SELECT, INSERT | SELECT, INSERT |
| `quote_requests` | INSERT | INSERT | INSERT, SELECT, UPDATE |
| `service_zones` | SELECT | SELECT | SELECT |
| `admin_audit` | — | — | SELECT, INSERT |

> **Nota:** tabella limitata ai grant DML rilevanti. `service_role` bypassa RLS ma è comunque vincolato ai grant di tabella. Phase 5 hardening del 2026-05-06 ha rimosso i grant non-DML (`TRIGGER`, `TRUNCATE`, `REFERENCES`) da `anon`/`authenticated` sulle tabelle app pubbliche dove non fanno parte del modello di accesso.

---

## 5. Audit Comportamento per Ruolo

### anon
| Operazione | Tabella | Esito | Note |
|---|---|---|---|
| SELECT | `gates` | ✅ OK | policy + grant |
| SELECT | `gate_options` | ✅ OK | policy + grant |
| SELECT | `fencing_panels` | ✅ OK | policy + grant |
| SELECT | `service_zones` | ✅ OK | policy + grant |
| SELECT | `configurations` | ✅ OK | policy + grant; share-link E2E app pending perché manca route pubblica |
| SELECT | `quote_requests` | ✅ BLOCCATO | corretto, nessuna policy SELECT |
| INSERT | `configurations` | ✅ OK | policy + grant |
| INSERT | `quote_requests` | ✅ OK | policy + grant |
| UPDATE/DELETE | qualsiasi | ✅ BLOCCATO | nessuna policy write per anon |

### authenticated non-admin
| Operazione | Tabella | Esito | Note |
|---|---|---|---|
| SELECT | `gates`, `gate_options`, `fencing_panels`, `service_zones` | ✅ OK | eredita policy anon SELECT |
| INSERT/UPDATE/DELETE admin | qualsiasi | ✅ BLOCCATO | policy richiedono `app_metadata.is_admin=true` |

### authenticated admin (`app_metadata.is_admin = true`)
| Operazione | Tabella | Esito | Note |
|---|---|---|---|
| UPDATE | `gates` | ✅ OK | |
| INSERT | `gates` | ✅ OK | policy + grant |
| DELETE | `gates` | ✅ OK | policy + grant |
| INSERT/UPDATE | `gate_options` | ✅ OK | |
| DELETE | `gate_options` | ✅ OK | policy + grant |
| INSERT/UPDATE/DELETE | `fencing_panels` | ✅ OK | |
| SELECT | `admin_audit` | ❌ BLOCCATO | nessuna policy, solo service_role legge |

### service_role
| Operazione | Esito | Note |
|---|---|---|
| Tutto su tutte le tabelle | ✅ OK | bypass RLS + grant completo su tabelle admin |
| `admin_audit` INSERT | ✅ OK | grant presente |
| `quote_requests` SELECT/UPDATE | ✅ OK | grants added via `20260505161000_quote_requests_service_role_grants.sql` |
| `quote_requests` DELETE | — | non richiesto e non aggiunto |

---

## 6. Problemi e rischi

### RISOLTI

**BUG-1: RESOLVED — `gates` admin INSERT e DELETE**
Risolto da `20260505154435_fix_pricing_rls_closure.sql` e relativo grant da `20260505160000_fix_pricing_rls_grants.sql`.
Playwright admin CRUD Phase 6 ha confermato i workflow admin contro staging.

**BUG-2: RESOLVED — `gate_options` admin DELETE**
Risolto da `20260505154435_fix_pricing_rls_closure.sql` e relativo grant da `20260505160000_fix_pricing_rls_grants.sql`.

**BUG-3: RESOLVED at DB layer — `configurations` anon SELECT**
Risolto da `20260505154435_fix_pricing_rls_closure.sql`. A livello DB/RLS anon può leggere configurazioni salvate.
Share-link E2E app resta pending perché non esiste ancora una route pubblica `/configurator/[id]`.

**BUG-4: RESOLVED — `service_zones` typo policy removed**
Risolto da `20260505154435_fix_pricing_rls_closure.sql`. Resta solo `service_zones_anon_select`.

### RISOLTI DA PHASE 5 HARDENING

**BUG-5: RESOLVED — `admin_audit` aveva grant non-DML per anon/authenticated**
Detected during Phase 5 verification on 2026-05-05.

Evidence:
- Query:
```sql
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'admin_audit'
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY grantee, privilege_type;
```
- Expected: only `service_role` appears (no privileges at all for `anon`/`authenticated`).
- Actual: `anon` and `authenticated` have `TRIGGER`, `TRUNCATE`, `REFERENCES` privileges.

Resolution:
- `20260506120000_harden_phase5_grants.sql` revoked `TRIGGER`, `TRUNCATE`, and `REFERENCES` on `public.admin_audit` from `anon` and `authenticated`.
- Post-apply direct grant query confirmed only `service_role` appears for `admin_audit`.

**BUG-6: RESOLVED — grants anon troppo ampi su tabelle catalogo**
Detected during Phase 5 verification on 2026-05-05.

Evidence:
- Query:
```sql
SELECT table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon','authenticated','service_role')
  AND privilege_type IN ('SELECT','INSERT','UPDATE','DELETE')
  AND table_name <> 'admin_audit'
ORDER BY table_name, grantee, privilege_type;
```
- Actual highlights:
  - `gates`: `anon` has `UPDATE` in addition to `SELECT`.
  - `gate_options`: `anon` has `INSERT` and `UPDATE` in addition to `SELECT`.
  - `fencing_panels`: `anon` has `INSERT` and `UPDATE` in addition to `SELECT`.

Resolution:
- `20260506120000_harden_phase5_grants.sql` revoked anon write grants found during inventory:
  - `REVOKE UPDATE ON public.gates FROM anon;`
  - `REVOKE INSERT, UPDATE ON public.gate_options FROM anon;`
  - `REVOKE INSERT, UPDATE ON public.fencing_panels FROM anon;`
- Post-apply direct grant query found additional non-DML grants on public app tables, so `20260506121000_harden_public_non_dml_grants.sql` revoked `TRIGGER`, `TRUNCATE`, and `REFERENCES` from `anon` and `authenticated` on `configurations`, `fencing_panels`, `gate_options`, `gates`, `quote_requests`, and `service_zones`.
- Final direct grant query confirmed `anon` has only:
  - `SELECT` on `gates`, `gate_options`, `fencing_panels`, and `service_zones`;
  - `SELECT`, `INSERT` on `configurations`;
  - `INSERT` on `quote_requests`.

### ANCORA APERTI

**RISCHIO-1: RESOLVED — `admin_audit` service-role only**
Decisione 2026-05-05: Option A selected. `admin_audit` remains readable only through server-side service-role code. No authenticated-admin RLS policy added, no migration required.

Verified on staging:
- RLS enabled with zero policies.
- DML grants limited to `service_role`: `SELECT`, `INSERT`.
- `anon` and `authenticated` have no DML or non-DML grants after Phase 5 hardening.

**RISCHIO-2: RESOLVED — `quote_requests` service_role SELECT/UPDATE**
RESOLVED ✅ (verified + migration applied on 2026-05-05).
service_role now has the required read/update grants for future server-side admin workflows.
```sql
GRANT SELECT, UPDATE ON public.quote_requests TO service_role;
```

Migration: `20260505161000_quote_requests_service_role_grants.sql`

**APERTO: `fencing_panels` 1 sola riga**
Seed incompleto. TBD da Marius. Non bloccante per schema, bloccante per test configuratore pannelli.

**APERTO: railheads**
Nessuna tabella `railheads`. TBD da Marius. Non creare migration vuote.

---

## 7. Tipi TypeScript

File: `apps/web/src/types/database.types.ts`
Aggiornato il 2026-05-06 dal DB staging reale.
Commit: `f2474e5 chore(types): regenerate database types for Phase 7`.

**Diff rispetto alla versione precedente:**
- Rimosso blocco `graphql_public` (schema vuoto, non usato nel progetto)
- Rimosso `graphql_public: { Enums: {} }` da `Constants`
- Phase 7: `apps/web/src/types/database.types.ts` rigenerato da staging via Supabase CLI.
- Differenza semantica rilevata: `gates.Insert.name` ora è opzionale perché `public.gates.name` ha un default DB.
- Molte altre differenze erano riordinamento proprietà prodotto dalla CLI.
- Typecheck dopo rigenerazione: passed.

---

## 8. Decisione Finale

**Staging DB: DB/RLS HARDENING CHIUSO; FINAL TECHNICAL CLOSURE ANCORA PARZIALE**

Phase 6 app regression chiusa: 2026-05-05.
La chiusura tecnica finale resta aperta finché i criteri del `DB_CLOSURE_PLAN.md` §10 non sono tutti verificati o esplicitamente aggiornati.

Migration: 19 locali = 19 remote, tutte applicate in ordine.
BUG-1, BUG-2, BUG-3, BUG-4 risolti (Phase 2).
quote_requests service_role grants verificati (Phase 3).
admin_audit: Option A confermata — service_role only (Phase 4).
RLS SQL verificato per tutti i ruoli e grant broadness risolta con Phase 5 hardening (Phase 5).
App regression: typecheck, lint, build, Playwright 6/6 zero skip, manual routing smoke (Phase 6).
Generated types: rigenerati e typecheck passati (Phase 7).
DB documentation: baseline aggiornata fino a Phase 8.

**Phase 6 app regression:** PASSED on 2026-05-05.
Typecheck, lint, build e Playwright admin CRUD 6/6 passati contro app local con staging DB.
Manual routing smoke: route protection verified via HTTP status checks. Post-login catalogue rendering and DevTools 401/403 inspection were not part of this recorded smoke.

Aperto prima della chiusura tecnica finale:
- Share-link E2E: pending — `/configurator/[id]` route non ancora implementata; il criterio §10 "Share-link configuration read works" non è ancora verificabile.
- Business data (Phase 9): separato dalla chiusura tecnica, bloccato su Marius (prezzi finali, railheads, fencing panels, finish palette).
