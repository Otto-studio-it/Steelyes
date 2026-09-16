import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import {
  GATE_TYPES,
  SILHOUETTE_INDEX,
  createGateConfig,
  createGatePreset,
  resolveCircleOverlays,
  resolveCollarOverlays,
  resolveSilhouette,
  type GateConfig,
  type GateOptionKey,
  type GateType,
} from '../src/index'

function withOptions(
  config: GateConfig,
  enabled: Partial<Record<GateOptionKey, { quantity?: number; variant?: string } | true>>,
  motorised?: boolean,
): GateConfig {
  return {
    ...config,
    motorised: motorised ?? config.motorised,
    options: config.options.map((option) => {
      const next = enabled[option.key]
      if (!next) return option
      if (next === true) {
        return { ...option, enabled: true, quantity: Math.max(1, option.quantity ?? 1) }
      }
      return {
        ...option,
        enabled: true,
        quantity: next.quantity ?? Math.max(1, option.quantity ?? 1),
        variant: next.variant,
      }
    }),
  }
}

function publicFile(publicPath: string): string {
  const here = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(here, '../../../apps/web/public', publicPath.replace(/^\//, ''))
}

describe('definitive decorative masters', () => {
  it('every GATE_TYPES preset resolves a silhouette with public file', () => {
    for (const gateType of GATE_TYPES) {
      const config = createGateConfig(createGatePreset(gateType as GateType))
      expect(() => resolveSilhouette(config)).not.toThrow()
      const resolved = resolveSilhouette(config)
      expect(resolved.gateType).toBe(gateType)
      expect(resolved.publicPath).toMatch(new RegExp(`^/2d-masters/${gateType}/silhouettes/`))
      expect(fs.existsSync(publicFile(resolved.publicPath)), resolved.publicPath).toBe(true)
    }
  })

  it('victorian base+circles uses baked master or tipology fallback for every gate', () => {
    for (const gateType of GATE_TYPES) {
      const pack = SILHOUETTE_INDEX.packs[gateType]
      expect(pack, gateType).toBeTruthy()
      const base = createGateConfig(createGatePreset(gateType as GateType))
      const config = withOptions(base, { circles: true }, false)
      expect(() => resolveSilhouette(config)).not.toThrow()
      const resolved = resolveSilhouette(config)
      expect(fs.existsSync(publicFile(resolved.publicPath)), `${gateType}:${resolved.publicPath}`).toBe(
        true,
      )

      const hasBakedBaseCircles =
        Boolean(pack.silhouettes['base_circles']) ||
        Boolean(pack.silhouettes['base_circles_motorised'])

      if (resolved.bakedOptions.includes('circles')) {
        expect(resolved.slug).toMatch(/circles/)
      } else {
        // Tipology fallback: base (or nearest tipology) + circle overlays
        expect(resolved.bakedOptions).not.toContain('circles')
        expect(resolveCircleOverlays(config).bands.length).toBeGreaterThan(0)
        // If pack never shipped base_circles, fallback is expected
        if (!hasBakedBaseCircles) {
          expect(resolved.slug === 'base' || !resolved.slug.includes('circles')).toBe(true)
        }
      }
    }
  })

  it('double_swing picks baked manual circles+collar master', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const config = withOptions(base, {
      arched_top: true,
      dog_bars: true,
      circles: true,
      picket_collars: { variant: 'every_1' },
    }, false)
    const resolved = resolveSilhouette(config)
    expect(resolved.slug).toBe('arched_dog_bars_circles_collar_1')
    expect(resolved.bakedOptions).toEqual(
      expect.arrayContaining(['arched_top', 'dog_bars', 'circles', 'picket_collars']),
    )
  })

  it('double_swing picks motorised twin when motorised', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const config = withOptions(base, { circles: true }, true)
    const resolved = resolveSilhouette(config)
    expect(resolved.slug).toBe('base_circles_motorised')
    expect(resolved.publicPath).toContain('base_circles_motorised.svg')
  })

  it('telescopic uses baked arched_circles and skips circle overlay', () => {
    const base = createGateConfig(createGatePreset('telescopic_sliding'))
    const config = withOptions(base, { arched_top: true, circles: true })
    const resolved = resolveSilhouette(config)
    expect(resolved.slug).toBe('arched_circles')
    expect(resolveCircleOverlays(config).bands).toHaveLength(1) // overlay still computed
    // UI skips overlay when baked — engine still returns plan; assert baked flag
    expect(resolved.bakedOptions).toContain('circles')
  })

  it('telescopic bakes base+circles instead of overlay fallback', () => {
    const base = createGateConfig(createGatePreset('telescopic_sliding'))
    const config = withOptions(base, { circles: true })
    const resolved = resolveSilhouette(config)
    expect(resolved.slug).toBe('base_circles')
    expect(resolved.bakedOptions).toContain('circles')
  })

  it('telescopic bakes dog_bars + collar_1', () => {
    const base = createGateConfig(createGatePreset('telescopic_sliding'))
    const config = withOptions(base, {
      dog_bars: true,
      picket_collars: { variant: 'every_1' },
    })
    const resolved = resolveSilhouette(config)
    expect(resolved.slug).toBe('dog_bars_collar_1')
    expect(resolved.bakedOptions).toEqual(expect.arrayContaining(['dog_bars', 'picket_collars']))
  })

  it('telescopic bakes arched_dog_bars_circles', () => {
    const base = createGateConfig(createGatePreset('telescopic_sliding'))
    const config = withOptions(base, {
      arched_top: true,
      dog_bars: true,
      circles: true,
    })
    const resolved = resolveSilhouette(config)
    expect(resolved.slug).toBe('arched_dog_bars_circles')
    expect(resolved.bakedOptions).toEqual(
      expect.arrayContaining(['arched_top', 'dog_bars', 'circles']),
    )
  })

  it('plain arched silhouettes match the definitive GATE masters', () => {
    const here = path.dirname(fileURLToPath(import.meta.url))
    const docs = path.resolve(here, '../../../docs/frontend/2d-masters')
    for (const gateType of GATE_TYPES) {
      for (const slug of ['arched', 'arched_dog_bars'] as const) {
        const sil = path.join(docs, gateType, 'silhouettes', `${slug}.svg`)
        expect(fs.existsSync(sil), sil).toBe(true)
        const gateName = `GATE__${gateType}__${slug}.svg`
        const matches: string[] = []
        const walk = (dir: string) => {
          if (!fs.existsSync(dir)) return
          for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name)
            if (entry.isDirectory()) {
              if (entry.name === '_review') continue
              walk(full)
              continue
            }
            if (entry.name === gateName) matches.push(full)
          }
        }
        walk(path.join(docs, gateType, 'definitive'))
        expect(matches.length, `${gateType}/${slug} definitive`).toBeGreaterThan(0)
        expect(fs.readFileSync(sil)).toEqual(fs.readFileSync(matches[0]))
        expect(fs.readFileSync(publicFile(`/2d-masters/${gateType}/silhouettes/${slug}.svg`))).toEqual(
          fs.readFileSync(sil),
        )
      }
    }
  })

  it('collar every_1 resolves on double_swing base', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const config = withOptions(base, { picket_collars: { variant: 'every_1' } }, false)
    const resolved = resolveSilhouette(config)
    expect(resolved.slug).toBe('base_collar_1')
    expect(resolveCollarOverlays(config).overlays[0]?.id).toBe('every_1')
  })

  it('single_swing picks baked arched_dog_bars circles+collar master', () => {
    const base = createGateConfig(createGatePreset('single_swing'))
    const config = withOptions(
      base,
      {
        arched_top: true,
        dog_bars: true,
        circles: true,
        picket_collars: { variant: 'every_1' },
      },
      false,
    )
    const resolved = resolveSilhouette(config)
    expect(resolved.slug).toBe('arched_dog_bars_circles_collar_1')
    expect(resolved.publicPath).toContain('single_swing/silhouettes/arched_dog_bars_circles_collar_1.svg')
  })
})
