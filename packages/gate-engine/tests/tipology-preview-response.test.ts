import { describe, expect, it } from 'vitest'

import {
  applyVictorianTipology,
  createGateConfig,
  createGatePreset,
  describeDesignPreview,
  getVictorianTipology,
  resolveCollarOverlays,
  resolveSilhouette,
} from '../src/index'

describe('victorian tipology', () => {
  it('reads base / arched / dog_bars / arched_dog_bars from options', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    expect(getVictorianTipology(base)).toBe('base')

    const arched = applyVictorianTipology(base, 'arched')
    expect(getVictorianTipology(arched)).toBe('arched')
    expect(resolveSilhouette(arched).slug).toBe('arched')

    const dog = applyVictorianTipology(base, 'dog_bars')
    expect(getVictorianTipology(dog)).toBe('dog_bars')
    expect(resolveSilhouette(dog).slug).toBe('dog_bars')

    const both = applyVictorianTipology(base, 'arched_dog_bars')
    expect(getVictorianTipology(both)).toBe('arched_dog_bars')
    expect(resolveSilhouette(both).slug).toBe('arched_dog_bars')
  })

  it('keeps decoration when switching tipology', () => {
    const base = createGateConfig(createGatePreset('single_swing'))
    const decorated = {
      ...base,
      options: base.options.map((option) =>
        option.key === 'circles' ? { ...option, enabled: true, quantity: 1 } : option,
      ),
    }

    const next = applyVictorianTipology(decorated, 'arched')
    expect(next.style).toBe('traditional_victorian')
    expect(next.options.find((option) => option.key === 'circles')?.enabled).toBe(true)
    expect(resolveSilhouette(next).slug).toBe('arched_circles')
  })

  it('does not wipe width, finish, or motor when changing shape', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      widthMm: 2400,
      heightMm: 1200,
      motorised: true,
      finish: 'anthracite_ral7016' as const,
    }

    const next = applyVictorianTipology(config, 'dog_bars')
    expect(next.widthMm).toBe(2400)
    expect(next.heightMm).toBe(1200)
    expect(next.motorised).toBe(true)
    expect(next.finish).toBe('anthracite_ral7016')
    expect(resolveSilhouette(next).slug).toBe('dog_bars_motorised')
  })
})

describe('describeDesignPreview', () => {
  it('gracefully maps old every_2 collar configs to every_1', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const decorated = {
      ...config,
      options: config.options.map((option) =>
        option.key === 'picket_collars'
          ? { ...option, enabled: true, quantity: 1, variant: 'every_2' }
          : option,
      ),
    }

    const described = describeDesignPreview(decorated)
    expect(described.ok).toBe(true)
    const overlays = resolveCollarOverlays(decorated)
    expect(overlays.overlays[0]?.id).toBe('every_1')
  })

  it('marks finish as swatch-only and dimensions as strip-only', () => {
    const described = describeDesignPreview(createGateConfig(createGatePreset('double_swing')))
    expect(described.channels.find((item) => item.key === 'finish')?.visual).toBe('swatch_only')
    expect(described.channels.find((item) => item.key === 'dimensions')?.visual).toBe('strip_only')
    expect(described.channels.find((item) => item.key === 'middle_bar')?.visual).toBe(
      'priced_not_drawn',
    )
    expect(described.channels.find((item) => item.key === 'top_railheads')?.visual).toBe('quote_only')
  })

  it('bakes telescopic circles instead of overlay fallback', () => {
    const config = createGateConfig(createGatePreset('telescopic_sliding'))
    const decorated = {
      ...config,
      options: config.options.map((option) =>
        option.key === 'circles' ? { ...option, enabled: true, quantity: 1 } : option,
      ),
    }

    const described = describeDesignPreview(decorated)
    expect(described.overlayFallback).toBe(false)
    expect(described.resolution?.slug).toBe('base_circles')
    expect(described.channels.find((item) => item.key === 'circles')?.visual).toBe('drawn_on_master')
  })

  it('marks sliding motorised as the same drawing', () => {
    const config = createGateConfig(createGatePreset('cantilever_sliding'))
    expect(config.motorised).toBe(true)
    const described = describeDesignPreview(config)
    expect(described.motorSplit).toBe(false)
    expect(described.channels.find((item) => item.key === 'motorised')?.visual).toBe('same_drawing')
  })
})
