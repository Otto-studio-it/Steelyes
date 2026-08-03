import { describe, expect, it } from 'vitest'

import {
  createGateConfig,
  createGatePreset,
  resolveHandleOverlay,
} from '../src/index'

describe('Phase 3.1 handle overlay (CA-01)', () => {
  it('places a handle when the gate is manual', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      motorised: false,
    }
    const plan = resolveHandleOverlay(config)
    expect(plan.instances).toHaveLength(1)
    expect(plan.instances[0]?.id).toBe('manual-handle')
    expect(plan.instances[0]?.xRatio).toBeCloseTo(572 / 1200, 5)
    expect(plan.instances[0]?.yRatio).toBeCloseTo(410 / 860, 5)
  })

  it('omits the handle when motorised', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      motorised: true,
    }
    const plan = resolveHandleOverlay(config)
    expect(plan.instances).toEqual([])
    expect(plan.notes.some((note) => /motorised/i.test(note))).toBe(true)
  })

  it('uses the trailing-edge anchor for single swing', () => {
    const config = {
      ...createGateConfig(createGatePreset('single_swing')),
      motorised: false,
    }
    const plan = resolveHandleOverlay(config)
    expect(plan.instances[0]?.xRatio).toBeCloseTo(1044 / 1200, 5)
  })

  it('places a handle on manual sliding types', () => {
    const config = {
      ...createGateConfig(createGatePreset('tracked_sliding')),
      motorised: false,
    }
    const plan = resolveHandleOverlay(config)
    expect(plan.instances).toHaveLength(1)
    expect(plan.instances[0]?.xRatio).toBeCloseTo(980 / 1200, 5)
  })
})
