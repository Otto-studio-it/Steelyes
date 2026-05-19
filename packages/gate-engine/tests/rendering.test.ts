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
              quantity: 8,
            }
          : option,
      ),
    }

    const plan = buildGateRenderPlan(config)

    expect(plan.notes).toContain('Railheads are shown schematically until the final catalogue is confirmed.')
    expect(plan.primitives.some((primitive) => primitive.kind === 'circle' && primitive.id.startsWith('top-railhead-'))).toBe(true)
  })
})
