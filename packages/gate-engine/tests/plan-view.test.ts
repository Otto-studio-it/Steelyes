import { describe, expect, it } from 'vitest'

import { buildGateRenderPlan, createGateConfig, createGatePreset, serializeGateRenderPlanToSvg } from '../src/index'

describe('gate-engine plan view', () => {
  it('builds a plan view render plan for double swing gates', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateRenderPlan(config, { viewMode: 'plan' })

    expect(plan.viewMode).toBe('plan')
    expect(plan.primitives.some((primitive) => primitive.id === 'driveway')).toBe(true)
    expect(plan.primitives.some((primitive) => primitive.id === 'swing-leaf-plan-1')).toBe(true)
    expect(plan.primitives.some((primitive) => primitive.id === 'swing-leaf-plan-2')).toBe(true)
  })

  it('serializes plan view output to SVG', () => {
    const config = createGateConfig(createGatePreset('tracked_sliding'))
    const plan = buildGateRenderPlan(config, { viewMode: 'plan' })
    const svg = serializeGateRenderPlanToSvg(plan)

    expect(svg).toContain('<svg')
    expect(svg).toContain('sliding-panel-plan')
  })
})
