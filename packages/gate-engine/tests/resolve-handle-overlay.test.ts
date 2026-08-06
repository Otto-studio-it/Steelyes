import { describe, expect, it } from 'vitest'

import {
  createGateConfig,
  createGatePreset,
  resolveHandleOverlay,
} from '../src/index'

describe('Design handle overlay (official masters lock)', () => {
  it('never invents a UI handle — manual masters bake it when named manual/manuale', () => {
    for (const gateType of [
      'double_swing',
      'single_swing',
      'tracked_sliding',
      'bifolding_double_swing',
    ] as const) {
      const manual = {
        ...createGateConfig(createGatePreset(gateType)),
        motorised: false,
      }
      const motorised = { ...manual, motorised: true }
      expect(resolveHandleOverlay(manual).instances).toEqual([])
      expect(resolveHandleOverlay(motorised).instances).toEqual([])
    }
  })

  it('documents the baked-handle policy', () => {
    const plan = resolveHandleOverlay(createGateConfig(createGatePreset('double_swing')))
    expect(plan.notes.some((note) => /baked|manual/i.test(note))).toBe(true)
  })
})
