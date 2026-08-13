/**
 * Decorative railhead / finial cues for 3D mesh.
 * Catalogue selection lives on GateConfig for quote/email — mesh/AR do not draw finials.
 */

import type { GateConfig } from '../types'
import type { GateMeshBox } from './types'

/**
 * Top finials are catalogue-only (quote/email). Design 2D and 3D/AR do not draw them.
 */
export function pushTopRailheads(
  _boxes: GateMeshBox[],
  _args: {
    config: GateConfig
    idPrefix: string
    centerX: number
    widthMm: number
    leafHeightMm: number
    /** Span used for count formula (usually full clear opening). */
    countWidthMm?: number
    depthOffsetMm?: number
  },
): void {
  return
}

/** Dog-bar finials are catalogue-only — not drawn on mesh. */
export function pushDogBarRailheads(
  _boxes: GateMeshBox[],
  _args: {
    config: GateConfig
    idPrefix: string
    centerX: number
    widthMm: number
    leafHeightMm: number
    countWidthMm?: number
    depthOffsetMm?: number
  },
): void {
  return
}
