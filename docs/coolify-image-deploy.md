# Coolify Image Deploy — Phase E Cutover Guide

**Goal:** Move Docker builds from the Coolify droplet (2 vCPU / 4GB RAM) to GitHub Actions, so Coolify only pulls pre-built images and restarts containers.

**Status:** Ready for production cutover after GitHub Actions and repo configuration are complete.

---

## Prerequisites

### 1. GitHub Repository Configuration

#### Required Actions Secrets/Variables

Before the workflow can run successfully, configure these in the GitHub repository settings (`Settings` → `Secrets and variables` → `Actions`):

**Variables** (non-sensitive, can be repository or organization-level):

| Variable Name | Example Value | Required | Notes |
|---------------|---------------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://abc123.supabase.co` | ✅ Yes | Public Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | ✅ Yes | Public anon key (safe to embed) |
| `NEXT_PUBLIC_SITE_URL` | `https://www.steelyes.co.uk` | ⚠️ Recommended | Canonical site URL |
| `NEXT_PUBLIC_COOKIEBOT_ID` | `abc123...` | ❌ Optional | Cookiebot CMP domain group ID |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAA...` | ❌ Optional | Cloudflare Turnstile site key |
| `NEXT_PUBLIC_POSTHOG_API_KEY` | `phc_...` | ❌ Optional | PostHog analytics key |
| `NEXT_PUBLIC_CONFIGURATOR_3D_PREVIEW` | `true` | ❌ Optional | Enable 3D preview feature flag |

**How to set:**
1. Go to `https://github.com/Otto-studio-it/Steelyes/settings/variables/actions`
2. Click **New repository variable**
3. Add each variable name and value
4. Save

**No secrets required for build!** The workflow uses `GITHUB_TOKEN` (automatically provided) for GHCR authentication.

#### GHCR Package Visibility

The workflow pushes to GitHub Container Registry (GHCR) at `ghcr.io/otto-studio-it/steelyes-web`.

**Options:**
- **Public package** (recommended for this use case): No additional Coolify authentication needed. Anyone can pull the image.
- **Private package**: Coolify will need a GitHub Personal Access Token (PAT) with `read:packages` scope.

**To make the package public** (after first push):
1. Go to `https://github.com/orgs/otto-studio-it/packages` (or user packages if not in org)
2. Find `steelyes-web`
3. Click **Package settings** → **Change visibility** → **Public**

---

## Workflow Overview

When you push to `main`, GitHub Actions will:
1. Build the Docker image using the existing `Dockerfile`
2. Push to GHCR with multiple tags:
   - `ghcr.io/otto-studio-it/steelyes-web:main` (always latest main)
   - `ghcr.io/otto-studio-it/steelyes-web:main-abc1234` (git SHA for rollback)
   - `ghcr.io/otto-studio-it/steelyes-web:latest` (alias for main)
3. Cache Docker layers using GitHub Actions cache (speeds up subsequent builds)

**Build time:** ~3-5 minutes (vs 10-20+ minutes on the droplet)

---

## Coolify Cutover Steps

### Phase 1: Staging (Test First)

1. **Verify GitHub Actions completed successfully**
   - Go to `https://github.com/Otto-studio-it/Steelyes/actions`
   - Check that "Build and Push Docker Image" workflow completed with ✅
   - Note the image tag (e.g., `ghcr.io/otto-studio-it/steelyes-web:main-abc1234`)

2. **In Coolify UI — Staging App**
   - Navigate to staging app (`staging.steelyes.co.uk`)
   - Go to **General** tab
   - Change **Build Pack** from "Nixpacks" to **"Docker Image"**
   - Set **Image** to: `ghcr.io/otto-studio-it/steelyes-web:main`
   - If package is **private**, add registry authentication:
     - **Registry URL:** `ghcr.io`
     - **Registry Username:** Your GitHub username
     - **Registry Password:** GitHub PAT with `read:packages` scope
   - **Save**

3. **Deploy staging**
   - Click **Deploy** button
   - Deployment should complete in **~30-60 seconds** (just pull + restart, no build!)
   - Monitor logs for any errors

4. **Smoke test staging**
   - Visit `https://staging.steelyes.co.uk`
   - Check `/healthz` endpoint
   - Test configurator (`/configurator`)
   - Verify PDF generation works (quote download)
   - Check AR model serving if applicable

5. **If staging fails:**
   - Review Coolify logs
   - Check that environment variables are still set (they should persist)
   - Verify GHCR package visibility/auth
   - **Rollback:** Change Build Pack back to "Nixpacks", redeploy

### Phase 2: Production (After Staging Success)

**Important:** Only proceed if staging is fully working.

1. **In Coolify UI — Production App**
   - Navigate to production app (`www.steelyes.co.uk`)
   - Go to **General** tab
   - Change **Build Pack** from "Nixpacks" to **"Docker Image"**
   - Set **Image** to: `ghcr.io/otto-studio-it/steelyes-web:main`
   - Add registry auth if private (same as staging)
   - **Save**

2. **Deploy production**
   - Click **Deploy** button
   - Deployment should complete in **~30-60 seconds**
   - Monitor logs

3. **Smoke test production**
   - Visit `https://www.steelyes.co.uk`
   - Check `/healthz` endpoint
   - Test configurator
   - Verify critical user flows

4. **Post-cutover monitoring**
   - Watch Coolify resource usage: `htop` on droplet should show **dramatically lower CPU** during future deploys
   - Check server load average: should stay under ~1.5 even during deploys
   - Memory usage should be more stable

---

## Deploy Workflow (After Cutover)

### Normal Deploy Process

1. **Push to `main`** (merge PR or direct push)
2. **GitHub Actions builds automatically** (3-5 min)
   - Watch progress: `https://github.com/Otto-studio-it/Steelyes/actions`
   - Wait for ✅ success
3. **Optional: Test staging first**
   - If staging is running, deploy it in Coolify (pulls `:main` tag)
   - Smoke test
4. **Deploy production in Coolify**
   - Click Deploy button
   - Coolify pulls the **same image** staging tested (fast, consistent)
   - Production is live in ~1 minute

**Note:** Coolify auto-deploy can remain **OFF** (recommended). Deploy manually after verifying Actions succeeded.

### Rollback Strategies

**Option 1: Rollback to previous image (fast)**
1. In Coolify, change Image tag from `main` to `main-<previous-sha>`
   - Find previous SHA in GitHub commit history or Actions logs
   - Example: `ghcr.io/otto-studio-it/steelyes-web:main-abc1234`
2. Deploy
3. Rollback completes in ~1 minute (just pull different tag)

**Option 2: Rollback to Nixpacks (emergency escape hatch)**
1. In Coolify, change Build Pack from "Docker Image" back to "Nixpacks"
2. Change **Branch/Tag** back to `main` (or specific commit)
3. Deploy
4. Accept that this deploy will take 10-20+ minutes and spike CPU

**Option 3: Revert git commit and re-run Actions**
1. `git revert <bad-commit>` and push to `main`
2. Wait for Actions to build new image
3. Deploy in Coolify (pulls new `:main`)

---

## Runtime Environment Variables

**Important:** Runtime secrets (non-`NEXT_PUBLIC_*`) are **NOT** baked into the image. They must be configured in Coolify's environment variable settings.

**Required runtime env vars** (set in Coolify → app → Environment):
- `SUPABASE_SERVICE_ROLE_KEY` — server-side Supabase admin key
- `RESEND_API_KEY` — email sending (optional but recommended)
- `INBOX_INGEST_SECRET` — webhook secret for inbox autoack (if used)
- `CRON_SECRET` — cron endpoint auth (if used)
- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile server-side key (if used)
- `RESEND_WEBHOOK_SECRET` — Resend webhook signature validation (if used)
- `TENANT_LEAD_WEBHOOK_URL` — lead routing webhook (if used)
- `SITE_HOLD` — temporary site hold flag (if used)
- `SITE_HOLD_BYPASS_TOKEN` — hold bypass secret (if used)
- `SITE_HOLD_CONTACT_EMAIL` — hold page contact email (if used)

**These remain in Coolify** and are injected at container runtime (never in the image).

---

## Troubleshooting

### Build fails in Actions with "missing variable"
- Check that all required `NEXT_PUBLIC_*` variables are set in GitHub repo settings
- Review Actions logs for specific missing variable name
- Add missing variable and re-run workflow

### Coolify deploy fails with "unauthorized" or "pull access denied"
- **If package is private:** Verify registry authentication in Coolify
- **If package is public:** Check that package visibility is set to Public in GitHub
- Verify image name matches exactly: `ghcr.io/otto-studio-it/steelyes-web:main`

### App starts but crashes / 500 errors
- Check Coolify logs for runtime errors
- Verify all runtime env vars are set (especially `SUPABASE_SERVICE_ROLE_KEY`)
- Check that `@resvg/resvg-js` and `sharp` binaries are present (should be via Dockerfile `outputFileTracingIncludes`)

### PDF generation broken
- The Dockerfile includes `outputFileTracingIncludes` for `@resvg/resvg-js` and `sharp`
- Verify in Coolify logs that native `.node` files are present
- Check Next.js standalone output includes `node_modules/@resvg/` and `node_modules/sharp/`

### Builds are still slow in Actions
- First build will be slower (no cache)
- Subsequent builds should use GitHub Actions cache (2-4x faster)
- Check Actions logs for "Cache restored from key: ..." to confirm cache is working

---

## Monitoring Success Metrics

**Before Phase E (Nixpacks on droplet):**
- Deploy time: 10-20+ minutes
- Server load during deploy: 10-20+ on 2 vCPU (server unresponsive)
- Memory pressure: risk of OOM kills

**After Phase E (image pull from GHCR):**
- Build time (Actions): 3-5 minutes (doesn't block deploys)
- Deploy time (Coolify): 30-60 seconds
- Server load during deploy: < 2 (server stays responsive)
- Memory pressure: minimal (no compile, just pull + restart)

**Check with:**
```bash
# On droplet (SSH)
uptime                 # load average should stay < 1.5 even during deploy
free -h                # MemAvailable should stay > 1GB
docker stats --no-stream   # container CPU/MEM usage
```

---

## Future Enhancements

1. **Pin staging to specific SHA** instead of `:main` tag for more control
2. **Add deployment notifications** (Slack, email) from Actions workflow
3. **Automate Coolify deploy** via Coolify API after Actions success (optional)
4. **Multi-environment images** with separate configs for staging/prod (if needed)
5. **Image scanning** with Trivy or similar (security)

---

## Questions / Issues

**Contact:** Ruben (ops owner) or Otto Studio IT team

**Related docs:**
- `uploads/steelyes-server-lightening-plan.md` § 7 Fase E
- GitHub Actions logs: `https://github.com/Otto-studio-it/Steelyes/actions`
- GHCR package: `https://github.com/orgs/otto-studio-it/packages?repo_name=Steelyes`
