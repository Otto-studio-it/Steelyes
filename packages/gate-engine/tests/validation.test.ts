import { describe, expect, it } from 'vitest'

import {
  GATE_DIMENSION_LIMITS,
  GLOBAL_DIMENSION_LIMITS,
  GATE_OPTION_KEYS,
  createGateConfig,
  createGatePreset,
  getDimensionLimits,
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
    expect(config.finish).toBe('black_satin')
    expect(config.fencePanels.quantity).toBe(0)
    expect(config.options).toHaveLength(GATE_OPTION_KEYS.length)
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

  it('accepts a railing panel up to 100 m long and 10 m high', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      fencePanels: {
        quantity: 1,
        panels: [{ heightMm: 10_000, lengthMm: 100_000 }],
      },
    }

    expect(validateGateConfig(config).ok).toBe(true)
  })

  it('rejects a railing panel above 100 m long or 10 m high', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      fencePanels: {
        quantity: 1,
        panels: [{ heightMm: 10_001, lengthMm: 100_001 }],
      },
    }

    const result = validateGateConfig(config)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues.map((issue) => issue.code)).toEqual(
        expect.arrayContaining(['invalid_fence_panel_height_range', 'invalid_fence_panel_length_range']),
      )
    }
  })

  it('rejects fence panels outside the standard 900mm to 1000mm band', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      fencePanels: {
        quantity: 1,
        panels: [{ heightMm: 900, lengthMm: 850 }],
      },
    }

    const result = validateGateConfig(config)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues.map((issue) => issue.code)).toContain('invalid_fence_panel_length_range')
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

  it('accepts circles on composite boards (explicit enable required, not auto-enabled)', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      style: 'composite_boards' as const,
      options: createGateConfig(createGatePreset('double_swing')).options.map((option) =>
        option.key === 'circles'
          ? {
              ...option,
              enabled: true,
            }
          : option,
      ),
    }

    const result = validateGateConfig(config)

    expect(result.ok).toBe(true)
  })

  it('has circles disabled by default on all gate configs', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const circlesOption = config.options.find((option) => option.key === 'circles')
    
    expect(circlesOption?.enabled).toBe(false)
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

  it('clamps oversized dimensions to the gate type limits during normalization', () => {
    const limits = getDimensionLimits('double_swing')
    const config = normalizeGateConfig({
      gateType: 'double_swing',
      widthMm: 9000,
      heightMm: 5000,
    })

    expect(config.widthMm).toBe(limits.maxWidthMm)
    expect(config.heightMm).toBe(limits.maxHeightMm)
    expect(validateGateConfig(config).ok).toBe(true)
  })

  it('returns per-type dimension limits and global fallback without gateType', () => {
    expect(getDimensionLimits('single_swing')).toEqual(GATE_DIMENSION_LIMITS.single_swing)
    expect(getDimensionLimits()).toEqual(GLOBAL_DIMENSION_LIMITS)
  })

  it('rejects quantity above 1 for single-instance flat options', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const result = validateGateConfig({
      ...config,
      options: config.options.map((option) =>
        option.key === 'arched_top'
          ? {
              ...option,
              enabled: true,
              quantity: 3,
            }
          : option,
      ),
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues.map((issue) => issue.code)).toContain('option_quantity_not_applicable')
    }
  })

  it('normalizes single-instance flat option quantities down to 1', () => {
    const config = normalizeGateConfig({
      gateType: 'double_swing',
      options: [{ key: 'middle_bar', enabled: true, quantity: 4 }],
    })

    const middleBar = config.options.find((option) => option.key === 'middle_bar')

    expect(middleBar?.quantity).toBe(1)
    expect(validateGateConfig(config).ok).toBe(true)
  })

  it('treats high railhead quantities as provisional guidance, not a hard fail', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const result = validateGateConfig({
      ...config,
      options: config.options.map((option) =>
        option.key === 'top_railheads'
          ? {
              ...option,
              enabled: true,
              // Above CA-14 bay guide (~17 at 1800 mm)
              quantity: 40,
            }
          : option,
      ),
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.guidance?.some((issue) => issue.code === 'provisional_count_guidance')).toBe(true)
      expect(result.guidance?.[0]?.message).toMatch(/survey/i)
      expect(result.guidance?.[0]?.message).not.toMatch(/cannot exceed/i)
    }
  })
  it('rounds non-integer dimensions instead of silently swapping in the preset', () => {
    const config = normalizeGateConfig({ gateType: 'double_swing', widthMm: 3047.6, heightMm: 1799.5 })
    expect(config.widthMm).toBe(3048)
    expect(config.heightMm).toBe(1800)
    // Missing / non-numeric still takes the preset.
    expect(normalizeGateConfig({ gateType: 'double_swing', widthMm: Number.NaN }).widthMm).toBe(1800)
  })

  it('rejects invalid posts and motorised values before they reach mesh or pricing', () => {
    const base = createGateConfig(createGatePreset('double_swing'))

    const nanPosts = validateGateConfig({ ...base, posts: { ...base.posts, extendAboveGateMm: Number.NaN } })
    expect(nanPosts.ok).toBe(false)
    expect(!nanPosts.ok && nanPosts.issues.map((issue) => issue.code)).toContain('invalid_posts')

    const badMaterial = validateGateConfig({ ...base, posts: { ...base.posts, material: 'gold' as never } })
    expect(!badMaterial.ok && badMaterial.issues.map((issue) => issue.code)).toContain('invalid_posts')

    const badMotor = validateGateConfig({ ...base, motorised: 'yes' as never })
    expect(!badMotor.ok && badMotor.issues.map((issue) => issue.code)).toContain('invalid_motorised')
  })

  it('returns issues instead of throwing on structurally broken configs', () => {
    const base = createGateConfig(createGatePreset('double_swing'))

    expect(() => validateGateConfig({ ...base, options: null as never })).not.toThrow()
    expect(validateGateConfig({ ...base, options: null as never }).ok).toBe(false)
    expect(validateGateConfig({ ...base, fencePanels: null as never }).ok).toBe(false)
    expect(
      validateGateConfig({ ...base, fencePanels: { quantity: 1, panels: [null as never] } }).ok,
    ).toBe(false)
  })
})
