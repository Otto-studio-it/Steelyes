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

**Evidence so far:**

- MCP baseline check confirmed the 4 target policies were absent before apply.
- MCP baseline check confirmed the duplicate typo `service_zones` policy was present before apply.
- MCP post-apply check confirmed the 4 target policies exist.
- MCP post-apply check confirmed only `service_zones_anon_select` remains.
- Supabase CLI dry-run detected `20260505160000_fix_pricing_rls_grants.sql` as the only pending migration.
- Supabase CLI applied `20260505160000_fix_pricing_rls_grants.sql` to staging.
- Supabase CLI follow-up dry-run returned `Remote database is up to date.`

**Remaining after Phase 2:**

- [ ] Optional direct SQL evidence capture for remote grants:

```sql
select table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('gates', 'gate_options')
  and grantee in ('authenticated', 'service_role')
  and privilege_type in ('INSERT', 'DELETE')
order by table_name, grantee, privilege_type;
```

Expected rows if verified directly:

```text
gate_options authenticated DELETE
gate_options service_role  DELETE
gates        authenticated DELETE
gates        authenticated INSERT
gates        service_role  DELETE
gates        service_role  INSERT
```

---

## Phase 3 — Verify quote request grants

**Goal:** confirm the admin quote workflow can read and update quote requests.

- [ ] Run a direct SQL/API check against staging before adding any grant.
- [ ] Test whether service-role admin code can `SELECT` from `quote_requests`.
- [ ] Test whether service-role admin code can `UPDATE` quote request status/admin notes.
- [ ] If either operation fails, add:

```sql
GRANT SELECT, UPDATE ON public.quote_requests TO service_role;
```

**Method:** use a direct Supabase SQL check or equivalent DB/API verification first. Playwright should verify the app workflow later, but it is not the fastest way to isolate grant behavior.

**Reason:** the baseline notes `quote_requests` currently has only `INSERT` grant for `service_role`. That may block the future admin requests dashboard, but grants should not be added speculatively if the current service-role path already works.

---

## Phase 4 — Decide admin audit access model

**Goal:** choose the intended access path for `admin_audit`.

Decision required:

- [ ] Option A: keep `admin_audit` readable only through server-side service-role code.
- [ ] Option B: add read-only RLS policy for authenticated admins.

Recommended default:

- [ ] Use Option A unless the UI needs direct Supabase client reads from authenticated admin sessions.

**Reason:** `admin_audit` is sensitive. Server-side service-role access keeps the public client surface smaller.

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

---

## Phase 6 — App-level regression tests

**Goal:** confirm the app still works after DB policy changes.

**Method:** use Playwright and normal app commands. These tests prove the user/admin workflows, not the individual SQL policies.

- [ ] Run typecheck.
- [ ] Run lint.
- [ ] Run build.
- [ ] Run admin CRUD E2E.
- [ ] Add or update an E2E test for saved configuration share-link read if the flow exists.
- [ ] Manually verify `/admin` login and catalogue pages against staging credentials.

**Reason:** RLS fixes are only complete when both SQL behavior and app workflows pass.

---

## Phase 7 — Update generated types if needed

**Goal:** keep TypeScript DB types aligned with Supabase.

- [ ] Check whether the migration changes schema shape.
- [ ] If only policies/grants changed, no type regeneration should be needed.
- [ ] If any table/column/enum changes are introduced, regenerate `apps/web/src/types/database.types.ts`.

**Reason:** RLS policies do not usually affect generated types. Avoid noisy type diffs unless schema changed.

---

## Phase 8 — Update DB documentation

**Goal:** make the docs match the verified DB state.

- [ ] Update `docs/db/STAGING_DB_BASELINE_2026-05-04.md` or create a new dated baseline after verification.
- [ ] Mark BUG-1, BUG-2, BUG-3 as resolved.
- [ ] Mark BUG-4 as resolved if the typo policy is dropped.
- [ ] Record the final `quote_requests` grant decision.
- [ ] Record the final `admin_audit` access decision.

**Reason:** the current baseline explicitly says `Staging DB: NON CHIUSO`. That statement must not remain stale after closure.

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

- [ ] Local and remote migrations are aligned.
- [ ] BUG-1, BUG-2, and BUG-3 are fixed.
- [ ] BUG-4 is removed or explicitly accepted.
- [ ] Required `gates` and `gate_options` admin grants are present on staging.
- [ ] RLS behavior is verified for anon, non-admin, admin, and service-role.
- [ ] Admin CRUD workflows pass against staging.
- [ ] Share-link configuration read works.
- [ ] `quote_requests` service-role behavior is verified.
- [ ] `admin_audit` access model is decided and documented.
- [ ] DB docs are updated after verification.

The DB can be considered business/pricing complete when:

- [ ] Marius confirms final prices.
- [ ] Marius confirms railheads.
- [ ] Marius confirms finish palette and multipliers.
- [ ] Marius confirms fencing panel catalogue data.
- [ ] Placeholder pricing copy is removed or intentionally kept as a signed-off fallback.

---

## Immediate next step

Apply the follow-up grant migration:

- table grants for `gates` insert/delete and `gate_options` delete

Then verify the grant rows on staging. After Phase 2 grants are confirmed, proceed to Phase 3 (`quote_requests` grants) and Phase 5 direct RLS behavior checks.
