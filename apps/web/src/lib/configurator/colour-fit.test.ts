import { describe, expect, it } from 'vitest'
import { createGateConfig, createGatePreset } from '@steelyes/gate-engine'

import { buildColourFitDrawing } from '@/lib/configurator/colour-fit'

describe('buildColourFitDrawing', () => {
  it('paints installation CAD from the selected finish', () => {
    const satin = createGateConfig(createGatePreset('double_swing'))
    const anthracite = { ...satin, finish: 'anthracite_ral7016' as const }

    const satinDraw = buildColourFitDrawing(satin)
    const anthraciteDraw = buildColourFitDrawing(anthracite)

    expect(satinDraw.finishHex).toBe('#1C1C1E')
    expect(anthraciteDraw.finishHex).toBe('#383E42')
    expect(satinDraw.svg).toContain('swing-fill')
    expect(anthraciteDraw.svg).toContain('#383E42')
    expect(satinDraw.svg).not.toBe(anthraciteDraw.svg)
  })

  it('scales the millimetre envelope with width and height', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const wide = { ...base, widthMm: 3200, heightMm: 1400 }

    const baseDraw = buildColourFitDrawing(base)
    const wideDraw = buildColourFitDrawing(wide)

    expect(baseDraw.widthMm).toBe(1800)
    expect(wideDraw.widthMm).toBe(3200)
    expect(wideDraw.svg).toContain('3200')
    expect(wideDraw.svg).toContain('1400')
  })
})
