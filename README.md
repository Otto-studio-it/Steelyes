# Steelyes Ltd — Bespoke Steel Gates Platform

> **British engineering excellence.** Precision-built, hand-finished bespoke steel gates. Designed and installed across the UK.

Monorepo della piattaforma digitale **Steelyes Ltd**: sito marketing, configuratore di cancelli con preview 2D/3D e pricing indicativo, pannello admin prezzi, e un motore di dominio TypeScript riutilizzabile.

## 📦 Struttura

| Path | Cosa contiene |
|---|---|
| `apps/web` | App Next.js 14 (App Router): marketing, configuratore (`/configurator`), quote share (`/quote/[token]`), admin (`/admin`) |
| `packages/gate-engine` | Motore di dominio puro TypeScript: tipi, validazione, regole (compatibilità, geometria, cantilever), pricing, render plan 2D, mesh plan 3D, serializzazione — **zero dipendenze runtime** |
| `docs/` | Regole architetturali, requisiti cliente, roadmap, audit fotografici |
| `supabase/` | Migrazioni database (gates, gate_options, configurations, quote_requests, leads) |
| `.github/` | CI/CD |

Ordine operativo:

1. `packages/gate-engine` decide il dominio.
2. `apps/web` consuma il dominio e gestisce la UI.
3. `docs/` spiega vincoli, stato e piano di esecuzione.
4. `design-system/` contiene materiale di riferimento, non logica di prodotto.
5. `assets-raw/` resta fuori dal prodotto finito e viene ignorato da git.
6. Ogni output locale temporaneo, cache o export va tenuto fuori da questi percorsi.

## 🛠 Stack

- **Framework**: Next.js 14 App Router, TypeScript strict
- **Styling**: Tailwind CSS 3 (token CSS in `globals.css`)
- **State**: Zustand (`configuratorStore`)
- **Backend**: Supabase (PostgreSQL) — pricing admin-driven con fallback al catalogo di default del motore
- **Email**: Resend
- **3D**: Three.js (feature flag `CONFIGURATOR_3D_PREVIEW_ENABLED`)
- **Testing**: Vitest (gate-engine), Playwright (e2e configuratore)
- **Monorepo**: pnpm workspace + Turborepo

## 🏁 Quickstart

Prerequisiti: Node.js 20+, pnpm 9+.

```bash
pnpm install --frozen-lockfile
pnpm dev          # http://localhost:3000
```

Variabili d'ambiente richieste per i flussi completi (vedi `apps/web/src/lib/env.ts`):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`.
Senza Supabase il configuratore funziona comunque con il catalogo prezzi di default.

## 💻 Comandi

| Comando | Effetto |
|---|---|
| `pnpm typecheck` | TypeScript strict su tutti i workspace |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest (suite gate-engine) |
| `pnpm build` | Build di produzione |
| `pnpm --filter web e2e` | Playwright e2e (richiede browser installati) |

## 🧠 Architettura in breve

- **Single source of truth nel motore**: dimensioni, regole geometriche, regola cantilever, pricing e cataloghi vivono in `packages/gate-engine`. La UI importa, non duplica.
- **Pricing config-driven**: il motore accetta un `PricingCatalog` iniettabile; il web lo costruisce dalle tabelle Supabase gestite dall'admin (`public.gates`) con fallback esplicito a `DEFAULT_PRICING_CATALOG`. Vedi `docs/db/PRICING_SEMANTICS.md`.
- **Tutti i prezzi sono indicativi** fino alla conferma del listino cliente ("Indicative, subject to survey").

## 🛑 Regole operative

- Niente push diretto su `main`: ogni modifica passa da una Pull Request.
- CI obbligatoria: `typecheck`, `lint`, `test`, `build` verdi prima del merge.

## 📚 Documenti decisionali

1. `docs/STEELYES_WORKPLAN.md`
2. `docs/DEFINITION_OF_DONE.md`
3. `docs/STACK_RULES.md`
4. `docs/CODEBASE_CONVENTIONS.md`
5. `docs/ARCHITECTURE_RULES.md`
6. `docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md` — fonte primaria per regole di dominio e prezzi
7. `docs/frontend/CONFIGURATOR_MASTER_ROADMAP_2026-05-20.md` — roadmap autoritativa configuratore
8. `docs/frontend/gate-catalog/` — schede tecniche per ogni tipologia di cancello
