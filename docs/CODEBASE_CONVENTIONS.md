---
title: Codebase Conventions
description: File naming, folder structure, imports, code style, branch naming, commit format
owner: Ruben (tech lead)
status: APPROVED for execution
last_updated: 2026-04-20
---

# Steelyes — Codebase Conventions

> Strict, enforceable rules for file naming, folder structure, and code organization.
> No negotiation. Use these everywhere or use nothing.

---

## Folder naming

**All lowercase, kebab-case.**

```
apps/
  web/
    src/
      app/
        (marketing)/
        (configurator)/
        (admin)/
        api/
      components/
        marketing/           # bespoke brand components
        configurator/        # 3D and form components
        admin/               # admin panel components
        ui/                  # shadcn primitives (copied)
      lib/
        supabase/            # Supabase client factories
        validation/          # Zod schemas
        email/               # React Email templates
        utils/               # pure utilities
      hooks/                 # custom React hooks
      store/                 # Zustand stores
      styles/                # CSS files, tokens
      content/               # MDX, JSON content
      tests/
        unit/                # co-located unit tests
        e2e/                 # Playwright E2E
packages/
  gate-engine/
    src/
      types.ts
      pricing.ts
      mesh/
      export/
    tests/                   # Vitest tests
docs/
  adr/                       # architecture decision records
  phases/                    # phase-specific docs
supabase/
  migrations/                # SQL migration files
  seed.sql
```

---

## File naming

### React components: **PascalCase**

```
src/components/marketing/GateCard.tsx
src/components/configurator/ConfiguratorCanvas.tsx
src/components/admin/RequestsKanban.tsx
src/components/ui/Button.tsx
```

### Logic, utilities, hooks: **camelCase**

```
src/lib/validation/quoteSchema.ts
src/lib/supabase/clientFactory.ts
src/lib/utils/priceFormatter.ts
src/hooks/useLiveRequests.ts
src/store/configuratorStore.ts
```

### Pages: **page.tsx** (Next.js convention)

```
src/app/(marketing)/page.tsx          # homepage
src/app/(marketing)/gates/page.tsx
src/app/(configurator)/configurator/[type]/page.tsx
src/app/(admin)/admin/page.tsx
```

### API routes: **route.ts** (Next.js convention)

```
src/app/api/webhooks/resend/route.ts
src/app/api/og/[slug]/route.ts
```

### Tests: **{name}.test.ts** or **{name}.spec.ts**

```
src/lib/utils/priceFormatter.test.ts
packages/gate-engine/tests/pricing.test.ts
apps/web/tests/e2e/quote-flow.spec.ts
```

---

## Route structure

**Exact paths — no synonyms, no variations.**

```
Marketing (SSG/ISR):
/
/gates
/gates/{style}  (modern, classic, privacy, bifolding, cantilevered, sliding, sliding-radius, double-swing, telescopic)
/railings
/balconies-terraces
/security-solutions
/staircases-metalwork
/installation
/gallery
/about
/contact
/case-study/{slug}
/legal/privacy-policy
/legal/cookie-policy
/legal/terms

Configurator (CSR):
/configurator
/configurator/{type}  (double-swing, sliding, bifolding, cantilevered, sliding-radius, telescopic)
/quote/{shareToken}

Admin (SSR + auth):
/admin
/admin/requests
/admin/requests/{id}
/admin/gates
```

---

## Import organization (strict order)

1. **External packages** (React, Next.js, npm deps)
2. **Internal absolute imports** (from `@/lib`, `@/components`)
3. **Relative imports** (from `./`, `../`)
4. **Type imports** at the top (use `import type`)

```ts
// External
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

// Internal absolute
import { calculatePrice } from '@/lib/pricing';
import { Button } from '@/components/ui/Button';
import { quoteSchema } from '@/lib/validation/quoteSchema';

// Types
import type { GateConfig } from '@/lib/types';

// Relative
import { helper } from '../utils';
```

**No barrel exports** (`export { A } from './A'`). Import directly from files.

---

## Gate Engine structure

Locked. This package is shared between frontend (client preview) and backend (Server Actions).

```
packages/gate-engine/
├── src/
│   ├── types.ts
│   │   ├── export type GateConfig
│   │   ├── export type GateType
│   │   ├── export type Gate
│   │   └── enums: FinishCode, TubeSize
│   │
│   ├── pricing.ts
│   │   ├── export function calculatePrice(gate, config): number
│   │   ├── throws PricingError if invalid input
│   │   └── pure TS, zero deps (except types)
│   │
│   ├── mesh/
│   │   ├── index.ts
│   │   │   ├── export function buildGateMesh(type, config): THREE.Group
│   │   │   └── dispatcher to builders
│   │   │
│   │   ├── shared.ts
│   │   │   ├── export function buildFrame(...)
│   │   │   ├── export function buildInfill(...)
│   │   │   ├── export function applyFinish(...)
│   │   │   ├── export function disposeGate(scene)
│   │   │   └── Materials (PBR matte-black, zinc-grey, bronze, pearl-white)
│   │   │
│   │   ├── double-swing.ts  (1 or 2 leaves)
│   │   ├── sliding.ts       (1 leaf + rail)
│   │   ├── bifolding.ts     (2–4 panels)
│   │   ├── cantilevered.ts  (leaf + overhead track + counterweight)
│   │   ├── sliding-radius.ts (curved rail)
│   │   └── telescopic.ts    (2–3 overlapping sections)
│   │
│   └── export/
│       ├── glb.ts
│       │   └── export function exportGLB(scene): ArrayBuffer
│       │
│       └── usdz.ts
│           └── export function exportUSDZ(scene): ArrayBuffer
│
└── tests/
    ├── pricing.test.ts
    ├── mesh/
    │   ├── double-swing.test.ts
    │   ├── sliding.test.ts
    │   └── ...
    └── export/
        ├── glb.test.ts
        └── usdz.test.ts
```

---

## TypeScript

### Strict mode: **non-negotiable**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### Rules

- **No `any` types** — use `unknown` and type-guard if needed
- **Explicit return types** on all functions
- **Explicit parameter types** on all function params
- **Type imports**: `import type { Foo } from 'bar'` for types only

```ts
// ✅ Good
export function priceFor(config: GateConfig, gate: Gate): number {
  return calculatePrice(config, gate);
}

// ❌ Bad
export function priceFor(config: any) {
  return calculatePrice(config);
}
```

---

## Comments

**Explain "why", not "what".**

```ts
// ✅ Good — explains reasoning
// We use Zustand selectors to prevent whole-tree re-renders during
// rapid slider drag (50 ms debounce). Context would re-render every descendant.
const price = store((s) => s.price);

// ❌ Bad — obvious from code
// Get the price from store
const price = store((s) => s.price);

// ✅ Good — documents constraint
// Scale mm → m for AR viewers (Quick Look, Scene Viewer expect metres).
// Verify with tape measure on real device.
const scaleFacto = 0.001; // mm to m

// ❌ Bad — unhelpful
// Convert scale
const scaleFacto = 0.001;
```

---

## Constants

**UPPER_SNAKE_CASE**, defined at top of file or module.

```ts
const MAX_WIDTH_MM = 6000;
const MIN_WIDTH_MM = 600;
const AR_MODEL_CACHE_TTL_MIN = 15;
const REBUILD_DEBOUNCE_MS = 50;
const CANTILEVER_VISUAL_BUFFER = 1.3;
```

---

## Environment variables

**Validate with Zod at app startup.**

```ts
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  TURNSTILE_SECRET_KEY: z.string(),
  // ... more
});

export const env = envSchema.parse(process.env);
```

---

## Zod schemas

**Shared client+server validation.**

```ts
// lib/validation/quoteSchema.ts
import { z } from 'zod';

export const quoteSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  postcode: z.string().regex(/^[A-Z]{1,2}\d/i, 'Invalid UK postcode'),
  configurationId: z.string().uuid().optional(),
  turnstileVerified: z.boolean(),
});

export type Quote = z.infer<typeof quoteSchema>;
```

---

## Server Actions

**Colocated in route folder. Named `actions.ts`.**

```
apps/web/src/app/(configurator)/configurator/[type]/
├── page.tsx
├── layout.tsx
└── actions.ts  ← Server Actions here

// Inside actions.ts:
'use server';

import { quoteSchema } from '@/lib/validation/quoteSchema';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function submitQuote(input: unknown) {
  // Validate
  const parsed = quoteSchema.parse(input);

  // Authorize (RLS does the hard work)
  // Turnstile verified == allowed to insert

  // Execute
  const { data, error } = await supabaseAdmin
    .from('quote_requests')
    .insert([parsed]);

  if (error) throw error;

  // Notify (email, etc.)
  await sendConfirmationEmail(parsed.email);

  return { success: true };
}
```

---

## Supabase clients

**Two clients: browser (anon) and server (admin).**

```ts
// lib/supabase/client.ts — browser, anon key
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// lib/supabase/server.ts — server only, admin key
import { createServerClient } from '@supabase/ssr';

export const supabaseAdmin = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  // ...
);
```

---

## Testing

### Unit tests (gate-engine, utils)

**Vitest, ≥95% coverage on gate-engine.**

```ts
// packages/gate-engine/tests/pricing.test.ts
import { describe, it, expect } from 'vitest';
import { calculatePrice } from '../src/pricing';

describe('calculatePrice', () => {
  it('calculates correct price for double-swing', () => {
    const gate = { basePricePerM2: 100, tubeMultipliers: { 50: 1.0 }, /* ... */ };
    const config = { widthMm: 2000, heightMm: 2000, leafCount: 2, /* ... */ };
    const price = calculatePrice(gate, config);
    expect(price).toBe(800); // 100 * (2*2) * 1.0
  });
});
```

### E2E tests (Playwright)

**Smoke tests per PR on key user flows.**

```ts
// apps/web/tests/e2e/quote-flow.spec.ts
import { test, expect } from '@playwright/test';

test('quote flow end-to-end', async ({ page }) => {
  await page.goto('/');
  await page.click('button:has-text("Get a Quote")');
  await page.fill('input[name="firstName"]', 'John');
  // ... fill form
  await page.click('button:has-text("Submit")');
  // Verify email sent, record in DB, admin notified
});
```

---

## Branch naming

**`{type}/{kebab-case}`**

```
feat/add-testimonial-carousel
feat/ar-export-usdz
fix/canvas-memory-leak
fix/turnstile-false-positive
docs/update-architecture-doc
chore/upgrade-dependencies
refactor/consolidate-types
```

---

## Commit format

**Conventional Commits**

```
feat(configurator): add sliding-radius mesh builder
  - Implements curved rail via ExtrudeGeometry along spline
  - Adds radius validation (min 800mm)
  - Includes unit tests with bounding box assertions

fix(pricing): round final price to nearest pound
  - Floating-point precision (1.15 * 2400 * 1.08) was off by 0.01
  - Now consistent client vs server

docs(architecture): update database schema section
  - Add admin_audit table
  - Clarify RLS policy intent

chore(deps): bump Next.js 14.1 → 14.2
  - Performance improvements
  - pnpm audit clean
```

---

## Code style

### Imports

```ts
// ✅ Good
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import type { GateConfig } from '@/lib/types';

// ❌ Bad — mixed order
import type { GateConfig } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
```

### Arrow functions

```ts
// ✅ Good
export const buildGateMesh = (type: GateType, config: GateConfig): THREE.Group => {
  // ...
};

// ❌ Bad — no return type
export const buildGateMesh = (type, config) => {
  // ...
};
```

### Object destructuring

```ts
// ✅ Good
const { width, height, tube } = config;

// ❌ Bad — verbose
const width = config.width;
const height = config.height;
const tube = config.tube;
```

---

## Forbidden patterns

- ❌ `console.log` in production code (use DevTools)
- ❌ `any` types (use `unknown` + type guard)
- ❌ `TODO` without issue ref (`TODO: fix #123`)
- ❌ Hardcoded secrets (use env vars)
- ❌ Barrel exports (`export { A } from './A'`)
- ❌ Commented-out code (delete or branch)
- ❌ `.prettierrc`, `.prettierignore` (use default Prettier)

---

**Locked document.** No exceptions.

_Last reviewed: 20 April 2026 · Next review: After first style violation or new pattern adoption_
