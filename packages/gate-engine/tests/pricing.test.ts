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
    expect(result.amountGbp).toBe(1900)
    expect(result.missingData).toEqual([])
    expect(result.lineItem).toMatchObject({
      code: 'base_manual',
      kind: 'base',
      amountGbp: 1900,
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

  it('prices add-ons deterministically including ship mid-band railheads', () => {
    let config = createGateConfig(createGatePreset('double_swing'))
    config = setOption(config, 'middle_bar', true, 1)
    config = setOption(config, 'dog_bars', true, 4)
    config = setOption(config, 'arched_top', true, 1)
    config = setOption(config, 'bushes', true, 2)
    config = setOption(config, 'spirals', true, 3)
    config = setOption(config, 'top_railheads', true, 9)

    const result = calculateGateOptionPricing(config)

    expect(result.missingData).toEqual([])
    expect(result.items.map((item) => item.code)).toEqual([
      'middle_bar',
      'top_railheads',
      'dog_bars',
      'arched_top',
      'bushes',
      'spirals',
    ])
    // CA-14: 1800 mm → 17 bays × £12.50 — the stored quantity (9) is ignored.
    expect(result.items.find((item) => item.code === 'top_railheads')?.amountGbp).toBe(213)
    expect(result.items.find((item) => item.code === 'dog_bars')?.amountGbp).toBe(75)
  })

  it('re-prices railheads when the width changes, whatever quantity was stored (CA-14)', () => {
    const narrow = setOption(createGateConfig(createGatePreset('double_swing')), 'top_railheads', true, 17)
    const wide = { ...narrow, widthMm: 5000 }
    const amount = (config: typeof narrow) =>
      calculateGateOptionPricing(config).items.find((item) => item.code === 'top_railheads')?.amountGbp

    expect(amount(narrow)).toBe(213) // 17 × £12.50
    expect(amount(wide)).toBe(613) // 49 × £12.50 — used to stay at 213

    // Tracked sliding goes to 10 m: 99 bays, not the old cap of 40.
    const tracked = setOption(
      { ...createGateConfig(createGatePreset('tracked_sliding')), widthMm: 10000 },
      'top_railheads',
      true,
      1,
    )
    expect(amount(tracked)).toBe(1238) // 99 × £12.50
  })

  it('keeps an indicative total when railheads use the ship mid-band unit price', () => {
    let config = createGateConfig(createGatePreset('double_swing'))
    config = setOption(config, 'top_railheads', true, 9)

    const result = calculateIndicativeGatePrice(config)

    expect(result.status).toBe('indicative')
    expect(result.totalGbp).toBe(1900 + 213)
    expect(result.breakdown.some((item) => item.code === 'top_railheads' && item.amountGbp === 213)).toBe(true)
  })

  it('keeps the indicative total aligned with the resolved base price when no uplifts apply', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const result = calculateIndicativeGatePrice(config)

    expect(result.status).toBe('indicative')
    expect(result.source).toBe('manual')
    expect(result.basePriceGbp).toBe(1900)
    expect(result.totalGbp).toBe(1900)
    expect(result.totalLabel).toContain('£1,900')
  })

  it('adds intake size uplift (+£50/200mm W, +£50/100mm H) above the reference band', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      widthMm: 2000,
      heightMm: 1100,
    }

    const result = calculateIndicativeGatePrice(config)

    expect(result.status).toBe('indicative')
    // 100mm width → 1×£50; 100mm height → 1×£50; base £1900
    expect(result.totalGbp).toBe(2000)
    expect(result.breakdown.map((item) => item.code)).toEqual([
      'base_manual',
      'size_width',
      'size_height',
    ])
  })

  it('does not charge a size uplift inside the client catalogue band', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      widthMm: 1900,
      heightMm: 1000,
    }

    const result = calculateIndicativeGatePrice(config)

    expect(result.status).toBe('indicative')
    expect(result.totalGbp).toBe(1900)
    expect(result.breakdown.map((item) => item.code)).toEqual(['base_manual'])
  })

  it.each(GATE_TYPES)(
    'keeps the %s default preset inside the reference band so FROM price equals the base price',
    (gateType) => {
      const entry = DEFAULT_PRICING_CATALOG.basePrices[gateType]
      const config = createGateConfig(createGatePreset(gateType))
      const expectedBase = config.motorised ? entry.autoGbp : entry.manualGbp

      expect(config.widthMm).toBeLessThanOrEqual(entry.referenceWidthMm)
      expect(config.heightMm).toBeLessThanOrEqual(entry.referenceHeightMm)

      const result = calculateIndicativeGatePrice(config)

      expect(result.status).toBe('indicative')
      expect(result.basePriceGbp).toBe(expectedBase)
      expect(result.totalGbp).toBe(expectedBase)
      expect(result.breakdown.filter((item) => item.kind === 'size')).toHaveLength(0)
    },
  )

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
    expect(result.totalGbp).toBe(1900 + 275 + 75 + 850 + 5 + 11)
    expect(result.breakdown.map((item) => item.code)).toEqual([
      'base_manual',
      'middle_bar',
      'dog_bars',
      'arched_top',
      'bushes',
      'spirals',
    ])
  })

  it('propagates the site survey request into the pricing result', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      siteSurveyRequested: true,
    }

    const result = calculateIndicativeGatePrice(config)

    expect(result.status).toBe('indicative')
    expect(result.siteSurveyRequested).toBe(true)
    expect(result.assumptions.some((assumption) => assumption.toLowerCase().includes('site survey'))).toBe(true)

    const withoutSurvey = calculateIndicativeGatePrice(createGateConfig(createGatePreset('double_swing')))
    expect(withoutSurvey.siteSurveyRequested).toBe(false)
  })

  it('notes supply-only fulfilment without changing the indicative total', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const supplyOnly = { ...base, fulfilment: 'supply_only' as const }

    const withInstall = calculateIndicativeGatePrice(base)
    const withoutInstall = calculateIndicativeGatePrice(supplyOnly)

    expect(withoutInstall.totalGbp).toBe(withInstall.totalGbp)
    expect(withoutInstall.assumptions.some((assumption) => assumption.toLowerCase().includes('supply only'))).toBe(
      true,
    )
    expect(withInstall.assumptions.some((assumption) => assumption.toLowerCase().includes('supply only'))).toBe(
      false,
    )
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
  it('says when fence panels or a custom RAL are outside the estimate', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const plain = calculateIndicativeGatePrice(base)
    const extras = calculateIndicativeGatePrice({
      ...base,
      finish: 'other_ral',
      customFinishHex: '#9E000C',
      fencePanels: { quantity: 2, panels: [{ heightMm: 1000, lengthMm: 950 }, { heightMm: 1000, lengthMm: 950 }] },
    })

    expect(extras.status).toBe('indicative')
    expect(extras.totalGbp).toBe(plain.totalGbp)
    expect(extras.assumptions.some((line) => /Fence panels \(2\) are not included/.test(line))).toBe(true)
    expect(extras.assumptions.some((line) => /Custom RAL/.test(line))).toBe(true)
    expect(plain.assumptions.some((line) => /Fence panels|Custom RAL/.test(line))).toBe(false)
  })
})
