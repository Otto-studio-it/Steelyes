import { describe, expect, it } from 'vitest'

import {
  DEFAULT_PRICING_CATALOG,
  GATE_TYPES,
  calculateGateBasePrice,
  calculateGateOptionPricing,
  calculateIndicativeGatePrice,
  calculateIndicativeGatePriceFromDraft,
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
  it('resolves the manual base price for a non-motorised config', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const result = calculateGateBasePrice(config)

    expect(result.source).toBe('manual')
    expect(result.amountGbp).toBe(1800)
    expect(result.missingData).toEqual([])
    expect(result.lineItem).toMatchObject({
      code: 'base_manual',
      kind: 'base',
      amountGbp: 1800,
    })
  })

  it('resolves the auto base price for a motorised config', () => {
    const config = {
      ...createGateConfig(createGatePreset('tracked_sliding')),
      motorised: true,
    }

    const result = calculateGateBasePrice(config)

    expect(result.source).toBe('auto')
    expect(result.amountGbp).toBe(3600)
    expect(result.missingData).toEqual([])
    expect(result.lineItem).toMatchObject({
      code: 'base_auto',
      kind: 'base',
      amountGbp: 3600,
    })
  })

  it('marks the auto base as missing when the catalog does not provide one', () => {
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

    const result = calculateGateBasePrice(config, catalog)

    expect(result.source).toBe('auto')
    expect(result.amountGbp).toBeNull()
    expect(result.missingData).toContain('base_price_auto_gbp')
    expect(result.lineItem.amountGbp).toBeNull()
  })

  it('prices add-ons deterministically and keeps railheads provisional', () => {
    let config = createGateConfig(createGatePreset('double_swing'))
    config = setOption(config, 'middle_bar', true, 1)
    config = setOption(config, 'dog_bars', true, 4)
    config = setOption(config, 'arched_top', true, 1)
    config = setOption(config, 'bushes', true, 2)
    config = setOption(config, 'spirals', true, 3)
    config = setOption(config, 'top_railheads', true, 9)

    const result = calculateGateOptionPricing(config)

    expect(result.missingData).toContain('option_price:top_railheads')
    expect(result.items.map((item) => item.code)).toEqual([
      'middle_bar',
      'top_railheads',
      'dog_bars',
      'arched_top',
      'bushes',
      'spirals',
    ])
    expect(result.items.find((item) => item.code === 'top_railheads')?.amountGbp).toBeNull()
    expect(result.items.find((item) => item.code === 'dog_bars')?.amountGbp).toBe(89)
  })

  it('marks the full price as survey required when provisional add-on pricing is still unresolved', () => {
    let config = createGateConfig(createGatePreset('double_swing'))
    config = setOption(config, 'top_railheads', true, 9)

    const result = calculateIndicativeGatePrice(config)

    expect(result.status).toBe('survey_required')
    expect(result.totalGbp).toBeNull()
    expect(result.missingData).toContain('option_price:top_railheads')
    expect(result.breakdown.some((item) => item.code === 'top_railheads' && item.amountGbp === null)).toBe(true)
  })

  it('keeps the indicative total aligned with the resolved base price when no uplifts apply', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const result = calculateIndicativeGatePrice(config)

    expect(result.status).toBe('indicative')
    expect(result.source).toBe('manual')
    expect(result.basePriceGbp).toBe(1800)
    expect(result.totalGbp).toBe(1800)
    expect(result.totalLabel).toContain('£1,800')
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
    config = setOption(config, 'dog_bars', true, 4)
    config = setOption(config, 'arched_top', true, 1)
    config = setOption(config, 'bushes', true, 2)
    config = setOption(config, 'spirals', true, 3)

    const result = calculateIndicativeGatePrice(config)

    expect(result.status).toBe('indicative')
    expect(result.totalGbp).toBe(1800 + 275 + 89 + 850 + 5 + 11)
    expect(result.breakdown.map((item) => item.code)).toEqual([
      'base_manual',
      'middle_bar',
      'dog_bars',
      'arched_top',
      'bushes',
      'spirals',
    ])
  })

  it('marks a draft with duplicated options as survey required before normalization', () => {
    const config = createGateConfig(createGatePreset('double_swing'))

    const result = calculateIndicativeGatePriceFromDraft({
      ...config,
      options: [
        config.options[0],
        {
          ...config.options[0],
        },
        ...config.options.slice(1),
      ],
    })

    expect(result.status).toBe('survey_required')
    expect(result.issues.map((issue) => issue.code)).toContain('duplicate_option')
    expect(result.breakdown).toHaveLength(0)
  })

  it('marks incompatible configurations as survey required before pricing', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      style: 'composite_boards' as const,
      options: createGateConfig(createGatePreset('double_swing')).options.map((option) =>
        option.key === 'top_railheads'
          ? {
              ...option,
              enabled: true,
              quantity: 9,
            }
          : option,
      ),
    }

    const result = calculateIndicativeGatePrice(config)

    expect(result.status).toBe('survey_required')
    expect(result.issues.map((issue) => issue.code)).toContain('incompatible_option_style')
    expect(result.totalGbp).toBeNull()
  })
})
