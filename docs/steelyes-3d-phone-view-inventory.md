# Steelyes 3D / phone AR inventory (as of 2026-09-21)

Live base today: `main` (includes `cursor/workshop-quote-pdf-attachment-ef1c` — PDF attachment already merged).

This file is a **read-only map**. Do not invent new AR APIs or a second mesh path.

## What already exists (backend / mesh / export)

| Area | Path | Notes |
|------|------|--------|
| Mesh plan (mm, fidelity, notes) | `packages/gate-engine/src/mesh/` (`buildGateMeshPlan`) | Swing / sliding / bifold / telescopic / radius. Victorian tubes = `workshop` when cylinders exist. |
| Railhead mesh | `packages/gate-engine/src/mesh/railheads.ts` | **No-ops.** Catalogue SKUs are quote/email only. 3D does **not** draw finials or placeholder cylinders. |
| THREE.Group (metres) | `apps/web/src/lib/configurator/ar/build-gate-three-group.ts` | `mm × 0.001`, snap-to-floor for Quick Look / Scene Viewer. |
| Client export | `apps/web/src/lib/configurator/ar/export-gate-ar-model.ts` | `exportGateArModel(config)` → `{ glbBlob, usdzBlob, glbUrl, usdzUrl, fidelity, notes, revoke }` |
| Handoff helpers | `apps/web/src/lib/configurator/ar/ar-handoff.ts` | TTL **3600s**, Quick Look `#allowsContentScaling=0`, Scene Viewer `resizable=false`, magic-byte validation, expiry label. |
| Handoff unit tests | `apps/web/src/lib/configurator/ar/ar-handoff.test.ts` | Vitest — already green. |
| Ephemeral store | `apps/web/src/lib/configurator/ar/ar-model-store.ts` | Memory + disk under `tmpdir()` / `AR_MODEL_STORE_DIR`. Single-instance Coolify. |
| POST upload | `apps/web/src/app/api/ar/models/route.ts` | **Not multipart.** Raw `arrayBuffer` body + header `x-ar-format: glb \| usdz`. One format per request. Returns `{ id, format, url, expiresAt, expiresInSeconds, phoneReachable }`. |
| GET/HEAD/OPTIONS serve | `apps/web/src/app/api/ar/models/[id]/route.ts` | Path `{uuid}.glb` / `{uuid}.usdz`. CORS `*`. **410** + `code: ar_model_expired` when gone. |
| ADR | `docs/adr/002-configurator-2d-first-on-demand-3d-ar.md` | 2D default; Three.js only on demand. |
| Older Phase A note | `docs/frontend/2d-masters/PHASE_A_AR_VIEW_IN_SPACE.md` | **Stale in places** (lists `ViewInYourSpace.tsx` as if it exists; says 15 min TTL; QR already rejected). Prefer this inventory + the Cursor brief. |

## What is missing (P0 UI)

| Expected | Reality |
|----------|---------|
| `apps/web/src/components/configurator/ViewInYourSpace.tsx` | **Does not exist.** |
| CTA under 2D preview | `PreviewCanvas.tsx` is 2D SVG only. |
| Quote share AR | `QuoteShareView` already mounts `PreviewCanvas` — one CTA in `PreviewCanvas` covers `/quote/{token}` **and** `MobilePreviewSheet`. Do **not** add a second CTA in the share action column. |
| PostHog production | `apps/web/src/lib/analytics/posthog.ts` is a **no-op stub**. Use `captureConfiguratorEvent` only. Do not add `posthog-js`. |

## Preview mount points (single source)

| Surface | File | Uses `PreviewCanvas`? |
|---------|------|------------------------|
| Desktop / tablet configurator | `ConfiguratorShell.tsx` | Yes |
| Mobile preview sheet | `mobile/MobilePreviewSheet.tsx` | Yes |
| Quote share | `QuoteShareView.tsx` | Yes (`<PreviewCanvas config={config} />`) |
| Fullscreen 2D dialog | inside `PreviewCanvas.tsx` | Uses `ConfiguratorPreview` directly — CTA should sit **outside** that dialog, under the main canvas. |

## API contract (do not change unless a mobile Safari bug)

```
POST /api/ar/models
Header: x-ar-format: glb | usdz
Body: raw bytes (GLB or USDZ)
200: { id, format, url, expiresAt, expiresInSeconds, phoneReachable }

GET /api/ar/models/{uuid}.{glb|usdz}
200: binary + CORS
410: { error, code: 'ar_model_expired' }

GET /api/ar/models
200: { ok, store, ttlSeconds }
```

Public URL resolution uses `x-forwarded-host`, `COOLIFY_URL`, `NEXT_PUBLIC_SITE_URL` — required for phone handoff (not localhost).

## Product constraints

- UI language: English (configurator / quote copy today).
- Do not touch `next.config.mjs` `@resvg/resvg-js` / `sharp` externals.
- No Coolify / env / DB changes in the UI PR.
- No WebXR. No photoreal textures. No fiction-type marketing meshes.
