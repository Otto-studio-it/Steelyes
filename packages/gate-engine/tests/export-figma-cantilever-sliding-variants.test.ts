import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  buildGateRenderPlan,
  createGateConfig,
  createGatePreset,
  getCantileverSiteSpace,
  serializeGateRenderPlanToSvg,
  type GateConfig,
  type GateOptionKey,
} from '../src/index'
import { mastersOutputRoot, REPO_MASTERS_ROOT } from './helpers/masters-output'

/**
 * Cantilever sliding — 5 silhouettes.
 *
 * CRITICAL (CA-05): customer widthMm = clear opening between posts ONLY.
 * Counterbalance tail = round(opening / 3) MINIMUM, drawn schematically left of leaf.
 * Never treat the full drawing width as the typed opening.
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

function stripForFigma(plan: ReturnType<typeof buildGateRenderPlan>, config: GateConfig) {
  const space = getCantileverSiteSpace(config.widthMm)
  return {
    ...plan,
    primitives: plan.primitives.filter(
      (p) => !p.id.startsWith('cad-dim-') && !p.id.includes('dimension'),
    ),
    labels: [],
    notes: [
      'Figma CAD silhouette — no baked millimetres on the drawing.',
      `CA-05: typed width = clear opening only. Seed example: opening ${space.clearOpeningMm} mm → min tail ${space.tailMm} mm → min parking run ${space.totalRunMm} mm.`,
      'Leaf fills 100% of the clear opening between posts. Triangular counterbalance sits AFTER the parking/guide post — never inside the opening.',
    ],
  }
}

describe('export Figma cantilever_sliding variant SVGs', () => {
  it('writes the 5 silhouette masters into docs/frontend/2d-masters/cantilever_sliding/silhouettes', () => {
    const packDir = path.join(REPO_MASTERS_ROOT, 'cantilever_sliding')
    const outPackDir = path.join(mastersOutputRoot(), 'cantilever_sliding')
    const outDir = path.join(outPackDir, 'silhouettes')
    fs.mkdirSync(outDir, { recursive: true })

    const written: string[] = []

    for (const variant of VARIANTS) {
      // Seed 4000 mm so SVG <desc> carries the client worked example proportions (CA-05).
      const config = variant.apply(createGateConfig(createGatePreset('cantilever_sliding')))
      config.widthMm = 4000
      config.heightMm = 1000

      const plan = stripForFigma(buildGateRenderPlan(config, { viewMode: 'technical' }), config)
      const file = path.join(outDir, `${variant.slug}.svg`)
      const svg = serializeGateRenderPlanToSvg(plan)
      fs.writeFileSync(file, svg)
      written.push(file)
      expect(svg.length).toBeGreaterThan(5_000)
      expect(svg).toContain('clear opening')
      expect(svg).toContain('1333')
    }

    fs.copyFileSync(path.join(outDir, 'composite.svg'), path.join(outPackDir, 'figma-base.svg'))

    expect(written).toHaveLength(5)
    expect(fs.existsSync(path.join(packDir, 'manifest.json'))).toBe(true)
  })
})
