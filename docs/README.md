# Steelyes Documentation

## Phase E: GitHub Actions Build Pipeline

This directory contains documentation for Phase E of the Steelyes server optimization plan: moving Docker builds from the Coolify droplet to GitHub Actions.

### Documents

1. **[GitHub Actions Setup](./github-actions-setup.md)** — Required GitHub repository configuration:
   - Actions variables (NEXT_PUBLIC_* values)
   - GHCR package visibility settings
   - Where to find configuration values
   - Verification steps

2. **[Local Testing Guide](./local-testing.md)** — Test the Docker build locally before deploying:
   - Build and run image locally
   - Verify native binaries (@resvg/resvg-js, sharp)
   - Validate workflow syntax
   - Check build args
   - Dry-run GHCR push

3. **[Coolify Image Deploy Guide](./coolify-image-deploy.md)** — Comprehensive deployment guide:
   - Workflow overview
   - Coolify cutover steps (staging → production)
   - Deploy workflow after cutover
   - Rollback strategies
   - Troubleshooting
   - Success metrics

4. **[Phase E Cutover Checklist](./phase-e-cutover-checklist.md)** — Quick reference checklist for the ops agent performing the actual cutover.

### Context

**Problem:** Production Coolify currently builds with Nixpacks on the droplet (2 vCPU / ~4GB RAM). Deploys crush the server with load averages of 10-20+, taking 10-20+ minutes and risking OOM kills.

**Solution:** Build Docker images in GitHub Actions (3-5 min on GitHub's infrastructure), push to GHCR, and have Coolify only pull pre-built images and restart containers (~1 minute deploy time).

**Benefits:**
- 🚀 **10-20x faster deploys** (1 min vs 10-20 min)
- 💪 **Server stays responsive** during deploys (load < 2 vs 10-20+)
- 🛡️ **No more OOM risk** during builds
- 🔄 **Consistent builds** (same image for staging and production)
- ⚡ **Fast rollbacks** (switch image tag, not rebuild)

### Implementation Files

- **Workflow:** `.github/workflows/build-push-image.yml`
- **Dockerfile:** `Dockerfile` (updated with build args for `NEXT_PUBLIC_*` vars)

### Quick Start

**Before pushing to production:**

1. **Configure GitHub Actions** → [github-actions-setup.md](./github-actions-setup.md)
   - Set repository variables (NEXT_PUBLIC_*)
   - Make GHCR package public (optional)

2. **Optional: Test locally** → [local-testing.md](./local-testing.md)
   - Build Docker image locally
   - Verify it runs and serves traffic
   - Check native binaries are included

3. **Push to `main`** (or merge PR)
   - Wait for GitHub Actions to complete (~3-5 min)
   - Verify build succeeded in Actions tab

**Production cutover (ops agent):**

4. **Follow cutover checklist** → [phase-e-cutover-checklist.md](./phase-e-cutover-checklist.md)
   - Switch staging to Docker Image source
   - Test staging thoroughly
   - Switch production to Docker Image source
   - Verify fast deploys (~1 min)

5. **Enjoy fast deploys** 🎉

### Related

- Source plan: `uploads/steelyes-server-lightening-plan.md` § 7 Fase E
- GitHub Actions: https://github.com/Otto-studio-it/Steelyes/actions
- GHCR packages: https://github.com/orgs/otto-studio-it/packages
