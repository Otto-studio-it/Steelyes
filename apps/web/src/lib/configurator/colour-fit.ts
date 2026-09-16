import {
  buildGateRenderPlan,
  getVictorianTipology,
  resolveFinishDefinition,
  serializeGateRenderPlanToSvg,
  type GateConfig,
  type VictorianTipology,
} from '@steelyes/gate-engine'

export type ColourFitDrawing = {
  svg: string
  dataUri: string
  finishHex: string
  finishLabel: string
  widthMm: number
  heightMm: number
  tipology: VictorianTipology
  motorised: boolean
  hasHandle: boolean
}

/**
 * Live CAD elevation for the customer Design preview (installation view).
 * Finish, millimetres, Victorian shape, middle bar and the CA-01 handle follow GateConfig.
 * Circles, collars and railheads stay on the workshop master until CAD draws them.
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
    tipology: getVictorianTipology(config),
    motorised: config.motorised,
    hasHandle: svg.includes('manual-handle'),
  }
}
