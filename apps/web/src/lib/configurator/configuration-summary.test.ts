import { describe, expect, it } from 'vitest'
import { createGateConfig, createGatePreset, railheadSeriesLabel, railheadWorkshopLabel } from '@steelyes/gate-engine'

import { buildConfigurationSummaryLines } from '@/lib/configurator/configuration-summary'
import { selectedRailheadSlug } from '@/lib/configurator/railhead'

describe('buildConfigurationSummaryLines', () => {
  it('includes the Steelyes series name when top_railheads is selected', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const config = {
      ...base,
      options: base.options.map((option) =>
        option.key === 'top_railheads'
          ? { ...option, enabled: true, quantity: 8, variant: 'RH32' }
          : option,
      ),
    }

    const lines = buildConfigurationSummaryLines(config)
    expect(lines.find((line) => line.label === 'Gate type')?.value).toBeTruthy()
    expect(lines.find((line) => line.label === 'Top railheads')).toEqual({
      label: 'Top railheads',
      value: railheadSeriesLabel('RH32'),
    })
    expect(lines.find((line) => line.label === 'Top railheads')?.value).not.toContain('RH32')
  })

  it('keeps the workshop SKU on workshop summaries', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const config = {
      ...base,
      options: base.options.map((option) =>
        option.key === 'top_railheads'
          ? { ...option, enabled: true, quantity: 8, variant: 'RH32' }
          : option,
      ),
    }

    expect(buildConfigurationSummaryLines(config, undefined, 'workshop').find((line) => line.label === 'Top railheads')).toEqual({
      label: 'Top railheads',
      value: railheadWorkshopLabel('RH32'),
    })
  })

  it('uses series TBC when enabled without a variant', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const config = {
      ...base,
      options: base.options.map((option) =>
        option.key === 'top_railheads'
          ? { ...option, enabled: true, quantity: 8, variant: undefined }
          : option,
      ),
    }

    expect(buildConfigurationSummaryLines(config).find((line) => line.label === 'Top railheads')).toEqual({
      label: 'Top railheads',
      value: 'selected (series TBC)',
    })
  })

  it('omits railheads when disabled', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    expect(buildConfigurationSummaryLines(config).some((line) => line.label === 'Top railheads')).toBe(
      false,
    )
  })

  it('does not include post extension in the mounting posts summary', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      posts: {
        enabled: true,
        material: 'steel' as const,
        capStyle: 'ball' as const,
        extendAboveGateMm: 120,
      },
    }
    const postsLine = buildConfigurationSummaryLines(config).find((line) => line.label === 'Mounting posts')
    expect(postsLine?.value).toBe('Steel post (powder coated) · Ball finial')
    expect(postsLine?.value).not.toContain('120')
    expect(postsLine?.value).not.toContain('mm')
  })

  it('shows "No mounting posts" when material is none', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      posts: {
        enabled: true,
        material: 'none' as const,
        capStyle: 'ball' as const,
        extendAboveGateMm: 120,
      },
    }
    const postsLine = buildConfigurationSummaryLines(config).find((line) => line.label === 'Mounting posts')
    expect(postsLine?.value).toBe('No mounting posts')
  })

  it('includes all enabled options in the summary', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const config = {
      ...base,
      options: base.options.map((option) =>
        option.key === 'middle_bar' || option.key === 'circles' || option.key === 'arched_top'
          ? { ...option, enabled: true }
          : option,
      ),
    }
    
    const lines = buildConfigurationSummaryLines(config)
    
    expect(lines.find((line) => line.label === 'Middle bar')).toBeDefined()
    expect(lines.find((line) => line.label === 'Circles')).toBeDefined()
    expect(lines.find((line) => line.label === 'Arched top')).toBeDefined()
    expect(lines.find((line) => line.label === 'Dog bars')).toBeUndefined()
  })

  it('shows option prices when pricing is provided', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const config = {
      ...base,
      style: 'composite_boards' as const,
      options: base.options.map((option) =>
        option.key === 'circles' || option.key === 'aluminium_panels'
          ? { ...option, enabled: true }
          : option,
      ),
    }
    
    const pricing: Partial<import('@steelyes/gate-engine').PricingResult> = {
      breakdown: [
        { code: 'base_manual', label: 'Manual base price', kind: 'base' as const, amountGbp: 1900, provisional: false },
        { code: 'circles', label: 'Circles', kind: 'option' as const, amountGbp: 275, provisional: true },
        { code: 'aluminium_panels', label: 'Aluminium panel upgrade', kind: 'option' as const, amountGbp: 200, provisional: true },
      ],
      totalGbp: 2375,
      totalLabel: '£2,375 indicative',
      status: 'indicative' as const,
    }
    
    const lines = buildConfigurationSummaryLines(config, pricing as import('@steelyes/gate-engine').PricingResult)
    
    const circlesLine = lines.find((line) => line.label === 'Circles')
    const aluminiumLine = lines.find((line) => line.label === 'Aluminium panel upgrade')
    
    expect(circlesLine).toBeDefined()
    expect(circlesLine?.value).toContain('£275')
    expect(aluminiumLine).toBeDefined()
    expect(aluminiumLine?.value).toContain('£200')
  })

  it('includes post cap with price when charged', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      posts: {
        enabled: true,
        material: 'steel' as const,
        capStyle: 'ball' as const,
        extendAboveGateMm: 120,
      },
    }
    
    const pricing: Partial<import('@steelyes/gate-engine').PricingResult> = {
      breakdown: [
        { code: 'base_manual', label: 'Manual base price', kind: 'base' as const, amountGbp: 1900, provisional: false },
        { code: 'post_cap', label: 'Post cap', kind: 'option' as const, amountGbp: 75, provisional: false },
      ],
      totalGbp: 1975,
      totalLabel: '£1,975 indicative',
      status: 'indicative' as const,
    }
    
    const lines = buildConfigurationSummaryLines(config, pricing as import('@steelyes/gate-engine').PricingResult)
    const postCapLine = lines.find((line) => line.label === 'Post cap')
    
    expect(postCapLine).toBeDefined()
    expect(postCapLine?.value).toContain('£75')
  })

  it('includes railing panels with dimensions', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      fencePanels: {
        quantity: 2,
        panels: [
          { heightMm: 1500, lengthMm: 3000 },
          { heightMm: 1200, lengthMm: 2500 },
        ],
      },
    }
    
    const lines = buildConfigurationSummaryLines(config)
    
    expect(lines.find((line) => line.label === 'Railing panels')?.value).toBe('2 panels (quoted separately)')
    expect(lines.find((line) => line.label === 'Panel 1')?.value).toBe('3000 mm × 1500 mm')
    expect(lines.find((line) => line.label === 'Panel 2')?.value).toBe('2500 mm × 1200 mm')
  })

  it('includes the fulfilment choice', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      fulfilment: 'supply_only' as const,
    }
    expect(buildConfigurationSummaryLines(config).find((line) => line.label === 'Supply or install')).toEqual({
      label: 'Supply or install',
      value: 'Supply only',
    })
  })
})

describe('selectedRailheadSlug', () => {
  it('returns the variant when top railheads are on', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const options = base.options.map((option) =>
      option.key === 'top_railheads'
        ? { ...option, enabled: true, quantity: 8, variant: 'RH7' }
        : option,
    )
    expect(selectedRailheadSlug(options)).toBe('RH7')
  })

  it('defaults to RH32 when enabled without a variant', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const options = base.options.map((option) =>
      option.key === 'top_railheads' ? { ...option, enabled: true, quantity: 8 } : option,
    )
    expect(selectedRailheadSlug(options)).toBe('RH32')
  })

  it('returns null when railheads are off', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    expect(selectedRailheadSlug(config.options)).toBeNull()
  })
})
