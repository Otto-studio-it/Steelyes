import type { GateConfig } from '../types'

export type MotorOverlayInstance = {
  id: string
  /** 0–1 across the full master image width (centre of motor kit marker). */
  xRatio: number
  /** 0–1 from top of the master image (centre of motor kit marker). */
  yRatio: number
  kind: 'post_operator' | 'track_operator'
}

export type MotorOverlayPlan = {
  instances: MotorOverlayInstance[]
  notes: string[]
}

/**
 * Product lock (PHASE_MOTOR_MANUAL): Design never draws a motor kit.
 * Motorised = dedicated `*_motorised` master (no handle); manual = handle overlay only.
 */
export function resolveMotorOverlay(
  config: Pick<GateConfig, 'gateType' | 'motorised'>,
  _opts?: { masterIncludesMotor?: boolean },
): MotorOverlayPlan {
  if (!config.motorised) {
    return {
      instances: [],
      notes: ['Manual — no motor kit on Design masters.'],
    }
  }

  return {
    instances: [],
    notes: [
      'Motorised — Design uses *_motorised masters without motor artwork (operator not shown).',
    ],
  }
}
