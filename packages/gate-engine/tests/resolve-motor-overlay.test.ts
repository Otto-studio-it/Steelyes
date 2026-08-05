import { describe, expect, it } from 'vitest'

import {
  createGateConfig,
  createGatePreset,
  resolveMotorOverlay,
} from '../src/index'

describe('motor kit overlay (manual vs motorised)', () => {
  it('never draws a motor kit on Design (product lock)', () => {
    const manual = {
      ...createGateConfig(createGatePreset('double_swing')),
      motorised: false,
    }
    const motorised = {
      ...createGateConfig(createGatePreset('tracked_sliding')),
      motorised: true,
    }

    expect(resolveMotorOverlay(manual).instances).toEqual([])
    expect(resolveMotorOverlay(motorised).instances).toEqual([])
    expect(resolveMotorOverlay(motorised, { masterIncludesMotor: true }).instances).toEqual([])
  })
})
