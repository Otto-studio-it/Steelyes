import { describe, expect, it } from 'vitest'

import { buildGateRenderPlan, createGateConfig, createGatePreset } from '../src/index'

describe('gate-engine rendering', () => {
  it('builds a swing preview plan with labels and frame primitives', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateRenderPlan(config, { viewMode: 'technical' })

    expect(plan.title).toContain('double swing')
    expect(plan.subtitle).toContain('1800 mm opening')
    expect(plan.primitives.some((primitive) => primitive.kind === 'rect' && primitive.id === 'swing-frame')).toBe(true)
    expect(plan.primitives.some((primitive) => primitive.kind === 'line' && primitive.id === 'upper-mid-rail')).toBe(true)
    expect(plan.primitives.some((primitive) => primitive.kind === 'line' && primitive.id === 'bottom-rail')).toBe(true)
    expect(plan.labels).toHaveLength(4)
  })

  it('builds a sliding preview plan with a track and note', () => {
    const config = {
      ...createGateConfig(createGatePreset('tracked_sliding')),
      motorised: true,
    }
    const plan = buildGateRenderPlan(config, { viewMode: 'technical' })

    expect(plan.title).toContain('tracked sliding')
    expect(plan.primitives.some((primitive) => primitive.kind === 'line' && primitive.id === 'track-line')).toBe(true)
    expect(plan.notes).toContain('2D technical drawing preview')
    expect(plan.labels.some((label) => label.id === 'label-track')).toBe(true)
  })

  it('shows the cantilever counterbalance tail and 4m ratio note', () => {
    const config = {
      ...createGateConfig(createGatePreset('cantilever_sliding')),
      widthMm: 4000,
    }

    const plan = buildGateRenderPlan(config)

    expect(plan.primitives.some((primitive) => primitive.kind === 'rect' && primitive.id === 'cantilever-tail')).toBe(true)
    expect(plan.notes).toContain('Cantilever counterbalance tail is shown at a 1/3 ratio for a 4m opening.')
    expect(plan.labels.some((label) => label.id === 'label-tail')).toBe(true)
  })

  it('flags provisional railheads in the notes when they are shown', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
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

    const plan = buildGateRenderPlan(config)

    expect(plan.notes).toContain('Railheads are shown schematically until the final catalogue is confirmed.')
    expect(plan.notes).toContain('Decorative options are shown schematically at the selected quantity.')
    expect(
      plan.primitives.filter(
        (primitive) =>
          primitive.kind === 'circle' &&
          primitive.id.startsWith('top-railhead-') &&
          !primitive.id.endsWith('-shadow'),
      ),
    ).toHaveLength(9)
  })

  it('renders sliding decorative options using the selected quantities', () => {
    const config = {
      ...createGateConfig(createGatePreset('tracked_sliding')),
      options: createGateConfig(createGatePreset('tracked_sliding')).options.map((option) => {
        if (option.key === 'dog_bars') {
          return {
            ...option,
            enabled: true,
            quantity: 4,
          }
        }

        if (option.key === 'dog_bar_railheads') {
          return {
            ...option,
            enabled: true,
            quantity: 4,
          }
        }

        return option
      }),
    }

    const plan = buildGateRenderPlan(config)

    expect(plan.notes).toContain('Decorative options are shown schematically at the selected quantity.')
    expect(
      plan.primitives.filter(
        (primitive) =>
          primitive.kind === 'line' &&
          primitive.id.startsWith('sliding-dog-bar-') &&
          !primitive.id.endsWith('-shadow'),
      ),
    ).toHaveLength(4)
    expect(
      plan.primitives.filter(
        (primitive) =>
          primitive.kind === 'circle' &&
          primitive.id.startsWith('sliding-dog-railhead-') &&
          !primitive.id.endsWith('-shadow'),
      ),
    ).toHaveLength(4)
  })

  it('caps sliding top railheads at the geometry rule expectation', () => {
    const base = createGateConfig(createGatePreset('tracked_sliding'))
    const config = {
      ...base,
      options: base.options.map((option) =>
        option.key === 'top_railheads'
          ? {
              ...option,
              enabled: true,
              quantity: 8,
            }
          : option,
      ),
    }

    const plan = buildGateRenderPlan(config)
    const railheads = plan.primitives.filter(
      (primitive) =>
        primitive.kind === 'circle' &&
        primitive.id.startsWith('sliding-top-railhead-') &&
        !primitive.id.endsWith('-shadow'),
    )

    expect(railheads).toHaveLength(8)
  })

  it('caps sliding bushes and spirals at the decorative capacity', () => {
    const base = createGateConfig(createGatePreset('tracked_sliding'))
    const config = {
      ...base,
      options: base.options.map((option) => {
        if (option.key === 'bushes' || option.key === 'spirals') {
          return {
            ...option,
            enabled: true,
            quantity: 11,
          }
        }

        return option
      }),
    }

    const plan = buildGateRenderPlan(config)
    const bushes = plan.primitives.filter(
      (primitive) => primitive.kind === 'circle' && primitive.id.startsWith('sliding-bush-'),
    )
    const spirals = plan.primitives.filter(
      (primitive) => primitive.kind === 'path' && primitive.id.startsWith('sliding-spiral-'),
    )

    // tracked_sliding preset is 2500mm wide -> capacity clamp(round(2500/230), 6, 14) = 11
    expect(bushes).toHaveLength(11)
    expect(spirals).toHaveLength(11)
  })

  it('uses different schematic colors for different finishes', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const mattePlan = buildGateRenderPlan({ ...base, finish: 'black_satin' })
    const bronzePlan = buildGateRenderPlan({ ...base, finish: 'black_matt' })

    const matteFrame = mattePlan.primitives.find((primitive) => primitive.id === 'swing-frame')
    const bronzeFrame = bronzePlan.primitives.find((primitive) => primitive.id === 'swing-frame')

    expect(matteFrame?.kind).toBe('rect')
    expect(bronzeFrame?.kind).toBe('rect')
    if (matteFrame?.kind === 'rect' && bronzeFrame?.kind === 'rect') {
      expect(matteFrame.stroke).not.toBe(bronzeFrame.stroke)
    }
  })

  it('rejects invalid configs before rendering', () => {
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

    expect(() => buildGateRenderPlan(config)).toThrowError('Invalid gate config for rendering')
  })
})
