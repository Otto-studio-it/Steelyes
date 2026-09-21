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
 * Radius sliding — photo lock from `foto /radius slidings gates`:
 * Articulated multi-panel train on a single curved track (~90° park).
 * When arched: every panel crest is curved. Not telescopic overlap.
 */
const VARIANTS = [
  {
    slug: 'base',
    title: 'Base Victorian',
    apply: (config: GateConfig) => {
      config.style = 'traditional_victorian'
      config.widthMm = 2600
      return config
    },
  },
  {
    slug: 'arched',
    title: 'Arched top',
    apply: (config: GateConfig) => {
      config.style = 'traditional_victorian'
      config.widthMm = 2600
      return enable(config, 'arched_top')
    },
  },
  {
    slug: 'dog_bars',
    title: 'Dog bars',
    apply: (config: GateConfig) => {
      config.style = 'traditional_victorian'
      config.widthMm = 2600
      return enable(config, 'dog_bars', 10)
    },
  },
  {
    slug: 'arched_dog_bars',
    title: 'Arched + dog bars',
    apply: (config: GateConfig) => {
      config.style = 'traditional_victorian'
      config.widthMm = 2600
      return enable(enable(config, 'arched_top'), 'dog_bars', 10)
    },
  },
  {
    slug: 'composite',
    title: 'Composite boards',
    apply: (config: GateConfig) => {
      config.style = 'composite_boards'
      config.widthMm = 2600
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
      'Radius: articulated panel train on curved track (~90° park). Not telescopic.',
      'arched_top curves every panel crest. Live mm stay in the UI strip below.',
    ],
  }
}

describe('export Figma radius_sliding variant SVGs', () => {
  it('writes the 5 silhouette masters into docs/frontend/2d-masters/radius_sliding/silhouettes', () => {
    const packDir = path.join(REPO_MASTERS_ROOT, 'radius_sliding')
    const outPackDir = path.join(mastersOutputRoot(), 'radius_sliding')
    const outDir = path.join(outPackDir, 'silhouettes')
    fs.mkdirSync(outDir, { recursive: true })

    const written: string[] = []

    for (const variant of VARIANTS) {
      const config = variant.apply(createGateConfig(createGatePreset('radius_sliding')))
      const plan = stripForFigma(buildGateRenderPlan(config, { viewMode: 'technical' }))
      const file = path.join(outDir, `${variant.slug}.svg`)
      const svg = serializeGateRenderPlanToSvg(plan)
      fs.writeFileSync(file, svg)
      written.push(file)
      expect(svg.length).toBeGreaterThan(5_000)
      expect(svg).toContain('radius-leaf-0')
      expect(svg).toContain('radius-leaf-4')
      expect(svg).toContain('track-line')
      expect(svg).toContain('radius-path-cue')
      expect(svg).toContain('radius-hinge-1')
      expect(svg).toContain('radius-guide-post')
      expect(svg).not.toContain('telescopic-segment-')
    }

    const arched = fs.readFileSync(path.join(outDir, 'arched.svg'), 'utf8')
    expect(arched).toContain('radius-leaf-0-arch')
    expect(arched).toContain('radius-leaf-1-arch')
    expect(arched).toContain('radius-leaf-4-arch')

    fs.copyFileSync(path.join(outDir, 'base.svg'), path.join(outPackDir, 'figma-base.svg'))

    expect(written).toHaveLength(5)
    expect(fs.existsSync(path.join(packDir, 'manifest.json'))).toBe(true)
  })
})
