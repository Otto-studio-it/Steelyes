# Steelyes

> The Architectural Forge.

Questo repository contiene il codice per la piattaforma digitale **Steelyes**: una moderna applicazione Next.js 14 (`apps/web`) e una libreria logica condivisa in TypeScript puro (`packages/gate-engine`).

## 🚀 Stato Attuale: Phase 0 (Scaffold)
Il progetto è attualmente in **Phase 0**. L'infrastruttura di base (monorepo, CI base) è presente. 
*Nota: Le integrazioni esterne (Supabase, Vercel, Resend, AWS, Sentry) non sono ancora state configurate completamente.*

## 🛠 Stack Approvato
- **Framework**: Next.js 14 App Router
- **Lingua**: TypeScript strict
- **Styling**: Tailwind CSS 3 + shadcn/ui (copied primitives)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Backend / Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Storage / CDN**: AWS S3 / CloudFront
- **Email**: Resend
- **Testing**: Playwright (E2E), Vitest (Unit)
- **Monorepo**: pnpm workspace + Turborepo

## 📁 Struttura Repo ad Alto Livello
- `apps/web`: Next.js 14 App Router application (marketing, configurator, admin)
- `packages/gate-engine`: Shared TypeScript logic per pricing e 3D mesh generation
- `docs/`: Regole architetturali, decisioni tecniche, design system e piani di lavoro
- `supabase/`: Migrazioni del database e configurazione locale
- `.github/`: Workflow CI/CD, issue template e branch protection rules

## 🏁 Come Iniziare (Locale)

### Prerequisiti
- Node.js 20+
- pnpm 9+

### Installazione
1. Clona la repo e installa le dipendenze:
   ```bash
   pnpm install --frozen-lockfile
   ```

2. Avvia il server di sviluppo:
   ```bash
   pnpm dev
   ```

3. Apri `http://localhost:3000` nel browser.

## 💻 Comandi Standard
- `pnpm install`: Installa le dipendenze usando il lockfile.
- `pnpm typecheck`: Esegue il check TypeScript rigoroso in tutti i workspace.
- `pnpm lint`: Avvia ESLint.
- `pnpm test`: Esegue Vitest.
- `pnpm build`: Effettua la build di produzione (Next.js + package).
*(Lo script E2E con Playwright verrà aggiunto nella Phase 1).*

## 🛑 Regole Operative (Git & CI)
- **Niente push diretto su `main`**: Tutte le modifiche devono passare per una Pull Request.
- **CI Obbligatoria**: Tutti i check (`typecheck`, `lint`, `test`, `build`) devono essere verdi prima del merge.
- **Branch Protection**: 
  > **Nota**: Se per ora stai lavorando completamente da solo, abbassa temporaneamente la branch protection togliendo "Require approvals", lascia però attivi i required status checks, e più avanti riattiva la review obbligatoria quando il flusso repo sarà completo.

## 📚 Documenti Decisionali (Fonte di Verità)
Non iniziare a sviluppare senza aver prima letto e compreso i seguenti documenti (bloccati e inalterabili):
1. `docs/STEELYES_WORKPLAN.md`
2. `docs/DEFINITION_OF_DONE.md`
3. `docs/STACK_RULES.md`
4. `docs/CODEBASE_CONVENTIONS.md`
5. `docs/ARCHITECTURE_RULES.md`
