# PostHog post-wizard report

The wizard has completed a deep integration of the Steelyes Next.js 14 App Router project. `posthog-node` was already installed; the existing singleton client helper at `src/lib/posthog.ts` and the server-side `home page viewed` event in `src/app/page.tsx` were preserved. Two new conversion events were added: a `'use server'` Server Actions file (`src/app/actions.ts`) exposes `trackGetQuoteClicked` and `trackCatalogueViewed`, and a new `'use client'` component (`src/components/CtaButtons.tsx`) wires both CTA buttons to those actions on click. Environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`) are stored in `apps/web/.env.local` and referenced via `process.env` — never hardcoded. The client retains `enableExceptionAutocapture: true` for automatic server-side error tracking.

User identification uses the `X-POSTHOG-DISTINCT-ID` request header (set by posthog-js on the frontend once that is integrated) with a fallback of `"anonymous"` for unauthenticated renders. This ensures server events can be correlated with client-side sessions once the frontend SDK is added.

| Event | Description | File |
|---|---|---|
| `home page viewed` | Fired on every server render of the home page — top of the conversion funnel | `apps/web/src/app/page.tsx` |
| `get quote clicked` | User clicked the primary "Get a Quote" CTA — primary conversion action | `apps/web/src/app/actions.ts` |
| `catalogue viewed` | User clicked "View Catalogue" — secondary engagement / interest signal | `apps/web/src/app/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/165207/dashboard/639957
- **Home page views over time** (daily line): https://eu.posthog.com/project/165207/insights/clyF3718
- **Quote CTA clicks over time** (daily line): https://eu.posthog.com/project/165207/insights/mNXJIgmZ
- **Conversion funnel — Home → Quote**: https://eu.posthog.com/project/165207/insights/8rUNjxi9
- **Quote vs Catalogue clicks — daily** (bar chart): https://eu.posthog.com/project/165207/insights/nle4NsnE
- **Unique visitors — home page (DAU)** (area chart): https://eu.posthog.com/project/165207/insights/eNhWtDbd

As the app grows (quote form, catalogue pages, auth), add `posthog.capture()` calls in new Server Actions / API routes using the same `getPostHogClient()` helper. Pass `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers from the browser to keep server and client events correlated.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
