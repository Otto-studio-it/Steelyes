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

**Last batch: 2026-07-28** — [`client-answers/2026-07-28-marius.md`](./client-answers/2026-07-28-marius.md). Closed `open.finish_palette`, `gate.cantilever.tail_ratio`, `gate.cantilever.width_meaning`. Blocking questions went 16 → 13.

Not yet mirrored into `questions.ts` (tracked as CL-708): the three closed answers above, plus new seeds for the handle rule (CA-01) and the aluminium panel option (CA-02).

## Question wording

Marius told us plainly that he could not parse the cantilever tail question (CA-04) — then answered it correctly once he reframed it himself, in millimetres with a worked example. Blocking questions should follow that shape: **plain sentence, worked example, expected unit.** Terms like "ratio", "tail ratio" or "28%" read as jargon and produce silence, not answers.
