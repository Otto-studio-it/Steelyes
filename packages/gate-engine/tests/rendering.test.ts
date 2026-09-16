import { describe, expect, it } from 'vitest'

import {
  buildGateRenderPlan,
  cantileverTailNote,
  createGateConfig,
  createGatePreset,
} from '../src/index'

describe('gate-engine rendering', () => {
  it('builds a swing preview plan with labels and frame primitives', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateRenderPlan(config, { viewMode: 'technical' })

    expect(plan.title).toContain('double swing')
    expect(plan.subtitle).toContain('1800 mm opening')
    expect(plan.subtitle).toContain('Black')
    expect(plan.labels.some((label) => label.id === 'label-finish')).toBe(true)
    expect(plan.primitives.some((primitive) => primitive.kind === 'rect' && primitive.id === 'leaf-1-frame')).toBe(true)
    expect(plan.primitives.some((primitive) => primitive.kind === 'line' && primitive.id === 'leaf-1-mid-rail')).toBe(true)
    expect(plan.primitives.some((primitive) => primitive.kind === 'line' && primitive.id === 'leaf-1-bottom-rail')).toBe(true)
    expect(plan.labels.some((label) => label.id === 'label-title')).toBe(true)
    expect(plan.labels.some((label) => label.id === 'cad-dim-gate-width-label')).toBe(true)
    expect(plan.labels.length).toBeGreaterThanOrEqual(4)
  })

  it('paints installation fills from the selected finish and shows a finish swatch', () => {
    const satin = createGateConfig(createGatePreset('double_swing'))
    const anthracite = { ...satin, finish: 'anthracite_ral7016' as const }
    const satinPlan = buildGateRenderPlan(satin, { viewMode: 'installation' })
    const anthracitePlan = buildGateRenderPlan(anthracite, { viewMode: 'installation' })

    const satinFill = satinPlan.primitives.find((p) => p.id === 'swing-fill')
    const anthraciteFill = anthracitePlan.primitives.find((p) => p.id === 'swing-fill')
    expect(satinFill?.kind).toBe('rect')
    expect(anthraciteFill?.kind).toBe('rect')
    if (satinFill?.kind === 'rect' && anthraciteFill?.kind === 'rect') {
      expect(satinFill.fill).not.toBe(anthraciteFill.fill)
    }
    expect(satinPlan.primitives.some((p) => p.id === 'finish-swatch')).toBe(true)
    expect(satinPlan.notes.some((n) => n.includes('Black satin'))).toBe(true)
  })

  it('builds a sliding preview plan with a track and note', () => {
    const config = {
      ...createGateConfig(createGatePreset('tracked_sliding')),
      motorised: true,
    }
    const plan = buildGateRenderPlan(config, { viewMode: 'technical' })

    expect(plan.title).toContain('tracked sliding')
    expect(plan.primitives.some((primitive) => primitive.kind === 'line' && primitive.id === 'track-line')).toBe(true)
    expect(plan.notes.some((n) => n.includes('CAD elevation from photo-guided 2D masters'))).toBe(true)
    expect(plan.labels.some((label) => label.id === 'label-track')).toBe(true)
  })

  it('shows the cantilever counterbalance tail and 4m ratio note', () => {
    const config = {
      ...createGateConfig(createGatePreset('cantilever_sliding')),
      widthMm: 4000,
    }

    const plan = buildGateRenderPlan(config)

    expect(plan.primitives.some((primitive) => primitive.kind === 'rect' && primitive.id === 'cantilever-tail')).toBe(true)
    expect(plan.notes).toContain(cantileverTailNote(4000))
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

  it('draws tracked runback, guide, and bottom box details', () => {
    const plan = buildGateRenderPlan(
      { ...createGateConfig(createGatePreset('tracked_sliding')), motorised: true },
      { viewMode: 'technical' },
    )
    expect(plan.primitives.some((p) => p.id === 'tracked-runback-zone')).toBe(true)
    expect(plan.primitives.some((p) => p.id === 'tracked-guide-post')).toBe(true)
    expect(plan.primitives.some((p) => p.id === 'tracked-bottom-box')).toBe(true)
    expect(plan.notes.some((n) => n.includes('runback'))).toBe(true)
  })

  it('draws cantilever carriage and foundation cues', () => {
    const plan = buildGateRenderPlan(createGateConfig(createGatePreset('cantilever_sliding')), {
      viewMode: 'technical',
    })
    expect(plan.primitives.some((p) => p.id === 'cantilever-bottom-box')).toBe(true)
    expect(plan.primitives.some((p) => p.id === 'cantilever-ground-guide')).toBe(true)
    expect(plan.primitives.some((p) => p.id === 'cantilever-foundation')).toBe(true)
  })

  it('draws bifold stack cues and swing ground clearance', () => {
    const bifold = buildGateRenderPlan(createGateConfig(createGatePreset('bifolding_double_swing')), {
      viewMode: 'technical',
    })
    expect(bifold.primitives.some((p) => p.id === 'bifold-stack-left')).toBe(true)
    expect(bifold.primitives.some((p) => p.id === 'bifold-stack-right')).toBe(true)

    const swing = buildGateRenderPlan(createGateConfig(createGatePreset('double_swing')), {
      viewMode: 'technical',
    })
    expect(swing.primitives.some((p) => p.id === 'leaf-1-bottom-rail')).toBe(true)
    expect(swing.notes.some((n) => n.includes('100 mm'))).toBe(true)
  })

  it('draws radius leaf splits for wide openings', () => {
    const plan = buildGateRenderPlan(
      { ...createGateConfig(createGatePreset('radius_sliding')), widthMm: 2600 },
      { viewMode: 'technical' },
    )
    expect(plan.primitives.some((p) => p.id === 'radius-leaf-split-1')).toBe(true)
    expect(plan.primitives.some((p) => p.id === 'radius-leaf-split-2')).toBe(true)
  })

  it('draws circle scroll bands on installation CAD when circles are on', () => {
    const swingBase = createGateConfig(createGatePreset('double_swing'))
    const swing = {
      ...swingBase,
      options: swingBase.options.map((option) =>
        option.key === 'circles' ? { ...option, enabled: true, quantity: 1 } : option,
      ),
    }
    const swingPlan = buildGateRenderPlan(swing, { viewMode: 'installation' })
    expect(swingPlan.primitives.some((p) => p.id.startsWith('top-circle-band'))).toBe(true)
    expect(swingPlan.primitives.some((p) => p.id.startsWith('bottom-circle-band'))).toBe(true)
    expect(swingPlan.notes.some((n) => n.includes('Circle bands'))).toBe(true)

    const slidingBase = createGateConfig(createGatePreset('tracked_sliding'))
    const sliding = {
      ...slidingBase,
      options: slidingBase.options.map((option) =>
        option.key === 'circles' ? { ...option, enabled: true, quantity: 1 } : option,
      ),
    }
    const slidingPlan = buildGateRenderPlan(sliding, { viewMode: 'installation' })
    expect(slidingPlan.primitives.some((p) => p.id.startsWith('sliding-top-circle-band'))).toBe(true)
    expect(slidingPlan.primitives.some((p) => p.id.startsWith('sliding-bottom-circle-band'))).toBe(true)
    expect(slidingPlan.primitives.some((p) => p.id.startsWith('sliding-bush-'))).toBe(false)
  })

  it('draws picket collars on long pickets, never on dog bars, and thins every_2', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const withCollars = (variant: 'every_1' | 'every_2', dogBars: boolean) => ({
      ...base,
      options: base.options.map((option) => {
        if (option.key === 'picket_collars') {
          return { ...option, enabled: true, quantity: 1, variant }
        }
        if (option.key === 'dog_bars') {
          return { ...option, enabled: dogBars, quantity: dogBars ? 1 : 0 }
        }
        return option
      }),
    })

    const every1 = buildGateRenderPlan(withCollars('every_1', false), { viewMode: 'installation' })
    const every2 = buildGateRenderPlan(withCollars('every_2', false), { viewMode: 'installation' })
    const dog = buildGateRenderPlan(withCollars('every_1', true), { viewMode: 'installation' })

    const count = (plan: ReturnType<typeof buildGateRenderPlan>) =>
      plan.primitives.filter((p) => p.kind === 'circle' && p.id.startsWith('picket-collar-')).length

    expect(count(every1)).toBeGreaterThan(count(every2))
    expect(count(every2)).toBeGreaterThan(0)
    expect(count(dog)).toBeGreaterThan(0)
    expect(dog.primitives.some((p) => p.id.startsWith('picket-collar-') && p.id.includes('dog'))).toBe(
      false,
    )
    expect(every1.notes.some((n) => n.includes('every long picket'))).toBe(true)
    expect(every2.notes.some((n) => n.includes('every 2nd long picket'))).toBe(true)
  })
})
