---
title: Platform Roadmap
description: Architecture and execution plan from Steelyes tenant #1 to embeddable multi-tenant product
owner: Ruben
status: ACTIVE
last_updated: 2026-06-12
---

# Platform Roadmap — Steelyes Configurator

## Vision

Build a **professional gate configurator** for Steelyes first, then extract an **embeddable platform** comparable to MyConfigurator — sold to manufacturers and installers as a white-label widget with admin-managed catalogues and lead routing.

Steelyes remains **tenant #1** and the live proof of the product.

---

## Architecture (3 layers)

### Layer 1 — `@steelyes/gate-engine`

Pure TypeScript domain kernel:

- `GateConfig` model, validation, dimension limits, cantilever rules
- `PricingCatalog` injection (base prices + options)
- 2D render plan + 3D mesh plan (schematic)
- JSON v1 serialization

**Rule:** no React, Supabase, or Three.js imports.

### Layer 2 — `apps/web` (Steelyes instance)

- Marketing site + configurator wizard
- Supabase-backed pricing (`gates`, `gate_options`) → `fetchPricingCatalog()`
- Share route `/quote/[shareToken]`, contact handoff, PDF export
- Admin: prices, options, fencing, **quote pipeline**

### Layer 3 — Platform (future)

```typescript
type TenantBundle = {
  id: string
  branding: { logo: string; colors: Record<string, string> }
  locale: 'en-GB' | 'it-IT'
  currency: 'GBP' | 'EUR'
  catalog: PricingCatalog & FinishCatalog & ConstraintCatalog
  enabledGateTypes: GateType[]
  leads: { email: string; webhook?: string }
}
```

Delivery: iframe embed + script loader + `postMessage` events.

---

## Completed in 6-hour sprint (2026-06-12)

| Item | Location |
|---|---|
| Option pricing from Supabase `gate_options` | `pricing-catalog.ts`, `pricing-catalog-server.ts` |
| Shared configuration summary helpers | `configuration-summary.ts`, `ConfigurationSummary.tsx` |
| Wizard step gating (validation blocks forward navigation) | `configuratorStore.ts`, `ConfiguratorShell.tsx`, `ConfiguratorPriceBar.tsx` |
| Theming token cleanup (configurator UI) | configurator components → Tailwind semantic tokens |
| Admin quote pipeline with status updates | `admin/quotes/` |
| Customer confirmation email on quote submit | `app/actions.ts` |
| Indicative PDF download | `quote-pdf.ts`, `/api/quote/[shareToken]/pdf` |
| E2E: PDF link + API smoke | `configurator.spec.ts` |

---

## Phase A — Data consolidation (next)

- [ ] Admin-editable reference sizes and dimension-step uplifts (DB migration)
- [ ] Per-mechanism dimension limits when Marius confirms values
- [ ] Railhead variant catalog unblock (`catalog/railheads.ts`)
- [ ] Align bushes/spirals pricing semantics with client doc (£90 flat vs per-unit)
- [ ] Regression tests for `buildPricingCatalogFromDbRows`

## Phase B — Product polish

- [ ] Per-step validation (not only global `validateGateConfig`)
- [ ] Disable step-rail jumps to unreachable future steps
- [ ] Unified `ConfigurationSummary` everywhere (admin uses inline formatter)
- [ ] Resend verified domain (replace `onboarding@resend.dev`)
- [ ] Turnstile wired to contact form

## Phase C — Visual fidelity

- [ ] Enable 3D on desktop (`NEXT_PUBLIC_CONFIGURATOR_3D=true`)
- [ ] Procedural mesh per gate type (use `docs/frontend/gate-audits/`)
- [ ] Photo-in-environment overlay (v2)
- [ ] AR / GLB export via `ar_model_key` (v2)

## Phase D — Platform extraction

- [ ] `TenantBundle` contract exported from engine
- [ ] `/embed/configurator?tenant=…` route
- [ ] Multi-tenant admin + RLS
- [ ] SaaS pricing + onboarding docs
- [ ] IP agreement with Marius (engine vs Steelyes data)

---

## External blockers (Marius)

- Final list prices and automated price columns
- Railhead variant catalogue
- Fence panel 900–1000 mm rule scope
- Per-mechanism install limits

Until confirmed, the engine uses documented fallbacks and `survey_required` status.

---

## Definition of Done — Steelyes production configurator

1. Admin price change → configurator reflects it (gates **and** options)
2. User cannot advance wizard with invalid configuration
3. Quote submit → lead in DB + workshop email + **customer email** + PDF link
4. Admin can manage quote pipeline statuses
5. CI green: gate-engine tests + typecheck + configurator e2e

## Definition of Done — Platform v1

1. Second tenant runs on separate `TenantBundle` without code fork
2. Embed works on external site via iframe
3. Leads route to tenant email/webhook
4. Branding configurable per tenant
