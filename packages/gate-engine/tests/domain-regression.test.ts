import { describe, expect, it } from 'vitest'

import {
  DEFAULT_GATE_PRESETS,
  GATE_TYPES,
  createGateConfig,
  createGatePreset,
  deserializeGateConfig,
  normalizeGateConfig,
  serializeGateConfig,
  stringifyGateConfig,
  validateGateConfig,
} from '../src/index'

describe('gate-engine domain regression', () => {
  it('keeps every supported gate type backed by a stable preset and valid config', () => {
    for (const gateType of GATE_TYPES) {
      const preset = createGatePreset(gateType)
      const config = createGateConfig(preset)
      const validation = validateGateConfig(config)

      expect(config.gateType).toBe(gateType)
      expect(preset.gateType).toBe(gateType)
      expect(validation.ok).toBe(true)
      expect(serializeGateConfig(config)).toMatchObject({
        version: 1,
        gateType,
        style: 'traditional_victorian',
        siteSurveyRequested: false,
      })
      expect(deserializeGateConfig(stringifyGateConfig(config))).toEqual(config)
    }
  })

  it('normalizes partial drafts onto a safe versioned config', () => {
    const normalized = normalizeGateConfig({
      gateType: 'radius_sliding',
      widthMm: 500,
      heightMm: 450,
      motorised: false,
      options: [],
      fencePanels: {
        quantity: -2,
        panels: [],
      },
    })

    expect(normalized.version).toBe(1)
    expect(normalized.gateType).toBe('radius_sliding')
    expect(normalized.widthMm).toBe(1600)
    expect(normalized.heightMm).toBe(800)
    expect(normalized.options).toHaveLength(8)
    expect(normalized.fencePanels.quantity).toBe(0)
    expect(normalized.fencePanels.panels).toHaveLength(0)
  })

  it('rejects invalid serialized payloads with readable issues', () => {
    expect(() =>
      deserializeGateConfig({
        version: 2,
        gateType: 'double_swing',
        style: 'traditional_victorian',
        widthMm: 1800,
        heightMm: 1000,
        motorised: false,
        finish: 'black_satin',
        options: [],
        fencePanels: { quantity: 1, panels: [] },
      } as any),
    ).toThrowError('Invalid serialized gate config')
  })

  it('keeps default preset objects isolated from accidental mutation', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    config.options[0].enabled = true
    config.options[0].quantity = 3

    expect(DEFAULT_GATE_PRESETS.double_swing.options[0].enabled).toBe(false)
    expect(DEFAULT_GATE_PRESETS.double_swing.options[0].quantity).toBe(0)
  })
})
