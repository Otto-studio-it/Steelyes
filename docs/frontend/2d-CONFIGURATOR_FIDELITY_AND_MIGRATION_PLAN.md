# 2D configurator fidelity and migration plan

Date: 2026-09-16  
Status: active execution baseline  
Owner: configurator 2D reliability

This is the honest map of why customers see a different gate from the one they configured, what to fix **first on the 2D path**, and how to migrate off a discrete SVG matrix so the drawing always answers the configuration.

---

## 1. Diagnosis

The customer Design preview is **not live CAD**. It is a **lookup of preloaded SVG masters**:

```
GateConfig → resolveSilhouette() → <img src=/2d-masters/{type}/silhouettes/{slug}.svg>
```

That policy was locked in Phase 0 (`neverInventCad`) and Phase 3 (masters as primary). It is the right art-direction source. It is the **wrong runtime contract** for a configurator, because a discrete file matrix cannot follow every field on `GateConfig`.

Live parametric CAD still exists and **does** follow the config:

| Surface | Renderer | Follows type / arch / dog bars | Follows finish | Follows mm | Follows middle bar | Follows railheads |
|--------|----------|--------------------------------|---------------|------------|--------------------|-------------------|
| Design UI (`TechnicalMasterPreview`) | Preloaded master + optional circle/collar overlay | Only if a baked SVG exists | Swatch only | Strip only | No | No (CA-17) |
| Quote PDF | `buildGateRenderPlan` technical | Yes | CAD ink | Envelope | Yes (live CAD) | No on Design; PDF is CAD |
| 3D / AR mesh | `buildGateMeshPlan` | Yes | Material | Yes | Limited | Finials in mesh |
| Figma export tests | same CAD plan, stripped | Yes | Line-art | No (stripped) | Hardcoded `middleBar = true` in CAD base | No |

The quote PDF can therefore show a **different drawing** from the Design screen the customer just approved. That is a commercial mismatch, not a cosmetic one.

---

## 2. Why “I clicked to change the gate and nothing happened”

Three separate bugs stacked. All match the report that every combination file had been created, yet the UI did not respond.

### 2.1 The control was not on the first screen

Victorian **shape** (`base` / `arched` / `dog_bars` / `arched_dog_bars`) lived only in Refine → Structure accordion (`arched_top`, `dog_bars` switches).

Choose / Quick Path screen 1 showed:

- a **stock photograph** of the mechanism (`GATE_TYPE_IMAGES`)
- style, finish, motor

So changing “tipologia di modifica” on the screen the customer actually uses **could not swap the drawing**, even with a complete SVG matrix. The files were never asked for.

**Fix in this change:** `TipologyPicker` on Choose and Refine. Hero and type cards now use the official master SVG, not the marketing photo.

### 2.2 Changing mechanism reset (or appeared not to)

Selecting a mechanism calls `createGateConfig(createGatePreset(nextType))` — a **full preset reset**. Width, finish, arch, dog bars, motor are wiped. That is safe against stale option/type pairs, but it feels like “my modification disappeared”.

Worse: `/configurator?gate=double_swing` (marketing CTA) re-applied the query preset whenever `searchParams` identity changed, **overwriting a type the customer had just picked**.

The type sheet also stayed open after commit, so the sticky Design preview behind it was easy to miss.

**Fix in this change:** deep-link `?gate=` / `shareToken` apply once per mount; type sheet closes on commit; type cards show the 2D master for that pack.

### 2.3 Several controls are priced but not drawn

Even with a complete matrix, these **never** swap Design:

| Customer control | What they think happens | What Design actually does |
|------------------|-------------------------|----------------------------|
| Finish / custom hex | Gate is painted | Swatch in the header only. Masters stay line-art. Copy used to say the hex updates the preview. |
| Width / height | Gate scales | Millimetre strip only. `clientMutable = [widthMm, heightMm]`. |
| `middle_bar` | Extra rail appears | Priced option. CAD base export **hardcodes** `middleBar = true`. Victorian masters already have a mid rail. |
| `top_railheads` / SKU picker | Finials on the top rail | Quote-only (CA-17). Engine overlay API exists; Design deliberately does not call it. |
| `dog_bar_railheads` | Second decorative row | Not in `OPTION_GROUPS`; quote metadata. |
| Motor on sliding packs | Manual vs automatic drawing | **Flat packs** (`tracked`, `cantilever`, `telescopic`, `radius`): one SVG for both. Copy said the handle appears on manual preview. Handle overlay is **always empty**. |
| Motor on swing / bifold | Drawing swaps | Works when `{slug}_motorised.svg` exists (complete on double/single swing). |
| Collar `every_2` | Spacing variant | `CollarChooserSection` is **not mounted**. Toggle always stores `every_1`. |
| Overlay fallback cells | Baked combo | Tipology master + generic circle/collar overlay (not gate-specific CAD). |

---

## 3. Combination matrix vs files we already have

Victorian expected cells: 4 tipologies × 4 decorations + composite = 17. Motor-split packs ×2 = 34.

| Pack | Policy | Present | Missing baked cells (overlay fallback) |
|------|--------|--------:|----------------------------------------|
| `double_swing` | motor-split | 34 | none |
| `single_swing` | motor-split | 34 | none |
| `cantilever_sliding` | flat | 17 | none |
| `single_bifolding` | motor-split | 32 | `dog_bars_collar_1_motorised`, `arched_dog_bars_circles_collar_1_motorised` |
| `bifolding_double_swing` | motor-split | 31 | `arched_dog_bars_circles_motorised`, `arched_dog_bars_collar_1`, `arched_dog_bars_collar_1_motorised` |
| `tracked_sliding` | flat | 15 | `base_circles`, `arched_circles` |
| `radius_sliding` | flat | 15 | `arched_collar_1`, `dog_bars_collar_1` |
| `telescopic_sliding` | flat | 10 | 7 cells (worst pack) |

Audit lock (2026-08-13): `tipology_drift === 0`. A missing deco cell **must not** steal another tipology (the historical P0: dog bars + collar resolving to `base_collar_1`). That is still true. Overlay fallbacks are honest-but-ugly, not wrong-shape.

Stale docs still say “5 silhouettes” / “others `base_only`”. Runtime is 10–34 files per pack. Treat `docs/frontend/2d-masters/README.md` and `catalog.json` as outdated.

---

## 4. Dual CAD stacks (silent drift)

Two 2D geometries exist in `packages/gate-engine`:

1. **`rendering.ts` live plan** — used by quote PDF, installation (removed from UI), tests that look for `rect#swing-frame`.
2. **`rendering/cad-base-elevation.ts`** — used to **export** Figma masters. `middleBar = true` always. Circles/collars are not first-class here; they were drawn into baked SVGs or composited as overlays later.

Playwright still expects live CAD (`getSwingFrameStroke`, Bronze / Pearl white). The product finish catalogue is black satin/matt/gloss + RAL 7016 + other RAL. Those e2e cases are **testing a renderer the Design UI no longer mounts**.

---

## 5. What this change does (2D first, reversible)

Keep Design = official masters. Make the first screen tell the truth and actually swap the files we already have.

1. **Gate shape picker** (`TipologyPicker`) on Choose and Refine. `applyVictorianTipology` preserves size, finish, motor, circles, collars.
2. **Hero + type cards** use `/2d-masters/.../silhouettes/*.svg`, not marketing photos.
3. **`?gate=` applied once** so marketing deep links cannot reset a later type change.
4. **Type sheet closes** after commit.
5. **Honesty copy** for finish, motor-on-sliding, middle bar, railheads, overlay fallback.
6. **Engine contract** `describeDesignPreview(config)` — single map of selected → drawn / overlay / quote-only. Tests lock tipology swaps including motorised twins.

This is not the full migration. It is the reliability floor so a customer can change mechanism and Victorian shape and **see it**.

---

## 6. Remaining 2D work (do this before skipping masters)

Ordered by customer-visible mismatch, not by file count.

### P1 — make every visible control either draw or leave the first screen

1. ~~**Fill the 16 missing baked cells**~~ (telescopic first). Generated from tipology SVG + overlay references; `pnpm sync:2d-masters` rebuilt the index.
2. ~~**Mount `CollarChooserSection`**~~ (`every_1` / `every_2`) when collars are on.
3. ~~**Stop offering `middle_bar` as a visual toggle**~~ — hidden from Design; still priced in the engine/quote.
4. ~~**Motor badge**~~ on flat sliding masters (“Manual recorded” / “Motorised recorded”).
5. ~~**Repair Playwright**~~ to assert master `img[src]` slug changes (arch, dog bars, type) instead of `rect#swing-frame` / Bronze.

### P2 — one drawing from Design to quote

6. Quote PDF currently calls `buildGateRenderPlan`. Until live CAD is the customer preview, **embed the same master PNG/SVG** the customer saw (`resolveSilhouette` + overlays), plus the mm strip. Stop surprising Marius with a different elevation in the PDF.
7. Refresh `docs/frontend/2d-masters/README.md`, `catalog.json`, `PHASE_MOTOR_MANUAL.md` (first-match wording is false; resolver is specificity scoring).

### P3 — do not expand the matrix further

Do not add railhead SKUs onto Design (CA-17 still holds). Do not bake `middle_bar` off/on into 34 extra files. Those belong in the parametric renderer, not in another combinatorial explosion.

---

## 7. Migration plan — skip the 2D matrix as runtime source of truth

“Salto del configuratore 2D” here means: **keep a 2D customer surface**, stop using a file-per-combo lookup as the thing that must be true for every click.

ADR 002 stays: 2D-first, 3D/AR on demand. We do **not** skip 2D for 3D. We skip **static masters as the only runtime renderer**.

### Target architecture

```
GateConfig
  ├─ validate / price / quote     (unchanged, gate-engine)
  ├─ Design preview (customer)    live CAD: buildGateRenderPlan
  │                                 viewMode: installation (finish) or technical (line-art)
  ├─ Official master (workshop)   resolveSilhouette — side-by-side or PDF plate
  └─ Visual QA                     existing SVG packs as golden snapshots
```

One `GateConfig` continues to drive price, share, PDF, mesh. Preview is a **function of config**, not a filename.

### What we already have (do not redraw)

| Asset | Path | Reuse as |
|-------|------|----------|
| Definitive SVG packs (204 silhouettes) | `docs/frontend/2d-masters/{type}/silhouettes/` + `apps/web/public/2d-masters/` | Golden files / art direction / workshop plate + quote PDF |
| Overlay SVGs | `public/2d-masters/overlays/{circles,collar}/` | Temporary until CAD draws circles/collars natively |
| Railhead SVGs | `public/2d-masters/railheads/` | Quote picker + later CAD finials |
| Lookup builder | `scripts/lib/silhouette-lookup.mjs` | Keep for QA: “does CAD match this slug?” |
| `silhouette-index.json` | `packages/gate-engine/src/silhouettes/` | Regression index, not the customer renderer |
| `cad-base-elevation.ts` | engine | Start point for live Design (fix `middleBar = true`) |
| `rendering.ts` live plan | engine | Finish-aware drawing already used in PDF |
| Photo audits / ARCHITECT_GAP_LOCK | `docs/frontend/gate-audits/`, `ARCHITECT_GAP_LOCK.md` | Topology lock while CAD is promoted |
| Mesh / AR | `packages/gate-engine/src/mesh` | Unchanged on-demand path |

### Migration slices (reversible)

**Slice A — honesty + first-screen shape (shipped).** Masters remain primary. Customer can change type and Victorian shape and see it.

**P1 — matrix + collar + PDF + e2e (this change).**  
16 missing every_1 cells are baked from tipology SVG + official overlays. Collar chooser is on Refine. Quote PDF embeds the same Design master (PNG via resvg), not a separate CAD elevation. Playwright asserts master slugs, not live-CAD `swing-frame` / Bronze. Sliding packs show a Manual/Motorised recorded badge. Middle bar is quote-only (no Design toggle).

**Slice B — live CAD behind a Design tab, masters remain default.** Shipped, then inverted in Slice C.

**Client visual lock (this change).**  
The official 2D master SVGs are the customer Design drawing — that is the art the client approved. Menu changes (`resolveSilhouette` + overlay fallback) swap the matching file immediately. Quote PDF embeds the same master PNG. Live CAD remains in the engine for goldens / schematic, not the customer preview.

**Slice C — live CAD as customer preview** was tried, then reverted: the parametric CAD is not the client-approved visual.

**Slice D — CAD goldens remain** for engine regression, not the customer drawing.

**Slice E — overlay fallbacks** stay for collar `every_2` until those cells are baked. Do not invent CAD on Design.

### What not to do

- Do not start a third renderer (canvas/WebGL 2D) while CAD + masters both exist.
- Do not encode finish into 5× copies of every master.
- Do not morph official masters with CSS filters as a “colour preview” — it fights line-art and still will not scale millimetres.
- Do not carry options across mechanism change without an explicit “keep shape” control; presets exist because telescopic ≠ swing geometry.

### Safety / “configuratore sicuro”

Secure here means **the drawing is a pure function of `GateConfig`**, fail-closed, no invented product:

- Validation stays in `gate-engine` (not duplicated in UI).
- If CAD cannot represent a combo, show the same fail-closed state masters use today — never a wrong tipology.
- Quote, share token, and PDF hash the same serialized config.
- Overlay fallback, quote-only railheads, and schematic fidelity badges stay visible until Slice C.

---

## 8. How to proceed from here

1. ~~P1 missing cells + collar chooser + e2e rewrite~~ — done (204 baked silhouettes; overlay fallback only for collar `every_2`).
2. **Customer Design = official 2D masters.** Menu swaps those files immediately. Quote PDF matches Design.
3. Live CAD stays in the engine (goldens / schematic). It is not the customer drawing.
4. Railhead SKUs remain quote-only (CA-17). Overlay compositing stays for collar `every_2`.
