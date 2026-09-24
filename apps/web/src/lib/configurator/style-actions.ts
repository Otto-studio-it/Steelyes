import type { GateConfig, GateOptionKey, GateStyle } from '@steelyes/gate-engine'

/** Victorian-only decorative options — not available on Composite Boards masters. Circles are baked on composite. */
export const COMPOSITE_DISABLED_OPTION_KEYS: GateOptionKey[] = [
  'top_railheads',
  'dog_bars',
  'dog_bar_railheads',
  'picket_collars',
  'bushes',
  'spirals',
]

/**
 * Apply gate style and clear options that do not exist for that tipology.
 * Composite masters have no dog bars, collars or railheads. Circles stay available.
 */
export function applyGateStyle(config: GateConfig, style: GateStyle): GateConfig {
  let next: GateConfig = { ...config, style }

  if (style === 'composite_boards') {
    next = {
      ...next,
      options: next.options.map((option) =>
        COMPOSITE_DISABLED_OPTION_KEYS.includes(option.key)
          ? { ...option, enabled: false, quantity: 0, variant: undefined }
          : option,
      ),
    }
  } else {
    next = {
      ...next,
      options: next.options.map((option) =>
        option.key === 'aluminium_panels'
          ? { ...option, enabled: false, quantity: 0, variant: undefined }
          : option,
      ),
    }
  }

  return next
}
