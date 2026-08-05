import type { GateConfig } from '../types'
import type { GateMeshBox, GateMeshCylinder, GateMeshOpening, GateMeshPlan } from './types'

export type { GateMeshOpening } from './types'

/** Max absolute error (mm) for AR tape checks of clear opening × height. */
export const MESH_ENVELOPE_TOLERANCE_MM = 2

export type GateMeshOpeningMeasurement = {
  /** Horizontal span of opening members (posts / counterbalance excluded). */
  leafSpanMm: number
  /** Vertical span of opening members (ground → top of leaf frame). */
  leafHeightMm: number
  minXMm: number
  maxXMm: number
  minYMm: number
  maxYMm: number
}

export type GateMeshOpeningCheck = GateMeshOpeningMeasurement & {
  clearOpeningMm: number
  heightMm: number
  widthErrorMm: number
  heightErrorMm: number
  withinTolerance: boolean
}

function isOpeningBox(box: GateMeshBox): boolean {
  // Frame / panel / bar only — posts, counterbalance, tracks, and leaf rails are excluded
  // so the AABB matches clear opening × ground-to-top-rail (CA-08).
  return box.role === 'frame' || box.role === 'panel' || box.role === 'bar'
}

function isOpeningCylinder(cylinder: GateMeshCylinder): boolean {
  return cylinder.role === 'bar'
}

/**
 * Axis-aligned bounds of leaf / panel members that represent the clear opening.
 * Mounting posts and cantilever counterbalance are excluded so tape checks match CA-08.
 */
export function measureMeshOpening(plan: GateMeshPlan): GateMeshOpeningMeasurement | null {
  let minX = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY
  let count = 0

  for (const box of plan.boxes) {
    if (!isOpeningBox(box)) continue
    const halfW = box.widthMm / 2
    const halfH = box.heightMm / 2
    minX = Math.min(minX, box.positionMm[0] - halfW)
    maxX = Math.max(maxX, box.positionMm[0] + halfW)
    minY = Math.min(minY, box.positionMm[1] - halfH)
    maxY = Math.max(maxY, box.positionMm[1] + halfH)
    count += 1
  }

  for (const cylinder of plan.cylinders) {
    if (!isOpeningCylinder(cylinder)) continue
    minX = Math.min(minX, cylinder.positionMm[0] - cylinder.radiusMm)
    maxX = Math.max(maxX, cylinder.positionMm[0] + cylinder.radiusMm)
    minY = Math.min(minY, cylinder.positionMm[1] - cylinder.heightMm / 2)
    maxY = Math.max(maxY, cylinder.positionMm[1] + cylinder.heightMm / 2)
    count += 1
  }

  if (count === 0 || !Number.isFinite(minX) || !Number.isFinite(maxX)) {
    return null
  }

  return {
    leafSpanMm: maxX - minX,
    leafHeightMm: maxY - minY,
    minXMm: minX,
    maxXMm: maxX,
    minYMm: minY,
    maxYMm: maxY,
  }
}

export function checkMeshOpeningEnvelope(
  plan: GateMeshPlan,
  config: Pick<GateConfig, 'widthMm' | 'heightMm'>,
  toleranceMm: number = MESH_ENVELOPE_TOLERANCE_MM,
): GateMeshOpeningCheck | null {
  const measured = measureMeshOpening(plan)
  if (!measured) return null

  const widthErrorMm = measured.leafSpanMm - config.widthMm
  const heightErrorMm = measured.leafHeightMm - config.heightMm

  return {
    ...measured,
    clearOpeningMm: config.widthMm,
    heightMm: config.heightMm,
    widthErrorMm,
    heightErrorMm,
    withinTolerance:
      Math.abs(widthErrorMm) <= toleranceMm && Math.abs(heightErrorMm) <= toleranceMm,
  }
}

export function buildMeshOpening(config: Pick<GateConfig, 'widthMm' | 'heightMm'>): GateMeshOpening {
  return {
    clearOpeningMm: config.widthMm,
    heightMm: config.heightMm,
    datum: 'clear_opening_ground_to_top_rail',
  }
}
