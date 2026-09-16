import {
  buildGateRenderPlan,
  resolveFinishDefinition,
  serializeGateRenderPlanToSvg,
  type GateConfig,
} from '@steelyes/gate-engine'

export type ColourFitDrawing = {
  svg: string
  dataUri: string
  finishHex: string
  finishLabel: string
  widthMm: number
  heightMm: number
}

/**
 * Live CAD elevation used by the Colour fit preview.
 * Finish, millimetres and middle bar follow GateConfig; this is not the official master.
 */
export function buildColourFitDrawing(config: GateConfig): ColourFitDrawing {
  const plan = buildGateRenderPlan(config, { viewMode: 'installation' })
  const finish = resolveFinishDefinition(config)
  const svg = serializeGateRenderPlanToSvg(plan)
  return {
    svg,
    dataUri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    finishHex: finish.schematic.frame,
    finishLabel: finish.label,
    widthMm: config.widthMm,
    heightMm: config.heightMm,
  }
}
