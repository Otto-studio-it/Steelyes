# Phase E Cutover Status Report

**Date:** 2026-09-21 15:25 UTC  
**Status:** ⚠️ Partial Success - PR Merged, Build Failed (Variables Needed)

---

## ✅ Completed Actions

### 1. PR #35 Merged Successfully
- **Merge Commit:** `9f5c368`
- **Method:** Squash merge
- **Branch:** `cursor/phase-e-ghcr-build-f1ab` → `main` (deleted)
- **PR URL:** https://github.com/Otto-studio-it/Steelyes/pull/35
- **Files Changed:** 10 files, 1,568 insertions

### 2. Workflow Triggered Automatically
- **Workflow:** Build and Push Docker Image
- **Run ID:** 35618401915
- **Run URL:** https://github.com/Otto-studio-it/Steelyes/actions/runs/35618401915
- **Trigger:** Push to `main` (automatic after merge)

---

## ❌ Build Failed - Missing Environment Variables

### Error Details

**Build Status:** FAILED (exit code 1)  
**Duration:** 2m 6s  
**Failure Point:** Docker build step, during Next.js build

**Root Cause:** Missing required GitHub Actions repository variables

The Next.js build failed during the "collecting page data" phase for `/api/ar/models` because the environment validation in `apps/web/src/lib/env.ts` requires these variables at build time:

```
Error Details from logs:
[
  {
    "code": "invalid_format",
    "format": "url",
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
    "format": "url",
    "path": ["NEXT_PUBLIC_SITE_URL"],
    "message": "Invalid site URL"
  },
  {
    "expected": "string",
    "code": "invalid_type",
    "path": ["SUPABASE_SERVICE_ROLE_KEY"],
    "message": "Invalid input: expected string, received undefined"
  }
]
```

---

## 🔧 Required Action: Set GitHub Actions Variables Manually

### Why Manual Setup is Needed

The GitHub token used by this agent does not have permissions to set Actions variables programmatically. Variables must be set manually via the GitHub UI or with a Personal Access Token that has `repo` and `admin:repo_hook` permissions.

### Step-by-Step Instructions

#### 1. Navigate to Repository Settings
Go to: https://github.com/Otto-studio-it/Steelyes/settings/variables/actions

#### 2. Add Repository Variables

For each variable below, click **"New repository variable"**, enter the name and value, then click **"Add variable"**:

| Variable Name | Value (from uploaded file) | Required |
|---------------|----------------------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://supabase.steelyes.co.uk` | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg5ODM5MTU4LCJleHAiOjIxMDUxOTkxNTh9.jlzoXnR86INH5FhBSi6BrapkOPhq-O5nyfDM78jtU5g` | ✅ Yes |
| `NEXT_PUBLIC_SITE_URL` | `https://www.steelyes.co.uk` | ✅ Yes |

**Note:** Do NOT add `SUPABASE_SERVICE_ROLE_KEY` to GitHub Actions - this is a runtime secret and stays in Coolify only.

#### 3. Verify Variables Are Set

After adding all three variables, verify by clicking the "Variables" tab in the Actions settings page. You should see:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY  
- NEXT_PUBLIC_SITE_URL

---

## 🔄 After Setting Variables: Trigger New Build

### Option 1: Manual Workflow Dispatch (Recommended)

```bash
# Via GitHub UI:
1. Go to: https://github.com/Otto-studio-it/Steelyes/actions/workflows/build-push-image.yml
2. Click "Run workflow" button (top right)
3. Select branch: main
4. Leave "Push to GHCR" checked
5. Click "Run workflow"

# Via GitHub CLI (if available):
gh workflow run build-push-image.yml --ref main
```

### Option 2: Push Dummy Commit to Main

```bash
git commit --allow-empty -m "chore: trigger GitHub Actions build with variables"
git push origin main
```

### Expected Results After Variables Are Set

1. **Build succeeds** (~3-5 minutes)
2. **Images pushed to GHCR:**
   - `ghcr.io/otto-studio-it/steelyes-web:main`
   - `ghcr.io/otto-studio-it/steelyes-web:main-<sha>`
   - `ghcr.io/otto-studio-it/steelyes-web:latest`
3. **Package visible at:** https://github.com/orgs/otto-studio-it/packages

---

## 📦 GHCR Package Configuration

### After First Successful Build

1. **Go to:** https://github.com/orgs/otto-studio-it/packages (or your personal packages if not in org context)
2. **Find:** `steelyes-web` package
3. **Recommended:** Change visibility to **Public**
   - **Benefit:** Coolify can pull without authentication
   - **Security:** No secrets in image (only public NEXT_PUBLIC_* vars)
   - **How:** Package settings → Change visibility → Public

### If Keeping Package Private

Coolify will need GitHub registry authentication:
- **Registry URL:** `ghcr.io`
- **Username:** Your GitHub username
- **Password:** GitHub Personal Access Token with `read:packages` scope

---

## 🎯 Next Steps Summary

1. ✅ **Done:** PR merged to `main`
2. ⏳ **Now:** Manually set GitHub Actions variables (see instructions above)
3. ⏳ **Then:** Trigger new build (workflow dispatch or push)
4. ⏳ **Wait:** Build completes successfully (~3-5 min)
5. ⏳ **Optional:** Make GHCR package public
6. ⏳ **Finally:** Follow Coolify cutover checklist (`docs/phase-e-cutover-checklist.md`)

---

## 📊 Current Repository State

- **Latest commit on main:** 9f5c368
- **Workflow file:** `.github/workflows/build-push-image.yml` ✅ Present
- **Documentation:** `docs/` directory with full guides ✅ Present
- **Variables template:** `REQUIRED_GITHUB_VARS.txt` ✅ Present
- **GitHub Actions variables:** ❌ NOT SET YET (required action)

---

## 🔍 Monitoring & Verification

### After Setting Variables and Triggering Build

**Watch the workflow:**
```bash
# List recent runs
gh run list --workflow=build-push-image.yml --limit 5

# Watch specific run
gh run watch <run-id>

# View logs if failed
gh run view <run-id> --log
```

**Check for GHCR images:**
```bash
# Via GitHub CLI (after build succeeds)
gh api /orgs/otto-studio-it/packages/container/steelyes-web/versions

# Via browser
# Go to: https://github.com/orgs/otto-studio-it/packages
```

---

## ⚠️ Important Notes

### Runtime Secrets Stay in Coolify

These should **NEVER** be added to GitHub Actions:
- ❌ `SUPABASE_SERVICE_ROLE_KEY`
- ❌ `RESEND_API_KEY`
- ❌ `INBOX_INGEST_SECRET`
- ❌ `CRON_SECRET`
- ❌ Any other sensitive keys

**These remain in Coolify environment variables and are injected at container runtime.**

### Why SUPABASE_SERVICE_ROLE_KEY Failed in Build

The error mentioned `SUPABASE_SERVICE_ROLE_KEY` was undefined, but this is expected because:
1. It's a runtime-only secret
2. However, `env.ts` validates it at module load time
3. During build, Next.js loads API routes to collect static data
4. This triggers the validation, which fails

**Solution:** The workflow only passes `NEXT_PUBLIC_*` vars as build args. The service role key will be provided by Coolify at runtime.

---

## 📞 Support

- **Documentation:** See `docs/` directory in repo
- **Variables Template:** `REQUIRED_GITHUB_VARS.txt`
- **Cutover Checklist:** `docs/phase-e-cutover-checklist.md`
- **GitHub Actions:** https://github.com/Otto-studio-it/Steelyes/actions

---

**Summary:** PR merged ✅, but build needs GitHub Actions variables to be set manually via UI. Once set, trigger new build and proceed with Coolify cutover.
