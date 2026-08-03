---
title: Internal Changelog
description: Verified implementation log for project work
owner: Ruben
status: ACTIVE
last_updated: 2026-07-28
---

# Steelyes — Internal Changelog

This is an internal implementation log. It records what changed, how it was verified, and which commit contains the work.

It is not a public product changelog.

---

## 2026-08-03 — Email UX P0 + P1 (inbox classification, inbound auto-ack)

- P0 (`apps/web/src/lib/email/send.ts`): subject tags `[LEAD]` / `[PREVENTIVO]` / `[INTAKE]` + short ref code, explicit `replyTo` on all 6 templates, plain-text fallback, `internalEmailShell()` for ops-facing mail
- P1 (`scripts/gmail-inbox-autoack.gs`): Google Apps Script bound to the info@ Workspace mailbox — auto-acks genuine customer emails ("received, team is reviewing"), applies triage labels (Preventivo/Reclamo/Fattura/Garanzia/Generico), skips the site's own `[LEAD]`/`[PREVENTIVO]`/`[INTAKE]` notifications to avoid a self-reply loop. No DNS/MX change — Resend stays outbound-only.
- Found but not adopted: Resend SDK 6.12.3 (already in `node_modules`) supports native inbound receiving (`emails.receiving`, `email.received` webhook). Would let a future rebuild move inbound handling in-app, but requires moving MX off Google Workspace — deferred, flagged for a later decision.

---

## 2026-08-03 — P0 go-live: inbox, legal, Cookiebot, PostHog off

- Public/workshop email → `info@steelyes.co.uk`; Resend from aligned
- Removed legal draft banners; privacy/cookies/terms updated (Coolify + Cloudflare + Cookiebot)
- PostHog client/server stubbed no-op; removed from root layout
- Cookiebot script gated on `NEXT_PUBLIC_COOKIEBOT_ID` (fallback necessary-cookie banner)
- Desktop AR: copy phone links (no QR)
- Client sheet: `docs/frontend/GO_LIVE_LIMITATIONS.md`

---

- Public contact + workshop notification destination: `info@steelyes.co.uk` (replaces `sales@` / Gmail defaults)
- `BUSINESS.email`, tenant leads email, `WORKSHOP_EMAIL` default aligned
- Resend domain verified: default `RESEND_FROM=Steelyes <info@steelyes.co.uk>`; Coolify staging+prod env set

---

## 2026-08-03 — Phase A AR View in your space

Commit: _pending_

- CTA **View in your space** on configurator preview (all 8 gate types)
- Client export GLB + USDZ from `buildGateMeshPlan` at real mm→m scale
- Ephemeral `/api/ar/models` HTTPS handoff → Quick Look / Scene Viewer
- camera Permissions-Policy allows self for AR
- Radius sliding gets schematic articulated mesh segments; mesh `fidelity` flag
- Doc: `docs/frontend/2d-masters/PHASE_A_AR_VIEW_IN_SPACE.md`

---

## 2026-08-03 — CA-01 handle on Design masters + Quick Path limits

Commit: _pending_

- Design masters no longer bake leaf handles; overlay via `resolveHandleOverlay` only when `!motorised` (manual = handle, automatic = none)
- Quick Path opening uses `getDimensionLimits(gateType)` so width chips/custom stay valid per type
- Docs: Phase 3 handle note in CHANGELOG; masters stripped of `manual-handle-*`

---

## 2026-08-03 — Phase 3 masters as primary preview

Commit: _pending_

- Configurator default preview = Design (`technical` id) with preloaded 2D masters
- Tab order: Design → Installation; Installation remains for colour / fit
- Mobile Quick Path chip uses `resolveSilhouette` master thumbnail (no live-CAD fallback)
- Doc: `docs/frontend/2d-masters/PHASE3_MASTERS_PRIMARY.md`

---

## 2026-07-31 — Photo-guided CAD base elevations (2D masters)

Commit: _pending_

- Copied linea guida from `foto /` → `docs/frontend/2d-masters/{type}/references/`
- Topology notes: `docs/frontend/2d-masters/TOPOLOGY.md`
- Technical view uses `rendering/cad-base-elevation.ts` (CAD ink, posts hatch; live dims still overlay)

---

## 2026-07-31 — Configurator gate-first chrome + custom hex finish

Commit: _pending_

- Preview surround light/neutral so black/anthracite gates read first
- Spec chrome uses steel accents (primary red reserved for CTAs)
- `customFinishHex` on GateConfig + FinishPicker colour/hex for Other RAL
- Manual handle on swing + sliding; omitted when motorised (CA-01)

---

## 2026-07-31 — Per-type 2D elevation detail pass

Commit: _pending_

- `rendering/type-details-2d.ts`: tracked runback/guide/bottom box; cantilever carriage/foundation; telescopic motor-side + stack; radius leaf splits; bifold stack cues; swing ground clearance
- Telescopic panel count → **2** (intake supersedes CA-11 provisional 3); overlap band kept
- Notes + mesh segment count aligned

---

## 2026-07-31 — CA-13 intake PDF prices + ship defaults

Commit: _pending_

- Locked FROM prices + size uplift (£50/100mm H, £50/200mm W) from steelyes-intake-2026-07-26.pdf
- Ship inventions: railhead £12.50 mid, aluminium panel formula, per-type size limits
- All 8 gate types → configure; company/VAT in footer
- Ground clearance 50 mm; picket 100 mm; tracked +350 mm runback

---

## 2026-07-31 — CA-08…CA-12 dimension + missing gates

Commit: _pending_

Source: Ruben answers to FOLLOWUP_MISSING_GATES (product owner).

- Recorded `docs/client-answers/2026-07-31-ruben.md`
- Width = clear opening; height = ground→top rail (all types)
- Bifold 2 panels/leaf 50/50; collection on hinge side; L/R at quote
- Telescopic: provisional 3 panels later superseded by intake **2** (CA-13); overlap 80–120 (schematic 100), motor-side front
- Radius: travel always curved; top straight or curved
- All 8 types now configure (2) or schematic (6) — no enquire tier left

---

## 2026-07-30 — Bifold schematic honesty + missing-gates plan

Commit: _pending_

Changed:

- Plan: `docs/frontend/MISSING_GATES_BUILD_PLAN_2026-07-30.md`
- Marius outbound: `docs/client-answers/FOLLOWUP_MISSING_GATES_2026-07-30.md`
- Engine: `packages/gate-engine/src/rules/bifold.ts` — provisional 2 panels/leaf from catalog
- 2D: fold stiles + hinge ticks + notes/labels for bifold types
- 3D mesh: shared `isBifoldGate` / panel count; bifold note on mesh plan
- UI: bifold types `enquire` → `schematic`; `BifoldSchematicNote`; `?gate=` deep-link
- Marketing: bifold / single-bifold CTAs → configurator schematic

Still enquire: telescopic, radius.

---

## 2026-07-28 — Client answer batch CA-01…CA-07 recorded and propagated

Commit: _pending_

Changed — documentation only, no code touched:

- Created `docs/client-answers/` as the canonical verbatim record of client answers:
  - `README.md` — id scheme, confidence levels, protocol for the next batch;
  - `2026-07-28-marius.md` — batch CA-01…CA-07 with verbatim text, translation, normalized rule, downstream impact.
- Propagated the batch into every doc that carried the superseded data:
  - `docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md` — new "Confirmed Build Rules" and "Finishes / Colours" sections, aluminium panel upgrade, answered questions marked;
  - `docs/CLIENT_BLOCKERS.md` — finish palette and business email moved to received; finish rate base and aluminium count rule added as new blockers;
  - `docs/frontend/CLIENT_CHANGELOG.md` — CL-701…CL-708 triaged;
  - `docs/frontend/CONTENT_FALLBACKS.md` — retired the zinc-grey/bronze/pearl-white fallback palette;
  - `docs/db/PRICING_SEMANTICS.md` — finish charge and aluminium upgrade semantics, both explicitly not implementable yet;
  - `docs/frontend/gate-catalog/cantilever-sliding.md` — confirmed tail geometry;
  - `docs/CLIENT_INTAKE.md` — protocol for answers arriving outside the form;
  - `docs/PROJECT_STATUS.md` — business/pricing data moved to partially unblocked.

Why:

- Client answers were arriving as raw multilingual WhatsApp text and being pasted directly into feature docs, which destroyed the distinction between what Marius said and what we inferred from truncated messages.
- Two docs still carried finishes (`zinc grey`, `bronze`, `pearl white`) that the client has withdrawn, and a contact email (`steelyes@yahoo.com`) that is superseded.

Verified:

- 16 blocking intake questions before the batch, 13 after — `gate.cantilever.tail_ratio`, `gate.cantilever.width_meaning` and `open.finish_palette` are closed.
- Confirmed against the source that `packages/gate-engine/src/finishes.ts` and `FINISH_CODES` already match CA-03 (shipped in `b32cfb8`); no code change needed there.

Known-wrong code identified but **not** changed in this pass:

- `packages/gate-engine/src/rules/cantilever.ts` — `CANTILEVER_TAIL_RATIO_DEFAULT = 0.28` and the `widthMm === 4000` special case are superseded by CA-05. The rule is 1/3 at every width, as a minimum. Tracked as CL-705.
- `apps/web/src/lib/marketing/business.ts` — `email` is still the Yahoo placeholder. Tracked as CL-706.
- `apps/web/src/components/marketing/SocialLinks.tsx` — Facebook id differs from the one the client last sent, TikTok is absent. Tracked as CL-707.
- `apps/web/src/lib/client-intake/questions.ts` — the three closed answers are not mirrored back, so `/admin/client-data` still asks them. Tracked as CL-708.
- `apps/web/tests/e2e/configurator.spec.ts` — two finish tests click `Bronze` and `Pearl white` radios and assert the stroke `#8B6914`. `FinishPicker` renders from `listFinishDefinitions()`, which no longer contains those codes, so both tests fail on selector timeout. Broken since the palette change in `b32cfb8`, found while propagating CA-03. Tracked as CL-709.

---

## 2026-05-09 — Production auth repair and deployment reality check

Commit: `6515fb0 Fix admin auth session flow`

Changed:

- Added server-side admin login/logout flow in the Next app:
  - `apps/web/src/app/admin/auth-actions.ts`
  - `apps/web/src/app/admin/login/LoginForm.tsx`
  - `apps/web/src/components/admin/AdminHeader.tsx`
- Verified that staging and production are separate Supabase projects:
  - staging → `hgeksaulzomkgqnfuriu`
  - production → `reqgfvahdcbmbajjqtve`
- Investigated production auth directly against `steelyes-prod`.
- Repaired the broken production auth record for `steelyes755@gmail.com` in `auth.users` / `auth.identities`.
- Verified that password login now succeeds directly against `steelyes-prod`.
- Verified that the public domain still points to the legacy GoDaddy site, not the new Next/Vercel app.

Why:

- The admin login worked locally and against staging, but production login was still failing.
- The failure turned out not to be the form code alone:
  - the known production auth user record was internally inconsistent;
  - the public domain was not serving the new app at all.

Verified:

- Local production build passed.
- Local Playwright admin CRUD suite passed against the app build.
- `steelyes-prod` password login returned `200` after auth record repair.
- `auth.admin.listUsers()` on `steelyes-prod` returned the repaired user successfully after repair.
- `steelyes.co.uk` returned the legacy GoDaddy site.
- `steelyes.vercel.app` returned `DEPLOYMENT_NOT_FOUND`.

Result:

- Production Supabase Auth is repaired for the known admin account.
- The next real blocker is deployment/domain cutover, not DB auth.

---

## 2026-05-06 — Marketing site audit and parallel frontend plan

Commit: `docs: document marketing frontend work split`

Changed:

- Added `docs/frontend/MARKETING_SITE_AUDIT_2026-05-06.md`.
- Added `docs/frontend/FRONTEND_PARALLEL_WORK_PLAN.md`.
- Updated `docs/frontend/PAGE_INVENTORY.md` with current route status.
- Updated `docs/frontend/UI_CONTENT_PLAN.md` with missing Phase 1 route targets.
- Updated project docs to point to the new frontend coordination files.

Why:

- The project is ready to shift from DB/RLS closure to finishing the approved storefront.
- Multiple AI agents can work in parallel only if ownership boundaries are explicit.
- The current site has approved visual patterns, but several route directories are missing pages.

Result:

- Claude Code/Sonnet can own gate-detail pages.
- Cursor/Opus can own services and case-study index pages.
- Codex can supervise, review, run checks, and integrate shared navigation/footer changes.

---

## 2026-05-06 — Documentation operating layer

Commit: `docs: organize project documentation`

Changed:

- Added `docs/README.md` as the documentation entry point.
- Added `docs/PROJECT_STATUS.md` as the current project snapshot.
- Added `docs/NEXT_ACTION_PLAN.md` as the ordered execution plan.
- Added `docs/CHANGELOG_INTERNAL.md` as the internal verified work log.
- Added frontend planning docs:
  - `docs/frontend/UI_CONTENT_PLAN.md`;
  - `docs/frontend/CONTENT_FALLBACKS.md`;
  - `docs/frontend/PAGE_INVENTORY.md`.
- Updated `docs/CLIENT_BLOCKERS.md` to distinguish UI/content progress from business-data blockers.
- Marked `docs/phases/PHASE_0_ACTION_PLAN.md` as historical so it no longer conflicts with current status.
- Updated `docs/phases/README.md` to point readers to the current status and action plan first.

Why:

- The project is changing focus from DB/RLS closure to UI/content stabilization.
- The docs needed a clear entry point and separation between status, plan, blockers, fallback rules, and historical phase notes.

Result:

- A developer can now resume from `docs/README.md`, then read `PROJECT_STATUS.md` and `NEXT_ACTION_PLAN.md` without reconstructing context from DB-specific files.

---

## 2026-05-06 — Phase 5 DB grant hardening

Commit: `c07fd6c fix(db): harden Phase 5 grants`

Changed:

- Added `supabase/migrations/20260506120000_harden_phase5_grants.sql`.
- Added `supabase/migrations/20260506121000_harden_public_non_dml_grants.sql`.
- Applied both migrations to Supabase staging.
- Updated `docs/db/DB_CLOSURE_PLAN.md`.
- Updated `docs/db/STAGING_DB_BASELINE_2026-05-04.md`.

Why:

- RLS already blocked the dangerous operations, but table grants were broader than the intended access model.
- Production-facing security should be easy to reason about at both grant and RLS levels.

Verified:

- Dry-run detected each new migration as pending before apply.
- `supabase db push --linked` applied the first migration.
- Direct grant query found additional non-DML grants on other public app tables.
- Second migration removed those non-DML grants from `anon` and `authenticated`.
- Final `supabase db push --linked --dry-run` returned `Remote database is up to date`.
- Final targeted SQL check returned `unexpected_grant_count = 0`.

Result:

- Phase 5 is closed for DB/RLS and grant-hardening scope on staging.
- Final technical closure remains partial only because share-link app route is not implemented.
- Phase 9 remains blocked on Marius business data.

---

## 2026-05-06 — Phase 8 DB documentation refresh

Commit: `fa8ac8d docs(db): Phase 8 refresh staging baseline`

Changed:

- Updated staging DB baseline to match verified migration state at that time.
- Preserved remaining open items:
  - Phase 5 grant hardening;
  - share-link E2E pending;
  - Phase 9 business data.

Result:

- DB docs stopped reporting original RLS bugs as open after they had been fixed.

---

## 2026-05-06 — Generated database types refresh

Commit: `f2474e5 chore(types): regenerate database types for Phase 7`

Changed:

- Regenerated `apps/web/src/types/database.types.ts` from staging.

Verified:

- Typecheck passed after regeneration.

Result:

- TypeScript DB types match staging-generated shape.

---

## 2026-05-05 — App regression for DB/RLS closure

Commit: `6dffb45 docs(db): Phase 6 complete — app regression passed`

Verified:

- Typecheck passed.
- Lint passed.
- Build passed.
- Playwright admin CRUD passed 6/6.
- Manual admin route smoke recorded.

Result:

- App-level regression was closed for the recorded admin CRUD scope.
