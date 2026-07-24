# Client product-data intake

Token-gated questionnaire for Marius to confirm known gate data and answer open questions. Answers autosave to Supabase; Ruben reviews/edits in admin.

## Surfaces

| Who | URL | Purpose |
|-----|-----|---------|
| Client | `/intake/<access_token>` | Mobile form, autosave, submit |
| Admin | `/admin/client-data` | Create session, copy link, edit answers, lock |

## Data

- `client_intake_sessions` — token, status (`in_progress` \| `submitted` \| `locked`)
- `client_intake_answers` — one row per `question_id` (JSONB value + status)
- Question catalog: `apps/web/src/lib/client-intake/questions.ts` (Italian labels + context)

Answer statuses: `proposed` (seeded from brief) → client `confirmed` / `provisional` / still `missing`.

## Ops

1. Apply migration `20260724100000_client_intake.sql`
2. Open `/admin/client-data` → **Crea sessione intake**
3. Copy link → send to Marius
4. Updates email `WORKSHOP_EMAIL` (throttled ~10 min); submit always notifies
5. **Esporta PDF** from admin for a full snapshot of answers + statuses

## Provenance & “Spiega meglio”

- Catalog: `apps/web/src/lib/client-intake/provenance.ts` (from Marius WhatsApp listino + options)
- Admin: **Fonti · Documentazione** accordion on `/admin/client-data`
- Intake + admin questions: **Non capisco — spiega meglio** expands plain Italian origin + facts (no LLM; curated from the same source)

Confirmed answers do **not** auto-apply to `gates` pricing — review first, then update admin listini manually.
