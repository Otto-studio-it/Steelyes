import { describe, expect, it } from 'vitest'

import {
  DEFAULT_PRICING_CATALOG,
  GATE_TYPES,
  calculateIndicativeGatePrice,
  createGateConfig,
  createGatePreset,
} from '../src/index'
import type { GateConfig, GateOptionKey, PricingCatalog } from '../src/index'

function setOption(
  config: GateConfig,
  key: GateOptionKey,
  enabled: boolean,
  quantity?: number,
): GateConfig {
  return {
    ...config,
    options: config.options.map((option) =>
      option.key === key
        ? {
            ...option,
            enabled,
            quantity,
          }
        : option,
    ),
  }
}

describe('gate-engine pricing', () => {
  it('uses the manual base when the config is not motorised', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const result = calculateIndicativeGatePrice(config)

    expect(result.status).toBe('indicative')
    expect(result.source).toBe('manual')
    expect(result.basePriceGbp).toBe(1800)
    expect(result.totalGbp).toBe(1800)
    expect(result.totalLabel).toContain('£1,800')
  })

  it('uses the auto base when the config is motorised', () => {
    const config = {
      ...createGateConfig(createGatePreset('tracked_sliding')),
      motorised: true,
    }

    const result = calculateIndicativeGatePrice(config)

    expect(result.status).toBe('indicative')
    expect(result.source).toBe('auto')
    expect(result.basePriceGbp).toBe(3600)
    expect(result.totalGbp).toBe(3600)
  })

  it('adds deterministic uplifts when width and height increase above the reference size', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      widthMm: 1900,
      heightMm: 1100,
    }

    const result = calculateIndicativeGatePrice(config)

    expect(result.status).toBe('indicative')
    expect(result.totalGbp).toBe(1970)
    expect(result.breakdown.map((item) => item.code)).toEqual([
      'base_manual',
      'size_width',
      'size_height',
    ])
  })

  it('falls back to survey required when the auto base price is missing', () => {
    const catalog: PricingCatalog = {
      ...DEFAULT_PRICING_CATALOG,
      basePrices: {
        ...DEFAULT_PRICING_CATALOG.basePrices,
        single_swing: {
          ...DEFAULT_PRICING_CATALOG.basePrices.single_swing,
          autoGbp: null,
        },
      },
    }

    const config = {
      ...createGateConfig(createGatePreset('single_swing')),
      motorised: true,
    }

    const result = calculateIndicativeGatePrice(config, catalog)

    expect(result.status).toBe('survey_required')
    expect(result.source).toBe('auto')
    expect(result.basePriceGbp).toBeNull()
    expect(result.totalGbp).toBeNull()
    expect(result.missingData).toContain('base_price_auto_gbp')
  })

  it.each(GATE_TYPES)('returns an indicative base result for %s', (gateType) => {
    const config = createGateConfig(createGatePreset(gateType))
    const result = calculateIndicativeGatePrice(config)

    expect(result.status).toBe('indicative')
    expect(result.totalGbp).toBeGreaterThan(0)
    expect(result.breakdown[0].kind).toBe('base')
  })

  it('prices known option combinations deterministically', () => {
    let config = createGateConfig(createGatePreset('double_swing'))
    config = setOption(config, 'middle_bar', true, 1)
    config = setOption(config, 'dog_bars', true, 3)
    config = setOption(config, 'arched_top', true, 1)
    config = setOption(config, 'bushes', true, 2)
    config = setOption(config, 'spirals', true, 3)

    const result = calculateIndicativeGatePrice(config)

    expect(result.status).toBe('indicative')
    expect(result.totalGbp).toBe(1800 + 275 + 84 + 850 + 5 + 11)
    expect(result.breakdown.map((item) => item.code)).toEqual([
      'base_manual',
      'middle_bar',
      'dog_bars',
      'arched_top',
      'bushes',
      'spirals',
    ])
  })
})
