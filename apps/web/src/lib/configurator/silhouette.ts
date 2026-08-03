/**
 * Preloaded 2D masters for the configurator.
 *
 * Serving: Option A — files under `/2d-masters/...` (apps/web/public).
 * Policy: Design preview (mode id `technical`) uses these masters only — never invent CAD.
 * UI: `TechnicalMasterPreview` (Phase 1 masters + Phase 2 overlays; Phase 3 = default preview).
 */

export {
  SILHOUETTE_INDEX,
  SilhouetteResolveError,
  listSilhouettePublicPaths,
  resolveRailheadOverlays,
  resolveSilhouette,
  type RailheadOverlayPlan,
  type SilhouetteResolution,
  type SilhouetteResolveInput,
} from '@steelyes/gate-engine'
