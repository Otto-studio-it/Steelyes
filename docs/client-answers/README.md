---
title: Client Answers — index
description: Canonical, dated record of every answer batch received from Marius, with normalized rules and downstream impact
owner: Ruben
status: ACTIVE
last_updated: 2026-07-28
---

# Client Answers

One file per batch of answers received from the client. **This folder is the source of truth for what Marius actually said.** Every other doc (requirements reference, blockers, changelog, intake catalog) cites a `CA-` id from here instead of re-quoting WhatsApp.

## Why this folder exists

Client answers arrive as raw multilingual messages (Italian / Romanian / English, often truncated). They were previously pasted straight into feature docs, which lost the verbatim text and made it impossible to tell a *confirmed* rule from an *inferred* one. Each batch file now keeps three layers separate:

1. **Verbatim** — untouched original text. Never edit, never "fix" the grammar.
2. **Reading** — English translation plus the interpretation we acted on.
3. **Normalized rule** — the implementable statement, with an explicit confidence level.

## Batches

| Date | File | Items | Blocking questions closed |
|---|---|---|---|
| 2026-07-28 | [`2026-07-28-marius.md`](./2026-07-28-marius.md) | CA-01 … CA-07 | `gate.cantilever.tail_ratio`, `gate.cantilever.width_meaning`, `open.finish_palette` |
| 2026-07-31 | [`2026-07-31-ruben.md`](./2026-07-31-ruben.md) | CA-08 … CA-12 | `open.width_meaning`, `open.height_meaning`, `gate.bifold.panels_per_leaf`, `gate.single_bifold.collection_side`, `gate.telescopic.panel_count`, `gate.radius.definition` |

Outbound (answered 2026-07-31):

| Date | File | Purpose |
|---|---|---|
| 2026-07-30 | [`FOLLOWUP_MISSING_GATES_2026-07-30.md`](./FOLLOWUP_MISSING_GATES_2026-07-30.md) | Unlock bifold / telescopic / radius / width_meaning — **answered in CA-08…CA-12** |

## Id scheme

`CA-NN` — sequential across all batches, never reused. Cite as `CA-05` in code comments, doc tables, and commit messages.

## Confidence levels

| Level | Meaning | May we implement pricing from it? |
|---|---|---|
| `CONFIRMED` | Unambiguous statement, numbers present, no missing clause | Yes |
| `PARTIAL` | Direction is clear, but a needed parameter (base, area, count rule) is still missing | Structure yes, numbers no |
| `INFERRED` | We reconstructed meaning from truncated or garbled text | No — ask before shipping |

## Protocol when a new batch arrives

1. Create `docs/client-answers/<date>-marius.md` from the structure of the latest batch file.
2. Paste the raw text into **Verbatim** first, before any analysis.
3. Assign `CA-NN` ids continuing from the previous batch.
4. Fill **Downstream impact** with concrete file paths — docs *and* code.
5. Update: [`../frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md`](../frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md), [`../CLIENT_BLOCKERS.md`](../CLIENT_BLOCKERS.md), [`../frontend/CLIENT_CHANGELOG.md`](../frontend/CLIENT_CHANGELOG.md), [`../PROJECT_STATUS.md`](../PROJECT_STATUS.md).
6. Mirror the answer into the intake catalog (`apps/web/src/lib/client-intake/questions.ts`) so `/admin/client-data` stops asking a question that is already answered.
7. Add the row to the **Batches** table above.

## Rule

Do not invent a formula to fill a gap a batch left open. An unanswered parameter stays an open question with an explicit owner — a placeholder number that reaches the configurator becomes a quoted price to a real customer.
