import { describe, expect, it } from 'vitest'

import {
  BIFOLD_PANELS_PER_LEAF,
  HEIGHT_MEANING,
  RADIUS_TRAVEL_PATH,
  TELESCOPIC_DEFAULT_PANEL_COUNT,
  TELESCOPIC_OVERLAP_MM_SCHEMATIC,
  WIDTH_MEANING,
  bifoldSchematicNote,
  buildGateRenderPlan,
  clearOpeningLeafWidthMm,
  createGateConfig,
  createGatePreset,
  dimensionMeaningNote,
  getRadiusTopProfile,
  getTelescopicPanelCount,
  radiusSchematicNote,
  telescopicSchematicNote,
} from '../src/index'

describe('CA-08 dimension meaning', () => {
  it('locks clear opening + ground-to-top-rail', () => {
    expect(WIDTH_MEANING).toBe('clear_opening_between_posts')
    expect(HEIGHT_MEANING).toBe('ground_to_top_rail')
    expect(clearOpeningLeafWidthMm(3000, 2)).toBe(1500)
    expect(dimensionMeaningNote()).toContain('clear opening')
    expect(dimensionMeaningNote()).toContain('top rail')
  })

  it('adds cantilever tail clause when requested', () => {
    expect(dimensionMeaningNote({ cantileverTailExtra: true })).toContain('Cantilever')
  })
})

describe('CA-09 / CA-10 bifold confirmed', () => {
  it('keeps 2 panels per leaf and quote-time handing copy', () => {
    expect(BIFOLD_PANELS_PER_LEAF).toBe(2)
    expect(bifoldSchematicNote('single_bifolding')).toContain('quote')
    expect(bifoldSchematicNote('bifolding_double_swing')).toContain('50/50')
  })
})

describe('CA-11 telescopic', () => {
  it('uses 3 overlapping panels and mid-band overlap on the render plan', () => {
    expect(getTelescopicPanelCount()).toBe(TELESCOPIC_DEFAULT_PANEL_COUNT)
    expect(TELESCOPIC_DEFAULT_PANEL_COUNT).toBe(3)
    const plan = buildGateRenderPlan(
      { ...createGateConfig(createGatePreset('telescopic_sliding')), widthMm: 4000 },
      { viewMode: 'technical' },
    )
    expect(plan.primitives.some((p) => p.id.startsWith('telescopic-segment-0'))).toBe(true)
    expect(plan.primitives.some((p) => p.id.startsWith('telescopic-segment-1'))).toBe(true)
    expect(plan.primitives.some((p) => p.id.startsWith('telescopic-segment-2'))).toBe(true)
    expect(plan.primitives.some((p) => p.id === 'telescopic-motor-side-marker')).toBe(true)
    expect(plan.primitives.some((p) => p.id.startsWith('telescopic-plan-leaf-'))).toBe(true)
    expect(plan.primitives.some((p) => p.id === 'telescopic-track-0')).toBe(true)
    expect(plan.primitives.some((p) => p.id === 'telescopic-track-2')).toBe(true)
    expect(plan.notes).toContain(telescopicSchematicNote(4000))
    expect(telescopicSchematicNote(4000)).toContain(String(TELESCOPIC_OVERLAP_MM_SCHEMATIC))
  })
})

describe('CA-12 radius', () => {
  it('keeps curved travel, articulated train, and arched crest on every panel', () => {
    expect(RADIUS_TRAVEL_PATH).toBe('curved')
    expect(getRadiusTopProfile(false)).toBe('straight')
    expect(getRadiusTopProfile(true)).toBe('curved')

    const straight = buildGateRenderPlan(
      { ...createGateConfig(createGatePreset('radius_sliding')), widthMm: 2600 },
      { viewMode: 'technical' },
    )
    expect(straight.primitives.some((p) => p.id === 'track-line' && p.kind === 'path')).toBe(true)
    expect(straight.primitives.some((p) => p.id === 'radius-path-cue')).toBe(true)
    expect(straight.primitives.some((p) => p.id.startsWith('radius-leaf-0'))).toBe(true)
    expect(straight.primitives.some((p) => p.id.startsWith('radius-leaf-4'))).toBe(true)
    expect(straight.primitives.some((p) => p.id === 'radius-hinge-1')).toBe(true)
    expect(straight.notes).toContain(radiusSchematicNote(false))

    const arched = buildGateRenderPlan(
      {
        ...createGateConfig(createGatePreset('radius_sliding')),
        widthMm: 2600,
        options: createGateConfig(createGatePreset('radius_sliding')).options.map((option) =>
          option.key === 'arched_top' ? { ...option, enabled: true } : option,
        ),
      },
      { viewMode: 'technical' },
    )
    // Every articulated panel gets its own arch — not a single lead-only crest.
    expect(arched.primitives.some((p) => p.id === 'radius-leaf-0-arch')).toBe(true)
    expect(arched.primitives.some((p) => p.id === 'radius-leaf-1-arch')).toBe(true)
    expect(arched.primitives.some((p) => p.id === 'radius-leaf-4-arch')).toBe(true)
  })
})
