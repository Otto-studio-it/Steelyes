import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import {
  createGateConfig,
  createGatePreset,
  getExpectedTopRailheadCount,
  resolveRailheadOverlays,
  type GateConfig,
  type GateOptionKey,
} from '../src/index'

function enable(
  config: GateConfig,
  key: GateOptionKey,
  quantity: number,
  variant?: string,
): GateConfig {
  return {
    ...config,
    options: config.options.map((option) =>
      option.key === key
        ? { ...option, enabled: true, quantity, variant: variant ?? option.variant }
        : option,
    ),
  }
}

function publicFile(publicPath: string): string {
  const here = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(here, '../../../apps/web/public', publicPath.replace(/^\//, ''))
}

describe('Phase 2 railhead overlays', () => {
  it('returns no instances when railhead options are off', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = resolveRailheadOverlays(config)
    expect(plan.instances).toEqual([])
    expect(plan.countRuleStatus).toBe('bay_locked_ca14')
  })

  it('places top railheads from preloaded SKU SVG with bay-locked count', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const expected = getExpectedTopRailheadCount(base.widthMm)
    const config = enable(base, 'top_railheads', expected, 'RH7')
    const plan = resolveRailheadOverlays(config)

    expect(plan.instances.length).toBe(expected)
    expect(plan.instances.every((item) => item.row === 'top')).toBe(true)
    expect(plan.instances[0]?.slug).toBe('RH7')
    expect(plan.instances[0]?.publicPath).toBe('/2d-masters/railheads/silhouettes/RH7.svg')
    expect(fs.existsSync(publicFile(plan.instances[0]!.publicPath))).toBe(true)

    const xs = plan.instances.map((item) => item.xRatio)
    expect(xs[0]).toBeGreaterThan(0.1)
    expect(xs[xs.length - 1]).toBeLessThan(0.9)
    expect(xs[0]).toBeLessThan(xs[1]!)
  })

  it('maps dog-bar variant slugs onto the shared overlay SVG', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const config = enable(enable(base, 'dog_bars', 10), 'dog_bar_railheads', 8, 'RH32-dog')
    const plan = resolveRailheadOverlays(config)

    expect(plan.instances.length).toBeGreaterThan(0)
    expect(plan.instances.every((item) => item.row === 'dog')).toBe(true)
    expect(plan.instances[0]?.slug).toBe('RH32')
    expect(plan.instances[0]?.anchorYRatio).toBeGreaterThan(0.5)
  })

  it('defaults to RH32 when option is on without a variant', () => {
    const base = createGateConfig(createGatePreset('single_swing'))
    const config = enable(base, 'top_railheads', 12)
    const plan = resolveRailheadOverlays(config)
    expect(plan.instances[0]?.slug).toBe('RH32')
    expect(plan.notes.some((note) => /default railhead/i.test(note))).toBe(true)
  })
})
