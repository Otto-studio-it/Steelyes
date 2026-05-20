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
  it('keeps the production catalog blocked with no entries', () => {
    expect(isVariantCatalogBlocked()).toBe(true)
    expect(DEFAULT_RAILHEAD_VARIANT_CATALOG.entries).toEqual([])
    expect(railheadCatalogSummary()).toMatchObject({
      status: 'blocked_pending_client',
      entryCount: 0,
      owner: 'Marius',
    })
  })

  it('rejects variant selection while the production catalog is blocked', () => {
    const config = withOptionVariant(
      createGateConfig(createGatePreset('double_swing')),
      'top_railheads',
      true,
      4,
      'ball-finial',
    )

    const issues = collectVariantCatalogIssues(config)
    expect(issues.map((issue) => issue.code)).toContain('variant_catalog_blocked')

    const validation = validateGateConfig(config)
    expect(validation.ok).toBe(false)
  })

  it('lists compatible variants from an injectable fixture catalog', () => {
    const config = createGateConfig(createGatePreset('double_swing'))

    expect(listRailheadVariantsForOption('top_railheads', config, FIXTURE_RAILHEAD_CATALOG)).toHaveLength(1)
    expect(listRailheadVariantsForOption('top_railheads', config, FIXTURE_RAILHEAD_CATALOG)[0]?.slug).toBe(
      'ball-finial',
    )
    expect(listRailheadVariantsForOption('dog_bar_railheads', config, FIXTURE_RAILHEAD_CATALOG)).toHaveLength(1)
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
          amountGbp: 24,
          provisional: false,
        }),
      ]),
    )
    expect(optionPricing.missingData).toEqual([])
  })
})
