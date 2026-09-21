import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  buildGateRenderPlan,
  createGateConfig,
  createGatePreset,
  serializeGateRenderPlanToSvg,
  type GateConfig,
  type GateOptionKey,
} from '../src/index'
import { mastersOutputRoot, REPO_MASTERS_ROOT } from './helpers/masters-output'

/**
 * Tracked sliding silhouettes — same option families as swing,
 * plus sliding topology (ground track, runback, guide post).
 * Composite default language = 3-bay horizontal boards.
 */
const VARIANTS = [
  {
    slug: 'base',
    title: 'Base Victorian',
    apply: (config: GateConfig) => {
      config.style = 'traditional_victorian'
      return config
    },
  },
  {
    slug: 'arched',
    title: 'Arched top',
    apply: (config: GateConfig) => {
      config.style = 'traditional_victorian'
      return enable(config, 'arched_top')
    },
  },
  {
    slug: 'dog_bars',
    title: 'Dog bars',
    apply: (config: GateConfig) => {
      config.style = 'traditional_victorian'
      return enable(config, 'dog_bars', 16)
    },
  },
  {
    slug: 'arched_dog_bars',
    title: 'Arched + dog bars',
    apply: (config: GateConfig) => {
      config.style = 'traditional_victorian'
      return enable(enable(config, 'arched_top'), 'dog_bars', 16)
    },
  },
  {
    slug: 'composite',
    title: 'Composite 3-bay',
    apply: (config: GateConfig) => {
      config.style = 'composite_boards'
      return config
    },
  },
] as const

function enable(config: GateConfig, key: GateOptionKey, quantity = 1): GateConfig {
  config.options = config.options.map((option) =>
    option.key === key ? { ...option, enabled: true, quantity } : option,
  )
  return config
}

function stripForFigma(plan: ReturnType<typeof buildGateRenderPlan>) {
  return {
    ...plan,
    primitives: plan.primitives.filter(
      (p) => !p.id.startsWith('cad-dim-') && !p.id.includes('dimension'),
    ),
    labels: [],
    notes: [
      'Figma CAD silhouette — no baked millimetres on the drawing.',
      'Tracked closed elevation: leaf fills 100% of clear opening between posts (no fake gap).',
      'Ground track under the opening; runback / motor pad drawn OUTSIDE beyond the parking post.',
    ],
  }
}

describe('export Figma tracked_sliding variant SVGs', () => {
  it('writes the 5 silhouette masters into docs/frontend/2d-masters/tracked_sliding/silhouettes', () => {
    const packDir = path.join(REPO_MASTERS_ROOT, 'tracked_sliding')
    const outPackDir = path.join(mastersOutputRoot(), 'tracked_sliding')
    const outDir = path.join(outPackDir, 'silhouettes')
    fs.mkdirSync(outDir, { recursive: true })

    const written: string[] = []

    for (const variant of VARIANTS) {
      const config = variant.apply(createGateConfig(createGatePreset('tracked_sliding')))
      const plan = stripForFigma(buildGateRenderPlan(config, { viewMode: 'technical' }))
      const file = path.join(outDir, `${variant.slug}.svg`)
      const svg = serializeGateRenderPlanToSvg(plan)
      fs.writeFileSync(file, svg)
      written.push(file)
      expect(svg.length).toBeGreaterThan(5_000)
      expect(svg).toContain('tracked-leaf')
      expect(svg).toContain('tracked-runback-zone')
      expect(svg).toContain('tracked-ground-rail')
    }

    // Commercial tracked default visual often composite — keep figma-base as composite
    fs.copyFileSync(path.join(outDir, 'composite.svg'), path.join(outPackDir, 'figma-base.svg'))

    expect(written).toHaveLength(5)
    expect(fs.existsSync(path.join(packDir, 'manifest.json'))).toBe(true)
  })
})
