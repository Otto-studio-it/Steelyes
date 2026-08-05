import type { GateConfig, GateType } from '../types'

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
 * Master paper is 1200×860 — same datum as handle overlays (CA-01).
 * Anchors are schematic until motorised-specific masters ship.
 */
export const MOTOR_OVERLAY_LAYOUT = {
  paperWidth: 1200,
  paperHeight: 860,
  /** Near ground / mid-post — typical underground / post operator zone. */
  yRatio: 620 / 860,
  /** Hinge-side post for double-leaf / bifold double. */
  doubleHingeXRatio: 96 / 1200,
  /** Hinge-side post for single leaf. */
  singleHingeXRatio: 156 / 1200,
  /** Parking / motor end for sliding types (fixed technical side). */
  slidingMotorXRatio: 180 / 1200,
} as const

function motorPlacement(gateType: GateType): Pick<MotorOverlayInstance, 'xRatio' | 'kind'> {
  switch (gateType) {
    case 'double_swing':
    case 'bifolding_double_swing':
      return {
        xRatio: MOTOR_OVERLAY_LAYOUT.doubleHingeXRatio,
        kind: 'post_operator',
      }
    case 'single_swing':
    case 'single_bifolding':
      return {
        xRatio: MOTOR_OVERLAY_LAYOUT.singleHingeXRatio,
        kind: 'post_operator',
      }
    case 'tracked_sliding':
    case 'cantilever_sliding':
    case 'telescopic_sliding':
    case 'radius_sliding':
      return {
        xRatio: MOTOR_OVERLAY_LAYOUT.slidingMotorXRatio,
        kind: 'track_operator',
      }
  }
}

export type ResolveMotorOverlayOptions = {
  /**
   * When true, the resolved Design master already includes the motor kit
   * (slug / lookup rule with `motorised: true`). Skip the procedural marker.
   */
  masterIncludesMotor?: boolean
}

/**
 * Motor kit marker for Design masters when `motorised` is on.
 * Complementary to CA-01 handle overlay (handle only when manual).
 *
 * Once dedicated `*_motorised` silhouette SVGs land in the pack, set
 * `masterIncludesMotor` so this procedural marker does not double-draw.
 */
export function resolveMotorOverlay(
  config: Pick<GateConfig, 'gateType' | 'motorised'>,
  options: ResolveMotorOverlayOptions = {},
): MotorOverlayPlan {
  if (!config.motorised) {
    return {
      instances: [],
      notes: ['Manual — motor kit omitted.'],
    }
  }

  if (options.masterIncludesMotor) {
    return {
      instances: [],
      notes: ['Motorised — motor kit included in Design master SVG.'],
    }
  }

  const placement = motorPlacement(config.gateType)
  return {
    instances: [
      {
        id: 'motor-kit',
        xRatio: placement.xRatio,
        yRatio: MOTOR_OVERLAY_LAYOUT.yRatio,
        kind: placement.kind,
      },
    ],
    notes: [
      'Motorised — schematic motor-kit marker on Design master (survey confirms kit).',
    ],
  }
}
