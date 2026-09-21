# Local Testing Guide for Phase E

This document describes how to test the Docker build locally before pushing to production.

---

## Prerequisites

- Docker installed locally
- `docker buildx` plugin available (usually included with Docker Desktop)

---

## Test 1: Build Image Locally

This simulates what GitHub Actions will do.

```bash
# From repo root
cd /path/to/Steelyes

# Build with your actual production values
docker buildx build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key" \
  --build-arg NEXT_PUBLIC_SITE_URL="https://www.steelyes.co.uk" \
  -t steelyes-web:test \
  -f Dockerfile \
  .
```

**Expected result:** Build completes without errors in ~5-10 minutes (first build, no cache).

---

## Test 2: Run Image Locally

Test that the built image actually runs and serves the app.

```bash
# Run the container
docker run -d \
  --name steelyes-test \
  -p 3000:3000 \
  -e SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" \
  -e RESEND_API_KEY="your-resend-key" \
  steelyes-web:test

# Check logs
docker logs -f steelyes-test

# Test the app
curl http://localhost:3000/healthz
# Should return: {"ok":true}

# Open in browser
open http://localhost:3000

# Clean up
docker stop steelyes-test
docker rm steelyes-test
```

**Expected result:**
- Container starts without errors
- `/healthz` returns `{"ok": true}`
- Homepage loads
- Configurator is accessible

---

## Test 3: Verify Native Binaries (PDF Generation)

Check that `@resvg/resvg-js` and `sharp` native binaries are included.

```bash
# Inspect the built image
docker run --rm -it steelyes-web:test sh

# Inside container:
$ ls -la apps/web/node_modules/@resvg/resvg-js/
$ ls -la apps/web/node_modules/sharp/

# Look for .node files (native binaries)
$ find apps/web -name "*.node" -type f

# Exit
$ exit
```

**Expected result:**
- `@resvg/resvg-js` directory exists with `.node` files
- `sharp` directory exists with `.node` files
- At least several `.node` binaries are present

---

## Test 4: Validate Workflow Syntax

Before pushing, validate the GitHub Actions workflow file.

```bash
# Option 1: Use act (GitHub Actions local runner)
# Install: brew install act
act --list -W .github/workflows/build-push-image.yml

# Option 2: Use actionlint (workflow linter)
# Install: brew install actionlint
actionlint .github/workflows/build-push-image.yml

# Option 3: Use GitHub API (requires gh CLI)
gh workflow view build-push-image.yml
```

**Expected result:** No syntax errors reported.

---

## Test 5: Check Build Args Are Used

Verify that build args are actually making it into the Next.js build.

```bash
# Build with a test value
docker buildx build \
  --build-arg NEXT_PUBLIC_SITE_URL="http://test-build-args.local" \
  -t steelyes-web:build-arg-test \
  -f Dockerfile \
  --progress=plain \
  . 2>&1 | grep -i "test-build-args"

# If found, build args are working
```

**Expected result:** You should see the test value appear in build output (Next.js will inline it).

---

## Test 6: Multi-Stage Build Inspection

Verify that the final image doesn't include unnecessary build artifacts.

```bash
# Check image size
docker images steelyes-web:test

# Expected: ~1-2 GB (reasonable for Next.js app with standalone output)
# Not expected: > 5 GB (would indicate build artifacts weren't removed)

# Inspect layers
docker history steelyes-web:test

# Check what's in the final image
docker run --rm steelyes-web:test ls -lh apps/web/
docker run --rm steelyes-web:test du -sh apps/web/.next/
```

**Expected result:**
- Final image size is reasonable (~1-2 GB)
- Only `apps/web/.next/standalone` and `apps/web/.next/static` are present
- No `node_modules` bloat (standalone mode includes minimal deps)

---

## Test 7: Dry-Run Push to GHCR

Test authentication to GHCR without actually pushing.

```bash
# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Tag for GHCR
docker tag steelyes-web:test ghcr.io/otto-studio-it/steelyes-web:test-local

# Test push (can abort after it starts)
docker push ghcr.io/otto-studio-it/steelyes-web:test-local

# Clean up remote test tag (optional)
# Use GitHub UI or API to delete the test-local tag
```

**Expected result:** Auth succeeds, push begins.

---

## Troubleshooting Local Builds

### Build fails with "pnpm: not found"

**Cause:** Docker doesn't have pnpm.

**Fix:** Already handled in Dockerfile with `corepack enable`. If still failing, check Docker version (needs Node 20 image with corepack).

### Build fails with "Cannot find module '@resvg/resvg-js'"

**Cause:** `outputFileTracingIncludes` not working.

**Fix:** Verify `next.config.mjs` includes the paths, and they match the actual install locations.

### Container starts but crashes immediately

**Cause:** Missing required runtime env vars.

**Fix:** Add at least:
```bash
docker run -d \
  -e NEXT_PUBLIC_SUPABASE_URL="..." \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="..." \
  -e SUPABASE_SERVICE_ROLE_KEY="..." \
  ...
```

### PDF generation fails in running container

**Cause:** Native binaries not included or wrong architecture.

**Fix:**
- Ensure `--platform linux/amd64` is used (matches Coolify droplet)
- Check `outputFileTracingIncludes` in `next.config.mjs`
- Run Test 3 above to verify binaries are present

---

## Quick Validation Checklist

Before pushing to `main` and triggering the workflow:

- [ ] Local Docker build succeeds
- [ ] Image runs and serves traffic
- [ ] `/healthz` endpoint returns 200
- [ ] Configurator page loads
- [ ] Native binaries are present (Test 3)
- [ ] Workflow YAML is valid (Test 4)
- [ ] Build args are used (Test 5)
- [ ] Final image size is reasonable (Test 6)

---

## Next Steps

Once local testing passes:

1. **Push to a feature branch first** (not `main`) to test the workflow
2. **Open a PR** and watch Actions run
3. **Review Actions logs** for any issues
4. **Merge to `main`** after PR approval
5. **Follow cutover checklist** in `docs/phase-e-cutover-checklist.md`

---

**Related docs:**
- `docs/github-actions-setup.md` — GitHub configuration
- `docs/coolify-image-deploy.md` — Full deployment guide
- `docs/phase-e-cutover-checklist.md` — Cutover procedure
