import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import {
  buildGateRenderPlan,
  createGateConfig,
  createGatePreset,
  serializeGateRenderPlanToSvg,
  type GateType,
} from '../src/index'

const TYPES: GateType[] = [
  'double_swing',
  'single_swing',
  'tracked_sliding',
  'cantilever_sliding',
  'bifolding_double_swing',
  'single_bifolding',
  'telescopic_sliding',
  'radius_sliding',
]

describe('export Figma CAD base SVGs', () => {
  it('writes dimension-stripped technical SVGs into docs/frontend/2d-masters', () => {
    const here = path.dirname(fileURLToPath(import.meta.url))
    const outRoot = path.resolve(here, '../../../docs/frontend/2d-masters')

    for (const gateType of TYPES) {
      const config = createGateConfig(createGatePreset(gateType))
      if (gateType === 'tracked_sliding' || gateType === 'cantilever_sliding') {
        config.style = 'composite_boards'
      }
      if (gateType === 'telescopic_sliding') {
        config.widthMm = 4000
      }
      if (gateType === 'radius_sliding') {
        config.widthMm = 2600
      }

      const plan = buildGateRenderPlan(config, { viewMode: 'technical' })
      const cleaned = {
        ...plan,
        primitives: plan.primitives.filter(
          (p) => !p.id.startsWith('cad-dim-') && !p.id.includes('dimension'),
        ),
        labels: plan.labels.filter((l) => !l.id.startsWith('cad-dim-') && l.id !== 'label-subtitle'),
        notes: ['Figma-importable CAD base — no sample dimensions.'],
      }

      const dir = path.join(outRoot, gateType)
      const silhouettesDir = path.join(dir, 'silhouettes')
      fs.mkdirSync(silhouettesDir, { recursive: true })
      const svg = serializeGateRenderPlanToSvg(cleaned)
      fs.writeFileSync(path.join(dir, 'figma-base.svg'), svg)
      // Swing silhouette packs own silhouettes/* (variant export tests)
      if (
        gateType !== 'double_swing' &&
        gateType !== 'single_swing' &&
        gateType !== 'tracked_sliding' &&
        gateType !== 'cantilever_sliding' &&
        gateType !== 'bifolding_double_swing' &&
        gateType !== 'single_bifolding' &&
        gateType !== 'telescopic_sliding' &&
        gateType !== 'radius_sliding'
      ) {
        fs.writeFileSync(path.join(silhouettesDir, 'base.svg'), svg)
      }
    }

    expect(fs.existsSync(path.join(outRoot, 'tracked_sliding', 'silhouettes', 'base.svg'))).toBe(true)
  })
})
