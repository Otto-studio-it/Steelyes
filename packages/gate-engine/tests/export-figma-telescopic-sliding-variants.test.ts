import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import {
  buildGateRenderPlan,
  createGateConfig,
  createGatePreset,
  serializeGateRenderPlanToSvg,
  type GateConfig,
  type GateOptionKey,
} from '../src/index'

/**
 * Telescopic sliding — photo lock from `foto /telescopic slidings gates`:
 * LOCKED = 3 overlapping panels (CA-11); N parallel tracks; depth stagger + plan cue;
 * stack ~1/n outside parking post. 2-leaf Combiarialdo = VARIANT — not these masters.
 */
const VARIANTS = [
  {
    slug: 'base',
    title: 'Base Victorian',
    apply: (config: GateConfig) => {
      config.style = 'traditional_victorian'
      config.widthMm = 4000
      return config
    },
  },
  {
    slug: 'arched',
    title: 'Arched top',
    apply: (config: GateConfig) => {
      config.style = 'traditional_victorian'
      config.widthMm = 4000
      return enable(config, 'arched_top')
    },
  },
  {
    slug: 'dog_bars',
    title: 'Dog bars',
    apply: (config: GateConfig) => {
      config.style = 'traditional_victorian'
      config.widthMm = 4000
      return enable(config, 'dog_bars', 10)
    },
  },
  {
    slug: 'arched_dog_bars',
    title: 'Arched + dog bars',
    apply: (config: GateConfig) => {
      config.style = 'traditional_victorian'
      config.widthMm = 4000
      return enable(enable(config, 'arched_top'), 'dog_bars', 10)
    },
  },
  {
    slug: 'composite',
    title: 'Composite boards',
    apply: (config: GateConfig) => {
      config.style = 'composite_boards'
      config.widthMm = 4000
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
      'Telescopic LOCKED = 3 overlapping panels (CA-11). N parallel tracks; front = motor-side leaf.',
      'Depth stagger + plan cue show stacked planes; stack zone outside parking post.',
    ],
  }
}

describe('export Figma telescopic_sliding variant SVGs', () => {
  it('writes the 5 silhouette masters into docs/frontend/2d-masters/telescopic_sliding/silhouettes', () => {
    const here = path.dirname(fileURLToPath(import.meta.url))
    const packDir = path.resolve(here, '../../../docs/frontend/2d-masters/telescopic_sliding')
    const outDir = path.join(packDir, 'silhouettes')
    fs.mkdirSync(outDir, { recursive: true })

    const written: string[] = []

    for (const variant of VARIANTS) {
      const config = variant.apply(createGateConfig(createGatePreset('telescopic_sliding')))
      const plan = stripForFigma(buildGateRenderPlan(config, { viewMode: 'technical' }))
      const file = path.join(outDir, `${variant.slug}.svg`)
      const svg = serializeGateRenderPlanToSvg(plan)
      fs.writeFileSync(file, svg)
      written.push(file)
      expect(svg.length).toBeGreaterThan(5_000)
      expect(svg).toContain('telescopic-segment-0')
      expect(svg).toContain('telescopic-segment-1')
      expect(svg).toContain('telescopic-segment-2')
      expect(svg).toContain('telescopic-track-0')
      expect(svg).toContain('telescopic-track-2')
      expect(svg).toContain('telescopic-plan-leaf-0')
      expect(svg).toContain('telescopic-plan-leaf-2')
      expect(svg).toContain('telescopic-stack-zone')
      expect(svg).toContain('telescopic-motor-side-marker')
      expect(svg).not.toContain('telescopic-segment-3')
    }

    fs.copyFileSync(path.join(outDir, 'base.svg'), path.join(packDir, 'figma-base.svg'))

    expect(written).toHaveLength(5)
    expect(fs.existsSync(path.join(packDir, 'manifest.json'))).toBe(true)
  })
})
