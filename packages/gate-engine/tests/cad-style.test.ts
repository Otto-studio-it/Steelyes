import { describe, expect, it } from 'vitest'

import {
  buildCadMountingPosts,
  buildCadTechnicalBackground,
  buildGateRenderPlan,
  CAD_COLORS,
  CAD_DIMENSION,
  CAD_STYLE_SOURCE,
  createGateConfig,
  createGatePreset,
  getCadTechnicalPalette,
  isCadTechnicalView,
  restylePrimitivesForCadTechnical,
} from '../src/index'

describe('CAD technical style tokens (phase 0)', () => {
  it('exposes CAD reference colours and dimension tokens', () => {
    expect(CAD_STYLE_SOURCE).toContain('2d-style-reference-double-swing-cad.png')
    expect(CAD_COLORS.paper).toBe('#FFFFFF')
    expect(CAD_COLORS.ink).toBe('#1A1A1A')
    expect(CAD_COLORS.dim).toBe('#C62828')
    expect(CAD_COLORS.ground).toBe('#2A2A2A')
    expect(CAD_DIMENSION.color).toBe(CAD_COLORS.dim)
    expect(isCadTechnicalView('technical')).toBe(true)
    expect(isCadTechnicalView('installation')).toBe(false)
  })

  it('builds a paper + ground-bar background for technical sheets', () => {
    const background = buildCadTechnicalBackground({
      canvasWidth: 1200,
      canvasHeight: 860,
      groundTopY: 678,
      gateLeftX: 120,
      gateRightX: 1080,
    })

    expect(background.some((p) => p.id === 'cad-paper' && p.kind === 'rect' && p.fill === CAD_COLORS.paper)).toBe(
      true,
    )
    expect(background.some((p) => p.id === 'cad-ground-bar' && p.kind === 'rect' && p.fill === CAD_COLORS.ground)).toBe(
      true,
    )
  })

  it('applies CAD palette, brick posts, outline gate, and red dims in technical view', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateRenderPlan(config, { viewMode: 'technical' })
    const cad = getCadTechnicalPalette()

    expect(plan.background.some((p) => p.id === 'cad-paper')).toBe(true)
    expect(plan.background.some((p) => p.id === 'cad-ground-bar')).toBe(true)
    expect(plan.background.some((p) => p.id === 'sky-top')).toBe(false)

    expect(plan.primitives.some((p) => p.id === 'cad-left-pillar')).toBe(true)
    expect(plan.primitives.some((p) => p.id === 'cad-right-pillar')).toBe(true)
    expect(plan.primitives.some((p) => p.id.startsWith('cad-left-pillar-bed-'))).toBe(true)
    expect(plan.primitives.some((p) => p.id.endsWith('-shadow'))).toBe(false)

    const frame = plan.primitives.find((p) => p.id === 'leaf-1-frame')
    expect(frame?.kind).toBe('rect')
    if (frame?.kind === 'rect') {
      expect(frame.stroke).toBe(CAD_COLORS.ink)
      expect(frame.fill).toBe(CAD_COLORS.fillNone)
      expect(frame.rx).toBe(0)
    }

    const topRail = plan.primitives.find((p) => p.id === 'leaf-1-top-rail' || p.id === 'leaf-1-arch')
    if (topRail && (topRail.kind === 'line' || topRail.kind === 'path')) {
      expect(topRail.stroke).toBe(CAD_COLORS.ink)
    }

    const widthLine = plan.primitives.find((p) => p.id === 'cad-dim-gate-width-line')
    expect(widthLine?.kind).toBe('line')
    if (widthLine?.kind === 'line') {
      expect(widthLine.stroke).toBe(cad.dim)
    }

    const heightLabel = plan.labels.find((l) => l.id === 'cad-dim-gate-height-label')
    expect(heightLabel?.fill).toBe(cad.dim)
    expect(heightLabel?.text).toBe(`${config.heightMm}`)
    expect(plan.labels.some((l) => l.id === 'label-height')).toBe(false)
  })

  it('restyles schematic primitives into CAD ink without touching dimension red', () => {
    const restyled = restylePrimitivesForCadTechnical([
      {
        kind: 'line',
        id: 'upper-mid-rail-shadow',
        x1: 0,
        y1: 0,
        x2: 10,
        y2: 0,
        stroke: '#000',
      },
      {
        kind: 'line',
        id: 'upper-mid-rail',
        x1: 0,
        y1: 0,
        x2: 10,
        y2: 0,
        stroke: '#FF00AA',
        strokeWidth: 8,
      },
      {
        kind: 'line',
        id: 'width-dimension-line',
        x1: 0,
        y1: 20,
        x2: 100,
        y2: 20,
        stroke: CAD_DIMENSION.color,
        strokeWidth: 1.35,
      },
    ])

    expect(restyled).toHaveLength(2)
    expect(restyled[0]?.id).toBe('upper-mid-rail')
    if (restyled[0]?.kind === 'line') {
      expect(restyled[0].stroke).toBe(CAD_COLORS.ink)
    }
    if (restyled[1]?.kind === 'line') {
      expect(restyled[1].stroke).toBe(CAD_DIMENSION.color)
    }
  })

  it('builds CAD brick pillars with hatch lines', () => {
    const posts = buildCadMountingPosts({
      frameX: 120,
      frameY: 150,
      frameWidth: 960,
      frameHeight: 520,
    })
    expect(posts.some((p) => p.id === 'cad-left-pillar')).toBe(true)
    expect(posts.some((p) => p.id === 'cad-right-pillar-cap')).toBe(true)
    expect(posts.filter((p) => p.id.includes('-bed-')).length).toBeGreaterThan(5)
    expect(posts.filter((p) => p.id.includes('-head-')).length).toBeGreaterThan(5)
  })

  it('keeps installation view on the scenic background (unchanged by CAD phases)', () => {
    const config = createGateConfig(createGatePreset('double_swing'))
    const plan = buildGateRenderPlan(config, { viewMode: 'installation' })

    expect(plan.background.some((p) => p.id === 'sky-top')).toBe(true)
    expect(plan.background.some((p) => p.id === 'cad-paper')).toBe(false)
    expect(plan.primitives.some((p) => p.id === 'cad-left-pillar')).toBe(false)
  })
})
