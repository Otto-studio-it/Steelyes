import { describe, expect, it } from 'vitest'

import {
  buildGateGeometryPlan,
  buildSwingRailLayout,
  createGateConfig,
  createGatePreset,
  SWING_RAIL_COUNT,
  VICTORIAN_DOUBLE_SWING_ZONE_RATIOS,
} from '../src/index'

describe('gate-engine geometry recipe', () => {
  it('builds a Victorian swing plan for double swing configs', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateGeometryPlan(config)

    expect(plan).not.toBeNull()
    if (!plan) return

    expect(plan.kind).toBe('swing_victorian')
    expect(plan.leafCount).toBe(2)
    expect(plan.zones).toEqual(VICTORIAN_DOUBLE_SWING_ZONE_RATIOS)
    expect(plan.features.centerLatch).toBe(true)
    expect(plan.features.tubeProfile).toBe(true)
    expect(plan.pickets.spacingMm).toBeGreaterThan(0)
  })

  it('derives four rail positions from zone ratios', () => {
    const rails = buildSwingRailLayout(VICTORIAN_DOUBLE_SWING_ZONE_RATIOS)

    expect(rails.upperMid).toBeCloseTo(0.14)
    expect(rails.spearBand).toBeCloseTo(0.62)
    expect(rails.lowerMid).toBeCloseTo(0.71)
    expect(rails.bottom).toBeCloseTo(0.98)
    expect(SWING_RAIL_COUNT).toBe(4)
  })

  it('enables decorative layers when options are selected', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      options: createGateConfig(createGatePreset('double_swing')).options.map((option) => {
        if (option.key === 'arched_top' || option.key === 'bushes' || option.key === 'spirals' || option.key === 'dog_bars') {
          return { ...option, enabled: true, quantity: 1 }
        }
        if (option.key === 'dog_bar_railheads') {
          return { ...option, enabled: true, quantity: 6 }
        }
        return option
      }),
    }

    const plan = buildGateGeometryPlan(config)
    expect(plan?.features.archedTop).toBe(true)
    expect(plan?.features.circleBands).toBe(true)
    expect(plan?.features.basketTwists).toBe(true)
    expect(plan?.features.spearRow).toBe(true)
  })

  it('returns null for composite style on swing gates', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      style: 'composite_boards' as const,
    }

    expect(buildGateGeometryPlan(config)).toBeNull()
  })

  it('returns null for invalid configs', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      widthMm: 100,
    }

    expect(buildGateGeometryPlan(config)).toBeNull()
  })
})
