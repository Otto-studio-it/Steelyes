import { describe, expect, it } from 'vitest'

import {
  buildCadDimensionLayer,
  buildGateRenderPlan,
  CAD_CLEARANCE_MIN_PX,
  CAD_COLORS,
  CAD_PROVISIONAL_CENTER_GAP_MM,
  CAD_PROVISIONAL_GROUND_CLEARANCE_MM,
  CAD_PROVISIONAL_SIDE_GAP_MM,
  createGateConfig,
  createGatePreset,
  getCadClearancePx,
} from '../src/index'

describe('CAD dimension layer (phase 2)', () => {
  const bounds = {
    frameX: 120,
    frameY: 150,
    frameWidth: 960,
    frameHeight: 520,
  }

  it('builds height, clearance, width chains with arrow heads', () => {
    const layer = buildCadDimensionLayer({
      bounds,
      widthMm: 3000,
      heightMm: 1800,
      leafCount: 2,
      showPosts: true,
    })

    expect(layer.primitives.some((p) => p.id === 'cad-dim-gate-height-line')).toBe(true)
    expect(layer.primitives.some((p) => p.id === 'cad-dim-clearance-line')).toBe(true)
    expect(layer.primitives.some((p) => p.id === 'cad-dim-gate-width-line')).toBe(true)
    expect(layer.primitives.some((p) => p.id === 'cad-dim-overall-height-line')).toBe(true)
    expect(layer.primitives.some((p) => p.id === 'cad-dim-opening-line')).toBe(true)
    expect(layer.primitives.filter((p) => p.id.includes('-arrow-')).length).toBeGreaterThan(8)

    expect(layer.labels.find((l) => l.id === 'cad-dim-gate-height-label')?.text).toBe('1800')
    expect(layer.labels.find((l) => l.id === 'cad-dim-clearance-label')?.text).toBe(
      `${CAD_PROVISIONAL_GROUND_CLEARANCE_MM}`,
    )
    expect(layer.labels.find((l) => l.id === 'cad-dim-gate-width-label')?.text).toBe('3000')
    expect(layer.labels.find((l) => l.id === 'cad-dim-center-gap-label')?.text).toBe(
      `${CAD_PROVISIONAL_CENTER_GAP_MM}`,
    )
    expect(layer.labels.find((l) => l.id === 'cad-dim-opening-label')?.text).toContain(
      `min: ${3000 + CAD_PROVISIONAL_SIDE_GAP_MM.min * 2}`,
    )
    expect(layer.notes.some((n) => n.includes('provisional'))).toBe(true)
  })

  it('omits post opening / overall / side gaps when posts are off', () => {
    const layer = buildCadDimensionLayer({
      bounds,
      widthMm: 2500,
      heightMm: 1600,
      leafCount: 1,
      showPosts: false,
    })

    expect(layer.primitives.some((p) => p.id === 'cad-dim-overall-height-line')).toBe(false)
    expect(layer.primitives.some((p) => p.id === 'cad-dim-opening-line')).toBe(false)
    expect(layer.primitives.some((p) => p.id.startsWith('cad-dim-side-gap-'))).toBe(false)
    expect(layer.primitives.some((p) => p.id === 'cad-dim-center-gap-line')).toBe(false)
  })

  it('wires the dimension stack into technical render plans', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateRenderPlan(config, { viewMode: 'technical' })

    expect(plan.primitives.some((p) => p.id === 'cad-dim-gate-width-line')).toBe(true)
    expect(plan.primitives.some((p) => p.id === 'cad-dim-gate-height-line')).toBe(true)
    expect(plan.primitives.some((p) => p.id === 'width-dimension-line')).toBe(false)
    expect(plan.labels.some((l) => l.id === 'cad-dim-gate-width-label')).toBe(true)
    expect(plan.labels.some((l) => l.id === 'label-dimensions')).toBe(false)
    expect(plan.notes.some((n) => n.includes('provisional'))).toBe(true)

    const widthLabel = plan.labels.find((l) => l.id === 'cad-dim-gate-width-label')
    expect(widthLabel?.fill).toBe(CAD_COLORS.dim)
    expect(widthLabel?.text).toBe(`${config.widthMm}`)
  })

  it('keeps a readable visual clearance under the gate on the technical sheet', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateRenderPlan(config, { viewMode: 'technical' })
    const clearancePx = getCadClearancePx(config.heightMm, 520)

    expect(clearancePx).toBeGreaterThanOrEqual(CAD_CLEARANCE_MIN_PX)
    const ground = plan.background.find((p) => p.id === 'cad-ground-bar')
    expect(ground?.kind).toBe('rect')
    if (ground?.kind === 'rect') {
      // Frame bottom is y=150+520=670; ground sits clearancePx below.
      expect(ground.y).toBe(670 + clearancePx)
    }
    expect(plan.labels.find((l) => l.id === 'cad-dim-clearance-label')?.text).toBe(
      `${CAD_PROVISIONAL_GROUND_CLEARANCE_MM}`,
    )
  })

  it('keeps installation labels on the old non-CAD dimension path', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateRenderPlan(config, { viewMode: 'installation' })

    expect(plan.primitives.some((p) => p.id.startsWith('cad-dim-'))).toBe(false)
  })
})
