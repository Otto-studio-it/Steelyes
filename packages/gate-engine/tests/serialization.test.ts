import { describe, expect, it } from 'vitest'

import {
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
      finish: 'matte_black',
    })
    expect(serialized.options).toHaveLength(7)
  })

  it('stringifies and deserializes the config without changing meaning', () => {
    const original = createGateConfig(createGatePreset('double_swing'))
    const json = stringifyGateConfig(original)
    const parsed = deserializeGateConfig(json)

    expect(parsed).toEqual(original)
  })
})
