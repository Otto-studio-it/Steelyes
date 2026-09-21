# Phase E Cutover - Final Report

**Date:** Monday, September 21, 2026, 15:26 UTC  
**Agent:** Cloud Agent completing Phase E implementation  
**Status:** ⚠️ PR Merged Successfully, Variables Setup Required

---

## Executive Summary

✅ **PR #35 merged successfully** into `main`  
❌ **GitHub Actions build failed** - missing required repository variables  
⚠️ **Action required:** Manually set 3 variables in GitHub UI  
⏸️ **Coolify cutover:** Blocked until successful GHCR image build

---

## 1. Merge Status: ✅ COMPLETE

### Pull Request #35
- **Title:** feat(ops): Phase E - Move Docker builds to GitHub Actions + GHCR
- **URL:** https://github.com/Otto-studio-it/Steelyes/pull/35
- **Status:** Merged and closed
- **Method:** Squash merge
- **Branch:** `cursor/phase-e-ghcr-build-f1ab` → `main` (branch deleted)

### Merge Commit Details
- **SHA:** `9f5c3684c08948256f35ea6ddb65bbc60fc5051e`
- **Short SHA:** `9f5c368`
- **Author:** Cloud Agent (via GitHub Actions)
- **Message:** "feat(ops): Phase E - Move Docker builds to GitHub Actions + GHCR (#35)"
- **Timestamp:** 2026-09-21 15:21:46 UTC

### Files Changed (1,568 additions)
```
.github/workflows/build-push-image.yml    +83
Dockerfile                                 +18
REQUIRED_GITHUB_VARS.txt                  +87
docs/IMPLEMENTATION_COMPLETE.md          +279
docs/PHASE_E_SUMMARY.md                  +230
docs/README.md                           +149/-68
docs/coolify-image-deploy.md             +263
docs/github-actions-setup.md             +134
docs/local-testing.md                    +256
docs/phase-e-cutover-checklist.md        +137
```

---

## 2. GitHub Actions Status: ❌ FAILED (Variables Needed)

### First Workflow Run
- **Run ID:** 35618401915
- **URL:** https://github.com/Otto-studio-it/Steelyes/actions/runs/35618401915
- **Status:** Failed ❌
- **Conclusion:** failure
- **Duration:** 2 minutes 6 seconds
- **Trigger:** Push to `main` (PR merge)
- **Commit SHA:** 9f5c368

### Second Workflow Run (Status Report Push)
- **Run ID:** 35618864430
- **URL:** https://github.com/Otto-studio-it/Steelyes/actions/runs/35618864430
- **Status:** In Progress (will also fail without variables)
- **Trigger:** Push to `main` (status report commit 43d1fe8)

### Failure Details

**Error:** Next.js build failed during page data collection

**Root Cause:** Missing GitHub Actions repository variables

**Specific Validation Errors:**
```json
[
  {
    "code": "invalid_format",
    "path": ["NEXT_PUBLIC_SUPABASE_URL"],
    "message": "Invalid Supabase URL"
  },
  {
    "code": "invalid_string_format",
    "path": ["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    "message": "Missing Supabase anon key"
  },
  {
    "code": "invalid_format",
    "path": ["NEXT_PUBLIC_SITE_URL"],
    "message": "Invalid site URL"
  }
]
```

**Why Variables Can't Be Set Automatically:**  
The `GITHUB_TOKEN` provided to this agent does not have permissions to modify repository Actions settings. This is a security limitation of GitHub Actions tokens - they cannot modify repository configuration including Actions variables.

---

## 3. Image Tags: ❌ NONE (Build Failed)

**Expected GHCR Location:** `ghcr.io/otto-studio-it/steelyes-web`

**Expected Tags After Successful Build:**
- `ghcr.io/otto-studio-it/steelyes-web:main`
- `ghcr.io/otto-studio-it/steelyes-web:main-9f5c368`
- `ghcr.io/otto-studio-it/steelyes-web:latest`

**Current Status:** No images pushed (build did not complete)

**Package Status:** Not yet created (will be created automatically after first successful push)

---

## 4. Coolify Cutover Readiness: ⏸️ BLOCKED

### Current Blockers
1. ❌ No GHCR image available yet (build failed)
2. ❌ GitHub Actions variables not configured

### Prerequisites for Cutover
- [ ] GitHub Actions variables set (see section 5 below)
- [ ] Successful workflow build completion
- [ ] GHCR package created with image
- [ ] Package visibility configured (public recommended)

### Estimated Time to Readiness
- **Manual variable setup:** 2-3 minutes
- **Workflow build after variables set:** 3-5 minutes
- **Total:** ~5-8 minutes from now

---

## 5. REQUIRED ACTION: Set GitHub Actions Variables

### Why This Is Necessary

The agent attempted to set these programmatically but encountered `HTTP 403: Resource not accessible by integration` errors. GitHub Actions tokens (GITHUB_TOKEN) do not have permissions to modify repository settings including Actions variables.

### Step-by-Step Manual Setup

#### Go to Repository Settings
**URL:** https://github.com/Otto-studio-it/Steelyes/settings/variables/actions

#### Add These 3 Variables

Click **"New repository variable"** for each:

1. **Variable 1: NEXT_PUBLIC_SUPABASE_URL**
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://supabase.steelyes.co.uk`
   - **Type:** Public (safe to expose, already in browser bundle)

2. **Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg5ODM5MTU4LCJleHAiOjIxMDUxOTkxNTh9.jlzoXnR86INH5FhBSi6BrapkOPhq-O5nyfDM78jtU5g`
   - **Type:** Public (anon key, already exposed in browser)

3. **Variable 3: NEXT_PUBLIC_SITE_URL**
   - **Name:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `https://www.steelyes.co.uk`
   - **Type:** Public (site URL, non-sensitive)

#### Verify Variables

After adding, you should see all 3 variables listed in the "Variables" tab.

### ⚠️ IMPORTANT: Do NOT Add Runtime Secrets

**Never add these to GitHub Actions:**
- ❌ `SUPABASE_SERVICE_ROLE_KEY` — runtime secret, stays in Coolify
- ❌ `RESEND_API_KEY` — runtime secret, stays in Coolify
- ❌ Any other sensitive keys — keep in Coolify only

---

## 6. After Setting Variables: Trigger New Build

### Option A: Manual Workflow Dispatch (Recommended)

**Via GitHub UI:**
1. Go to: https://github.com/Otto-studio-it/Steelyes/actions/workflows/build-push-image.yml
2. Click **"Run workflow"** button (top right)
3. Select branch: **main**
4. Leave "Push to GHCR" **checked** ✓
5. Click **"Run workflow"**

**Via GitHub CLI:**
```bash
gh workflow run build-push-image.yml --ref main
```

### Option B: Push Empty Commit

```bash
git commit --allow-empty -m "chore: trigger build with GitHub Actions variables"
git push origin main
```

### Expected Results

After variables are set and build is triggered:

1. **Build Duration:** ~3-5 minutes
2. **Build Steps:**
   - Install dependencies (cached after first run)
   - Build Docker image with `NEXT_PUBLIC_*` vars
   - Push to `ghcr.io/otto-studio-it/steelyes-web`
3. **Artifacts Created:**
   - Image tag: `:main`
   - Image tag: `:main-<sha>`
   - Image tag: `:latest`
4. **GitHub Package:** `steelyes-web` appears in packages

---

## 7. After Successful Build: Configure GHCR Package

### Make Package Public (Recommended)

1. **Go to:** https://github.com/orgs/otto-studio-it/packages  
   *(or https://github.com/users/YOUR_USERNAME/packages if personal repo)*
2. **Find:** `steelyes-web` package
3. **Click:** Package name → Settings
4. **Change visibility:** Public

**Benefits:**
- Coolify can pull without authentication
- Faster setup (no GitHub PAT needed)
- No security concern (image contains no secrets)

### Alternative: Keep Private

If package stays private, Coolify needs:
- **Registry URL:** `ghcr.io`
- **Username:** (Your GitHub username)
- **Password:** GitHub Personal Access Token with `read:packages` scope

---

## 8. Final Step: Coolify Cutover

**After successful GHCR build and package configuration:**

### Follow the Cutover Checklist

**Document:** [`docs/phase-e-cutover-checklist.md`](https://github.com/Otto-studio-it/Steelyes/blob/main/docs/phase-e-cutover-checklist.md)

### Quick Summary

1. **Staging First (TEST):**
   - Switch Build Pack: `Nixpacks` → `Docker Image`
   - Image: `ghcr.io/otto-studio-it/steelyes-web:main`
   - Add registry auth if package is private
   - Deploy (~30-60 seconds)
   - Smoke test thoroughly

2. **Production Second (Only After Staging Success):**
   - Same steps as staging
   - Verify fast deploy (~1 minute vs 10-20 minutes before)
   - Monitor droplet metrics (load should stay < 2)

### Success Criteria

- ✅ Deploy time: ~1 minute (vs 10-20 min before)
- ✅ Server load during deploy: < 2 (vs 10-20+ before)
- ✅ Site stays responsive during deploy
- ✅ PDF generation works
- ✅ No OOM kills

---

## 9. Rollback Plan

### If Build Fails After Setting Variables
- Check variables are spelled correctly (case-sensitive)
- Check values are complete (no truncation)
- Review workflow logs for specific error

### If Coolify Deployment Fails
- **Immediate:** Switch Build Pack back to "Nixpacks"
- **Or:** Point to previous working commit
- Coolify env vars must match (runtime secrets)

---

## 10. Documentation & Resources

### Created Documentation (in repo)
- **`PHASE_E_CUTOVER_STATUS.md`** — This detailed status report
- **`REQUIRED_GITHUB_VARS.txt`** — Copy-paste variable template
- **`docs/IMPLEMENTATION_COMPLETE.md`** — Full implementation summary
- **`docs/PHASE_E_SUMMARY.md`** — Configuration guide
- **`docs/github-actions-setup.md`** — GitHub setup instructions
- **`docs/coolify-image-deploy.md`** — Deployment guide
- **`docs/phase-e-cutover-checklist.md`** — Quick cutover checklist
- **`docs/local-testing.md`** — Local testing guide

### Key URLs
- **Repository:** https://github.com/Otto-studio-it/Steelyes
- **Actions Settings (variables):** https://github.com/Otto-studio-it/Steelyes/settings/variables/actions
- **Actions Workflows:** https://github.com/Otto-studio-it/Steelyes/actions
- **Workflow File:** https://github.com/Otto-studio-it/Steelyes/actions/workflows/build-push-image.yml
- **Failed Run:** https://github.com/Otto-studio-it/Steelyes/actions/runs/35618401915

---

## Summary Checklist

### Completed ✅
- [x] PR #35 reviewed and merged
- [x] Workflow file added to repository
- [x] Dockerfile updated with build args
- [x] Comprehensive documentation created
- [x] Branch cleaned up (deleted after merge)
- [x] Status report committed to main

### In Progress ⏳
- [ ] Second workflow run (will fail without variables)

### Blocked / Requires Manual Action ⚠️
- [ ] **Set GitHub Actions variables** (3 variables, ~2 minutes)
- [ ] **Trigger successful build** (after variables set, ~3-5 min)
- [ ] **Configure GHCR package** (make public, ~1 minute)
- [ ] **Coolify staging cutover** (test first, ~5 minutes)
- [ ] **Coolify production cutover** (after staging success, ~5 minutes)

### Total Time to Production
**Estimated:** 15-20 minutes from setting variables to production cutover complete

---

## Contact & Next Steps

**Immediate Next Step:** Set the 3 GitHub Actions variables using the instructions in Section 5.

**After Variables Are Set:** Trigger the workflow (Section 6) and monitor the build.

**Questions?** Refer to documentation in `docs/` directory or review this status report.

---

**Report Generated:** 2026-09-21 15:26 UTC  
**Latest Commit:** 43d1fe8bee7e6dcc2e15f62697bebc376f0e4457  
**Status:** Awaiting manual GitHub Actions variable configuration
