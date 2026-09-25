import { describe, expect, it } from 'vitest'

import {
  calculateGateOptionPricing,
  collectVariantCatalogIssues,
  createGateConfig,
  createGatePreset,
  DEFAULT_RAILHEAD_VARIANT_CATALOG,
  isVariantCatalogBlocked,
  listRailheadVariantsForOption,
  railheadCatalogSummary,
  resolveRailheadVariantPricing,
  validateGateConfig,
} from '../src/index'
import type { GateConfig, RailheadVariantCatalog } from '../src/index'

const FIXTURE_RAILHEAD_CATALOG: RailheadVariantCatalog = {
  status: 'provisional',
  blockedReason: '',
  owner: 'test-fixture',
  entries: [
    {
      slug: 'ball-finial',
      label: 'Ball finial',
      status: 'provisional',
      optionKey: 'top_railheads',
      unitPriceGbp: 12.5,
      appliesTo: {
        styles: ['traditional_victorian'],
        gateTypes: ['double_swing', 'single_swing'],
      },
      notes: 'Test fixture only — not production data.',
      adminSlug: 'railheads-top',
    },
    {
      slug: 'spear-dog-bar',
      label: 'Spear dog-bar railhead',
      status: 'confirmed',
      optionKey: 'dog_bar_railheads',
      unitPriceGbp: 8,
      appliesTo: {
        styles: ['traditional_victorian'],
      },
      notes: 'Test fixture only — not production data.',
      adminSlug: 'railheads-dog-bars',
    },
    {
      slug: 'composite-cap',
      label: 'Composite cap',
      status: 'confirmed',
      optionKey: 'top_railheads',
      unitPriceGbp: 6,
      appliesTo: {
        styles: ['composite_boards'],
      },
      notes: 'Test fixture only — not production data.',
    },
  ],
}

function withOptionVariant(
  config: GateConfig,
  key: 'top_railheads' | 'dog_bar_railheads',
  enabled: boolean,
  quantity: number,
  variant?: string,
): GateConfig {
  return {
    ...config,
    options: config.options.map((option) =>
      option.key === key
        ? {
            ...option,
            enabled,
            quantity,
            variant,
          }
        : option,
    ),
  }
}

describe('railhead variant catalog', () => {
  it('exposes a provisional schematic catalog until final prices are confirmed', () => {
    expect(isVariantCatalogBlocked()).toBe(false)
    expect(DEFAULT_RAILHEAD_VARIANT_CATALOG.status).toBe('provisional')
    expect(DEFAULT_RAILHEAD_VARIANT_CATALOG.entries.length).toBeGreaterThan(0)
    expect(railheadCatalogSummary()).toMatchObject({
      status: 'provisional',
      owner: 'Marius',
    })
  })

  it('lists compatible variants from the production provisional catalog', () => {
    const config = createGateConfig(createGatePreset('double_swing'))

    expect(listRailheadVariantsForOption('top_railheads', config).length).toBeGreaterThan(0)
    expect(listRailheadVariantsForOption('dog_bar_railheads', config).length).toBeGreaterThan(0)
  })

  it('rejects unknown variant slugs', () => {
    const config = withOptionVariant(
      createGateConfig(createGatePreset('double_swing')),
      'top_railheads',
      true,
      4,
      'unknown-variant',
    )

    const issues = collectVariantCatalogIssues(config)
    expect(issues.map((issue) => issue.code)).toContain('unknown_variant')
  })

  it('validates variant slug, option key, and style compatibility', () => {
    const config = withOptionVariant(
      createGateConfig(createGatePreset('double_swing')),
      'top_railheads',
      true,
      4,
      'composite-cap',
    )

    const issues = collectVariantCatalogIssues(config, FIXTURE_RAILHEAD_CATALOG)
    expect(issues.map((issue) => issue.code)).toContain('variant_incompatible')
  })

  it('prices confirmed railhead variants from the fixture catalog', () => {
    const config = withOptionVariant(
      createGateConfig(createGatePreset('double_swing')),
      'dog_bar_railheads',
      true,
      3,
      'spear-dog-bar',
    )

    const pricing = resolveRailheadVariantPricing(
      config.options.find((option) => option.key === 'dog_bar_railheads')!,
      config,
      FIXTURE_RAILHEAD_CATALOG,
    )

    expect(pricing).toMatchObject({
      slug: 'spear-dog-bar',
      unitGbp: 8,
      provisional: false,
    })

    const optionPricing = calculateGateOptionPricing(config, undefined, FIXTURE_RAILHEAD_CATALOG)
    expect(optionPricing.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'dog_bar_railheads:spear-dog-bar',
          // CA-14: 1800 mm → 17 bays × £8 (stored quantity 3 is ignored).
          amountGbp: 136,
          provisional: false,
        }),
      ]),
    )
    expect(optionPricing.missingData).toEqual([])
  })
})

describe('picket collar spacing variants', () => {
  it('accepts every_1 on picket_collars (every_2 is gracefully mapped)', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const every1 = {
      ...base,
      options: base.options.map((option) =>
        option.key === 'picket_collars'
          ? { ...option, enabled: true, quantity: 1, variant: 'every_1' }
          : option,
      ),
    }
    const bad = {
      ...base,
      options: base.options.map((option) =>
        option.key === 'picket_collars'
          ? { ...option, enabled: true, quantity: 1, variant: 'every_3' }
          : option,
      ),
    }

    expect(validateGateConfig(every1).ok).toBe(true)
    expect(collectVariantCatalogIssues(every1)).toEqual([])
    expect(collectVariantCatalogIssues(bad).map((issue) => issue.code)).toContain('unknown_variant')
  })
})
