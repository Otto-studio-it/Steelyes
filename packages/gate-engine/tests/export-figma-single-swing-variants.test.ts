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

/** Single-swing silhouette catalog — same 5 families as double_swing, one leaf. */
const VARIANTS = [
  {
    slug: 'base',
    title: 'Base Victorian',
    apply: (config: GateConfig) => config,
  },
  {
    slug: 'arched',
    title: 'Arched top',
    apply: (config: GateConfig) => enable(config, 'arched_top'),
  },
  {
    slug: 'dog_bars',
    title: 'Dog bars',
    apply: (config: GateConfig) => enable(config, 'dog_bars', 10),
  },
  {
    slug: 'arched_dog_bars',
    title: 'Arched + dog bars',
    apply: (config: GateConfig) => enable(enable(config, 'arched_top'), 'dog_bars', 10),
  },
  {
    slug: 'composite',
    title: 'Composite boards',
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
    notes: ['Figma CAD silhouette — dimensions live in UI strip below, not on drawing.'],
  }
}

describe('export Figma single_swing variant SVGs', () => {
  it('writes the 5 silhouette masters into docs/frontend/2d-masters/single_swing/silhouettes', () => {
    const packDir = path.join(REPO_MASTERS_ROOT, 'single_swing')
    const outPackDir = path.join(mastersOutputRoot(), 'single_swing')
    const outDir = path.join(outPackDir, 'silhouettes')
    fs.mkdirSync(outDir, { recursive: true })

    const written: string[] = []

    for (const variant of VARIANTS) {
      const config = variant.apply(createGateConfig(createGatePreset('single_swing')))
      const plan = stripForFigma(buildGateRenderPlan(config, { viewMode: 'technical' }))
      const file = path.join(outDir, `${variant.slug}.svg`)
      const svg = serializeGateRenderPlanToSvg(plan)
      fs.writeFileSync(file, svg)
      written.push(file)
      expect(svg.length).toBeGreaterThan(5_000)
    }

    fs.copyFileSync(path.join(outDir, 'base.svg'), path.join(outPackDir, 'figma-base.svg'))

    expect(written).toHaveLength(5)
    expect(fs.existsSync(path.join(packDir, 'manifest.json'))).toBe(true)
  })
})
