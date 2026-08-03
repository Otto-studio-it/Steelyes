---
title: MyConfigurator Competitive Matrix
description: Feature comparison Steelyes configurator vs MyConfigurator (AlloTools) with gap priorities
owner: Ruben
status: ACTIVE
last_updated: 2026-06-12
sources:
  - https://www.myconfigurator.com/gates
  - https://www.myconfigurator.com/
---

# Steelyes vs MyConfigurator — competitive matrix

MyConfigurator is the primary B2B benchmark for gate/fence 3D configurators in Europe. Steelyes targets **UK metal gates** first, then **embeddable platform** sales.

Legend: ✅ Done · 🟡 Partial · 🔴 Missing · 🎯 V1 target · 📅 Post-V1

---

## Core configurator

| Feature | MyConfigurator | Steelyes today | Priority |
|---------|----------------|----------------|----------|
| Gate type selection | ✅ Many | ✅ 8 types | ✅ |
| Style / infill | ✅ | ✅ 2 styles | ✅ |
| Dimensions | ✅ Real-time | ✅ Sliders + presets | ✅ |
| Decorative options | ✅ Rich catalog | 🟡 7 options, railheads blocked | 🎯 P0 Marius |
| Motorisation | ✅ 3D motor models | 🟡 Boolean toggle | 📅 Phase 4 |
| Mounting posts | ✅ Materials + angles | 🟡 Posts step (basic) | 🎯 V1 polish |
| Fence panels | ✅ Complex fences | 🔴 Model only, UI hidden | 📅 V1.1 |
| Multi-product project | ✅ Gate+fence+wicket | 🔴 Gate only | 📅 Platform |
| Finish / colour | ✅ | ✅ 4 finishes swatch | ✅ |

---

## Visual preview

| Feature | MyConfigurator | Steelyes today | Priority |
|---------|----------------|----------------|----------|
| 2D front view | ✅ Production vector | 🟡 Technical SVG — **improving via geometry recipe** | 🎯 P0 |
| 3D view | ✅ Core product | 🟡 Box mesh placeholder | 🎯 Phase 1 |
| Top / plan view | ✅ Angles, layout | 🔴 | 📅 Phase 4 |
| Installation context | 🟡 | ✅ Ground + posts installation mode | ✅ Advantage |
| Photo simulation | ✅ In customer photo | 🔴 | 📅 Phase 4 |
| AR at home | ✅ QR on PDF | 🔴 | 📅 Phase 4 |
| Night lighting mode | ✅ | 🔴 | — (skip) |
| Realistic tube geometry | ✅ | 🟡 Double-line 2D; 3D pending | 🎯 Phase 1 |

---

## CPQ & pricing

| Feature | MyConfigurator | Steelyes today | Priority |
|---------|----------------|----------------|----------|
| Real-time price | ✅ | ✅ Indicative | ✅ |
| Public / purchase / margin prices | ✅ B2B | 🔴 Single indicative layer | 📅 Phase 2 |
| Option line items | ✅ | 🟡 Some survey_required | 🎯 P0 |
| Railhead unit pricing | ✅ | 🔴 Catalog blocked | 🎯 P0 |
| PDF quote | ✅ 3D + dimensions + cuts | 🟡 Indicative text + config | 🎯 Phase 3 |
| Admin price edit | ✅ | ✅ Supabase admin | ✅ |

---

## Quote & CRM funnel

| Feature | MyConfigurator | Steelyes today | Priority |
|---------|----------------|----------------|----------|
| Save configuration | ✅ | ✅ Supabase + localStorage | ✅ |
| Share link | ✅ | ✅ `/quote/[token]` | ✅ |
| Contact / lead | ✅ | ✅ Contact handoff | ✅ |
| Customer email | ✅ | ✅ On submit | ✅ |
| PDF download | ✅ Rich | 🟡 Basic PDF | 🎯 Phase 3 |
| ERP export | ✅ | 🔴 | 📅 Platform |

---

## UX & mobile

| Feature | MyConfigurator | Steelyes today | Priority |
|---------|----------------|----------------|----------|
| Mobile-first wizard | 🟡 | ✅ Portrait + landscape split | ✅ **Advantage** |
| Orientation hint | — | ✅ Wired portrait | ✅ |
| Brand-premium UI | 🟡 Generic manufacturer | ✅ Steelyes design system | ✅ **Advantage** |
| Performance | 🟡 Heavy 3D | ✅ 2D-first lightweight | ✅ **Advantage** |
| Honest survey copy | 🟡 | ✅ survey_required UX | ✅ **Advantage** |

---

## Platform / white-label

| Feature | MyConfigurator | Steelyes today | Priority |
|---------|----------------|----------------|----------|
| Multi-tenant SaaS | ✅ Core business | 🔴 Documented only | 📅 Phase 5 |
| Embed widget | ✅ | 🔴 | 📅 Phase 5 |
| Custom branding | ✅ | 🔴 Hard-coded Steelyes | 📅 Phase 5 |
| Open domain kernel | 🔴 Closed | ✅ `@steelyes/gate-engine` | ✅ **Advantage** |
| Self-hosted option | 🔴 | ✅ Vercel + Supabase | ✅ **Advantage** |

---

## Gap priority stack (what to build next)

### P0 — Client launch blockers

1. Marius data: prices, railheads, dimension rules  
2. Double swing Victorian 2D fidelity (geometry recipe → renderer)  
3. Production deploy  

### P1 — Credibility parity

4. Procedural 3D tubes for primary slice  
5. PDF with embedded SVG drawing  
6. Per-mechanism gate-audit renderer passes  

### P2 — Competitive feature parity

7. Photo overlay  
8. Plan view  
9. Motor catalog schematic  
10. Fence panels UI  

### P3 — Platform moat

11. TenantBundle + embed  
12. Multi-tenant admin  
13. Webhook / CRM integrations  

---

## How Steelyes wins (positioning statement)

> **MyConfigurator** sells enterprise 3D CPQ across all outdoor joinery — powerful, heavy, generic.  
> **Steelyes Platform** delivers a faster, mobile-first, brand-quality gate configurator with an honest quote funnel and an embeddable engine manufacturers can own.

Do not compete on breadth of product categories in V1. Compete on **depth, design, and deployability** for metal gates.

---

## Review cadence

Re-evaluate this matrix when:

- A new MyConfigurator release is announced  
- Marius confirms catalog data  
- V1 launch completes  
- First non-Steelyes tenant pilot starts
