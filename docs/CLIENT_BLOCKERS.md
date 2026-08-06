---
title: Client Blockers
description: Asset tracker, impact, fallback strategies, weekly check-ins
owner: Ruben (project manager)
status: ACTIVE
last_updated: 2026-07-28
---

# Steelyes — Client Blockers

> Weekly tracker for client-provided assets that block or enhance the product.
> Updates every Monday. Escalate on Friday if overdue.

Current execution note:

- DB/RLS hardening is closed on staging.
- Supabase production auth for the known admin account is repaired.
- UI/content work can continue with fallbacks.
- Business/pricing completion remains blocked by Marius.
- Do not create speculative pricing schema or railhead tables while these inputs are pending.

Partial unblock on 2026-07-28 (batch [`docs/client-answers/2026-07-28-marius.md`](./client-answers/2026-07-28-marius.md)):

- **Finish palette received** — four blacks + RAL 7016 + custom RAL. The rate (£55/m² + VAT) arrived without its base or area definition, so finishes are palette-unblocked but still pricing-blocked.
- **Official email confirmed** — `info@steelyes.co.uk`. Company number, VAT, address and phone are still missing, so the footer legal block stays incomplete.
- **Social profiles received** — Instagram, Facebook, TikTok.
- **Cantilever geometry received** — tail = 1/3 of the clear opening, minimum. This unblocks cantilever preview work.
- 16 blocking intake questions were open; **3 are now closed, 13 remain.**

---

## Asset tracker (sorted by criticality)

| Asset | Needed by | Phase blocked | Impact | Status | Fallback | Owner |
|-------|-----------|---------------|--------|--------|----------|-------|
| **Logo SVG (vector)** | Week 2 | Phase 1 | Nav/footer look incomplete | ⏳ pending | Wordmark text only | Marius |
| **Price list (`public.gates`: `base_price_manual_gbp` + `base_price_auto_gbp` per row, plus option multipliers)** | Week 6 | Phase 2 / Phase 9 DB business closure | Configurator shows placeholder or NULL auto prices | ⏳ pending | "Indicative, subject to survey"; show manual vs motorised clearly | Marius |
| **Railhead variants + unit prices** | Week 6 | Phase 2 / Phase 9 DB business closure | Railheads only as `gate_options` / `per_railhead`; prices non-final until variants confirmed | 🟡 provisional catalog 2026-07-30 | Use [`foto-intake/railheads-catalog.json`](./frontend/foto-intake/railheads-catalog.json) (61 SKUs, 54 priced EX VAT); totals still survey until count rule | Marius |
| **Finish palette** | Week 6 | Phase 2 / Phase 9 DB business closure | Configurator missing finishes | ✅ received 2026-07-28 | n/a — real palette in `finishes.ts` (CA-03) | Marius |
| **Finish rate base + area rule** | Week 6 | Phase 2 pricing | £55/m²+VAT known, but not what it applies to — cannot compute a colour total | ⏳ pending | Finishes stay `provisional: true`; no colour line on quotes | Marius |
| **Aluminium panel upgrade count rule** | Week 8 | Phase 2 pricing | +£12.75/panel and +£12/bar unusable without a panel count | ⏳ pending | Show option, render total as "quoted after survey" | Marius |
| **Installation zones (postcode prefixes)** | Week 4 | Phase 1 | Postcode check widget hidden | ⏳ pending | "UK-wide coverage" | Marius |
| **Case Study content ("the dream gate")** | Week 3 | Phase 1 | Case study page not published | ⏳ pending | Page hidden from nav, redirect to `/` | Marius |
| **Telescopic install video** | Week 12 | Phase 4 | Gallery missing showcase video | ⏳ pending | Video slot empty, add post-launch | Marius |
| **Company Number + VAT** | Week 4 | Phase 1 | Footer legal block incomplete | ⏳ pending | Blank, flag for pre-launch checklist | Marius |
| **Business email** | Week 4 | Phase 1 | Contact page showed a Yahoo placeholder | ✅ confirmed 2026-08-05 | n/a — `info@steelyes.co.uk` (supersedes CA-06) | Marius |
| **Business phone + registered address** | Week 4 | Phase 1 | Contact page still shows unconfirmed values | ⏳ pending | Current phone/address in `business.ts`, verify pre-launch | Marius |
| **Social profile URLs** | Week 4 | Phase 1 | Footer/header social row incomplete | ✅ received 2026-07-28 | n/a — Instagram, Facebook, TikTok (CA-07) | Marius |
| **Photo consent from property owners** | Week 12 | Phase 4 | Gallery cannot publish | ⏳ pending | Workshop/in-progress photos only | Marius |
| **DNS registrar access** | Week 13 | Phase 4 | Domain cutover blocked | ⏳ pending | Deploy to `steelyes.vercel.app` temporarily | Marius |
| **DNS for email (SPF/DKIM/DMARC)** | Week 13 | Phase 4 | Resend emails → spam | ⏳ pending | Use `resend.dev` subdomain, flag post-launch | Marius |

Operational note verified on 2026-05-09:

- `steelyes.co.uk` is still serving the legacy GoDaddy Website Builder site.
- `steelyes.vercel.app` is not currently an active deployment.
- The missing DNS/domain cutover is now the main reason the repaired production app is not publicly reachable.

---

## Blockers by phase

### Phase 1 — Marketing site (Weeks 2–5)

**Critical**:
- Logo SVG — no substitute; wordmark text is acceptable fallback
- Company details (number, VAT, email, phone, address) — legal compliance, footer block
- Installation zones — postcode check widget (can default to "UK-wide")

**Nice**:
- Case study content — can hide page from nav if missing
- Telescopic video — can launch without, add post-launch

### Phase 2 — Configurator (Weeks 6–9)

**Critical**:
- Confirmed gate base prices (manual **and** motorised columns on each catalogue row) plus multipliers for tube size, finish, options — configurator core feature
- Railhead variant list with real **per-railhead** GBP (today stored only as provisional `gate_options` rows; see `docs/db/RAILHEADS_TBD.md`)
- ~~Finish palette~~ — **received 2026-07-28** (CA-03). What remains is the *rate base*: £55/m²+VAT is known, but not whether a colour is already inside the `FROM` price, what area the m² measures, or whether open-bar Victorian pays the same as solid composite.
- Aluminium panel upgrade count rule (CA-02) — the uplifts are known, the units are not

**If missing**: launch with the confirmed four-finish palette + custom RAL, all marked "Indicative pricing, subject to survey", and no colour line item on quotes until the rate base is confirmed.

**Do not** reintroduce `zinc-grey`, `bronze` or `pearl-white` as fallback finishes anywhere. The client explicitly withdrew them on 2026-07-28.

**Current DB implication**: these items block business/pricing completion, not the DB/RLS hardening state. Engineering should keep current provisional representations and wait for real client data before adding new catalogue schema.

### Phase 3 — AR (Weeks 10–11)

**No blockers**: AR is purely algorithmic, no client assets required.

### Phase 4 — Launch (Weeks 12–13)

**Critical**:
- Photo consent from property owners — gallery cannot publish without
- DNS registrar access — domain cutover impossible without
- DNS for email — Resend cannot use custom domain without

**Fallbacks**:
- Gallery: launch with workshop photos / in-progress shots from Marius (no consent needed)
- Domain: launch on `steelyes.vercel.app` (not `steelyes.co.uk`), flag as v1.1 follow-up
- Email: send from `resend.dev` subdomain, document for manual update later

---

## Impact assessment

### "No impact" (v1 works without)
- Telescopic install video (nice-to-have, add post-launch)
- Google Ads access (post-launch optimization)

### "Degrade gracefully" (fallback available)
- Logo SVG → wordmark text
- Case study content → hide page
- Photo consent → use workshop photos only
- DNS access → vercel.app deployment

### "Launch blocker if missing" (no fallback)
- Price list (core business logic)
- Finish rate base + area rule (a colour total cannot be computed without it)
- Company legal details (compliance) — email received, number/VAT/address still missing
- Installation zones (service area validation)

### "Blocks final business-data closure, but not UI/content progress"
- Railhead final variant/pricing model
- Real `fencing_panels` catalogue data
- Final option multipliers

Use documented fallbacks in `docs/frontend/CONTENT_FALLBACKS.md` until Marius responds.

---

## Weekly check-in cadence

**Every Monday morning (UK time)**:

1. Review tracker above — any asset marked ⏳ pending?
2. If asset was needed last week and still not received:
   - Message Marius on WhatsApp (simple, direct)
   - Ask: "Do you have [asset]? If delayed, applying fallback [X]."
3. If asset is needed this week and not yet received:
   - Proactive message Tuesday (give 5 days buffer before deadline)
   - Example: "For Week 6 configurator launch, we need price list by Friday EOD"
4. If asset has been requested 2+ weeks overdue:
   - Flag in GitHub Issues as `blocked:client-asset`
   - Document impact and fallback applied
   - CC Ruben for decision on escalation

---

## Asset dependency map (critical path)

```
Phase 1 (Weeks 2–5)
├─ Logo SVG
│  └─ Nav + footer polish (Week 2)
├─ Company details
│  └─ Legal footer block (Week 4)
├─ Installation zones
│  └─ Postcode check widget (Week 4)
└─ Case study content
   └─ Case study page (Week 3, can hide if missing)

Phase 2 (Weeks 6–9)
├─ Price list (gates manual/auto GBP + multipliers)
│  └─ Configurator pricing (CRITICAL — Week 6)
├─ Railhead variants + prices
│  └─ Replace placeholder `per_railhead` option pricing (CRITICAL — Week 6)
├─ Finish palette ✅ received 2026-07-28
│  └─ Finish rate base + area rule (CRITICAL — still pending)
└─ Aluminium panel count rule
   └─ Composite aluminium upgrade pricing (Week 8)

Phase 4 (Weeks 12–13)
├─ Photo consent
│  └─ Gallery publication (Week 12)
├─ DNS registrar access
│  └─ Domain cutover (Week 13)
└─ DNS email setup
   └─ Email deliverability (Week 13)
```

---

## GitHub issue template for blocked state

When an asset is overdue:

```markdown
# Blocked: [Asset name]

## Asset
[What is blocking us?]

## Needed by
[Which phase/week?]

## Impact
[What cannot ship without this?]

## Fallback
[What are we doing instead?]

## Status
- [ ] Requested from Marius on [date]
- [ ] Reminder sent on [date]
- [ ] Fallback applied on [date]

## Escalation
If asset not received by [date], escalate to [decision]
```

---

## Pre-launch checklist (Week 12–13)

Before DNS cutover, verify:

- [ ] All critical assets received OR fallback applied and documented
- [ ] Logo either SVG or wordmark text
- [ ] Company details either complete or marked "TBD" with disclaimer
- [ ] Price list either real or marked "Indicative" visibly on configurator
- [ ] Railheads either priced per confirmed variant list or still clearly marked non-final / survey-required
- [ ] Finishes show the confirmed palette only — no `zinc-grey` / `bronze` / `pearl-white` anywhere in code or copy
- [ ] Custom RAL shows "+ extra charge — powder coating, quoted separately" and never a figure
- [x] Contact email is `info@steelyes.co.uk`, not the Yahoo placeholder
- [ ] Social row carries Instagram + Facebook + TikTok, tracking parameters stripped
- [ ] Photo consent either obtained or using workshop photos only
- [ ] DNS registrar access confirmed, TTL lowered for fast propagation
- [ ] Email DNS records ready for deployment

---

## Asset communication template

**Monday message to Marius (if asset overdue)**:

```
Hi Marius,

For [Phase X] launching in Week X, we need:
- [Asset name]: needed by [date]
- [Impact]: [what blocks without it]
- [Fallback]: if delayed, we'll use [fallback strategy]

Do you have an ETA? Let me know ASAP.

Cheers,
Ruben
```

**Friday escalation (if still missing)**:

```
Hi Marius,

[Asset name] is now overdue for Phase X.

We're proceeding with fallback: [fallback].
This will be visible as [disclaimer] on the live site.

Once you have [asset], we can swap it in for v1.1.

Let me know if there's a blocker on your end.

Cheers,
Ruben
```

---

## Policy

**Locked**: no asset can block an internal milestone. Every asset gets a fallback. Fallback is documented and visible to the client (if applicable). If fallback is incomplete or workaround (e.g., placeholder), it's marked for post-launch v1.1.

---

**Active document.** Update every Monday. Last update: 2026-07-28 · Next update: next Monday (rolling)

_Remember: a missing asset never blocks an internal phase. We always have a fallback._
