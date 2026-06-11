import { describe, expect, it } from 'vitest'

import { buildGateMeshPlan, createGateConfig, createGatePreset } from '../src/index'

describe('gate-engine mesh', () => {
  it('builds a schematic mesh plan for double swing gates', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateMeshPlan(config)

    expect(plan.finish).toBe('matte_black')
    expect(plan.material.colorHex).toBe('#1A1A1A')
    expect(plan.boxes.some((box) => box.id === 'leaf-1')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'leaf-2')).toBe(true)
  })

  it('uses finish material tokens from the shared catalog', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      finish: 'bronze' as const,
    }
    const plan = buildGateMeshPlan(config)

    expect(plan.material.colorHex).toBe('#8B6914')
  })

  it('builds a sliding mesh plan with track and panel boxes', () => {
    const config = createGateConfig(createGatePreset('tracked_sliding'))
    const plan = buildGateMeshPlan(config)

    expect(plan.boxes.some((box) => box.id === 'sliding-track')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'sliding-panel')).toBe(true)
  })

  it('includes a counterbalance tail in cantilever mesh plans', () => {
    const config = {
      ...createGateConfig(createGatePreset('cantilever_sliding')),
      widthMm: 4000,
    }
    const plan = buildGateMeshPlan(config)

    expect(plan.boxes.some((box) => box.id === 'counterbalance-tail')).toBe(true)
    expect(plan.notes).toContain('Cantilever counterbalance tail is shown at a 1/3 ratio for a 4m opening.')
  })

  it('rejects invalid configs before mesh generation', () => {
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

    expect(() => buildGateMeshPlan(config)).toThrowError('Invalid gate config for mesh generation')
  })
})
