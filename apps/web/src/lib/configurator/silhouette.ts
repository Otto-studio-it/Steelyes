/**
 * Preloaded 2D masters for the configurator.
 *
 * Serving: Option A — files under `/2d-masters/...` (apps/web/public).
 * Policy: Design preview (mode id `technical`) uses these masters only — never invent CAD.
 * UI: `TechnicalMasterPreview` (masters + railhead overlays + CA-01 handle overlay).
 */

export {
  SILHOUETTE_INDEX,
  SilhouetteResolveError,
  listSilhouettePublicPaths,
  resolveHandleOverlay,
  resolveRailheadOverlays,
  resolveSilhouette,
  type HandleOverlayPlan,
  type RailheadOverlayPlan,
  type SilhouetteResolution,
  type SilhouetteResolveInput,
} from '@steelyes/gate-engine'
