/**
 * Motorised Design masters — product lock.
 *
 * When a pack has `*_motorised` SVGs, resolveSilhouette picks them via
 * `when.motorised: true`. Manual/manuale masters already include the handle
 * when the client drew one. Shared packs (tracked / cantilever / …) use one
 * CAD for both states — no handle overlay, no motor kit drawn.
 */

import type { GateConfig } from '../types'

export type MotorOverlayInstance = {
  id: string
  xRatio: number
  yRatio: number
}

export type MotorOverlayPlan = {
  instances: MotorOverlayInstance[]
  notes: string[]
}

export type ResolveMotorOverlayOptions = {
  /** Ignored — masters never get a composited motor kit. */
  masterIncludesMotor?: boolean
}

/** Always empty — motor kits are not drawn on Design masters. */
export function resolveMotorOverlay(
  _config: Pick<GateConfig, 'gateType' | 'motorised'>,
  _options: ResolveMotorOverlayOptions = {},
): MotorOverlayPlan {
  return {
    instances: [],
    notes: ['Motor kit never drawn on Design masters (product lock).'],
  }
}
