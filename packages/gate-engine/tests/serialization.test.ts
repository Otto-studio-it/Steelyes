import { describe, expect, it } from 'vitest'

import {
  GATE_OPTION_KEYS,
  createGateConfig,
  createGatePreset,
  deserializeGateConfig,
  serializeGateConfig,
  stringifyGateConfig,
} from '../src/index'

describe('gate-engine serialization', () => {
  it('serializes a config into a stable versioned object', () => {
    const config = createGateConfig(createGatePreset('tracked_sliding'))
    const serialized = serializeGateConfig(config)

    expect(serialized).toMatchObject({
      version: 1,
      gateType: 'tracked_sliding',
      style: 'traditional_victorian',
      widthMm: 2500,
      heightMm: 1000,
      motorised: true,
      finish: 'black_satin',
      siteSurveyRequested: false,
      fulfilment: 'supply_and_install',
    })
    expect(serialized.options).toHaveLength(GATE_OPTION_KEYS.length)
  })

  it('stringifies and deserializes the config without changing meaning', () => {
    const original = createGateConfig(createGatePreset('double_swing'))
    const json = stringifyGateConfig(original)
    const parsed = deserializeGateConfig(json)

    expect(parsed).toEqual(original)
  })

  it('defaults missing fulfilment on older saved payloads', () => {
    const serialized = serializeGateConfig(createGateConfig(createGatePreset('double_swing')))
    const { fulfilment: _omit, ...legacy } = serialized

    expect(deserializeGateConfig(legacy)).toMatchObject({ fulfilment: 'supply_and_install' })
  })

  it('rejects serialized payloads with duplicated option keys', () => {
    const original = createGateConfig(createGatePreset('double_swing'))
    const serialized = serializeGateConfig(original)
    const invalid = {
      ...serialized,
      options: [...serialized.options, serialized.options[0]],
    }

    expect(() => deserializeGateConfig(invalid as never)).toThrowError('Invalid serialized gate config')
  })
  it('opens designs saved with retired finish codes', () => {
    const current = serializeGateConfig(createGateConfig(createGatePreset('double_swing')))

    const black = deserializeGateConfig({ ...current, finish: 'matte_black' as never })
    expect(black.finish).toBe('black_matt')

    const bronze = deserializeGateConfig({ ...current, finish: 'bronze' as never })
    expect(bronze.finish).toBe('other_ral')
    expect(bronze.customFinishHex).toBe('#8B6914')

    expect(() => deserializeGateConfig({ ...current, finish: 'neon_pink' as never })).toThrow()
  })
})
