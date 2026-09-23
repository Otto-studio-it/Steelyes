import { describe, expect, it } from 'vitest'

import {
  calculateGateBasePrice,
  calculateIndicativeGatePrice,
  createGateConfig,
  createGatePreset,
  resolveStyleAwareBasePrice,
  stylePricingSummary,
  DEFAULT_PRICING_CATALOG,
} from '../src/index'

describe('gate-engine style-aware pricing', () => {
  it('applies the confirmed composite boards manual discount for single swing', () => {
    const victorian = createGateConfig(createGatePreset('single_swing'))
    const composite = {
      ...createGateConfig(createGatePreset('single_swing')),
      style: 'composite_boards' as const,
    }

    const victorianBase = calculateGateBasePrice(victorian)
    const compositeBase = calculateGateBasePrice(composite)

    expect(victorianBase.amountGbp).toBe(850)
    expect(compositeBase.amountGbp).toBe(750)
    expect(compositeBase.lineItem.code).toBe('base_manual:composite_boards')
    expect(compositeBase.lineItem.note).toContain('GBP 750')
  })

  it('keeps equal auto base prices for single swing across styles', () => {
    const victorian = {
      ...createGateConfig(createGatePreset('single_swing')),
      motorised: true,
    }
    const composite = {
      ...createGateConfig(createGatePreset('single_swing')),
      style: 'composite_boards' as const,
      motorised: true,
    }

    expect(calculateGateBasePrice(victorian).amountGbp).toBe(2700)
    expect(calculateGateBasePrice(composite).amountGbp).toBe(2700)
  })

  it('uses shared equal base pricing for composite boards on other gate types', () => {
    const composite = {
      ...createGateConfig(createGatePreset('double_swing')),
      style: 'composite_boards' as const,
    }

    const resolution = resolveStyleAwareBasePrice(composite, DEFAULT_PRICING_CATALOG.basePrices.double_swing)
    const base = calculateGateBasePrice(composite)

    expect(resolution.source).toBe('shared_equal')
    expect(resolution.confirmed).toBe(true)
    expect(base.amountGbp).toBe(1900)
    expect(base.lineItem.note).toContain('matches traditional Victorian')
  })

  it('changes the indicative total when style changes the manual base on single swing', () => {
    const victorian = {
      ...createGateConfig(createGatePreset('single_swing')),
      widthMm: 850,
    }
    const composite = {
      ...createGateConfig(createGatePreset('single_swing')),
      style: 'composite_boards' as const,
      widthMm: 850,
    }

    const victorianTotal = calculateIndicativeGatePrice(victorian)
    const compositeTotal = calculateIndicativeGatePrice(composite)

    expect(victorianTotal.status).toBe('indicative')
    expect(compositeTotal.status).toBe('indicative')
    expect(victorianTotal.totalGbp).toBe(925)
    expect(compositeTotal.totalGbp).toBe(825)
    expect(compositeTotal.assumptions).toContain(
      'Composite boards manual base is GBP 750 (traditional Victorian is GBP 850 for this gate type).',
    )
  })

  it('reports style pricing as confirmed for supported style and gate type pairs', () => {
    expect(
      stylePricingSummary({
        ...createGateConfig(createGatePreset('single_swing')),
        style: 'composite_boards',
      }),
    ).toMatchObject({
      style: 'composite_boards',
      hasStyleSpecificBase: true,
      confirmed: true,
    })

    expect(stylePricingSummary(createGateConfig(createGatePreset('double_swing')))).toMatchObject({
      style: 'traditional_victorian',
      hasStyleSpecificBase: false,
      confirmed: true,
    })
  })
})
