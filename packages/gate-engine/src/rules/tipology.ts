import type { GateConfig, GateOptionKey } from '../types'

/**
 * Victorian structural tipologies that swap the Design 2D master.
 * Decorative options (circles, collars) layer on top of these.
 */
export const VICTORIAN_TIPOLOGIES = ['base', 'arched', 'dog_bars', 'arched_dog_bars'] as const

export type VictorianTipology = (typeof VICTORIAN_TIPOLOGIES)[number]

const TIPOLOGY_OPTIONS: Record<VictorianTipology, readonly GateOptionKey[]> = {
  base: [],
  arched: ['arched_top'],
  dog_bars: ['dog_bars'],
  arched_dog_bars: ['arched_top', 'dog_bars'],
}

function optionEnabled(config: Pick<GateConfig, 'options'>, key: GateOptionKey): boolean {
  return config.options.some((option) => option.key === key && option.enabled)
}

export function getVictorianTipology(config: Pick<GateConfig, 'options'>): VictorianTipology {
  const arched = optionEnabled(config, 'arched_top')
  const dogBars = optionEnabled(config, 'dog_bars')
  if (arched && dogBars) return 'arched_dog_bars'
  if (arched) return 'arched'
  if (dogBars) return 'dog_bars'
  return 'base'
}

/**
 * Switch Victorian tipology without wiping decoration / finish / size.
 * Forces Traditional Victorian (composite boards have their own master).
 */
export function applyVictorianTipology(config: GateConfig, tipology: VictorianTipology): GateConfig {
  const enabled = new Set<GateOptionKey>(TIPOLOGY_OPTIONS[tipology])

  return {
    ...config,
    style: 'traditional_victorian',
    options: config.options.map((option) => {
      if (option.key === 'arched_top' || option.key === 'dog_bars') {
        const on = enabled.has(option.key)
        return {
          ...option,
          enabled: on,
          quantity: on ? Math.max(1, option.quantity ?? 1) : 0,
          variant: on ? option.variant : undefined,
        }
      }

      if (option.key === 'dog_bar_railheads' && !enabled.has('dog_bars')) {
        return { ...option, enabled: false, quantity: 0, variant: undefined }
      }

      if (option.key === 'aluminium_panels') {
        return { ...option, enabled: false, quantity: 0, variant: undefined }
      }

      return option
    }),
  }
}
