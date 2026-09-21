# Phase E Cutover Checklist

Quick reference for Coolify ops agent performing the Phase E cutover.

---

## ✅ Pre-Cutover (One-Time Setup)

- [ ] **GitHub Actions Variables Set** (`Settings` → `Secrets and variables` → `Actions` → `Variables`)
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `NEXT_PUBLIC_SITE_URL` (recommended)
  - [ ] Optional: `NEXT_PUBLIC_COOKIEBOT_ID`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, etc.
  
- [ ] **First Actions Build Succeeded**
  - [ ] Go to `https://github.com/Otto-studio-it/Steelyes/actions`
  - [ ] Verify "Build and Push Docker Image" workflow shows ✅
  - [ ] Note the image tag: `ghcr.io/otto-studio-it/steelyes-web:main`

- [ ] **GHCR Package Visibility** (if you want to avoid auth setup in Coolify)
  - [ ] Go to `https://github.com/orgs/otto-studio-it/packages`
  - [ ] Find `steelyes-web` package
  - [ ] Set visibility to **Public** (or keep Private and configure auth below)

---

## 🧪 Staging Cutover

- [ ] **Backup current staging config** (screenshot or note Build Pack = Nixpacks, Branch = main)

- [ ] **Switch to Docker Image**
  - [ ] Coolify → Staging App → General tab
  - [ ] Build Pack: `Docker Image`
  - [ ] Image: `ghcr.io/otto-studio-it/steelyes-web:main`
  - [ ] **If private package:** Add registry auth:
    - Registry URL: `ghcr.io`
    - Username: (GitHub username)
    - Password: (GitHub PAT with `read:packages`)
  - [ ] Save

- [ ] **Deploy staging**
  - [ ] Click Deploy button
  - [ ] Wait ~30-60 seconds (not 10-20 minutes!)
  - [ ] Check logs for errors

- [ ] **Smoke test staging**
  - [ ] Visit `https://staging.steelyes.co.uk`
  - [ ] Check `/healthz` → `{"ok": true}`
  - [ ] Open `/configurator`
  - [ ] Test quote generation (if possible)
  - [ ] Verify no 500 errors

- [ ] **Staging rollback (if failed)**
  - [ ] Build Pack → `Nixpacks`
  - [ ] Branch → `main`
  - [ ] Deploy (will take 10-20 min)

---

## 🚀 Production Cutover (Only After Staging Success)

- [ ] **Backup current production config** (screenshot or note Build Pack = Nixpacks, Branch = main)

- [ ] **Switch to Docker Image**
  - [ ] Coolify → Production App → General tab
  - [ ] Build Pack: `Docker Image`
  - [ ] Image: `ghcr.io/otto-studio-it/steelyes-web:main`
  - [ ] Add registry auth if private (same as staging)
  - [ ] Save

- [ ] **Deploy production**
  - [ ] Click Deploy button
  - [ ] Wait ~30-60 seconds
  - [ ] Check logs for errors

- [ ] **Smoke test production**
  - [ ] Visit `https://www.steelyes.co.uk`
  - [ ] Check `/healthz`
  - [ ] Open `/configurator`
  - [ ] Test critical user flow (quote request)

- [ ] **Monitor droplet health**
  - [ ] SSH to droplet
  - [ ] `uptime` → load should be < 2 (not 10-20!)
  - [ ] `free -h` → MemAvailable should be stable
  - [ ] `docker stats --no-stream`

---

## 📊 Success Criteria

- ✅ Deploy time: **~1 minute** (vs 10-20 min before)
- ✅ Server load during deploy: **< 2** (vs 10-20+ before)
- ✅ Site responsive during deploy
- ✅ PDF generation still works
- ✅ No OOM kills

---

## 🆘 Emergency Rollback

**If production breaks:**

1. Coolify → Production App → General
2. Build Pack → `Nixpacks`
3. Branch → `main` (or specific known-good commit)
4. Deploy (accept 10-20 min build time)
5. Investigate logs after prod is stable

---

## 🔄 New Deploy Process (Post-Cutover)

1. **Push to `main`** or merge PR
2. **Wait for GitHub Actions** to complete (~3-5 min)
   - Check: `https://github.com/Otto-studio-it/Steelyes/actions`
3. **Deploy staging** in Coolify (optional pre-prod test)
4. **Deploy production** in Coolify
   - Takes ~1 minute (pull + restart)
   - Pulls **same image** staging tested

**No more Coolify builds!** Server stays fast.

---

## 📝 Notes

- Runtime secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, etc.) stay in Coolify env vars (not in image)
- Image tags available:
  - `:main` — always latest main branch
  - `:main-abc1234` — specific git SHA (for rollback)
  - `:latest` — alias for main
- Auto-deploy can stay OFF (recommended: manual deploy after verifying Actions)

---

**Full docs:** `docs/coolify-image-deploy.md`
