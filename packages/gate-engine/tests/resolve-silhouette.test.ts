import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import {
  GATE_TYPES,
  SILHOUETTE_INDEX,
  createGateConfig,
  createGatePreset,
  listSilhouettePublicPaths,
  resolveSilhouette,
  SilhouetteResolveError,
  type GateConfig,
  type GateOptionKey,
  type GateType,
} from '../src/index'

function enable(config: GateConfig, key: GateOptionKey, quantity = 1): GateConfig {
  return {
    ...config,
    options: config.options.map((option) =>
      option.key === key ? { ...option, enabled: true, quantity } : option,
    ),
  }
}

function publicFile(publicPath: string): string {
  const here = path.dirname(fileURLToPath(import.meta.url))
  // packages/gate-engine/tests → apps/web/public
  return path.resolve(here, '../../../apps/web/public', publicPath.replace(/^\//, ''))
}

describe('Phase 0 silhouette resolver', () => {
  it('locks preloaded-master-only policy', () => {
    expect(SILHOUETTE_INDEX.policy.neverInventCad).toBe(true)
    expect(SILHOUETTE_INDEX.policy.technicalSource).toBe('preloaded_master_only')
    expect(SILHOUETTE_INDEX.policy.clientMutable).toEqual(['widthMm', 'heightMm'])
  })

  it('resolves every ready gate type to an existing public SVG', () => {
    for (const gateType of GATE_TYPES) {
      const config = createGateConfig(createGatePreset(gateType as GateType))
      const resolved = resolveSilhouette(config)
      expect(resolved.publicPath).toMatch(new RegExp(`^/2d-masters/${gateType}/silhouettes/`))
      expect(fs.existsSync(publicFile(resolved.publicPath))).toBe(true)
    }
  })

  it('maps style/options via manifest lookup (first match wins)', () => {
    const base = createGateConfig(createGatePreset('double_swing'))

    expect(resolveSilhouette(base).slug).toBe('base')

    const composite = { ...base, style: 'composite_boards' as const }
    expect(resolveSilhouette(composite).slug).toBe('composite')

    const arched = enable(base, 'arched_top')
    expect(resolveSilhouette(arched).slug).toBe('arched')

    const dog = enable(base, 'dog_bars', 10)
    expect(resolveSilhouette(dog).slug).toBe('dog_bars')

    const both = enable(enable(base, 'arched_top'), 'dog_bars', 10)
    expect(resolveSilhouette(both).slug).toBe('arched_dog_bars')
  })

  it('does not change master when only client mm change', () => {
    const a = createGateConfig(createGatePreset('tracked_sliding'))
    const b = { ...a, widthMm: 4200, heightMm: 1400 }
    expect(resolveSilhouette(a).publicPath).toBe(resolveSilhouette(b).publicPath)
    expect(resolveSilhouette(a).clientMutable).toEqual(['widthMm', 'heightMm'])
  })

  it('indexes every listed public path to a real file', () => {
    const paths = listSilhouettePublicPaths()
    expect(paths.length).toBe(40) // 8 types × 5 silhouettes
    for (const publicPath of paths) {
      expect(fs.existsSync(publicFile(publicPath)), publicPath).toBe(true)
    }
  })

  it('fails closed for unknown gate types (never invent CAD)', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    expect(() =>
      resolveSilhouette({ ...config, gateType: 'not_a_gate' as GateType }),
    ).toThrow(SilhouetteResolveError)
  })
})
