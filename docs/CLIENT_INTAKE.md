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

## Answers arriving outside the form

Marius often replies on WhatsApp instead of filling the form. Those answers are still authoritative and must not be lost.

1. Record the verbatim text in [`client-answers/`](./client-answers/README.md) as a dated batch with `CA-NN` ids.
2. Mirror each answer back into `questions.ts` (seed + status) so `/admin/client-data` stops asking something already answered.
3. Cite the `CA-NN` id wherever the rule is implemented.

**Last batch: 2026-08-11** — [`client-answers/2026-08-11-marius.md`](./client-answers/2026-08-11-marius.md). Closed layout rules `open.railhead_count_rule` + `open.dog_bars_count_rule` (CA-14/15); circles option CA-16; Design railhead policy CA-17. Prior: 2026-07-28 closed finish palette + cantilever.

Not yet mirrored into live admin answer rows (WhatsApp batches are authoritative in `client-answers/`): mark CA-14…CA-17 confirmed in the active intake session when convenient.
## Question wording

Marius told us plainly that he could not parse the cantilever tail question (CA-04) — then answered it correctly once he reframed it himself, in millimetres with a worked example. Blocking questions should follow that shape: **plain sentence, worked example, expected unit.** Terms like "ratio", "tail ratio" or "28%" read as jargon and produce silence, not answers.
