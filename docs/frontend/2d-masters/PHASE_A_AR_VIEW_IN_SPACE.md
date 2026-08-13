# Phase A — AR “View in your space” (2026-08-03)

## Goal

Every configured gate type can be placed at **real millimetre scale** via the phone camera using native viewers (Apple Quick Look / Google Scene Viewer). No WebXR.

## Scope (all 8 gate types)

| Type | Mesh fidelity (Phase A) |
|------|-------------------------|
| double_swing / single_swing (Victorian) | `workshop` — tube pickets |
| bifolding_* | schematic fold + frames |
| tracked / cantilever / telescopic / radius | `schematic` panels (+ radius articulated train) |

Same AR pipeline for every type; fidelity improves later without changing the CTA.

## How it works

1. Client builds `buildGateMeshPlan(config)` → Three.js group in **metres** (`mm × 0.001`)
2. Export **GLB** + **USDZ** (Three `GLTFExporter` / `USDZExporter`)
3. Client hosts GLB/USDZ on ephemeral `/api/ar/models/{id}` (15 min TTL, magic-byte validated)
4. iPhone → `rel="ar"` Quick Look (`#allowsContentScaling=0`); Android → Scene Viewer intent (`resizable=false` + HTTPS fallback); desktop → copy link / download
5. GET serves models with CORS so Scene Viewer can fetch; expired models return **410**

## Phase 2 harden (2026-08-05)

| Risk | Fix |
|------|-----|
| User pinch-rescales → tape check lies | Scale lock on Quick Look + Scene Viewer |
| Scene Viewer blocked by CORS | `Access-Control-Allow-Origin: *` on model GET |
| Hosting all-or-nothing | Partial host (GLB and/or USDZ) + download fallback |
| Localhost demo on phone | `phoneReachable` warning when origin is private |
| Silent expiry | Countdown + clear regenerate message |

## Files

| File | Role |
|------|------|
| `packages/gate-engine/src/mesh/*` | Mesh plan + radius segments + fidelity flag |
| `apps/web/src/lib/configurator/ar/build-gate-three-group.ts` | Shared Three group |
| `apps/web/src/lib/configurator/ar/export-gate-ar-model.ts` | GLB/USDZ export |
| `apps/web/src/lib/configurator/ar/ar-model-store.ts` | Ephemeral HTTPS handoff store |
| `apps/web/src/app/api/ar/models/*` | Upload + serve AR binaries |
| `apps/web/src/components/configurator/ViewInYourSpace.tsx` | CTA + dialog |
| `apps/web/src/components/configurator/PreviewCanvas.tsx` | Wires CTA on preview |

## Desktop behaviour

AR is phone-only. Desktop does **not** use QR. Instead it offers **Copy iPhone link (USDZ)** / **Copy Android link (GLB)** so the user can paste into Messages / WhatsApp and open on the phone (links expire ~15 min).

## Non-goals (later)

- S3 signed URL cache (`ar_model_key`)
- Photoreal materials / exact 2D SVG extrusion
- Custom pillar-snap AR (would need WebXR / commercial SDK + ADR change)
- Desktop QR deep-link (rejected — copy link is preferred)

## Verify

1. Configurator → **View in your space**
2. Model appears in viewer for any gate type
3. Phone: AR button → place on floor → width matches tape (approx)
4. Download GLB / USDZ works
