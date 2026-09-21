# Phase E Implementation Summary

**PR:** https://github.com/Otto-studio-it/Steelyes/pull/35  
**Branch:** `cursor/phase-e-ghcr-build-f1ab`  
**Status:** ✅ Ready for review and GitHub configuration

---

## What Was Implemented

### 1. GitHub Actions Workflow
**File:** `.github/workflows/build-push-image.yml`

- Triggers on push to `main` and tags `v*`
- Supports manual trigger via `workflow_dispatch` with dry-run option
- Builds Docker image using existing `Dockerfile`
- Pushes to GHCR: `ghcr.io/otto-studio-it/steelyes-web`
- Tags: `:main`, `:main-<sha>`, `:latest`
- Uses GitHub Actions cache for fast subsequent builds (2-4x speedup)
- Build time: ~3-5 minutes (vs 10-20+ on droplet)

### 2. Dockerfile Updates
**File:** `Dockerfile`

- Added `ARG` and `ENV` declarations for all `NEXT_PUBLIC_*` variables
- These are the only variables that need to be at build time
- Runtime secrets remain separate (Coolify env vars)
- Preserves existing standalone output and native binary inclusion

### 3. Documentation
**Directory:** `docs/`

#### Created Files:
1. **`github-actions-setup.md`** (Setup guide)
   - Complete list of required GitHub Actions variables
   - Where to find each value
   - How to configure repository settings
   - GHCR package visibility setup
   - Troubleshooting

2. **`local-testing.md`** (Testing guide)
   - How to build and test locally
   - Verify native binaries (@resvg/resvg-js, sharp)
   - Validate workflow syntax
   - Check build args are working
   - Multi-stage build inspection

3. **`coolify-image-deploy.md`** (Deployment guide)
   - Full cutover procedure (staging → production)
   - Deploy workflow after cutover
   - Rollback strategies
   - Runtime environment variables
   - Troubleshooting
   - Success metrics

4. **`phase-e-cutover-checklist.md`** (Quick reference)
   - Pre-cutover checklist
   - Staging cutover steps
   - Production cutover steps
   - Success criteria
   - Emergency rollback
   - New deploy process

5. **`README.md`** (Overview)
   - Problem statement
   - Solution overview
   - Benefits
   - Quick start guide
   - Links to all docs

---

## Required GitHub Configuration (Before Merge)

**Action Required by:** Ruben (repo admin)

**Location:** `https://github.com/Otto-studio-it/Steelyes/settings/variables/actions`

### Required Repository Variables

| Variable Name | Value Source | Required | Where to Find |
|---------------|--------------|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard | ✅ Yes | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard | ✅ Yes | Project Settings → API → anon public key |
| `NEXT_PUBLIC_SITE_URL` | Production domain | ⚠️ Recommended | `https://www.steelyes.co.uk` |
| `NEXT_PUBLIC_COOKIEBOT_ID` | Cookiebot account | ❌ Optional | Coolify prod env (if set) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare | ❌ Optional | Coolify prod env (if set) |
| `NEXT_PUBLIC_POSTHOG_API_KEY` | PostHog | ❌ Optional | Coolify prod env (if set) |
| `NEXT_PUBLIC_CONFIGURATOR_3D_PREVIEW` | Feature flag | ❌ Optional | Coolify prod env (if set) |

**Note:** These can be copied from Coolify production app environment variables (the `NEXT_PUBLIC_*` ones).

**No secrets needed!** Runtime secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, etc.) stay in Coolify and are **never** added to GitHub.

---

## Next Steps

### Step 1: Review PR (Now)
- [ ] Review code changes in PR #35
- [ ] Review documentation
- [ ] Verify Dockerfile changes preserve existing functionality

### Step 2: Configure GitHub (Before Merge)
- [ ] Set repository variables (see table above)
- [ ] Verify variables are saved correctly

### Step 3: Merge PR
- [ ] Ensure CI pipeline passes (may need variables for build step)
- [ ] Merge to `main`

### Step 4: Verify First Build
- [ ] Watch GitHub Actions: https://github.com/Otto-studio-it/Steelyes/actions
- [ ] Wait for "Build and Push Docker Image" to complete (~3-5 min)
- [ ] Check for ✅ success
- [ ] Note the image tags created

### Step 5: Configure GHCR Package (Optional but Recommended)
- [ ] Go to: https://github.com/orgs/otto-studio-it/packages
- [ ] Find `steelyes-web` package
- [ ] Change visibility to **Public**
  - This avoids needing to configure GitHub PAT in Coolify
  - Public packages are fine for this use case (no secrets in image)

### Step 6: Coolify Cutover (Ops Agent)
- [ ] Follow `docs/phase-e-cutover-checklist.md` exactly:
  1. **Staging first** (test thoroughly)
  2. **Production second** (only after staging success)
- [ ] Monitor droplet metrics (load, memory) during first deploy
- [ ] Verify fast deploy time (~1 min vs 10-20 min)

### Step 7: Validate Success
- [ ] Deploy time: ~1 minute ✅
- [ ] Server load during deploy: < 2 ✅
- [ ] Site stays responsive during deploy ✅
- [ ] PDF generation still works ✅
- [ ] No OOM kills ✅

---

## Rollback Plan

### If GitHub Actions Build Fails
- Fix the workflow or Dockerfile
- Push another commit
- No impact on production (Coolify still uses Nixpacks)

### If Staging Deploy from GHCR Fails
- Switch staging back to Nixpacks in Coolify
- Investigate logs
- No impact on production

### If Production Deploy from GHCR Fails
- **Immediate:** Switch production back to Nixpacks in Coolify (10-20 min rebuild, accept downtime)
- **Or:** Point to previous working image tag (`:main-<previous-sha>`) if issue is with new code
- Investigate and fix
- Retry cutover when ready

---

## Security Notes

✅ **Safe:**
- `NEXT_PUBLIC_*` variables are already exposed in the browser bundle
- Using GitHub Actions Variables (not Secrets) for these is correct
- GHCR public packages are fine (no secrets in image)
- `GITHUB_TOKEN` is auto-provided (no manual token setup)

❌ **Never Do:**
- Do NOT add `SUPABASE_SERVICE_ROLE_KEY` to GitHub Actions
- Do NOT add `RESEND_API_KEY` to GitHub Actions
- Do NOT commit `.env` files with real secrets
- Do NOT make runtime secrets available at build time

---

## Expected Metrics

### Before Phase E (Current - Nixpacks on Droplet)
- **Build time:** 10-20+ minutes
- **Server load during deploy:** 10-20+ on 2 vCPU
- **Memory pressure:** High (risk of OOM)
- **Production impact:** Site unresponsive during deploy
- **Staging impact:** Cannot deploy staging and prod in parallel

### After Phase E (Target - GHCR Image Pull)
- **Build time (Actions):** 3-5 minutes (doesn't block)
- **Deploy time (Coolify):** 30-60 seconds
- **Server load during deploy:** < 2 on 2 vCPU
- **Memory pressure:** Minimal (just pull + restart)
- **Production impact:** Site stays responsive
- **Staging impact:** Can deploy quickly, minimal impact

**Improvement:** 10-20x faster deploys, server stays healthy.

---

## Troubleshooting Reference

### "Workflow fails with missing variable"
→ Check GitHub Actions variables are set correctly (case-sensitive)

### "Coolify deploy fails with 'unauthorized'"
→ If GHCR package is private, add GitHub PAT to Coolify registry auth
→ Or change package visibility to Public

### "App crashes with missing env var"
→ Verify runtime secrets are still in Coolify env vars (they don't transfer with image source change)

### "PDF generation broken"
→ Check logs for `@resvg/resvg-js` or `sharp` errors
→ Verify native binaries are in the image: `docker run --rm <image> find apps/web -name "*.node"`

**Full troubleshooting:** See `docs/coolify-image-deploy.md`

---

## Questions?

- **GitHub Actions setup:** See `docs/github-actions-setup.md`
- **Local testing:** See `docs/local-testing.md`
- **Cutover procedure:** See `docs/phase-e-cutover-checklist.md`
- **Full deployment guide:** See `docs/coolify-image-deploy.md`
- **PR discussion:** https://github.com/Otto-studio-it/Steelyes/pull/35

**Contact:** Ruben (ops owner) or Otto Studio IT team

---

**Status:** ✅ Implementation complete, awaiting GitHub configuration and cutover.
