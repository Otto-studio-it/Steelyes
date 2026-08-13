import type { GateConfig, GateOptionKey } from '../types'

export type CircleBandOverlay = {
  id: 'upper' | 'lower' | 'combined'
  publicPath: string
  title: string
}

export type CircleOverlayPlan = {
  /** Prefer combined for a single <img> stack on Design. */
  bands: CircleBandOverlay[]
  notes: string[]
}

export const CIRCLE_OVERLAY_PATHS = {
  upper: '/2d-masters/overlays/circles/band_upper.svg',
  upperStraight: '/2d-masters/overlays/circles/band_upper_straight.svg',
  upperArched: '/2d-masters/overlays/circles/band_upper_arched.svg',
  lower: '/2d-masters/overlays/circles/band_lower.svg',
  combined: '/2d-masters/overlays/circles/bands_combined.svg',
  combinedArched: '/2d-masters/overlays/circles/bands_combined_arched.svg',
} as const

function optionOn(
  config: Pick<GateConfig, 'options'>,
  key: GateOptionKey,
): boolean {
  return config.options.some((option) => option.key === key && option.enabled)
}

/**
 * CA-16 / Q1 (2026-08-12) — Circles toggle always shows upper + lower together.
 * When arched_top is on, the upper band follows the arch curve.
 * Railheads stay off Design (CA-17); circles are structural decoration and do show.
 */
export function resolveCircleOverlays(
  config: Pick<GateConfig, 'options'>,
): CircleOverlayPlan {
  const notes: string[] = []
  const circlesOn = optionOn(config, 'circles')
  const bushesOn = optionOn(config, 'bushes')
  const arched = optionOn(config, 'arched_top')

  if (!circlesOn && !bushesOn) {
    return { bands: [], notes }
  }

  if (bushesOn && !circlesOn) {
    notes.push(
      'Showing circle bands via legacy bushes toggle — prefer the Circles option (CA-16).',
    )
  }

  notes.push(
    arched
      ? 'Circles: upper (follows arch) + lower — both always on when Circles is enabled (Q1).'
      : 'Circles: upper + lower bands — both always on when Circles is enabled (Q1).',
  )
  notes.push('Circle density is automatic per bay; £2.50/unit remains survey-flagged.')

  const publicPath = arched
    ? CIRCLE_OVERLAY_PATHS.combinedArched
    : CIRCLE_OVERLAY_PATHS.combined

  return {
    bands: [
      {
        id: 'combined',
        publicPath,
        title: arched
          ? 'Circle bands (arched upper + lower)'
          : 'Circle bands (upper + lower)',
      },
    ],
    notes,
  }
}
