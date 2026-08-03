import { describe, expect, it } from 'vitest'

import {
  CANTILEVER_TAIL_RATIO,
  buildGateMeshPlan,
  buildGateRenderPlan,
  cantileverTailNote,
  createGateConfig,
  createGatePreset,
  getCantileverSiteSpace,
  getCantileverTailMm,
  getCantileverTailRatio,
  getCantileverTotalRunMm,
} from '../src/index'

describe('cantilever tail rule (CA-05 / CL-705)', () => {
  it('applies 1/3 minimum at every clear opening width', () => {
    expect(getCantileverTailRatio(2500)).toBe(CANTILEVER_TAIL_RATIO)
    expect(getCantileverTailRatio(4000)).toBe(CANTILEVER_TAIL_RATIO)
    expect(getCantileverTailRatio(6000)).toBeCloseTo(1 / 3)
    expect(getCantileverTailMm(4000)).toBe(1333)
    expect(getCantileverTotalRunMm(4000)).toBe(5333)
  })

  it('matches the client worked example 4000 → 1333 → 5333', () => {
    expect(getCantileverSiteSpace(4000)).toEqual({
      clearOpeningMm: 4000,
      tailMm: 1333,
      totalRunMm: 5333,
    })
  })

  it('keeps the 2D render plan and 3D mesh plan tail notes aligned', () => {
    for (const widthMm of [2500, 4000]) {
      const config = {
        ...createGateConfig(createGatePreset('cantilever_sliding')),
        widthMm,
      }

      const renderPlan = buildGateRenderPlan(config)
      const meshPlan = buildGateMeshPlan(config)
      const expectedNote = cantileverTailNote(widthMm)

      expect(renderPlan.notes).toContain(expectedNote)
      expect(meshPlan.notes).toContain(expectedNote)
      expect(expectedNote).toContain('1/3')
      expect(expectedNote).not.toContain('schematically')
    }
  })

  it('sizes the 3D counterbalance tail box from the shared ratio', () => {
    const config = {
      ...createGateConfig(createGatePreset('cantilever_sliding')),
      widthMm: 4000,
    }

    const meshPlan = buildGateMeshPlan(config)
    const tail = meshPlan.boxes.find((box) => box.id === 'counterbalance-tail')

    expect(tail).toBeDefined()
    expect(tail?.widthMm).toBeCloseTo(4000 * CANTILEVER_TAIL_RATIO)
  })
})
