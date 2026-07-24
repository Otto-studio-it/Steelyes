import { GATE_TYPES, type GateType } from './types'

export type DimensionLimits = {
  minWidthMm: number
  maxWidthMm: number
  minHeightMm: number
  maxHeightMm: number
}

/**
 * Global fabrication envelope for the current configurator slice.
 * This is the single source of truth for dimension bounds: the web UI must
 * import these values instead of redefining them.
 */
export const GLOBAL_DIMENSION_LIMITS: DimensionLimits = {
  minWidthMm: 600,
  maxWidthMm: 6000,
  minHeightMm: 600,
  maxHeightMm: 3000,
}

/**
 * Per-gate-type limits. The client has not yet confirmed per-mechanism
 * install limits (see docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md
 * open questions), so every type currently inherits the global envelope.
 * When confirmed values arrive, override individual entries here — the
 * validation, normalization, and UI all read through getDimensionLimits.
 */
export const GATE_DIMENSION_LIMITS: Record<GateType, DimensionLimits> = Object.fromEntries(
  GATE_TYPES.map((gateType) => [gateType, { ...GLOBAL_DIMENSION_LIMITS }]),
) as Record<GateType, DimensionLimits>

export function getDimensionLimits(gateType?: GateType): DimensionLimits {
  if (gateType && gateType in GATE_DIMENSION_LIMITS) {
    return GATE_DIMENSION_LIMITS[gateType]
  }

  return GLOBAL_DIMENSION_LIMITS
}
