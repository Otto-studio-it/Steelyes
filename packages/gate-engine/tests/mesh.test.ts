import { describe, expect, it } from 'vitest'

import {
  buildGateMeshPlan,
  checkMeshOpeningEnvelope,
  createGateConfig,
  createGatePreset,
  MESH_ENVELOPE_TOLERANCE_MM,
  type GateConfig,
  type GateOptionKey,
} from '../src/index'

function enableOption(config: GateConfig, key: GateOptionKey, quantity = 1): GateConfig {
  return {
    ...config,
    options: config.options.map((option) =>
      option.key === key ? { ...option, enabled: true, quantity } : option,
    ),
  }
}

describe('gate-engine mesh', () => {
  it('builds a schematic mesh plan for double swing gates', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateMeshPlan(config)

    expect(plan.finish).toBe('black_satin')
    expect(plan.material.colorHex).toBe('#1C1C1E')
    expect(plan.boxes.some((box) => box.id === 'leaf-frame-1-stile-left')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'leaf-frame-2-stile-left')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'left-mount-post')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'right-mount-post')).toBe(true)
    expect(plan.opening).toEqual({
      clearOpeningMm: config.widthMm,
      heightMm: config.heightMm,
      datum: 'clear_opening_ground_to_top_rail',
    })
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
    expect(plan.boxes.some((box) => box.id === 'sliding-panel-stile-left')).toBe(true)
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

  it('adds fold stile, hinge knuckles, and stack packs for bifolding swing gates', () => {
    const config = createGateConfig(createGatePreset('bifolding_double_swing'))
    const plan = buildGateMeshPlan(config)

    expect(plan.boxes.some((box) => box.id === 'leaf-fold-1')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'leaf-fold-2')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'leaf-fold-hinge-1-0')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'leaf-frame-1-outer-stile-left')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'leaf-frame-2-outer-stile-left')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'bifold-stack-left')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'bifold-stack-right')).toBe(true)
  })

  it('puts victorian pickets on both bifold panels per leaf', () => {
    const config = createGateConfig(createGatePreset('bifolding_double_swing'))
    const plan = buildGateMeshPlan(config)

    expect(plan.fidelity).toBe('workshop')
    expect(plan.cylinders.some((c) => c.id.startsWith('leaf-1-picket-upper-'))).toBe(true)
    expect(plan.cylinders.some((c) => c.id.startsWith('leaf-1-outer-picket-upper-'))).toBe(true)
    expect(plan.cylinders.some((c) => c.id.startsWith('leaf-2-outer-picket-upper-'))).toBe(true)
  })

  it('single bifold has one fold stile and left stack only', () => {
    const plan = buildGateMeshPlan(createGateConfig(createGatePreset('single_bifolding')))
    expect(plan.boxes.some((box) => box.id === 'leaf-fold-1')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'leaf-fold-2')).toBe(false)
    expect(plan.boxes.some((box) => box.id === 'bifold-stack-left')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'bifold-stack-right')).toBe(false)
    expect(plan.cylinders.some((c) => c.id.startsWith('leaf-1-outer-'))).toBe(true)
  })

  it('adds telescopic segment boxes for telescopic sliding gates', () => {
    const config = createGateConfig(createGatePreset('telescopic_sliding'))
    const plan = buildGateMeshPlan(config)

    expect(plan.boxes.some((box) => box.id === 'telescopic-segment-1-stile-left')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'telescopic-segment-2-stile-left')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'telescopic-segment-3-stile-left')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'telescopic-segment-4-stile-left')).toBe(false)
  })

  it('builds workshop telescopic mesh with overlap stiles and stack outside opening', () => {
    const config = createGateConfig(createGatePreset('telescopic_sliding'))
    const plan = buildGateMeshPlan(config)
    const check = checkMeshOpeningEnvelope(plan, config)

    expect(plan.fidelity).toBe('workshop')
    expect(plan.cylinders.some((c) => c.id.startsWith('telescopic-segment-1-picket-'))).toBe(true)
    expect(plan.cylinders.some((c) => c.id.startsWith('telescopic-segment-3-picket-'))).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'telescopic-segment-2-overlap-stile')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'telescopic-stack-zone')).toBe(true)
    const stack = plan.boxes.find((box) => box.id === 'telescopic-stack-zone')!
    expect(stack.positionMm[0]).toBeGreaterThan(config.widthMm / 2)
    expect(check?.withinTolerance).toBe(true)
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

  it('builds a workshop articulated mesh for radius sliding', () => {
    const plan = buildGateMeshPlan(createGateConfig(createGatePreset('radius_sliding')))
    const check = checkMeshOpeningEnvelope(plan, createGateConfig(createGatePreset('radius_sliding')))

    expect(plan.boxes.some((box) => box.id === 'radius-segment-1-stile-left')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'radius-segment-3-stile-left')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'radius-hinge-1')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'radius-park-leaf-0')).toBe(true)
    expect(plan.cylinders.some((c) => c.id.startsWith('radius-segment-1-picket-'))).toBe(true)
    expect(plan.fidelity).toBe('workshop')
    expect(check?.withinTolerance).toBe(true)
  })

  it('marks Victorian swing mesh as workshop fidelity', () => {
    const plan = buildGateMeshPlan(createGateConfig(createGatePreset('double_swing')))
    expect(plan.fidelity).toBe('workshop')
    expect(plan.cylinders.length).toBeGreaterThan(0)
  })

  it('keeps opening leaf span and height within AR tape tolerance for every gate type', () => {
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
      // Use catalog preset dims — each gate type has different width/height limits.
      const config = createGateConfig(createGatePreset(gateType))
      const plan = buildGateMeshPlan(config)
      const check = checkMeshOpeningEnvelope(plan, config)

      expect(check, gateType).not.toBeNull()
      expect(Math.abs(check!.widthErrorMm), `${gateType} width`).toBeLessThanOrEqual(
        MESH_ENVELOPE_TOLERANCE_MM,
      )
      expect(Math.abs(check!.heightErrorMm), `${gateType} height`).toBeLessThanOrEqual(
        MESH_ENVELOPE_TOLERANCE_MM,
      )
      expect(check!.withinTolerance, gateType).toBe(true)
    }
  })

  it('does not let visual boldness shrink swing leaf height below typed height', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateMeshPlan(config)
    const stile = plan.boxes.find((box) => box.id === 'leaf-frame-1-stile-left')

    expect(stile?.heightMm).toBe(config.heightMm)
    expect(stile?.positionMm[1]).toBe(config.heightMm / 2)
  })

  it('excludes cantilever counterbalance from the clear-opening envelope', () => {
    const config = {
      ...createGateConfig(createGatePreset('cantilever_sliding')),
      widthMm: 4000,
      heightMm: 1800,
    }
    const plan = buildGateMeshPlan(config)
    const check = checkMeshOpeningEnvelope(plan, config)
    const tail = plan.boxes.find((box) => box.id === 'counterbalance-tail')

    expect(tail).toBeDefined()
    expect(check?.leafSpanMm).toBeCloseTo(4000, 5)
    expect(tail!.positionMm[0]).toBeGreaterThan(config.widthMm / 2)
  })

  it('builds arched top rail segments within the typed height envelope', () => {
    const config = enableOption(createGateConfig(createGatePreset('double_swing')), 'arched_top')
    const plan = buildGateMeshPlan(config)
    const check = checkMeshOpeningEnvelope(plan, config)

    expect(plan.boxes.some((box) => box.id.startsWith('leaf-1-arch-seg-'))).toBe(true)
    expect(plan.boxes.some((box) => box.id.startsWith('leaf-2-arch-seg-'))).toBe(true)
    expect(check?.withinTolerance).toBe(true)
  })

  it('builds dog rail + short dog bars for dog_bars option', () => {
    const config = enableOption(createGateConfig(createGatePreset('single_swing')), 'dog_bars', 10)
    const plan = buildGateMeshPlan(config)
    const check = checkMeshOpeningEnvelope(plan, config)

    expect(plan.boxes.some((box) => box.id === 'leaf-1-dog-rail')).toBe(true)
    expect(plan.cylinders.some((cylinder) => cylinder.id.startsWith('leaf-1-dog-bar-'))).toBe(true)
    expect(check?.withinTolerance).toBe(true)
  })

  it('subdivides composite swing leaves into vertical boards', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      style: 'composite_boards' as const,
    }
    const plan = buildGateMeshPlan(config)
    const check = checkMeshOpeningEnvelope(plan, config)

    expect(plan.boxes.some((box) => box.id === 'leaf-1-board-1')).toBe(true)
    expect(plan.fidelity).toBe('schematic')
    expect(check?.withinTolerance).toBe(true)
  })

  it('does not draw top railhead finials on mesh (catalogue-only)', () => {
    const config = enableOption(createGateConfig(createGatePreset('double_swing')), 'top_railheads', 8)
    const plan = buildGateMeshPlan(config)
    const check = checkMeshOpeningEnvelope(plan, config)

    expect(plan.boxes.some((box) => box.id.includes('railhead'))).toBe(false)
    expect(check?.withinTolerance).toBe(true)
  })

  it('shows a manual handle only when not motorised (CA-01)', () => {
    const manual = createGateConfig(createGatePreset('double_swing'))
    expect(manual.motorised).toBe(false)
    const manualPlan = buildGateMeshPlan(manual)
    expect(manualPlan.boxes.some((box) => box.id === 'manual-handle-plate')).toBe(true)

    const motorised = { ...manual, motorised: true }
    const motorPlan = buildGateMeshPlan(motorised)
    expect(motorPlan.boxes.some((box) => box.id === 'manual-handle-plate')).toBe(false)
    expect(motorPlan.cylinders.some((cylinder) => cylinder.id === 'manual-handle-grip')).toBe(false)
  })

  it('builds tracked sliding with ground track, Victorian pickets, and no false opening gap', () => {
    const config = createGateConfig(createGatePreset('tracked_sliding'))
    const plan = buildGateMeshPlan(config)
    const check = checkMeshOpeningEnvelope(plan, config)

    expect(plan.boxes.some((box) => box.id === 'sliding-track')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'sliding-panel-stile-left')).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'tracked-runback-zone')).toBe(true)
    expect(plan.cylinders.some((cylinder) => cylinder.id.startsWith('tracked-leaf-picket-'))).toBe(
      true,
    )
    expect(plan.fidelity).toBe('workshop')
    expect(check?.withinTolerance).toBe(true)
    expect(plan.notes.some((note) => note.includes('ground track'))).toBe(true)
  })

  it('builds cantilever without driveway ground track and keeps tail outside the opening', () => {
    const config = {
      ...createGateConfig(createGatePreset('cantilever_sliding')),
      widthMm: 4000,
    }
    const plan = buildGateMeshPlan(config)
    const check = checkMeshOpeningEnvelope(plan, config)
    const tail = plan.boxes.find((box) => box.id === 'counterbalance-tail')

    expect(plan.boxes.some((box) => box.id === 'sliding-track')).toBe(false)
    expect(plan.boxes.some((box) => box.id === 'cantilever-tail-diag')).toBe(true)
    expect(tail).toBeDefined()
    expect(tail!.positionMm[0]).toBeGreaterThan(config.widthMm / 2)
    expect(plan.cylinders.length).toBeGreaterThan(0)
    expect(plan.fidelity).toBe('workshop')
    expect(check?.leafSpanMm).toBeCloseTo(4000, 5)
    expect(check?.withinTolerance).toBe(true)
  })

  it('applies arched and dog_bars options on tracked sliding within envelope', () => {
    const config = enableOption(
      enableOption(createGateConfig(createGatePreset('tracked_sliding')), 'arched_top'),
      'dog_bars',
      12,
    )
    const plan = buildGateMeshPlan(config)
    const check = checkMeshOpeningEnvelope(plan, config)

    expect(plan.boxes.some((box) => box.id.startsWith('tracked-leaf-arch-seg-'))).toBe(true)
    expect(plan.boxes.some((box) => box.id === 'tracked-leaf-dog-rail')).toBe(true)
    expect(plan.cylinders.some((cylinder) => cylinder.id.startsWith('tracked-leaf-dog-bar-'))).toBe(
      true,
    )
    expect(check?.withinTolerance).toBe(true)
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
  it('keeps Victorian infill visible — no picket sits inside an opaque frame or panel box', () => {
    const gateTypes = [
      'double_swing',
      'single_swing',
      'bifolding_double_swing',
      'single_bifolding',
      'tracked_sliding',
      'cantilever_sliding',
      'telescopic_sliding',
      'radius_sliding',
    ] as const

    for (const gateType of gateTypes) {
      for (const arched of [false, true]) {
        const base = createGateConfig(createGatePreset(gateType))
        const config = {
          ...base,
          style: 'traditional_victorian' as const,
          options: base.options.map((option) =>
            option.key === 'arched_top' ? { ...option, enabled: arched } : option,
          ),
        }
        const plan = buildGateMeshPlan(config)
        const solids = plan.boxes.filter((box) => box.role === 'frame' || box.role === 'panel')
        const pickets = plan.cylinders.filter((cylinder) => cylinder.id.includes('picket'))

        expect(pickets.length, `${gateType} pickets`).toBeGreaterThan(0)
        for (const picket of pickets) {
          const [x, y, z] = picket.positionMm
          const swallowed = solids.some(
            (box) =>
              Math.abs(x - box.positionMm[0]) + picket.radiusMm <= box.widthMm / 2 &&
              Math.abs(y - box.positionMm[1]) + picket.heightMm / 2 <= box.heightMm / 2 &&
              Math.abs(z - box.positionMm[2]) + picket.radiusMm <= box.depthMm / 2,
          )
          expect(swallowed, `${gateType}${arched ? ' arched' : ''} ${picket.id}`).toBe(false)
        }

        const check = checkMeshOpeningEnvelope(plan, config)
        expect(check?.withinTolerance, `${gateType}${arched ? ' arched' : ''} envelope`).toBe(true)
      }
    }
  })
})
