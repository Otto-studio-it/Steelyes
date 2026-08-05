import { describe, expect, it } from 'vitest'

import {
  createGateConfig,
  createGatePreset,
  resolveMotorOverlay,
  SILHOUETTE_INDEX,
  resolveSilhouette,
  type SilhouetteIndex,
  type SilhouetteLookupRule,
} from '../src/index'

describe('motor kit overlay (manual vs motorised)', () => {
  it('omits the motor kit when the gate is manual', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      motorised: false,
    }
    const plan = resolveMotorOverlay(config)
    expect(plan.instances).toEqual([])
    expect(plan.notes.some((note) => /manual/i.test(note))).toBe(true)
  })

  it('places a post-operator marker when double swing is motorised', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      motorised: true,
    }
    const plan = resolveMotorOverlay(config)
    expect(plan.instances).toHaveLength(1)
    expect(plan.instances[0]?.id).toBe('motor-kit')
    expect(plan.instances[0]?.kind).toBe('post_operator')
    expect(plan.instances[0]?.xRatio).toBeCloseTo(96 / 1200, 5)
  })

  it('places a track-operator marker when sliding is motorised', () => {
    const config = {
      ...createGateConfig(createGatePreset('tracked_sliding')),
      motorised: true,
    }
    const plan = resolveMotorOverlay(config)
    expect(plan.instances[0]?.kind).toBe('track_operator')
    expect(plan.instances[0]?.xRatio).toBeCloseTo(180 / 1200, 5)
  })

  it('skips the procedural marker when the Design master already includes the motor', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      motorised: true,
    }
    const plan = resolveMotorOverlay(config, { masterIncludesMotor: true })
    expect(plan.instances).toEqual([])
    expect(plan.notes.some((note) => /design master/i.test(note))).toBe(true)
  })
})

describe('silhouette lookup motorised filter', () => {
  it('selects a motorised-specific slug when a matching rule exists', () => {
    const index: SilhouetteIndex = structuredClone(SILHOUETTE_INDEX)
    const pack = index.packs.double_swing
    if (!pack) throw new Error('expected double_swing pack')

    const motorisedRule: SilhouetteLookupRule = {
      when: { motorised: true },
      slug: 'base_motorised',
    }
    pack.rules = [motorisedRule, ...pack.rules]
    pack.silhouettes.base_motorised = {
      slug: 'base_motorised',
      title: 'Base Victorian (motorised)',
      publicPath: '/2d-masters/double_swing/silhouettes/base_motorised.svg',
      style: 'traditional_victorian',
      options: [],
      includesMotorKit: true,
    }

    const motorised = resolveSilhouette(
      { ...createGateConfig(createGatePreset('double_swing')), motorised: true },
      index,
    )
    expect(motorised.slug).toBe('base_motorised')
    expect(motorised.masterIncludesMotor).toBe(true)

    const manual = resolveSilhouette(
      { ...createGateConfig(createGatePreset('double_swing')), motorised: false },
      index,
    )
    expect(manual.slug).toBe('base')
    expect(manual.masterIncludesMotor).toBe(false)
  })

  it('keeps procedural motor marker when motorised master has no includesMotorKit', () => {
    const resolved = resolveSilhouette({
      ...createGateConfig(createGatePreset('double_swing')),
      motorised: true,
    })
    expect(resolved.slug).toBe('base_motorised')
    expect(resolved.masterIncludesMotor).toBe(false)
  })
})
