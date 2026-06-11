import { describe, expect, it } from 'vitest'

import {
  CANTILEVER_TAIL_RATIO_AT_4M,
  CANTILEVER_TAIL_RATIO_DEFAULT,
  buildGateMeshPlan,
  buildGateRenderPlan,
  cantileverTailNote,
  createGateConfig,
  createGatePreset,
  getCantileverTailRatio,
} from '../src/index'

describe('cantilever tail rule', () => {
  it('returns the confirmed 1/3 ratio for the 4m opening', () => {
    expect(getCantileverTailRatio(4000)).toBe(CANTILEVER_TAIL_RATIO_AT_4M)
    expect(getCantileverTailRatio(4000)).toBeCloseTo(1 / 3)
  })

  it('returns the schematic default ratio for every other width', () => {
    expect(getCantileverTailRatio(2500)).toBe(CANTILEVER_TAIL_RATIO_DEFAULT)
    expect(getCantileverTailRatio(3999)).toBe(CANTILEVER_TAIL_RATIO_DEFAULT)
    expect(getCantileverTailRatio(6000)).toBe(CANTILEVER_TAIL_RATIO_DEFAULT)
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
    expect(tail?.widthMm).toBeCloseTo(4000 * CANTILEVER_TAIL_RATIO_AT_4M)
  })
})
