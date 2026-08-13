import type { GateConfig, GateOptionKey } from '../types'

export type CollarOverlay = {
  id: 'every_1' | 'every_2'
  publicPath: string
  title: string
  spacing: 1 | 2
}

export type CollarOverlayPlan = {
  overlays: CollarOverlay[]
  notes: string[]
}

export const COLLAR_OVERLAY_PATHS = {
  every_1: '/2d-masters/overlays/collar/row_every_1.svg',
  every_2: '/2d-masters/overlays/collar/row_every_2.svg',
  unit: '/2d-masters/overlays/collar/boss_stepped.svg',
} as const

export const COLLAR_SPACING_VARIANTS = ['every_1', 'every_2'] as const
export type CollarSpacingVariant = (typeof COLLAR_SPACING_VARIANTS)[number]

function optionOn(
  config: Pick<GateConfig, 'options'>,
  key: GateOptionKey,
): boolean {
  return config.options.some((option) => option.key === key && option.enabled)
}

function optionVariant(
  config: Pick<GateConfig, 'options'>,
  key: GateOptionKey,
): string | undefined {
  return config.options.find((option) => option.key === key && option.enabled)?.variant
}

/**
 * Q2–Q4 locked 2026-08-12: collar/boss on long pickets only, mid-height (~50%),
 * spacing every 1 or every 2 bars — never on dog bars.
 */
export function resolveCollarOverlays(
  config: Pick<GateConfig, 'options'>,
): CollarOverlayPlan {
  const notes: string[] = []

  if (!optionOn(config, 'picket_collars')) {
    return { overlays: [], notes }
  }

  const raw = optionVariant(config, 'picket_collars')
  const spacing: CollarSpacingVariant =
    raw === 'every_2' ? 'every_2' : 'every_1'

  notes.push(
    spacing === 'every_1'
      ? 'Collars on every long picket at mid-height (never on dog bars).'
      : 'Collars on every 2nd long picket at mid-height (never on dog bars).',
  )

  return {
    overlays: [
      {
        id: spacing,
        publicPath: COLLAR_OVERLAY_PATHS[spacing],
        title: spacing === 'every_1' ? 'Collar every picket' : 'Collar every 2nd picket',
        spacing: spacing === 'every_1' ? 1 : 2,
      },
    ],
    notes,
  }
}
