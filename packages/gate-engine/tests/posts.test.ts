import { describe, expect, it } from 'vitest'

import { buildGateRenderPlan, createGateConfig, createGatePreset, normalizeGatePosts } from '../src/index'

describe('gate posts rendering', () => {
  it('renders mounting posts in installation view when enabled', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateRenderPlan(config, { viewMode: 'installation' })

    expect(plan.viewMode).toBe('installation')
    expect(plan.background.length).toBeGreaterThan(0)
    expect(plan.primitives.some((item) => item.id === 'left-mount-post')).toBe(true)
    expect(plan.primitives.some((item) => item.id === 'right-mount-post')).toBe(true)
  })

  it('hides posts when disabled', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      posts: normalizeGatePosts({ enabled: false, material: 'none', capStyle: 'flat', extendAboveGateMm: 0 }),
    }
    const plan = buildGateRenderPlan(config, { viewMode: 'installation' })

    expect(plan.primitives.some((item) => item.id === 'left-mount-post')).toBe(false)
  })

  it('uses technical dimensions in technical view', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateRenderPlan(config, { viewMode: 'technical' })

    expect(plan.labels.some((label) => label.id === 'label-dimensions')).toBe(true)
    expect(plan.primitives.some((item) => item.id === 'width-dimension-line')).toBe(true)
  })
})
