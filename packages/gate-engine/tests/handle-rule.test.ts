import { describe, expect, it } from 'vitest'

import {
  buildGateCutList,
  buildGateRenderPlan,
  createGateConfig,
  createGatePreset,
} from '../src/index'

describe('handle rule (CA-01)', () => {
  it('draws a manual handle when the swing gate is not motorised', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      motorised: false,
    }
    const plan = buildGateRenderPlan(config)
    expect(plan.primitives.some((p) => p.id === 'manual-handle-grip')).toBe(true)
    expect(plan.primitives.some((p) => p.id === 'manual-handle-plate')).toBe(true)
  })

  it('omits the handle when motorised', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      motorised: true,
    }
    const plan = buildGateRenderPlan(config)
    expect(plan.primitives.some((p) => p.id.startsWith('manual-handle'))).toBe(false)
  })

  it('includes handle hardware in the cut list only for manual swing', () => {
    const manual = buildGateCutList({
      ...createGateConfig(createGatePreset('single_swing')),
      motorised: false,
    })
    const motorised = buildGateCutList({
      ...createGateConfig(createGatePreset('single_swing')),
      motorised: true,
    })

    expect(manual.lines.some((line) => line.id === 'manual-handle')).toBe(true)
    expect(motorised.lines.some((line) => line.id === 'manual-handle')).toBe(false)
    expect(motorised.notes.some((note) => note.includes('no leaf handle'))).toBe(true)
  })
})
