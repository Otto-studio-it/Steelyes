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
    expect(lines.find((line) => line.label === 'Railheads')).toEqual({
      label: 'Railheads',
      value: railheadSeriesLabel('RH32'),
    })
    expect(lines.find((line) => line.label === 'Railheads')?.value).not.toContain('RH32')
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

    expect(buildConfigurationSummaryLines(config, undefined, 'workshop').find((line) => line.label === 'Railheads')).toEqual({
      label: 'Railheads',
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

    expect(buildConfigurationSummaryLines(config).find((line) => line.label === 'Railheads')).toEqual({
      label: 'Railheads',
      value: 'selected (series TBC)',
    })
  })

  it('omits railheads when disabled', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    expect(buildConfigurationSummaryLines(config).some((line) => line.label === 'Railheads')).toBe(
      false,
    )
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
