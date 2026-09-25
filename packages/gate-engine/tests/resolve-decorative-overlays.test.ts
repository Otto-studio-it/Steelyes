import { describe, expect, it } from 'vitest'

import {
  createGateConfig,
  createGatePreset,
  resolveCircleOverlays,
  resolveCollarOverlays,
} from '../src/index'

function enable(
  config: ReturnType<typeof createGateConfig>,
  key: 'circles' | 'arched_top' | 'picket_collars' | 'bushes',
  variant?: string,
) {
  return {
    ...config,
    options: config.options.map((option) =>
      option.key === key
        ? { ...option, enabled: true, quantity: 1, variant }
        : option,
    ),
  }
}

describe('decorative overlays', () => {
  const base = createGateConfig(createGatePreset('double_swing'))

  it('circles Q1: always combined upper+lower', () => {
    const plan = resolveCircleOverlays(enable(base, 'circles'))
    expect(plan.bands).toHaveLength(1)
    expect(plan.bands[0]?.id).toBe('combined')
    expect(plan.bands[0]?.publicPath).toContain('bands_combined.svg')
  })

  it('circles follow arched top when arched_top is on', () => {
    const plan = resolveCircleOverlays(enable(enable(base, 'circles'), 'arched_top'))
    expect(plan.bands[0]?.publicPath).toContain('bands_combined_arched.svg')
  })

  it('collar always uses every_1 spacing (every_2 gracefully mapped)', () => {
    expect(resolveCollarOverlays(base).overlays).toHaveLength(0)
    const every1 = resolveCollarOverlays(enable(base, 'picket_collars'))
    expect(every1.overlays[0]?.id).toBe('every_1')
    expect(every1.overlays[0]?.spacing).toBe(1)
    const oldEvery2 = resolveCollarOverlays(enable(base, 'picket_collars', 'every_2'))
    expect(oldEvery2.overlays[0]?.id).toBe('every_1')
    expect(oldEvery2.overlays[0]?.spacing).toBe(1)
  })
})
