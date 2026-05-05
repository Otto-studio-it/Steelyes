---
title: Client Blockers
description: Asset tracker, impact, fallback strategies, weekly check-ins
owner: Ruben (project manager)
status: ACTIVE
last_updated: 2026-05-04
---

# Steelyes — Client Blockers

> Weekly tracker for client-provided assets that block or enhance the product.
> Updates every Monday. Escalate on Friday if overdue.

---

## Asset tracker (sorted by criticality)

| Asset | Needed by | Phase blocked | Impact | Status | Fallback | Owner |
|-------|-----------|---------------|--------|--------|----------|-------|
| **Logo SVG (vector)** | Week 2 | Phase 1 | Nav/footer look incomplete | ⏳ pending | Wordmark text only | Marius |
| **Price list (`public.gates`: `base_price_manual_gbp` + `base_price_auto_gbp` per row, plus option multipliers)** | Week 6 | Phase 2 | Configurator shows placeholder or NULL auto prices | ⏳ pending | "Indicative, subject to survey"; show manual vs motorised clearly | Marius |
| **Railhead variants + unit prices** | Week 6 | Phase 2 | Railheads only as `gate_options` / `per_railhead`; prices non-final until variants confirmed | ⏳ pending | Keep wide placeholder range + copy "subject to survey"; no dedicated table until data arrives | Marius |
| **Finish palette + multipliers** | Week 6 | Phase 2 | Configurator missing finishes | ⏳ pending | 4 generic: matte-black, zinc, bronze, pearl | Marius |
| **Installation zones (postcode prefixes)** | Week 4 | Phase 1 | Postcode check widget hidden | ⏳ pending | "UK-wide coverage" | Marius |
| **Case Study content ("the dream gate")** | Week 3 | Phase 1 | Case study page not published | ⏳ pending | Page hidden from nav, redirect to `/` | Marius |
| **Telescopic install video** | Week 12 | Phase 4 | Gallery missing showcase video | ⏳ pending | Video slot empty, add post-launch | Marius |
| **Company Number + VAT** | Week 4 | Phase 1 | Footer legal block incomplete | ⏳ pending | Blank, flag for pre-launch checklist | Marius |
| **Business email + phone + address** | Week 4 | Phase 1 | Contact page shows placeholders | ⏳ pending | Yahoo email + temp phone, update pre-launch | Marius |
| **Photo consent from property owners** | Week 12 | Phase 4 | Gallery cannot publish | ⏳ pending | Workshop/in-progress photos only | Marius |
| **DNS registrar access** | Week 13 | Phase 4 | Domain cutover blocked | ⏳ pending | Deploy to `steelyes.vercel.app` temporarily | Marius |
| **DNS for email (SPF/DKIM/DMARC)** | Week 13 | Phase 4 | Resend emails → spam | ⏳ pending | Use `resend.dev` subdomain, flag post-launch | Marius |

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
- Finish palette with multipliers — product personalization

**If missing**: launch with 4 generic finishes (matte-black, zinc-grey, bronze, pearl-white) and visibly marked "Indicative pricing, subject to survey"

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
- Finish palette (configurator feature)
- Company legal details (compliance)
- Installation zones (service area validation)

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
└─ Finish palette
   └─ Configurator finishes (CRITICAL — Week 6)

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

**Active document.** Update every Monday. Last update: 2026-05-04 · Next update: next Monday (rolling)

_Remember: a missing asset never blocks an internal phase. We always have a fallback._
