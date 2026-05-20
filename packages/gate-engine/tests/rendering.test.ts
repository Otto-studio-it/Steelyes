import { describe, expect, it } from 'vitest'

import { buildGateRenderPlan, createGateConfig, createGatePreset } from '../src/index'

describe('gate-engine rendering', () => {
  it('builds a swing preview plan with labels and frame primitives', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateRenderPlan(config)

    expect(plan.title).toContain('double swing')
    expect(plan.subtitle).toContain('1800 mm wide')
    expect(plan.primitives.some((primitive) => primitive.kind === 'rect' && primitive.id === 'swing-frame')).toBe(true)
    expect(plan.labels).toHaveLength(4)
  })

  it('builds a sliding preview plan with a track and note', () => {
    const config = {
      ...createGateConfig(createGatePreset('tracked_sliding')),
      motorised: true,
    }
    const plan = buildGateRenderPlan(config)

    expect(plan.title).toContain('tracked sliding')
    expect(plan.primitives.some((primitive) => primitive.kind === 'line' && primitive.id === 'track-line')).toBe(true)
    expect(plan.notes).toContain('2D technical drawing preview')
    expect(plan.labels.some((label) => label.id === 'label-track')).toBe(true)
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

  it('uses different schematic colors for different finishes', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const mattePlan = buildGateRenderPlan({ ...base, finish: 'matte_black' })
    const bronzePlan = buildGateRenderPlan({ ...base, finish: 'bronze' })

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
