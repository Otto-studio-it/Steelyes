---
title: Delivery Roadmap — 2 Weeks to Client Handoff
description: Concrete missing work across website, indicative pricing, 2D configurator, and 3D/AR — sequenced for a 14-day delivery with parallel Claude Code / Codex / Cursor
owner: Ruben
status: ACTIVE
last_updated: 2026-07-30
depends_on:
  - docs/frontend/CONFIGURATOR_DATA_READINESS_2026-07-28.md
  - docs/frontend/CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md
  - docs/adr/002-configurator-2d-first-on-demand-3d-ar.md
  - docs/client-answers/2026-07-28-marius.md
  - docs/STACK_RULES.md
capacity:
  calendar: 14 days (2026-07-30 → 2026-08-12)
  hours_per_day: 12–15
  agents: Claude Code + Codex + Cursor
---

# Delivery Roadmap — 2 Weeks to Client Handoff

**Verdict:** we can deliver a credible, honest product in 14 days if we freeze scope hard. We cannot honestly finish all 8 gate types, final prices, or photoreal AR. We *can* ship: marketing site live, indicative pricing, a trustworthy 2D configurator for the buildable types, and on-demand 3D/AR on phone camera for those same types.

This file is the execution authority for the next 14 days. If it conflicts with older roadmaps, **this file wins for sequencing**. Older roadmaps remain useful for file ownership detail.

---

## 0. Non-negotiable product rules

| Rule | Why |
|---|---|
| **2D first, then 3D/AR from the same `GateConfig`** | ADR 002. AR that disagrees with the 2D preview destroys trust. |
| **No invented workshop rules on customer-facing surfaces** | Invented railhead/dog-bar counts look like workshop constraints. Quarantine or soften. |
| **Indicative pricing only until Marius closes formulas** | Never show a colour/railhead/aluminium total as final. |
| **Gate-type honesty** | Only configure what we can draw. The rest is “Enquire”. |
| **AR = native phone viewers, not WebXR** | Stack forbids WebXR/Babylon. Path is GLB/USDZ → Apple Quick Look / Google Scene Viewer (opens the device camera). |
| **Three.js only via dynamic import** | Never in the default `/configurator` bundle. |
| **Blender MCP is optional polish, not the source of truth** | Geometry recipes live in `gate-engine`. Blender may export hero meshes *derived from* those recipes; it must not invent dimensions. |

---

## 1. Delivery scope freeze (what we ship on day 14)

### In scope — must ship

| Lane | Ship |
|---|---|
| **Website** | App live on a public URL; contact/footer with known data; legal pages usable; no false claims; gallery/case-study hidden or workshop-only |
| **Indicative pricing** | Live indicative total + clear “subject to survey”; finish palette selectable; custom RAL as “quoted separately”; no fake colour £ totals |
| **2D configurator** | Full flow for `double_swing` + `single_swing`; schematic-labelled for `tracked_sliding` + `cantilever_sliding`; other 4 types = Enquire CTA |
| **3D / AR** | On-demand button: generate mesh from same config → preview in 3D → “View in your space” opens phone camera (Quick Look / Scene Viewer) with real mm dimensions for the 2 swing types first, schematic for sliding if time |

### Explicitly out of scope for this handoff

- Final catalogue prices / size-uplift formula / railhead SKUs
- Honest geometry for bifold, telescopic, radius
- Fencing panel pricing + render
- Photoreal materials / Blender hero pack for every type
- Domain cutover of `steelyes.co.uk` if Marius DNS is late (ship on Vercel URL + Cloudflare when ready)
- Payment / accounts / WebXR in-browser AR

### Capacity math (sanity check)

| Input | Value |
|---|---|
| Calendar | 14 days |
| Human+agent day | ~12–15 h focused |
| Gross | ~170–210 h |
| Integration / review tax | ~25% |
| Net build | ~130–160 h |

Parallel agents multiply *draft* speed, not *integration* speed. Plan assumes **one integrator (Codex or Ruben)** merges daily; workers never edit the same files.

---

## 2. Inventory — what is actually missing

### A. Website / marketing

| Item | Status | Owner | Priority |
|---|---|---|---|
| Public deploy (Vercel → prod env → `steelyes-prod`) | Missing / broken (`DEPLOYMENT_NOT_FOUND`) | Ruben | P0 |
| Domain / DNS (`steelyes.co.uk` still GoDaddy legacy) | Blocked on Marius | Marius | P0 |
| Sales email in `business.ts` | Data ready (CA-06), code may lag | Cursor | P0 |
| Social links (FB conflict + TikTok missing) | Data ready (CA-07) | Cursor | P1 |
| Phone / company no. / VAT / address | Still missing | Marius | P0 legal |
| Logo SVG | Missing → wordmark fallback | Marius / fallback | P1 |
| Legal pages (privacy / cookies / terms) | Placeholders | Claude | P0 |
| Iubenda / consent | TBD | Ruben | P0 |
| Unsafe claims audit (homepage, about, gates) | Open | Codex | P0 |
| Case study | Hide until content | Cursor | P1 |
| Gallery consent | Workshop-only until consent | Cursor | P1 |
| Install zones / postcode widget | Hide or “UK-wide” | Cursor | P2 |

### B. Indicative pricing

| Item | Status | Ship rule for day 14 |
|---|---|---|
| Base `FROM` prices in DB | Unverified | Show as indicative; never “final” |
| Size uplift formula | Missing | No size-based total; disclaimer |
| Finish palette | Confirmed (CA-03) | Swatches live |
| Finish £55/m² base + area | Partial | **No colour line item** until answered |
| Custom RAL | Confirmed policy | “+ extra charge — powder coating” only |
| Aluminium upgrade £12.75 / £12 | Partial (CA-02) | Toggle OK; total = “quoted after survey” |
| Railheads | Blocked | Empty picker / provisional; no unit price as final |
| Handle rule (CA-01) | Confirmed | Affects BOM/preview, not price |
| Motorised vs manual columns | Partial in catalogue | Show both where present; NULL → “on request” |

### C. Configurator 2D

| Item | Status | Day-14 target |
|---|---|---|
| Config contract + serialization | Ready | Keep |
| Finish tokens in 2D | Ready / harden | Preview reads engine finishes only |
| Swing Victorian recipe | Ready | Primary hero path |
| Cantilever tail = 1/3 | Data ready; code still wrong (CL-705) | **Fix** |
| Site-space warning (4000 → 5333) | Not built | **Ship** |
| Handle gated on `!motorised` | Not modelled | **Ship** (even simple) |
| Invented count formulas | Dangerous | Quarantine + soft copy |
| `width_meaning` / `height_meaning` | Open (except cantilever) | Label dimensions honestly; chase Marius |
| Tracked / cantilever geometry | Schematic | Ship labelled schematic |
| Bifold / telescopic / radius | Fiction | **Enquire only** — do not configure |
| Fence panels UI | Domain only | Defer or “coming soon” |
| Save / share / quote | Baseline exists | Harden end-to-end |
| Mobile portrait + landscape | Partial | Finish orientation UX |
| Gate-type picker honesty | Missing | Hide or Enquire for 4 fiction types |

### D. Configurator 3D + live camera AR

| Item | Status | Day-14 target |
|---|---|---|
| Procedural mesh from `GateConfig` (`packages/gate-engine/src/mesh`) | Exists, partial | Align 1:1 with 2D for swing types |
| Lazy Three.js viewer | Per stack | On-demand route/panel only |
| Export GLB | Likely missing / incomplete | Required for Android Scene Viewer |
| Export USDZ | Missing | Required for iOS Quick Look |
| “View in your space” CTA | Missing | Opens native AR (camera) |
| Desktop QR fallback | Proposed in stack | QR to same AR URL on phone |
| Scale = real mm | Must be correct | Gate width/height in metres in the scene |
| Blender MCP | Not required | Optional: bake nicer Victorian mesh *from* engine dims; never invent types |
| WebXR in-page camera | Forbidden | Do **not** build |

**AR product promise (honest wording):**

> “Place your configured gate in your driveway using your phone camera. Dimensions match what you entered. Looks are schematic / workshop-accurate, not a photo.”

---

## 3. Architecture for 2D → 3D → camera (do this order)

```text
GateConfig (single source)
    │
    ├─► 2D render plan (SVG)     ← Week 1 primary
    │
    ├─► indicative pricing       ← Week 1 parallel
    │
    └─► mesh plan (engine)       ← Week 2, only after 2D matches config
            │
            ├─► Three.js on-demand preview (lazy)
            ├─► export .glb  → Android Scene Viewer
            └─► export .usdz → iOS Quick Look
                    │
                    └─► Button: “View in your space”
                         opens OS AR → phone camera, real-world scale
```

**Blender MCP role (optional, end of Week 2 only if 2D+procedural AR already works):**

1. Take confirmed swing Victorian dimensions + finish tokens from engine.
2. Generate / refine a clean mesh asset.
3. Re-import as an optional high-fidelity override for AR export.
4. If Blender output drifts from `GateConfig`, **engine wins** — discard the asset.

Do not start Blender before the 2D recipe and procedural mesh agree.

---

## 4. Parallel agent lanes (avoid merge hell)

| Agent | Lane | Owns (examples) | Must not touch |
|---|---|---|---|
| **Claude Code** | Engine + 2D truth | `packages/gate-engine/**`, cantilever fix, handle rule, quarantine counts, mesh alignment | Marketing pages, deploy secrets |
| **Cursor** | Website + configurator UI | `apps/web` marketing, finish swatches, Enquire gating, AR CTA UI, business/social | Inventing engine constants |
| **Codex** | Integrator / QA / docs | Reviews, merges, Playwright, claim audit, deploy checklist, this roadmap updates | Large greenfield features while workers are mid-PR |

Daily cadence:

1. Morning: Ruben assigns max 3 tickets from the day board below.
2. Midday: workers push; Codex rebases / reviews.
3. Evening: green checks on `main` or release branch; update this file’s checkbox board.

---

## 5. Day-by-day plan

Dates assume start **Thu 30 Jul 2026** → handoff **Wed 12 Aug 2026**.

### Week 1 — Foundation, site, honest 2D

| Day | Date | Focus | Exit criteria |
|---|---|---|---|
| **D0** | Thu 30 Jul | Scope freeze + Marius ping + deploy kickoff | This roadmap accepted; follow-up WhatsApp sent (`width_meaning`, finish base, aluminium counts); Vercel project linked |
| **D1** | Fri 31 Jul | Deploy + contact/social + legal stubs | App reachable on `*.vercel.app`; CA-06/CA-07 reflected in UI; legal pages not empty placeholders |
| **D2** | Sat 1 Aug | Claims audit + hide incomplete marketing | No zinc/bronze/pearl; case study hidden; gallery workshop-only; pricing language indicative everywhere |
| **D3** | Sun 2 Aug | 2D: cantilever tail + site-space note + handle rule | CA-05 in code; 4000→5333 warning live; no handle when motorised |
| **D4** | Mon 3 Aug | 2D: quarantine invented counts + gate-type honesty | Fiction types → Enquire; provisional counts not worded as workshop law |
| **D5** | Tue 4 Aug | 2D UX: finishes, orientation, mobile | Swatches from engine; portrait usable; landscape side-by-side |
| **D6** | Wed 5 Aug | Quote / share / save hardening | Full path: configure → share `/quote/[token]` → request quote email |
| **D7** | Thu 6 Aug | Week-1 freeze + bug bash | 2 swing types solid; 2 sliding schematic; indicative price; site live. **No 3D work until this green.** |

### Week 2 — 3D mesh + phone-camera AR + polish

| Day | Date | Focus | Exit criteria |
|---|---|---|---|
| **D8** | Fri 7 Aug | Mesh plan = 2D plan for swing | Same members/posts/finish tokens; visual QA checklist |
| **D9** | Sat 8 Aug | Lazy Three.js viewer on demand | Button “3D preview”; default route still 2D; bundle budget respected |
| **D10** | Sun 9 Aug | GLB export + Android Scene Viewer | “View in your space” works on one Android device at real scale |
| **D11** | Mon 10 Aug | USDZ export + iOS Quick Look | Same CTA works on iPhone; desktop shows QR to open on phone |
| **D12** | Tue 11 Aug | Sliding schematic 3D if capacity; else polish | Tracked/cantilever AR optional; polish + a11y + copy |
| **D13** | Wed 12 Aug | Client handoff pack | Staging/prod URL, known limitations doc, Marius open questions list, demo script |

**Buffer rule:** if D7 is not green, slip AR — deliver outstanding 2D + site. A late broken AR is worse than no AR.

---

## 6. Ticket board (checkboxes)

### Website

- [ ] Production deploy on Vercel (`steelyes-prod` env)
- [ ] Cloudflare / DNS cutover **or** documented temporary URL
- [x] `sales@steelyes.co.uk` everywhere (no Yahoo)
- [x] Instagram / Facebook / TikTok canonical URLs
- [ ] Legal pages usable (privacy, cookies, terms)
- [ ] Consent / cookies path decided
- [x] Homepage / gates claims audit (no final-price language)
- [x] Case study hidden or filled
- [x] Gallery = workshop / consented only
- [x] Footer legal: blanks for missing company/VAT, not fake numbers

### Indicative pricing

- [x] Single disclaimer component used on gates + configurator + quote
- [x] Finish swatches; `other_ral` = quoted separately
- [ ] No £55/m² total until `open.finish_uplift_rule` answered
- [ ] Aluminium upgrade toggle without numeric total
- [x] Railhead picker empty or provisional label
- [ ] Motorised / manual display honest when auto price NULL

### Configurator 2D

- [x] Fix cantilever tail to 1/3 all widths
- [x] Live site-space run length note
- [x] Handle only when `!motorised`
- [x] Gate types: 2 buildable + 2 schematic + 4 enquire
- [x] Quarantine provisional count rules / soft validation copy
- [x] Dimension labels: state what we *think* width means; flag cantilever as clear opening
- [x] Finish-aware SVG preview
- [ ] Mobile orientation UX complete
- [ ] Save / share / quote path verified on phone

### Configurator 3D / AR

- [ ] Mesh derived only from engine (parity with 2D for swing)
- [ ] Lazy 3D viewer entry point
- [ ] GLB export
- [ ] USDZ export
- [ ] “View in your space” → native AR camera
- [ ] Real-world scale from config mm
- [ ] Desktop QR fallback
- [ ] Fallback UI when AR unavailable
- [ ] (Optional) Blender MCP hero mesh for Victorian only — after procedural works

### Client chase (parallel, every day until answered)

- [ ] `open.width_meaning` / `open.height_meaning` (worked example)
- [ ] `open.finish_uplift_rule` (base + area + Victorian)
- [ ] Aluminium panel/bar counts on 3000×1000 example
- [ ] Company legal + phone
- [ ] DNS access for `steelyes.co.uk`
- [ ] Facebook vanity URL

---

## 7. Definition of done (client handoff)

The delivery is **done** when all of the following are true:

1. A public URL loads the new site (Vercel and/or `steelyes.co.uk`).
2. A phone user can configure a double-swing Victorian gate in 2D, see finish change, see indicative price, save/share, request a quote.
3. Fiction gate types cannot be configured as if they were real.
4. Cantilever shows the 1/3 tail rule and site-space warning.
5. On supported phones, “View in your space” places the **same** configured swing gate in AR at real size.
6. Written limitations sheet lists every provisional/indicative item and every open Marius question.
7. No invented £ totals for colour, railheads, or aluminium.

**Stretch (nice, not required):** schematic AR for cantilever/tracked; Blender-polished Victorian mesh; domain cutover complete.

---

## 8. Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Marius data still incomplete | High | Indicative + Enquire; do not invent |
| USDZ export eats days | Medium | Ship Android GLB first; iOS day+1; if blocked, 3D orbit only + “AR next” |
| Agents conflict on same files | High | Strict lane table; daily integrator |
| Scope creep (8 gate types, fencing, photoreal) | High | This freeze; reject in review |
| Domain still on GoDaddy | High | Hand off on Vercel URL; DNS as parallel track |
| AR scale wrong | High | One physical tape-measure test before demo |

---

## 9. Demo script (day 14)

1. Open site on iPhone → homepage → Gates → Configurator.
2. Choose double swing + Victorian + black satin + manual + 3000×1800.
3. Show 2D update live; show indicative price disclaimer.
4. Toggle motorised → handle disappears.
5. Share link → reopen on second device.
6. Tap **3D** → orbit preview.
7. Tap **View in your space** → camera opens → place gate → walk around; confirm width with tape if possible.
8. Show cantilever path: enter 4000 → warning 5333 total run.
9. Show bifold/telescopic as Enquire (not fake geometry).
10. Show open questions still with Marius.

---

## 10. Related docs

- Readiness truth: [`CONFIGURATOR_DATA_READINESS_2026-07-28.md`](./CONFIGURATOR_DATA_READINESS_2026-07-28.md)
- Client batch: [`../client-answers/2026-07-28-marius.md`](../client-answers/2026-07-28-marius.md)
- **Foto dump intake (2026-07-30):** [`foto-intake/FOTO_INTAKE_ANALYSIS_2026-07-30.md`](./foto-intake/FOTO_INTAKE_ANALYSIS_2026-07-30.md) — organised `foto /` inventory, screenshot vs web rule, CAD 2D style lock, railheads Numbers, local 3D models
- ADR: [`../adr/002-configurator-2d-first-on-demand-3d-ar.md`](../adr/002-configurator-2d-first-on-demand-3d-ar.md)
- Stack AR choice: [`../STACK_RULES.md`](../STACK_RULES.md)
- Older detailed phases: [`CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md`](./CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md)
- Blockers: [`../CLIENT_BLOCKERS.md`](../CLIENT_BLOCKERS.md)
