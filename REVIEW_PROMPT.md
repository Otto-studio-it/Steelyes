# Steelyes Admin Panel — Revisione Tecnica Completa

Sei un esperto di Next.js 14, Supabase (PostgreSQL + PostgREST + Auth), e TypeScript.
Ti chiedo di analizzare il lavoro fatto su questo progetto e dirmi:
1. Se l'approccio è corretto
2. Dove ci sono problemi e perché
3. Come risolverli

---

## Contesto del progetto

**Stack:** Next.js 14 (App Router), Supabase (hosted cloud), TypeScript, Tailwind CSS, pnpm workspaces/Turborepo.

**Obiettivo:** Costruire un admin panel interno (`/admin/*`) che permetta al cliente (Marius) di modificare i prezzi dei cancelli direttamente dal telefono, senza intervento dello sviluppatore.

**Supabase Project ref:** `hgeksaulzomkgqnfuriu`

---

## Lavoro fatto — in ordine cronologico

### 1. Schema DB (migrations SQL)

**File:** `supabase/migrations/`

Sequenza migrations applicate (tutte segnate come "remote" dal CLI):

| Timestamp | Nome | Cosa fa |
|---|---|---|
| 20260423120000 | init | Schema base: tabelle `gates`, `service_zones`, `configurations`, `quote_requests`, `admin_audit`. Enums `gate_type`, `gate_style`, `quote_status`. Triggers `updated_at`. RLS enabled su tutte. |
| 20260430000000 | rls_policies | Policies SELECT per `anon` su `gates`, `service_zones`, `configurations`. INSERT per `anon` su `configurations` e `quote_requests`. |
| 20260430000001 | gates_pricing_schema | Estende enum `gate_type` (aggiunge `single-swing`, `bifolding-single`) e `gate_style` (aggiunge `victorian`). Ristruttura `gates`: drop vecchie colonne (`base_price_per_m2`, `tube_multipliers`, `finish_multipliers`, `motor_surcharge`), aggiunge nuove (`finish`, `min_width_mm`, `min_height_mm`, `base_price_manual_gbp`, `base_price_auto_gbp`). Crea `gate_options` e `fencing_panels`. |
| 20260430000002 | gates_seed | INSERT 16 cancelli Victorian (8 tipi × metal/composite) con prezzi da Marius. **NOTA:** questa migration fu separata dalla 000001 perché PostgreSQL non permette di usare un nuovo enum value nella stessa transazione in cui è stato aggiunto (`ALTER TYPE ADD VALUE` + `INSERT` = error 55P04 "unsafe use of new value"). |
| 20260430000003 | admin_auth | RLS policies UPDATE per `authenticated` + `is_admin = true` su `gates`, `gate_options`, `fencing_panels`. Usa `auth.jwt()->'user_metadata'->>'is_admin'`. |
| 20260501000000 | auto_schema_reload | Crea `EVENT TRIGGER pgrst_watch ON ddl_command_end` che esegue `NOTIFY pgrst, 'reload schema'`. |
| 20260501000001 | notify_schema_reload | Semplice `NOTIFY pgrst, 'reload schema'`. |
| 20260501000002 | grants | `GRANT USAGE ON SCHEMA public` + `GRANT SELECT/UPDATE/INSERT` su tutte le tabelle a `anon`, `authenticated`, `service_role`. + `NOTIFY pgrst, 'reload schema'`. |
| 20260501000003 | catchup (enum) | Ri-esegue `ALTER TYPE ADD VALUE IF NOT EXISTS` per i valori enum mancanti. |
| 20260501000004 | catchup_tables | Ri-esegue idempotente tutto: DROP/ADD COLUMN su `gates`, CREATE TABLE IF NOT EXISTS per `gate_options` e `fencing_panels`, policies, triggers, seed con `ON CONFLICT DO NOTHING`, GRANT, `NOTIFY pgrst`. |

### Perché così tante migrations "catchup"?

Il problema principale: `supabase link` è stato eseguito a un certo punto della sessione. Dopo il link, `supabase migration list` mostrava **solo la migration init (20260423120000) sul remoto**, nonostante le migrations precedenti risultassero applicate con successo. Si è poi usato `supabase migration repair --status applied` per segnare tutte le migrations come applicate — questo aggiorna solo la tabella di tracking `supabase_migrations.schema_migrations`, **NON esegue l'SQL**. Risultato: il DB remoto aveva solo lo schema init, ma il CLI pensava che tutte le migrations fossero già applicate.

La conferma è arrivata dall'output dell'ultima migration (`20260501000004`):
```
NOTICE (42701): column "name" of relation "gates" already exists, skipping
NOTICE (42701): column "finish" of relation "gates" already exists, skipping
NOTICE (42P07): relation "gate_options" already exists, skipping
NOTICE (42P07): relation "fencing_panels" already exists, skipping
```
Questo significa che le tabelle e colonne ESISTONO nel DB, ma il CLI non lo sapeva.

### 2. Il problema attuale irrisolto: PostgREST schema cache

Dopo tutte le migrations applicate, le chiamate REST API continuano a restituire:

```json
{"code":"42703","message":"column gates.name does not exist"}
{"code":"PGRST205","message":"Could not find the table 'public.gate_options' in the schema cache"}
{"code":"PGRST205","message":"Could not find the table 'public.fencing_panels' in the schema cache"}
```

**Cosa è stato tentato per ricaricare la schema cache:**
1. `NOTIFY pgrst, 'reload schema'` eseguito dentro migrations → **non funziona**
2. `EVENT TRIGGER` su `ddl_command_end` → **non funziona (o almeno non ha effetto immediato)**
3. Click "Reload schema cache" nel dashboard Supabase (Settings → API) → **utente non l'ha confermato come eseguito**
4. `SELECT pg_notify('pgrst', 'reload schema')` nel SQL Editor del dashboard → **non confermato**

**Domanda chiave:** `NOTIFY pgrst, 'reload schema'` eseguito dentro una migration (via `supabase db push`) funziona su un progetto Supabase hosted? O c'è qualche motivo per cui non viene ricevuto da PostgREST?

### 3. Codice Next.js costruito

**Struttura:**
```
apps/web/src/
  app/
    admin/
      layout.tsx              ← Server Component, metadata noindex
      login/
        page.tsx              ← Suspense wrapper (fix per useSearchParams in Next.js 14)
        LoginForm.tsx         ← 'use client', useRouter + useSearchParams
      dashboard/
        page.tsx              ← Server Component, link alle 3 sezioni
      gates/
        page.tsx              ← Server Component, fetch via getServiceRoleClient()
        GatePriceCard.tsx     ← 'use client', card espandibile, chiama Server Action
        actions.ts            ← 'use server', updateGatePrice(), validazione Zod
      gate-options/
        page.tsx              ← Server Component
        OptionCard.tsx        ← 'use client'
        actions.ts            ← 'use server', updateGateOption()
      fencing/
        page.tsx              ← Server Component
        FencingCard.tsx       ← 'use client'
        NewFencingForm.tsx    ← 'use client', form aggiunta nuovo pannello
        actions.ts            ← 'use server', upsertFencingPanel()
  middleware.ts               ← Protegge route /admin/dashboard /admin/gates etc.
  components/admin/
    AdminHeader.tsx           ← 'use client', nav + logout
  lib/
    env.ts                    ← Validazione env vars con Zod (split client/server)
    supabase/
      client.ts               ← createBrowserClient()
      server.ts               ← getServerClient() + getServiceRoleClient()
  types/
    database.types.ts         ← Tipi Supabase (aggiornati manualmente per gate_options, fencing_panels, gates nuove colonne)
```

**Scelte architetturali:**

- **Route group `admin/` separato da `(marketing)/`**: nessun header/footer pubblico, layout dedicato, middleware auth separato.
- **Server Actions per i writes**: Next.js Server Actions + `getServiceRoleClient()` (bypass RLS) per aggiornare prezzi. Validazione con Zod prima del write.
- **`revalidatePath` dopo ogni update**: assicura che la pagina Server Component si ricarichi con dati freschi.
- **Mobile-first UI**: card espandibili invece di tabelle orizzontali (inutilizzabili su mobile).
- **Auth via Supabase Auth**: email/password. Il flag `is_admin` vive in `user_metadata` del JWT. Middleware Next.js controlla session + `is_admin` e redirige a login se mancante.

**Bug risolti durante sviluppo:**
1. `useSearchParams()` senza `<Suspense>` in Next.js 14 → pagina bianca (fix: estratto in componente separato wrappato in Suspense)
2. `SUPABASE_SERVICE_ROLE_KEY` validato in `env.ts` anche lato client → ZodError (fix: schema split client/server con check `typeof window`)
3. `database.types.ts` stale (PostgREST schema cache non aggiornata) → TypeScript errors su `gate_options`, `fencing_panels` (fix: aggiornato manualmente)

---

## Stato attuale

| Cosa | Stato |
|---|---|
| DB schema (tabelle, colonne, enums) | ✅ Corretto e applicato |
| Seed data (16 cancelli, 8 gate_options) | ✅ Applicato (confermato da migration output) |
| RLS policies (SELECT anon, UPDATE admin) | ✅ Applicate |
| GRANTs (anon/authenticated/service_role) | ✅ Applicati |
| Admin panel UI (/admin/*) | ✅ Costruito |
| Auth middleware | ✅ Costruito |
| Login funzionante | ✅ Confermato dall'utente |
| PostgREST schema cache aggiornata | ❌ **PROBLEMA APERTO** |
| `database.types.ts` aggiornato | ⚠️ Aggiornato manualmente (non rigenerato da DB) |

---

## Domande per la revisione

1. **PostgREST NOTIFY:** `NOTIFY pgrst, 'reload schema'` eseguito dentro `supabase db push` su progetto hosted dovrebbe funzionare? Se no, qual è il modo corretto per forzare il reload senza accesso diretto al DB (senza Docker, senza Personal Access Token)?

2. **migration repair gotcha:** Usare `supabase migration repair --status applied` segna le migrations come applicate senza eseguirle. Era il modo corretto per gestire la situazione? C'era un modo migliore?

3. **GRANTs nelle migrations:** È corretto che le migrations SQL su Supabase non aggiungano automaticamente i GRANT a `anon`/`authenticated` come fa Studio? Bisogna sempre includerli manualmente?

4. **Admin auth con user_metadata:** Usare `auth.jwt()->'user_metadata'->>'is_admin'` in RLS policy è sicuro? O è meglio usare una tabella `admin_users` separata?

5. **Server Actions + service_role:** Per writes dall'admin panel si usa `getServiceRoleClient()` (bypass RLS) dentro Server Actions. Questo è sicuro dato che le Server Actions girano solo server-side e l'auth è già verificata dal middleware?

6. **database.types.ts:** È normale che `supabase gen types` mostri schema vecchio anche dopo migrations applicate? Come si forza il refresh dei tipi su progetto hosted?

---

## File chiave da esaminare

Se vuoi vedere il codice, i file più rilevanti sono:
- `supabase/migrations/20260501000004_catchup_tables.sql` (migration principale)
- `apps/web/src/middleware.ts`
- `apps/web/src/app/admin/gates/actions.ts`
- `apps/web/src/app/admin/gates/page.tsx`
- `apps/web/src/lib/env.ts`
- `apps/web/src/lib/supabase/server.ts`
