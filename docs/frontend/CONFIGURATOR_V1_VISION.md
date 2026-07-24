---
title: Configurator V1 Vision
description: Client-ready scope, competitive positioning, execution phases, and definition of done
owner: Ruben
status: ACTIVE
last_updated: 2026-06-12
depends_on:
  - docs/PLATFORM_ROADMAP.md
  - docs/frontend/CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md
  - docs/adr/002-configurator-2d-first-on-demand-3d-ar.md
  - docs/frontend/gate-audits/double_swing/
---

# Configurator V1 Vision — Client-ready & platform-ready

## Executive summary

Steelyes has a **working configurator** (wizard, pricing, save/share, PDF, contact handoff) with a **solid domain kernel** (`@steelyes/gate-engine`). The gap vs a shippable client product and vs [MyConfigurator](https://www.myconfigurator.com/gates) is primarily **visual fidelity**, **CPQ data completeness**, and **immersive sales tools** — not missing wizard steps.

**Strategy:** nail **one gate type visually** (double swing Victorian), ship production quote funnel, then expand mechanisms and extract a white-label platform.

---

## Product goal

A customer configures a real Steelyes gate, trusts the preview and indicative price, and submits a quote Steelyes can fabricate from — on mobile or desktop — in under 3 minutes.

Secondary goal: the same engine becomes **`TenantBundle` embed SaaS** for other metal gate manufacturers.

---

## V1 scope freeze (Steelyes tenant #1)

### In scope

| Area | V1 target |
|------|-----------|
| Primary slice | `double_swing` + `traditional_victorian` |
| Finishes | 4 engine finishes (provisional tokens OK) |
| Steps | Gate → Dimensions → Posts → Options → Summary |
| Preview | Installation + Technical 2D; 3D schematic on desktop |
| Pricing | Indicative FROM + survey_required on blocked lines |
| Quote | Share link, PDF, contact handoff, admin pipeline |
| Geometry | Recipe layer + Victorian zone ratios from gate-audit |

### Explorable but secondary (badge “Schematic preview”)

- Other 7 gate mechanisms
- Composite boards on non-primary types
- Fence panels (hidden until Marius confirms rule)

### Post-V1 (do not block launch)

- Photo-in-environment overlay
- Native AR / GLB export
- Full motor catalog 3D
- Multi-product project (gate + fence + wicket)
- ERP / cutting-plan export

---

## Competitive positioning vs MyConfigurator

See `docs/frontend/MYCONFIGURATOR_COMPETITIVE_MATRIX.md` for full matrix.

**Win on:** mobile UX, brand design, honest pricing UX, embeddable open architecture, UK vertical depth, self-hosted cost.

**Match over time:** multi-view preview, photo simulation, PDF with drawing, real-time CPQ.

**Do not chase first:** 10 product categories, French market ERP integrations, night lighting mode.

---

## Architecture (3 layers — unchanged)

1. **`gate-engine`** — config, validation, geometry recipe, 2D plan, mesh plan, pricing, serialization  
2. **`apps/web`** — Steelyes instance (marketing + configurator + admin)  
3. **Platform** — `TenantBundle`, embed route, multi-tenant admin (Phase D)

### New: geometry recipe layer

```
GateConfig → buildGateGeometryPlan() → SwingVictorianGeometryPlan
                ↓                              ↓
         buildGateRenderPlan()          buildGateMeshPlan() [future]
```

Implemented in `packages/gate-engine/src/geometry/`.  
Source ratios: `docs/frontend/gate-audits/double_swing/TOPOLOGY_VICTORIAN.md`.

---

## Execution phases

### Phase 1 — Visual credibility (weeks 1–4) ★ current

- [x] Geometry recipe module + tests  
- [x] Four horizontal rails in Victorian swing renderer  
- [x] Tube-profile pickets (double-line schematic)  
- [x] Circle scroll bands (`bushes`) + spear row (`dog_bar_railheads`)  
- [ ] Finials following arched path per picket  
- [ ] Mesh plan consumes geometry recipe (tubes not boxes)  
- [ ] Gate-audit pass for `tracked_sliding`, `cantilever_sliding`, `single_swing`

### Phase 2 — CPQ & data (weeks 3–5, blocked on Marius)

- [ ] Railhead variant catalog + picker  
- [ ] Finish price multipliers  
- [ ] Per-mechanism dimension limits in admin  
- [ ] Bushes/spirals pricing semantics aligned with client doc  
- [ ] Reference size presets editable in admin

### Phase 3 — Client-ready polish (weeks 4–6)

- [x] Orientation hint wired (portrait phone)  
- [ ] Per-step validation  
- [ ] Step-rail forward guard  
- [ ] Production deploy + domain  
- [ ] Resend verified domain  
- [ ] Turnstile on contact  
- [ ] Fence panels step (if confirmed)

### Phase 4 — Immersive sales (weeks 7–10)

- [ ] Photo overlay v1  
- [ ] GLB / USDZ on-demand export  
- [ ] QR on PDF → AR handoff  
- [ ] Plan view (top) for driveway layout

### Phase 5 — Platform extraction (weeks 10–16)

- [ ] `TenantBundle` runtime  
- [ ] `/embed/configurator?tenant=`  
- [ ] Multi-tenant RLS + onboarding  
- [ ] IP agreement Marius vs engine

---

## Definition of Done — V1 launch

1. Marius signs off double swing Victorian preview vs reference photos  
2. FROM pricing matches client doc for primary slice (within documented bands)  
3. Quote submit → DB + workshop email + customer email + PDF  
4. Share link works in production  
5. Mobile portrait + landscape usable without layout breaks  
6. No fabricated prices on blocked catalog lines  
7. Legal footer and contact data confirmed or clearly marked pending  
8. Lighthouse mobile configurator ≥ 85

---

## Definition of Done — “beats MyConfigurator” (Steelyes perception)

| Criterion | Target |
|-----------|--------|
| Time to first preview | < 2s on 4G mobile |
| Preview recognition | “That’s our Victorian double swing” — Marius yes |
| Quote funnel | Fewer steps than MyConfigurator demo to reach human contact |
| Design | Premium brand vs generic manufacturer UI |
| Honesty | Clear indicative / survey copy — no fake precision |
| Embed readiness | Second tenant pilot with `TenantBundle` mock |

---

## Open questions for Marius (blocking fidelity)

From `docs/frontend/gate-audits/double_swing/observed.json`:

1. Photos 02–04 = 1800×1000 mm band or larger custom installs?  
2. Catalog height includes arch rise or rectangular field only?  
3. Circle bands + basket twists = which catalog line / price?  
4. Standard top railhead count at 1800 mm width?  
5. Central spear row — standard or optional?

---

## Related documents

- `docs/PLATFORM_ROADMAP.md`  
- `docs/frontend/MYCONFIGURATOR_COMPETITIVE_MATRIX.md`  
- `docs/frontend/gate-audits/`  
- `tools/gate-photo-audit/README.md`  
- `packages/gate-engine/src/geometry/`
