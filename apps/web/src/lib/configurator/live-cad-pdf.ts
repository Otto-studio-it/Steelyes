import { Resvg } from '@resvg/resvg-js'
import type { GateConfig } from '@steelyes/gate-engine'

import { buildColourFitDrawing, type ColourFitDrawing } from '@/lib/configurator/colour-fit'

export type LiveCadRaster = Pick<
  ColourFitDrawing,
  'finishHex' | 'finishLabel' | 'widthMm' | 'heightMm' | 'tipology'
> & {
  png: Uint8Array
}

/**
 * Same live CAD PNG the customer Design preview shows.
 * Server-only — do not import from client components.
 */
export function rasterizeLiveCad(config: GateConfig): LiveCadRaster {
  const drawing = buildColourFitDrawing(config)
  const png = new Resvg(drawing.svg, {
    fitTo: { mode: 'width', value: 1200 },
    background: '#ffffff',
  })
    .render()
    .asPng()

  return {
    png,
    finishHex: drawing.finishHex,
    finishLabel: drawing.finishLabel,
    widthMm: drawing.widthMm,
    heightMm: drawing.heightMm,
    tipology: drawing.tipology,
  }
}
