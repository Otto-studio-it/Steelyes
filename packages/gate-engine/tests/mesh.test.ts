import { describe, expect, it } from 'vitest'

import { buildGateMeshPlan, createGateConfig, createGatePreset } from '../src/index'

describe('gate-engine mesh', () => {
  it('builds a schematic mesh plan for double swing gates', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateMeshPlan(config)

    expect(plan.finish).toBe('black_satin')
    expect(plan.material.colorHex).toBe('#1C1C1E')
    expect(plan.boxes.some((box) => box.id === 'leaf-frame-1')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'leaf-frame-2')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'left-mount-post')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'right-mount-post')).toBe(true)
  })

  it('uses finish material tokens from the shared catalog', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      finish: 'black_matt' as const,
    }
    const plan = buildGateMeshPlan(config)

    expect(plan.material.colorHex).toBe('#1A1A1A')
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
    expect(plan.notes.some((note) => note.includes('5333') && note.includes('1/3'))).toBe(true)
  })

  it('includes tube pickets as cylinders for Victorian double swing', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateMeshPlan(config)

    expect(plan.cylinders.length).toBeGreaterThan(0)
    expect(plan.cylinders.some((cylinder) => cylinder.role === 'bar')).toBe(true)
  })

  it('adds fold detail boxes for bifolding swing gates', () => {
    const config = createGateConfig(createGatePreset('bifolding_double_swing'))
    const plan = buildGateMeshPlan(config)

    expect(plan.boxes.some((box) => box.id === 'leaf-fold-1')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'leaf-frame-1-outer')).toBe(true)
  })

  it('adds telescopic segment boxes for telescopic sliding gates', () => {
    const config = createGateConfig(createGatePreset('telescopic_sliding'))
    const plan = buildGateMeshPlan(config)

    expect(plan.boxes.some((box) => box.id === 'telescopic-segment-1')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'telescopic-segment-2')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'telescopic-segment-3')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'telescopic-segment-4')).toBe(false)
  })

  it('builds a mesh plan for every gate type', () => {
    const types = [
      'double_swing',
      'single_swing',
      'tracked_sliding',
      'cantilever_sliding',
      'bifolding_double_swing',
      'single_bifolding',
      'telescopic_sliding',
      'radius_sliding',
    ] as const

    for (const gateType of types) {
      const plan = buildGateMeshPlan(createGateConfig(createGatePreset(gateType)))
      expect(plan.gateType).toBe(gateType)
      expect(plan.boxes.length).toBeGreaterThan(0)
      expect(plan.fidelity === 'workshop' || plan.fidelity === 'schematic').toBe(true)
    }
  })

  it('builds a schematic articulated mesh for radius sliding', () => {
    const plan = buildGateMeshPlan(createGateConfig(createGatePreset('radius_sliding')))
    expect(plan.boxes.some((box) => box.id === 'radius-segment-1')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'radius-segment-3')).toBe(true)
    expect(plan.fidelity).toBe('schematic')
  })

  it('marks Victorian swing mesh as workshop fidelity', () => {
    const plan = buildGateMeshPlan(createGateConfig(createGatePreset('double_swing')))
    expect(plan.fidelity).toBe('workshop')
    expect(plan.cylinders.length).toBeGreaterThan(0)
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
