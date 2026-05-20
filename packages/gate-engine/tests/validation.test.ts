import { describe, expect, it } from 'vitest'

import {
  createGateConfig,
  createGatePreset,
  normalizeGateConfig,
  validateGateConfig,
} from '../src/index'

describe('gate-engine validation', () => {
  it('normalizes a partial draft using the preset baseline', () => {
    const config = normalizeGateConfig({
      gateType: 'single_swing',
      widthMm: 880,
    })

    expect(config.version).toBe(1)
    expect(config.gateType).toBe('single_swing')
    expect(config.style).toBe('traditional_victorian')
    expect(config.widthMm).toBe(880)
    expect(config.heightMm).toBe(1000)
    expect(config.finish).toBe('matte_black')
    expect(config.fencePanels.quantity).toBe(0)
    expect(config.options).toHaveLength(7)
  })

  it('accepts a valid preset-based config', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const result = validateGateConfig(config)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.gateType).toBe('double_swing')
    }
  })

  it('rejects invalid dimensions and fence panel mismatch', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      widthMm: 500,
      fencePanels: {
        quantity: 2,
        panels: [{ heightMm: 900, lengthMm: 1200 }],
      },
    }

    const result = validateGateConfig(config)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues.map((issue) => issue.code)).toContain('invalid_width')
      expect(result.issues.map((issue) => issue.code)).toContain('fence_panel_quantity_mismatch')
    }
  })

  it('rejects duplicated option keys on a fully formed config', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const duplicated = {
      ...config,
      options: [
        config.options[0],
        {
          ...config.options[0],
        },
        ...config.options.slice(1),
      ],
    }

    const result = validateGateConfig(duplicated)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues.map((issue) => issue.code)).toContain('duplicate_option')
    }
  })

  it('rejects decorative victorian options on composite boards', () => {
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

    const result = validateGateConfig(config)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues.map((issue) => issue.code)).toContain('incompatible_option_style')
    }
  })

  it('rejects dog bar railheads when dog bars are disabled', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const result = validateGateConfig({
      ...config,
      options: config.options.map((option) =>
        option.key === 'dog_bar_railheads'
          ? {
              ...option,
              enabled: true,
              quantity: 8,
            }
          : option,
      ),
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues.map((issue) => issue.code)).toContain('missing_option_dependency')
    }
  })

  it('rejects railhead quantities that exceed the gate width geometry', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const result = validateGateConfig({
      ...config,
      options: config.options.map((option) =>
        option.key === 'top_railheads'
          ? {
              ...option,
              enabled: true,
              quantity: 15,
            }
          : option,
      ),
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues.map((issue) => issue.code)).toContain('geometry_count_mismatch')
    }
  })
})
