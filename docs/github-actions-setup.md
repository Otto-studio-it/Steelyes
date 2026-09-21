# GitHub Actions Configuration for Phase E

## Required Setup in GitHub Repository Settings

Navigate to: `https://github.com/Otto-studio-it/Steelyes/settings/variables/actions`

### Actions Variables (Public, Safe to Store)

These must be set as **Repository Variables** (or **Organization Variables** if applicable):

| Variable Name | Value Source | Required | Example |
|---------------|--------------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings | ✅ **Required** | `https://abcdefgh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project API settings | ✅ **Required** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_SITE_URL` | Production site URL | ⚠️ **Recommended** | `https://www.steelyes.co.uk` |
| `NEXT_PUBLIC_COOKIEBOT_ID` | Cookiebot account | ❌ Optional | `a1b2c3d4-e5f6-...` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile | ❌ Optional | `0x4AAAAAAA...` |
| `NEXT_PUBLIC_POSTHOG_API_KEY` | PostHog project settings | ❌ Optional | `phc_abc123...` |
| `NEXT_PUBLIC_CONFIGURATOR_3D_PREVIEW` | Feature flag | ❌ Optional | `true` |

### Important Notes

1. **No secrets needed!** The workflow uses `GITHUB_TOKEN` (automatically provided by GitHub) for GHCR authentication.

2. **Why these are variables, not secrets:**
   - They are `NEXT_PUBLIC_*` environment variables
   - Next.js inlines these at build time into the client bundle
   - They are already exposed in the browser (not sensitive)
   - Using Variables allows them to be visible in workflow logs for debugging

3. **Runtime secrets stay in Coolify:**
   - `SUPABASE_SERVICE_ROLE_KEY` — **Never** add to GitHub Actions
   - `RESEND_API_KEY` — **Never** add to GitHub Actions
   - Other sensitive keys — Keep in Coolify environment variables only
   - These are injected at container runtime, not build time

### How to Add Variables

1. **Go to repository settings:**
   ```
   https://github.com/Otto-studio-it/Steelyes/settings/variables/actions
   ```

2. **Click "New repository variable"**

3. **For each variable above:**
   - Enter the **Name** (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Enter the **Value** (copy from your Supabase dashboard, production .env, etc.)
   - Click "Add variable"

4. **Repeat for all required variables**

### Where to Find Values

| Variable | Where to Find |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → Project API keys → `anon` `public` |
| `NEXT_PUBLIC_SITE_URL` | Your production domain (usually `https://www.steelyes.co.uk`) |
| Others | Coolify production app environment variables (copy the current values) |

### Verification

After adding variables, you can verify the workflow will have access by:

1. **Test with workflow_dispatch:**
   - Go to `Actions` → `Build and Push Docker Image` → `Run workflow`
   - Select branch `main`
   - Uncheck "Push to GHCR" for a dry-run test
   - Run workflow
   - Check logs to confirm variables are present (they'll show as `***` in some contexts)

2. **Or wait for automatic trigger:**
   - Push a commit to `main`
   - Workflow runs automatically
   - Check logs for success

### GHCR Package Visibility (One-Time)

After the **first successful push**, the package will exist at:
```
https://github.com/orgs/otto-studio-it/packages/container/package/steelyes-web
```

**Recommended: Make it public** (avoids auth setup in Coolify):
1. Go to package settings
2. **Change visibility** → **Public**
3. Confirm

**If keeping private:**
- Coolify will need GitHub PAT with `read:packages` scope
- See main documentation for details

### Troubleshooting

**Build fails with "NEXT_PUBLIC_SUPABASE_URL is not defined":**
- Variable name is case-sensitive, must match exactly
- Refresh the Actions page and check Variables list
- Re-run the workflow after adding the variable

**Build succeeds but missing variable is actually needed:**
- The workflow doesn't fail on missing optional variables
- Check runtime logs in Coolify after deploy
- Add the missing variable and trigger a new build

**Variables not showing up in workflow:**
- Repository variables are org/repo-specific
- If using org variables, ensure repo is in the org
- Check variable scope (Actions can use both repository and organization variables)

---

## Quick Reference Commands

```bash
# Trigger workflow manually (GitHub CLI)
gh workflow run build-push-image.yml --ref main

# Check workflow status
gh run list --workflow=build-push-image.yml --limit 5

# View latest workflow logs
gh run view --log

# List current repository variables
gh variable list

# Set a variable (example)
gh variable set NEXT_PUBLIC_SITE_URL --body "https://www.steelyes.co.uk"
```

---

**Next step after configuration:** See `docs/phase-e-cutover-checklist.md` for cutover procedure.
