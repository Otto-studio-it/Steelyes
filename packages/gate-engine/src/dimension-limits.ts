import { GATE_TYPES, type GateType } from './types'

export type DimensionLimits = {
  minWidthMm: number
  maxWidthMm: number
  minHeightMm: number
  maxHeightMm: number
}

/**
 * Global fallback envelope. Prefer getDimensionLimits(gateType).
 */
export const GLOBAL_DIMENSION_LIMITS: DimensionLimits = {
  minWidthMm: 600,
  maxWidthMm: 6000,
  minHeightMm: 600,
  maxHeightMm: 3000,
}

/**
 * Per-type limits from intake 2026-07-26 bands (mins) + ship max inventions
 * where Marius gave only starting bands. Tracked max ~10 m from intake.
 */
export const GATE_DIMENSION_LIMITS: Record<GateType, DimensionLimits> = {
  double_swing: { minWidthMm: 1800, maxWidthMm: 5000, minHeightMm: 800, maxHeightMm: 2500 },
  single_swing: { minWidthMm: 800, maxWidthMm: 2000, minHeightMm: 800, maxHeightMm: 2500 },
  tracked_sliding: { minWidthMm: 2500, maxWidthMm: 10000, minHeightMm: 800, maxHeightMm: 2500 },
  cantilever_sliding: { minWidthMm: 2500, maxWidthMm: 6000, minHeightMm: 800, maxHeightMm: 2500 },
  bifolding_double_swing: { minWidthMm: 2800, maxWidthMm: 6000, minHeightMm: 800, maxHeightMm: 2500 },
  single_bifolding: { minWidthMm: 1400, maxWidthMm: 3000, minHeightMm: 800, maxHeightMm: 2500 },
  telescopic_sliding: { minWidthMm: 2000, maxWidthMm: 8000, minHeightMm: 800, maxHeightMm: 2500 },
  radius_sliding: { minWidthMm: 1600, maxWidthMm: 5000, minHeightMm: 800, maxHeightMm: 2500 },
}

// Ensure every GATE_TYPES key exists (compile-time sanity).
void GATE_TYPES

export function getDimensionLimits(gateType?: GateType): DimensionLimits {
  if (gateType && gateType in GATE_DIMENSION_LIMITS) {
    return GATE_DIMENSION_LIMITS[gateType]
  }

  return GLOBAL_DIMENSION_LIMITS
}
