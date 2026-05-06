# DB Closure Plan

**Project:** Steelyes
**Scope:** Supabase staging DB and pricing catalogue readiness
**Created:** 2026-05-05
**Status:** Open

This document lists the phases still required to close the database work. It separates technical DB closure from business/pricing closure because the schema can become production-ready before all client-confirmed catalogue data arrives.

---

## Phase 1 — Clean Git noise before new DB work

**Goal:** make sure the next DB commit contains only intentional files.

- [ ] Review current uncommitted changes.
- [ ] Keep the `.gitignore` rules for generated local artifacts:
  - `apps/web/playwright-report/`
  - `apps/web/test-results/`
  - `supabase/.temp/`
  - macOS `._*` files
- [ ] Remove already-tracked generated/macOS files from the Git index without deleting local copies.
- [ ] Commit this cleanup separately from DB logic if possible.
- [ ] Confirm whether staged admin UI changes are part of the next commit or should be committed separately.
- [ ] Start the DB fix from a clean or clearly understood working tree.

**Reason:** `.gitignore` only prevents new ignored files from being tracked. It does not stop Git from showing changes to files that are already tracked. The repository currently contains tracked AppleDouble files, Playwright output, and Supabase CLI cache files, so these need to be removed from the index before DB work continues.

---


## Phase 2 — Fix blocking RLS bugs

**Status:** Complete on staging for the Phase 2 scope. Policy closure was applied and verified via MCP; grant closure was applied via Supabase CLI and the remote database is up to date.

**Goal:** remove the three production-blocking DB issues documented in `STAGING_DB_BASELINE_2026-05-04.md`.

The policy closure migration is:

```text
supabase/migrations/20260505154435_fix_pricing_rls_closure.sql
```

It includes:

- [x] `gates_admin_insert`
  - Admin users must be able to create gate catalogue rows.
- [x] `gates_admin_delete`
  - Admin users must be able to remove gate catalogue rows when needed.
- [x] `gate_options_admin_delete`
  - Admin users must be able to remove option rows.
- [x] `configurations_anon_select`
  - Public share links must be able to read saved configurations after anonymous insert.
- [x] Drop the duplicate typo policy on `service_zones`:

```sql
DROP POLICY "service.
_zones_anon_select" ON public.service_zones;
```

The grant closure migration is:

```text
supabase/migrations/20260505160000_fix_pricing_rls_grants.sql
```

It includes:

- [x] Table grants required by the new admin operations:
  - `GRANT INSERT, DELETE ON public.gates TO authenticated, service_role;`
  - `GRANT DELETE ON public.gate_options TO authenticated, service_role;`

**Closure condition:** BUG-1, BUG-2, BUG-3, and BUG-4 from the staging baseline are fixed, and the required `gates` / `gate_options` grants are present on staging.

**Reason:** RLS policies are not enough on their own when table privileges are missing. `service_role` bypasses RLS, but it still needs the relevant table grants.

**Evidence:**

- MCP baseline check confirmed the 4 target policies were absent before apply.
- MCP baseline check confirmed the duplicate typo `service_zones` policy was present before apply.
- MCP post-apply check confirmed the 4 target policies exist.
- MCP post-apply check confirmed only `service_zones_anon_select` remains.
- Supabase CLI dry-run detected `20260505160000_fix_pricing_rls_grants.sql` as the only pending migration.
- Supabase CLI applied `20260505160000_fix_pricing_rls_grants.sql` to staging.
- Supabase CLI follow-up dry-run returned `Remote database is up to date.`

---

## Phase 3 — Verify quote request grants

**Goal:** confirm the admin quote workflow can read and update quote requests.

- [x] Run a direct SQL/API check against staging before adding any grant.
- [x] Test whether service-role admin code can `SELECT` from `quote_requests`.
- [x] Test whether service-role admin code can `UPDATE` quote request status/admin notes.
- [x] If either operation fails, add:

```sql
GRANT SELECT, UPDATE ON public.quote_requests TO service_role;
```

**Method:** use a direct Supabase SQL check or equivalent DB/API verification first. Playwright should verify the app workflow later, but it is not the fastest way to isolate grant behavior.

**Reason:** the baseline notes `quote_requests` currently has only `INSERT` grant for `service_role`. That may block the future admin requests dashboard, but grants should not be added speculatively if the current service-role path already works.

**Verified on staging (2026-05-05):** service_role was missing `SELECT` and `UPDATE` on `public.quote_requests`, so migration `20260505161000_quote_requests_service_role_grants.sql` was applied. Post-apply check confirmed `anon` and `authenticated` still have no read/update grants, while `service_role` has `SELECT` + `UPDATE`.

---

## Phase 4 — Decide admin audit access model

**Status:** Closed — Option A selected.

**Goal:** choose the intended access path for `admin_audit`.

**Decision:** keep `admin_audit` readable only through server-side service-role code. No RLS policy added. No change to existing grants.

Decision outcome:

- [x] Option A: keep `admin_audit` readable only through server-side service-role code.
- [ ] Option B: add read-only RLS policy for authenticated admins.
  - Rejected for now: unnecessary client-side surface, no current app use case.

**Reason:** `admin_audit` is sensitive. Server-side service-role access keeps the public client surface smaller.

**Evidence (verified on staging 2026-05-05):**

- `admin_audit` has RLS enabled with zero policies.
- DML grants for `admin_audit` are limited to `service_role`: `SELECT`, `INSERT`.
- App code does not read `admin_audit` today outside generated database types.
- Future audit-log UI should read through server-side `getServiceRoleClient()`.
- Note: Phase 5 verification later detected non-DML privileges (`TRIGGER`, `TRUNCATE`, `REFERENCES`) present for `anon` and `authenticated` on `admin_audit`. This does not enable reads due to RLS/no SELECT, but it violates the stricter “no grants at all” expectation and should be cleaned up.

---

## Phase 5 — Run direct RLS and behavior verification

**Goal:** prove the DB behaves correctly by role after the migration.

**Method:** use direct Supabase SQL/API checks for policy behavior. These checks are faster and more precise than browser tests for RLS because they isolate database authorization from UI behavior.

Verify `anon`:

- [ ] Can `SELECT` public catalogue tables:
  - `gates`
  - `gate_options`
  - `fencing_panels`
  - `service_zones`
- [ ] Can `INSERT` `configurations`.
- [ ] Can `SELECT` saved `configurations` required by share links.
- [ ] Can `INSERT` `quote_requests`.
- [ ] Cannot update/delete catalogue or admin tables.
- [ ] Cannot read `quote_requests`.

Verify authenticated non-admin:

- [ ] Can read public catalogue data.
- [ ] Cannot perform admin writes.

Verify authenticated admin:

- [ ] Can `INSERT`, `UPDATE`, and `DELETE` `gates`.
- [ ] Can `INSERT`, `UPDATE`, and `DELETE` `gate_options`.
- [ ] Can `INSERT`, `UPDATE`, and `DELETE` `fencing_panels`.

Verify service-role:

- [ ] Can perform required server-side admin operations.
- [ ] Can insert audit rows.
- [ ] Can read/update quote requests if the admin dashboard requires it.

**Closure condition:** all expected role checks pass against staging.

**Status (2026-05-05):** NOT COMPLETE — Phase 5 inventory checks found mismatches that need follow-up documentation and fixes:

- `admin_audit`: `anon` and `authenticated` have unexpected non-DML privileges (`TRIGGER`, `TRUNCATE`, `REFERENCES`).
- `gates`: `anon` has `UPDATE` table grant (RLS blocks without an UPDATE policy, but the grant is broader than intended).
- `gate_options`: `anon` has `INSERT` and `UPDATE` table grants (RLS blocks these writes, but the grants are broader than intended).
- `fencing_panels`: `anon` has `INSERT` and `UPDATE` table grants (RLS blocks these writes, but the grants are broader than intended).
- `service_zones`: docs/expected sample query used a non-existent `zone_name` column; the table currently has `postcode_prefix` + `surcharge` only.

---

## Phase 6 — App-level regression tests

**Goal:** confirm the app still works after DB policy changes.

**Method:** use Playwright and normal app commands. These tests prove the user/admin workflows, not the individual SQL policies.

**Status:** Complete — 2026-05-05

**Evidence:**
- Typecheck: passed (zero errors).
- Lint: passed (zero errors).
- Build: passed (21 pages, zero errors).
- Playwright: 6/6 passed, zero skip (24.1s).
- Manual routing smoke: `/admin` → 307, `/admin/login` → 200, `/admin/gates` → 307 (protected). This verifies route protection, not post-login catalogue rendering.
- Share-link E2E: pending — no public `/configurator/[id]` route exists yet. `configurations` table not referenced outside admin or types. Will be added when route is implemented.

- [x] Run typecheck.
- [x] Run lint.
- [x] Run build.
- [x] Run admin CRUD E2E (6/6, zero skip).
- [x] Manually verify `/admin` routing against staging-backed local app.
- [ ] Share-link E2E: pending — public configuration share route not yet implemented.

**Reason:** RLS fixes are only complete when both SQL behavior and app workflows pass.

---

## Phase 7 — Update generated types if needed

**Goal:** keep TypeScript DB types aligned with Supabase.

- [x] Check whether the migration changes schema shape.
- [x] If only policies/grants changed, no type regeneration should be needed.
- [x] Regenerate `apps/web/src/types/database.types.ts` if generated type shape differs from staging.

**Reason:** RLS policies do not usually affect generated types. Avoid noisy type diffs unless schema changed.

**Status:** Complete — 2026-05-06

**Decision:** types regenerated.

**Evidence:**
- Phase 2+3 migrations contain only POLICY and GRANT DDL. No tables, columns, enums, relationships, or functions were changed by those phases.
- `supabase gen types typescript --linked --schema public` output was generated to `/tmp/steelyes-database.types.ts`.
- `diff -u apps/web/src/types/database.types.ts /tmp/steelyes-database.types.ts`: non-empty.
- Most differences were property ordering/formatting from the current Supabase CLI output.
- One semantic generated-type difference was found: `gates.Insert.name` is optional in staging-generated types because `public.gates.name` has a database default.
- `apps/web/src/types/database.types.ts` was regenerated from staging via Supabase CLI.
- Typecheck after regeneration: `cd apps/web && pnpm typecheck` passed (zero errors).

---

## Phase 8 — Update DB documentation

**Goal:** make the docs match the verified DB state.

**Status:** Complete — 2026-05-06

**Evidence:**
- `docs/db/STAGING_DB_BASELINE_2026-05-04.md` updated to reflect 17 aligned migrations.
- BUG-1, BUG-2, BUG-3, and BUG-4 marked resolved at DB/RLS layer.
- `quote_requests` service-role SELECT/UPDATE grant decision recorded.
- `admin_audit` Option A service-role-only decision recorded.
- Phase 6 app regression and Phase 7 generated-types regeneration recorded.
- Remaining open items preserved: Phase 5 grant hardening, share-link E2E pending, Phase 9 business data.

- [x] Update `docs/db/STAGING_DB_BASELINE_2026-05-04.md` after verification.
- [x] Mark BUG-1, BUG-2, BUG-3 as resolved.
- [x] Mark BUG-4 as resolved.
- [x] Record the final `quote_requests` grant decision.
- [x] Record the final `admin_audit` access decision.

**Decision:** documentation is current through Phase 8, but final technical DB closure remains open until §10 criteria are satisfied or explicitly revised.

**Reason:** the baseline must distinguish resolved DB/RLS bugs from remaining closure blockers. Phase 8 prevents stale "open bug" sections from contradicting later verified phases.

---

## Phase 9 — Business data still blocked on Marius

**Goal:** close pricing/catalogue completeness, separate from DB security correctness.

Still required from Marius:

- [ ] Confirm final gate base prices:
  - `base_price_manual_gbp`
  - `base_price_auto_gbp`
- [ ] Confirm option prices and multipliers.
- [ ] Confirm railhead variant list.
- [ ] Confirm railhead unit prices.
- [ ] Confirm railhead compatibility rules.
- [ ] Confirm finish palette.
- [ ] Confirm finish multipliers.
- [ ] Provide real `fencing_panels` catalogue data.

Do not create speculative railhead tables until the required data is received.

**Reason:** `RAILHEADS_TBD.md` explicitly states that first-class railhead schema is blocked on real catalogue data.

---

## Phase 10 — Final DB closure criteria

The DB can be considered technically closed when:

- [x] Local and remote migrations are aligned.
- [x] BUG-1, BUG-2, and BUG-3 are fixed.
- [x] BUG-4 is removed or explicitly accepted.
- [x] Required `gates` and `gate_options` admin grants are present on staging.
- [ ] RLS behavior is verified for anon, non-admin, admin, and service-role.
- [x] Admin CRUD workflows pass against staging.
- [ ] Share-link configuration read works.
- [x] `quote_requests` service-role behavior is verified.
- [x] `admin_audit` access model is decided and documented.
- [x] DB docs are updated after verification.

**Partial status after Phase 8:** most original DB/RLS closure bugs are resolved and documented, but final technical closure is still blocked by the open Phase 5 verification/hardening follow-ups and by the unimplemented share-link app route.

The DB can be considered business/pricing complete when:

- [ ] Marius confirms final prices.
- [ ] Marius confirms railheads.
- [ ] Marius confirms finish palette and multipliers.
- [ ] Marius confirms fencing panel catalogue data.
- [ ] Placeholder pricing copy is removed or intentionally kept as a signed-off fallback.

---

## Immediate next step

Proceed to Phase 9 business-data closure when Marius provides final catalogue inputs, or open a dedicated Phase 5 hardening follow-up for grant tightening if technical security hardening should be completed first.

Do not proceed to final DB technical closure until §10 criteria are either satisfied or explicitly revised. In particular:

- Phase 5 grant-broadness follow-ups remain open.
- Share-link E2E remains pending until a public configuration share route exists.
- Business/pricing completion remains blocked on Marius.
