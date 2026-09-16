import { describe, expect, it } from 'vitest'

import {
  GATE_TYPES,
  SILHOUETTE_INDEX,
  buildGateRenderPlan,
  createGateConfig,
  createGatePreset,
  resolveSilhouette,
  type GateConfig,
  type GateOptionKey,
  type GateType,
} from '../src/index'

const TIP = [
  { id: 'base', opts: {} as Partial<Record<GateOptionKey, true>> },
  { id: 'arched', opts: { arched_top: true as const } },
  { id: 'dog_bars', opts: { dog_bars: true as const } },
  { id: 'arched_dog_bars', opts: { arched_top: true as const, dog_bars: true as const } },
]

const DECO = [
  { id: 'plain', opts: {} as Partial<Record<GateOptionKey, true | { variant: string }>> },
  { id: 'circles', opts: { circles: true as const } },
  { id: 'collar_1', opts: { picket_collars: { variant: 'every_1' } } },
  { id: 'circles_collar_1', opts: { circles: true as const, picket_collars: { variant: 'every_1' } } },
]

function withOptions(
  config: GateConfig,
  enabled: Partial<Record<GateOptionKey, { quantity?: number; variant?: string } | true>>,
  motorised: boolean,
  style: GateConfig['style'] = 'traditional_victorian',
): GateConfig {
  return {
    ...config,
    motorised,
    style,
    options: config.options.map((option) => {
      const next = enabled[option.key]
      if (!next) return { ...option, enabled: false, quantity: 0, variant: undefined }
      if (next === true) return { ...option, enabled: true, quantity: 1 }
      return {
        ...option,
        enabled: true,
        quantity: next.quantity ?? 1,
        variant: next.variant,
      }
    }),
  }
}

function hasCircleBand(plan: ReturnType<typeof buildGateRenderPlan>): boolean {
  return plan.primitives.some((primitive) => primitive.id.includes('circle-band'))
}

function hasPicketCollar(plan: ReturnType<typeof buildGateRenderPlan>): boolean {
  return plan.primitives.some((primitive) => primitive.id.startsWith('picket-collar-'))
}

/**
 * Slice D: CAD is a function of GateConfig. Workshop masters still resolve.
 * Do not perceptually compare CAD to Figma — they are different drawing languages.
 */
describe('live CAD golden (installation view)', () => {
  it('renders every Victorian audit cell and keeps workshop resolve', () => {
    const failures: string[] = []

    for (const gateType of GATE_TYPES) {
      const pack = SILHOUETTE_INDEX.packs[gateType as GateType]
      expect(pack).toBeTruthy()
      const motorSplit = Object.keys(pack.silhouettes).some((slug) => slug.endsWith('_motorised'))

      for (const tip of TIP) {
        for (const deco of DECO) {
          for (const motor of motorSplit ? [false, true] : [false]) {
            const label = `${gateType}/${tip.id}${deco.id === 'plain' ? '' : `_${deco.id}`}${motor ? '_motorised' : ''}`
            const base = createGateConfig(createGatePreset(gateType as GateType))
            const config = withOptions(base, { ...tip.opts, ...deco.opts }, motor)

            try {
              const resolved = resolveSilhouette(config)
              expect(resolved.slug.length).toBeGreaterThan(0)

              const plan = buildGateRenderPlan(config, { viewMode: 'installation' })
              expect(plan.primitives.length).toBeGreaterThan(0)

              const wantCircles = Boolean(deco.opts.circles)
              const wantCollars = Boolean(deco.opts.picket_collars)
              if (wantCircles && !hasCircleBand(plan)) {
                failures.push(`${label}: missing circle-band primitives`)
              }
              if (!wantCircles && hasCircleBand(plan)) {
                failures.push(`${label}: unexpected circle-band primitives`)
              }
              if (wantCollars && !hasPicketCollar(plan)) {
                failures.push(`${label}: missing picket-collar primitives`)
              }
              if (!wantCollars && hasPicketCollar(plan)) {
                failures.push(`${label}: unexpected picket-collar primitives`)
              }
            } catch (error) {
              failures.push(
                `${label}: ${error instanceof Error ? error.message : String(error)}`,
              )
            }
          }
        }
      }

      for (const motor of motorSplit ? [false, true] : [false]) {
        const label = `${gateType}/composite${motor ? '_motorised' : ''}`
        const base = createGateConfig(createGatePreset(gateType as GateType))
        const config = withOptions(base, {}, motor, 'composite_boards')
        try {
          const resolved = resolveSilhouette(config)
          expect(resolved.slug).toContain('composite')
          const plan = buildGateRenderPlan(config, { viewMode: 'installation' })
          expect(plan.primitives.length).toBeGreaterThan(0)
          if (hasCircleBand(plan) || hasPicketCollar(plan)) {
            failures.push(`${label}: composite CAD should not draw Victorian deco`)
          }
        } catch (error) {
          failures.push(`${label}: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
    }

    if (failures.length > 0) {
      throw new Error(failures.join('\n'))
    }
  })

  it('still resolves the workshop master for collar every_2 overlay cells', () => {
    for (const gateType of GATE_TYPES) {
      const base = createGateConfig(createGatePreset(gateType as GateType))
      const config = withOptions(base, { picket_collars: { variant: 'every_2' } }, false)
      const resolved = resolveSilhouette(config)
      expect(resolved.slug.length).toBeGreaterThan(0)

      const plan = buildGateRenderPlan(config, { viewMode: 'installation' })
      expect(hasPicketCollar(plan)).toBe(true)
      const collars = plan.primitives.filter((primitive) => primitive.id.startsWith('picket-collar-'))
      expect(collars.length).toBeGreaterThan(0)
    }
  })
})
