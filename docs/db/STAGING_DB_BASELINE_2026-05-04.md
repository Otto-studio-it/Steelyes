# Staging DB Baseline — 2026-05-04

**Progetto:** steelyes-staging (`hgeksaulzomkgqnfuriu`)
**Data audit:** 2026-05-04
**Agente:** Agent 1 — DB audit scope

---

## 1. Migration Status

**Stato: ALLINEATO ✅**

14 migration locali = 14 remote, tutte applicate in ordine.

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

Nessun mismatch. Nessuna migration "applied" senza SQL locale.

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

### `gate_options`
| Policy | Role | Cmd | Condition |
|---|---|---|---|
| `gate_options_anon_select` | anon | SELECT | `true` |
| `gate_options_admin_insert` | authenticated | INSERT | `app_metadata.is_admin = true` |
| `gate_options_admin_update` | authenticated | UPDATE | `app_metadata.is_admin = true` |

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

### `quote_requests`
| Policy | Role | Cmd | Condition |
|---|---|---|---|
| `quote_requests_anon_insert` | anon | INSERT | `true` |

### `service_zones`
| Policy | Role | Cmd | Condition |
|---|---|---|---|
| `service_zones_anon_select` | anon | SELECT | `true` |
| `service.\n_zones_anon_select` | anon | SELECT | `true` ← ⚠️ TYPO + duplicato |

### `admin_audit`
_Nessuna policy. RLS abilitato = blocco totale via PostgREST per tutti i ruoli tranne service_role (bypass)._

---

## 4. Grants (anon / authenticated / service_role)

| Tabella | anon | authenticated | service_role |
|---|---|---|---|
| `gates` | SELECT | SELECT, UPDATE | SELECT, UPDATE |
| `gate_options` | SELECT, INSERT, UPDATE | SELECT, INSERT, UPDATE | SELECT, INSERT, UPDATE |
| `fencing_panels` | SELECT, INSERT, UPDATE | SELECT, INSERT, UPDATE, DELETE | SELECT, INSERT, UPDATE, DELETE |
| `configurations` | SELECT, INSERT | SELECT, INSERT | SELECT, INSERT |
| `quote_requests` | INSERT | INSERT | INSERT *(updated 2026-05-05: service_role now also has SELECT, UPDATE via `20260505161000_quote_requests_service_role_grants.sql`)* |
| `service_zones` | SELECT | SELECT | SELECT |
| `admin_audit` | — | — | SELECT, INSERT |

> **Nota:** `information_schema.role_table_grants` non include TRIGGER/REFERENCES/TRUNCATE nell'elenco utile. Solo DML rilevante mostrato. `service_role` bypassa RLS ma è comunque vincolato ai grant di tabella.

---

## 5. Audit Comportamento per Ruolo

### anon
| Operazione | Tabella | Esito | Note |
|---|---|---|---|
| SELECT | `gates` | ✅ OK | policy + grant |
| SELECT | `gate_options` | ✅ OK | policy + grant |
| SELECT | `fencing_panels` | ✅ OK | policy + grant |
| SELECT | `service_zones` | ✅ OK | policy + grant |
| SELECT | `configurations` | ❌ BLOCCATO | grant presente, **policy mancante** |
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
| INSERT | `gates` | ❌ **MANCA POLICY** | bug — vedi Problemi Aperti |
| DELETE | `gates` | ❌ **MANCA POLICY** | bug |
| INSERT/UPDATE | `gate_options` | ✅ OK | |
| DELETE | `gate_options` | ❌ **MANCA POLICY** | bug |
| INSERT/UPDATE/DELETE | `fencing_panels` | ✅ OK | |
| SELECT | `admin_audit` | ❌ BLOCCATO | nessuna policy, solo service_role legge |

### service_role
| Operazione | Esito | Note |
|---|---|---|
| Tutto su tutte le tabelle | ✅ OK | bypass RLS + grant completo su tabelle admin |
| `admin_audit` INSERT | ✅ OK | grant presente |
| `quote_requests` SELECT/UPDATE/DELETE | ⚠️ VERIFICARE | grant INSERT only — admin dashboard legge quote_requests via service_role? |

---

## 6. Problemi Aperti

### BUG BLOCCANTI per prod

**BUG-1: `gates` mancano policy admin INSERT e DELETE**
Admin può solo aggiornare gate esistenti, non aggiungerne o rimuoverli via app.
SQL correttivo (NON applicato — da fare in migration dedicata):
```sql
CREATE POLICY gates_admin_insert ON public.gates
  FOR INSERT TO authenticated
  WITH CHECK (((auth.jwt() -> 'app_metadata' ->> 'is_admin'))::boolean = true);

CREATE POLICY gates_admin_delete ON public.gates
  FOR DELETE TO authenticated
  USING (((auth.jwt() -> 'app_metadata' ->> 'is_admin'))::boolean = true);
```

**BUG-2: `gate_options` manca policy admin DELETE**
SQL correttivo:
```sql
CREATE POLICY gate_options_admin_delete ON public.gate_options
  FOR DELETE TO authenticated
  USING (((auth.jwt() -> 'app_metadata' ->> 'is_admin'))::boolean = true);
```

**BUG-3: `configurations` — anon può INSERT ma non SELECT**
Dopo salvataggio configurazione, utente non può leggere il proprio record (share link rotto).
SQL correttivo:
```sql
CREATE POLICY configurations_anon_select ON public.configurations
  FOR SELECT TO anon
  USING (true);
```

### NON BLOCCANTI ma da chiudere

**BUG-4: `service_zones` policy duplicata con typo**
`service.\n_zones_anon_select` (ha newline nel nome) coesiste con `service_zones_anon_select`. Funzionalmente innocuo. Da rimuovere:
```sql
DROP POLICY "service.
_zones_anon_select" ON public.service_zones;
```

**BUG-5: `admin_audit` ha grant non-DML per anon/authenticated**
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

Required follow-up:
- Decide whether to explicitly `REVOKE TRIGGER, TRUNCATE, REFERENCES` on `public.admin_audit` from `anon` and `authenticated` to match the strict “service-role only” surface.

**BUG-6: grants anon troppo ampi su tabelle catalogo (mitigati da RLS)**
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

Impact:
- RLS currently blocks anon writes because there are no anon UPDATE/DELETE policies on these tables, but the table-level grants are broader than intended and make the security posture harder to reason about.

Required follow-up:
- Consider tightening table grants to align with intended access (e.g. `REVOKE INSERT, UPDATE` from `anon` on catalogue tables), keeping RLS as the primary control.

**RISCHIO-1: RESOLVED — `admin_audit` service-role only**
Decisione 2026-05-05: Option A selected. `admin_audit` remains readable only through server-side service-role code. No authenticated-admin RLS policy added, no migration required.

Verified on staging:
- RLS enabled with zero policies.
- DML grants limited to `service_role`: `SELECT`, `INSERT`.
- `anon` and `authenticated` have no DML grants (but see BUG-5 for non-DML privileges that should be cleaned up).

**RISCHIO-2: `quote_requests` grant service_role solo INSERT**
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
Aggiornato il 2026-05-04 dal DB staging reale.

**Diff rispetto alla versione precedente:**
- Rimosso blocco `graphql_public` (schema vuoto, non usato nel progetto)
- Rimosso `graphql_public: { Enums: {} }` da `Constants`
- Tutte le 7 tabelle: **identiche** — nessuna rottura frontend

---

## 8. Decisione Finale

**Staging DB: NON CHIUSO**

Motivazione: 3 bug bloccanti per prod (BUG-1, BUG-2, BUG-3). In particolare BUG-3 (configurations SELECT mancante) rompe il funnel pubblico del configuratore. BUG-1 e BUG-2 rendono il pannello admin incompleto per gates.

Schema stabile, migrations allineate, tipi aggiornati.
Chiude dopo: fix BUG-1 + BUG-2 + BUG-3 in una migration, verifica RISCHIO-2, seed fencing_panels da Marius.
