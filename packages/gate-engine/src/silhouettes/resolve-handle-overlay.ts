import type { GateConfig, GateType } from '../types'

export type HandleOverlayInstance = {
  id: string
  /** 0–1 across the full master image width (centre of handle). */
  xRatio: number
  /** 0–1 from top of the master image (centre of handle). */
  yRatio: number
}

export type HandleOverlayPlan = {
  instances: HandleOverlayInstance[]
  notes: string[]
}

/**
 * Master paper is 1200×860. Anchors match the former baked handle positions on
 * swing masters (CA-01) and approximate leading-edge placement for sliding types.
 */
export const HANDLE_OVERLAY_LAYOUT = {
  paperWidth: 1200,
  paperHeight: 860,
  /** Mid-leaf Y used by CAD / former baked SVGs (plate centre ≈ 410). */
  yRatio: 410 / 860,
  doubleLeafXRatio: 572 / 1200,
  singleLeafXRatio: 1044 / 1200,
  /** Sliding / telescopic / radius — leading edge of the moving leaf. */
  slidingXRatio: 980 / 1200,
} as const

function handleXRatio(gateType: GateType): number {
  switch (gateType) {
    case 'double_swing':
    case 'bifolding_double_swing':
      return HANDLE_OVERLAY_LAYOUT.doubleLeafXRatio
    case 'single_swing':
    case 'single_bifolding':
      return HANDLE_OVERLAY_LAYOUT.singleLeafXRatio
    case 'tracked_sliding':
    case 'cantilever_sliding':
    case 'telescopic_sliding':
    case 'radius_sliding':
      return HANDLE_OVERLAY_LAYOUT.slidingXRatio
  }
}

/**
 * CA-01 — Design masters never bake the handle. Overlay only when manual (`!motorised`).
 */
export function resolveHandleOverlay(
  config: Pick<GateConfig, 'gateType' | 'motorised'>,
): HandleOverlayPlan {
  if (config.motorised) {
    return {
      instances: [],
      notes: ['Motorised — leaf handle omitted (CA-01).'],
    }
  }

  return {
    instances: [
      {
        id: 'manual-handle',
        xRatio: handleXRatio(config.gateType),
        yRatio: HANDLE_OVERLAY_LAYOUT.yRatio,
      },
    ],
    notes: ['Manual — leaf handle overlay on Design master (CA-01).'],
  }
}
