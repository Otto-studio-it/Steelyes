# Steelyes 

> The Architectural Forge.

This repository contains the Steelyes platform monorepo: a single deployable Next.js 14 application (`apps/web`) and a shared pure-TypeScript logic library (`packages/gate-engine`).

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- pnpm 8+

### Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open `http://localhost:3000` in your browser.

## 📁 Repository Structure

- `apps/web`: Next.js 14 App Router application (marketing, configurator, admin)
- `packages/gate-engine`: Shared TypeScript logic for 3D mesh generation and pricing
- `docs/`: Architecture rules, stack decisions, design system, and phase plans
- `supabase/`: Database migrations and local setup

## 📚 Architecture & Rules

Before contributing, please read the locked documentation:
1. `docs/PROJECT_BRIEF.md`
2. `docs/STACK_RULES.md`
3. `docs/ARCHITECTURE_RULES.md`
4. `docs/CODEBASE_CONVENTIONS.md`
5. `docs/DESIGN_RULES.md`

## 🛠 Commands

- `pnpm dev`: Start development servers across apps
- `pnpm build`: Build the project
- `pnpm lint`: Run ESLint
- `pnpm type-check`: Run TypeScript compiler check
- `pnpm test`: Run Vitest in packages

*Note: Production services (Supabase, Vercel, Resend, Sentry) are not connected in the local scaffold.*
# Steelyes
