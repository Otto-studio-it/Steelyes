import { describe, expect, it } from 'vitest'

import {
  createGateConfig,
  createGatePreset,
  DEFAULT_CONFIG_VERSION,
  DEFAULT_FINISH,
  DEFAULT_GATE_PRESETS,
  GATE_OPTION_KEYS,
  GATE_STYLES,
  GATE_TYPES,
} from '../src/index'

describe('gate-engine', () => {
  it('exports the expected gate type set', () => {
    expect(GATE_TYPES).toEqual([
      'double_swing',
      'single_swing',
      'tracked_sliding',
      'cantilever_sliding',
      'bifolding_double_swing',
      'single_bifolding',
      'telescopic_sliding',
      'radius_sliding',
    ])
  })

  it('exports the expected style set', () => {
    expect(GATE_STYLES).toEqual(['traditional_victorian', 'composite_boards'])
  })

  it('exports the expected option keys', () => {
    expect(GATE_OPTION_KEYS).toEqual([
      'middle_bar',
      'top_railheads',
      'dog_bars',
      'dog_bar_railheads',
      'arched_top',
      'bushes',
      'spirals',
    ])
  })

  it('creates stable default presets and configs', () => {
    const preset = createGatePreset('double_swing')
    const config = createGateConfig(preset)

    expect(config.version).toBe(DEFAULT_CONFIG_VERSION)
    expect(config.gateType).toBe('double_swing')
    expect(config.style).toBe('traditional_victorian')
    expect(config.finish).toBe(DEFAULT_FINISH)
    expect(config.options).toHaveLength(DEFAULT_GATE_PRESETS.double_swing.options.length)
    expect(config.fencePanels.quantity).toBe(0)
  })
})
