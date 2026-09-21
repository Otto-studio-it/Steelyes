# Steelyes 3D / phone AR inventory (as of 2026-09-21)

Live base today: `main` (includes `cursor/workshop-quote-pdf-attachment-ef1c` — PDF attachment already merged).

This file is a **read-only map**. Do not invent new AR APIs or a second mesh path.

## What already exists (backend / mesh / export)

| Area | Path | Notes |
|------|------|--------|
| Mesh plan (mm, fidelity, notes) | `packages/gate-engine/src/mesh/` (`buildGateMeshPlan`) | Swing / sliding / bifold / telescopic / radius. Victorian tubes = `workshop` when cylinders exist. |
| Railhead mesh | `packages/gate-engine/src/mesh/railheads.ts` | **No-ops.** Catalogue SKUs are quote/email only. 3D does **not** draw finials or placeholder cylinders. |
| Three.js scene graph (metres) | `apps/web/src/lib/configurator/ar/build-gate-three-group.ts` | `mm × 0.001`. One merged mesh + one opaque material per role. Returns a wrapper `root`; the floor snap sits on the child group because USDZExporter drops the transform of the object it is given. |
| Server export | `apps/web/src/lib/configurator/ar/export-gate-ar-model.ts` | `exportGateArModel(config, 'glb' \| 'usdz')` → `{ bytes, fidelity }`. Runs in Node (small `FileReader` shim for GLTFExporter). |
| Handoff helpers | `apps/web/src/lib/configurator/ar/ar-handoff.ts` | `buildArModelPath` / `parseArModelFile`, Quick Look `#allowsContentScaling=0`, Scene Viewer `resizable=false` (package `com.google.android.googlequicksearchbox` for `ar_preferred`). |
| Unit tests | `ar-handoff.test.ts`, `export-gate-ar-model.test.ts` | Vitest, run by `pnpm test`. |
| GET/HEAD/OPTIONS model | `apps/web/src/app/api/ar/gate/[file]/route.ts` | Path `{shareToken}.glb` / `{shareToken}.usdz`. Model is generated server-side from the saved configuration (no client upload, no expiry). CORS `*`, per-IP rate limit, small in-process LRU, exempt from site hold. |
| Open perimeter leaf frame | `packages/gate-engine/src/mesh/leaf-frame.ts` | Victorian leaves = stiles + bottom + top (or arch segments). Replaced the solid W×H box that hid every picket in 3D / AR. |
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
