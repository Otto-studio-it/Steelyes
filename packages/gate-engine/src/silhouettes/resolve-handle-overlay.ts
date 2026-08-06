import type { GateConfig } from '../types'

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
 * @deprecated Layout kept for tests / legacy references only.
 * Design no longer composites a handle — official masters bake it when named
 * manual/manuale, otherwise the design does not place one.
 */
export const HANDLE_OVERLAY_LAYOUT = {
  paperWidth: 1200,
  paperHeight: 860,
  yRatio: 410 / 860,
  doubleLeafXRatio: 572 / 1200,
  singleLeafXRatio: 1044 / 1200,
  slidingXRatio: 980 / 1200,
} as const

/**
 * Official intake lock (2026-08-05):
 * - SVG named *manual* / *manuale* already draws the handle.
 * - SVG without that naming does not place a handle (manual or motorised).
 * Never invent a UI handle overlay on Design masters.
 */
export function resolveHandleOverlay(
  _config: Pick<GateConfig, 'gateType' | 'motorised'>,
): HandleOverlayPlan {
  return {
    instances: [],
    notes: [
      'Handle is baked into official manual/manuale masters when present; otherwise omitted by design — no UI overlay.',
    ],
  }
}
