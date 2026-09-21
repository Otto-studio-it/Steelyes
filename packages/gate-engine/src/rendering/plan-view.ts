import type { GateRenderLabel, GateRenderPlan, GateRenderPrimitive } from './render-plan'
import { getCantileverTailRatio } from '../rules/cantilever'

const PLAN_WIDTH = 1200
const PLAN_HEIGHT = 860
const PLAN_CENTER_X = 600
const PLAN_DRIVEWAY_Y = 520

function isSlidingGate(gateType: string): boolean {
  return gateType.includes('sliding')
}

export function buildPlanViewPlan(input: {
  gateType: string
  style: string
  widthMm: number
  heightMm: number
  title: string
  subtitle: string
}): Pick<GateRenderPlan, 'primitives' | 'labels' | 'background' | 'notes'> {
  const scale = Math.min(680 / input.widthMm, 1)
  const gateWidth = input.widthMm * scale
  const gateDepth = Math.max(80, input.heightMm * scale * 0.12)
  const leftX = PLAN_CENTER_X - gateWidth / 2
  const primitives: GateRenderPrimitive[] = [
    {
      kind: 'rect',
      id: 'driveway',
      x: 80,
      y: PLAN_DRIVEWAY_Y - 40,
      width: PLAN_WIDTH - 160,
      height: 220,
      rx: 18,
      fill: '#D8D2C8',
      stroke: '#8E857C',
      strokeWidth: 2,
      opacity: 0.95,
    },
    {
      kind: 'rect',
      id: 'gate-opening',
      x: leftX,
      y: PLAN_DRIVEWAY_Y - gateDepth,
      width: gateWidth,
      height: gateDepth,
      rx: 6,
      fill: 'none',
      stroke: '#1B1C1A',
      strokeWidth: 4,
      strokeDasharray: '10 8',
    },
  ]

  if (isSlidingGate(input.gateType)) {
    const panelWidth = gateWidth * (input.gateType === 'cantilever_sliding' ? 0.64 : 0.88)
    primitives.push({
      kind: 'rect',
      id: 'sliding-panel-plan',
      x: leftX + gateWidth - panelWidth,
      y: PLAN_DRIVEWAY_Y - gateDepth + 6,
      width: panelWidth,
      height: gateDepth - 12,
      rx: 4,
      fill: '#ECE7DF',
      stroke: '#1B1C1A',
      strokeWidth: 3,
    })
    if (input.gateType === 'cantilever_sliding') {
      // CA-05: the tail is a third of the clear opening at every width (it was 0.28 except at exactly 4000 mm).
      const tailWidth = gateWidth * getCantileverTailRatio(input.widthMm)
      primitives.push({
        kind: 'rect',
        id: 'counterbalance-plan',
        x: leftX,
        y: PLAN_DRIVEWAY_Y - gateDepth + 6,
        width: tailWidth,
        height: gateDepth - 12,
        rx: 4,
        fill: '#DDD6CC',
        stroke: '#9E000C',
        strokeWidth: 2.5,
      })
    }
  } else {
    const leafWidth = gateWidth / (input.gateType.includes('double') ? 2 : 1)
    const swingDepth = gateDepth + 90
    for (let index = 0; index < (input.gateType.includes('double') ? 2 : 1); index += 1) {
      const x = leftX + leafWidth * index
      primitives.push({
        kind: 'rect',
        id: `swing-leaf-plan-${index + 1}`,
        x,
        y: PLAN_DRIVEWAY_Y - swingDepth,
        width: leafWidth - 8,
        height: swingDepth,
        rx: 4,
        fill: '#ECE7DF',
        stroke: '#1B1C1A',
        strokeWidth: 3,
        opacity: 0.95,
      })
      primitives.push({
        kind: 'line',
        id: `swing-arc-${index + 1}`,
        x1: index === 0 ? x : x + leafWidth,
        y1: PLAN_DRIVEWAY_Y - gateDepth,
        x2: index === 0 ? x - 70 : x + leafWidth + 70,
        y2: PLAN_DRIVEWAY_Y - gateDepth - 50,
        stroke: '#9E000C',
        strokeWidth: 2,
        strokeDasharray: '6 6',
        opacity: 0.75,
      })
    }
  }

  const labels: GateRenderLabel[] = [
    {
      id: 'plan-width-label',
      x: PLAN_CENTER_X,
      y: PLAN_DRIVEWAY_Y + 120,
      text: `${input.widthMm} mm opening`,
      anchor: 'middle',
      size: 14,
      weight: 700,
      fill: '#1B1C1A',
    },
    {
      id: 'plan-depth-label',
      x: leftX - 36,
      y: PLAN_DRIVEWAY_Y - gateDepth / 2,
      text: `${input.heightMm} mm`,
      anchor: 'end',
      size: 12,
      weight: 600,
      fill: '#5C403D',
    },
  ]

  return {
    background: [],
    primitives,
    labels,
    notes: ['Plan view shows driveway layout, opening width, and leaf or panel sweep schematic.'],
  }
}
