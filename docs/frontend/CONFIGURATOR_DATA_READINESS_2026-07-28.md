---
title: Configurator Data Readiness — 2D/3D
description: Per-gate-type and per-subsystem assessment of whether confirmed client data is sufficient to build the 2D and 3D configurator
owner: Ruben
status: ACTIVE
last_updated: 2026-07-28
source: code audit of packages/gate-engine + docs/client-answers/2026-07-28-marius.md
---

# Configurator Data Readiness — 2D/3D

Question: **is the current documentation enough to proceed on the 2D and 3D configurator?**

Short answer: **enough for the architecture and for 2 of 8 gate types. Not enough for the other 6, and not enough for any final price.**

This assessment reads the engine code, not the docs. Where a doc says "confirmed" but the code uses an invented constant, the code wins.

---

## The distinction that matters

There are three very different states, and the project has been treating them as one:

| State | Meaning | Safe to ship? |
|---|---|---|
| **Confirmed** | Client stated the rule; code implements exactly that | Yes |
| **Schematic** | We draw a deliberate abstraction and say so | Yes, if labelled |
| **Invented** | We made up a number and present it as a rule | **No** |

The engine currently contains all three, and a customer cannot tell them apart. The third category is the real risk in this codebase — not the missing data.

---

## Per-gate-type verdict

| Gate type | 2D | 3D | Photo audit exists | Verdict |
|---|---|---|---|---|
| `double_swing` | Real recipe — zone ratios from photo audit, 4 rails, tube pickets | Procedural members + tube cylinders | ✅ | **BUILDABLE** |
| `single_swing` | Same recipe, 1 leaf | Same | ✅ | **BUILDABLE** |
| `tracked_sliding` | Schematic: frame rect + track line + panel | Schematic boxes | ✅ | **SCHEMATIC ONLY** — track type/position unknown |
| `cantilever_sliding` | Schematic + tail (rule now correct per CA-05) | Schematic + tail box | ✅ | **SCHEMATIC ONLY** — carriage, foundation unknown |
| `bifolding_double_swing` | **Drawn as a double swing with a dashed centre line** | **Identical to double swing** | ❌ | **NOT BUILDABLE** |
| `single_bifolding` | **Drawn as a single swing** | **Identical to single swing** | ❌ | **NOT BUILDABLE** |
| `telescopic_sliding` | 3 hardcoded segments, magic offsets | 3 hardcoded segments | ❌ | **NOT BUILDABLE** |
| `radius_sliding` | Rounded rect + a decorative arc | **No special case at all** — falls through to generic sliding | ❌ | **NOT BUILDABLE** |

### What "not buildable" means concretely

`packages/gate-engine/src/geometry/swing-victorian.ts` is the only module with a real geometry recipe, and it returns `null` unless the style is `traditional_victorian` **and** the gate type contains `swing`. Everything else renders from `buildSlidingFrame` / `buildSlidingMeshBoxes`, which are hand-tuned rectangles.

Two specific consequences worth naming:

- **`bifolding_double_swing` is a double swing.** `getLeafCount()` returns 2 for both, `isSwingGate()` matches both, and the only difference in the output is `strokeDasharray: '6 10'` on one line ([rendering.ts:358](../../packages/gate-engine/src/rendering.ts#L358)). A customer configuring a bifold sees a non-bifold gate. `gate.bifold.panels_per_leaf` is still unanswered, so we cannot fix this — there is no fold geometry to draw.
- **`radius_sliding` has no geometry.** It gets `rx: 80` on the panel rect and a decorative bezier. In 3D it is not mentioned once in `buildSlidingMeshBoxes`. The intake question `gate.radius.definition` asks what the product even *is* — curved travel path, curved top, or both — and is unanswered. We are drawing a product we cannot define.

Only **4 of 8** gate types have a photo audit in [`gate-audits/`](./gate-audits/): double_swing, single_swing, tracked_sliding, cantilever_sliding. The four types with no audit are exactly the four that are not buildable.

---

## Per-subsystem verdict

| Subsystem | State | Detail |
|---|---|---|
| Config contract + serialization | ✅ Ready | `GateConfig`, versioned, shared by 2D and 3D. Sound. |
| Finish rendering | ✅ Ready | CA-03 palette live in `finishes.ts`; both renderers read the same tokens |
| Finish **pricing** | 🔴 Blocked | £55/m² has no base and no area definition (CA-03) |
| Swing Victorian geometry | ✅ Ready | Zone ratios derived from a real photo audit |
| Composite panel geometry | 🔴 Blocked | `open.composite_build` never answered. Composite renders as a flat fill — we do not know thickness, reinforcement, or how many horizontal members a panel has |
| Cantilever tail | ✅ Ready | CA-05 gives the rule for all widths. Code still wrong (CL-705) but the data is complete |
| Dimension limits | 🔴 Blocked | Every one of the 8 types inherits the same 600–6000mm envelope. No per-type limits. And `open.width_meaning` / `open.height_meaning` are unanswered — **we do not know what the number the customer types actually measures** |
| Dimension presets | 🔴 Blocked | `open.dimension_bands` — are 1800/1900 fixed presets or the ends of a range? |
| Railhead catalogue | 🔴 Blocked | `DEFAULT_RAILHEAD_VARIANT_CATALOG.status === 'blocked_pending_client'`; the picker correctly returns an empty list |
| Decoration count rules | ⚠️ **Invented** | See below — the most dangerous item on this list |
| Handle | 🟡 Data ready, not built | CA-01 confirmed. No handle is modelled anywhere yet; `centerLatch` is emitted for every 2-leaf gate regardless of `motorised` |
| Posts | ✅ Ready | Shipped in `4c8260b`; `posts.ts` + mesh boxes |
| Motor / track visibility | 🔴 Blocked | `gate.tracked.track_details` asks whether the motor and rack should be visible. Unanswered |
| Fencing panels | 🔴 Blocked | No pricing model, no panel spec, no render |
| Preview fidelity target | 🔴 Blocked | `open.preview_fidelity` — the client said "70/80% like the photo" months ago in passing; never confirmed as an acceptance criterion |

---

## The invented constants

These live in [`rules/geometry.ts`](../../packages/gate-engine/src/rules/geometry.ts) behind `PROVISIONAL_COUNT_RULES` (quarantined 2026-07-30):

```ts
getExpectedTopRailheadCount   = clamp(round(widthMm / 190), 6, 14)
getExpectedDogBarRailheadCount = clamp(round(widthMm / 220), 4, 10)
getExpectedDogBarCount         = clamp(2 + round(widthMm / 850), 2, 5)
getDecorativeBarCapacity       = clamp(round(widthMm / 210), 8, 16)   // /230 for sliding
```

None of these divisors came from the client. `open.railhead_count_rule`, `open.dog_bars_count_rule` and `open.circles_count_rule` remain open. Over-count now emits `provisional_count_guidance` (soft) — it does **not** fail `validateGateConfig` or read as a workshop maximum.

Picket spacing (110mm), tube profile (40×2.5mm) and the 4-rail count in [`geometry/constants.ts`](../../packages/gate-engine/src/geometry/constants.ts) still carry schematic comments until Marius confirms.

---

## So: can we proceed?

Yes — on a scoped slice. Here is what the confirmed data actually supports.

### Build now, no new client data needed

1. **Fix the cantilever tail** (CL-705). CA-05 is complete. The `0.28` fallback is actively wrong for every width except 4000mm.
2. **Implement the handle rule** (CA-01). Gate the handle on `!motorised` in both renderers and the cut list. Also decide what `centerLatch` should do when `motorised` — it is currently unconditional.
3. **Add the cantilever site-space warning.** A customer typing 4000mm needs to be told they need 5333mm of run. This is the highest-value single UI addition available from this batch, and it costs nothing in client data.
4. **Label the schematic gate types honestly.** `tracked_sliding` and `cantilever_sliding` can ship with an explicit "schematic — proportions confirmed at survey" state.
5. **Quarantine the invented constants.** Move the four count formulas behind a single `PROVISIONAL_COUNT_RULES` export with a comment naming the open intake question, and soften the user-facing copy from "cannot exceed" to a guidance state. Same amount of code, honest output.

### Needs client data before any work is worth doing

| Work | Blocked on |
|---|---|
| Bifold geometry (both types) | `gate.bifold.panels_per_leaf`, `gate.single_bifold.collection_side` |
| Telescopic geometry | `gate.telescopic.panel_count` — panel count and overlap order |
| Radius geometry | `gate.radius.definition` — what the product is |
| Any final price | `open.prices_still_valid`, `open.size_uplift_formula` |
| Colour pricing | `open.finish_uplift_rule` |
| Composite panel realism + aluminium option | `open.composite_build` |
| Per-type size limits | `open.dimension_bands` + the six `*.size_limits` questions |
| Railheads | `open.railhead_variants` + `open.railhead_count_rule` |
| Fencing panels | `open.fencing_pricing`, `open.fencing_panel_specs` |

### The one question that outranks all others

`open.width_meaning` and `open.height_meaning`. **We do not know what the number the customer types into the configurator measures.** Clear opening? Leaf width? Overall including posts? Height to the top rail or to the tip of the railheads?

Every price, every render and every site-space warning depends on it. CA-05 answered it for cantilever only, incidentally, by describing the opening between posts. For the other seven types it is unknown. Nothing built on top of dimensions is trustworthy until this is closed — and it is a five-minute answer for Marius, which makes it the single highest-leverage question in the whole intake.

---

## Recommended sequencing

1. **This week** — ship the five "build now" items. All are code-only, no client dependency.
2. **In parallel** — send Marius the follow-up in [`../client-answers/2026-07-28-marius.md`](../client-answers/2026-07-28-marius.md), with `width_meaning` / `height_meaning` promoted to the top and asked with a worked example, per the CA-04 lesson.
3. **Then** — restrict the configurator's visible gate types to the four with a photo audit, and treat the other four as "enquire" rather than "configure", until their geometry questions are answered. Better a smaller honest configurator than eight types where four are fiction.
4. **Only after** the size-uplift formula arrives — turn on real totals. Until then every total stays "indicative, subject to survey", which is already the shipped behaviour and is correct.

---

## Bottom line

The documentation is now good enough to **work from**, which was not true before this batch — the client-answer record makes it possible to tell a confirmed rule from a guess, which is the precondition for everything else.

It is not good enough to **finish**. Two gate types are real, two are schematic-but-defensible, four are fiction. The blocker is not the amount of documentation. It is that four gate types and the meaning of "width" have never been described by the person who builds them.
