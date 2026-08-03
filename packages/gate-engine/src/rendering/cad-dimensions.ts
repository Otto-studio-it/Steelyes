import type { GateRenderLabel, GateRenderPrimitive } from './render-plan'
import {
  CAD_COLORS,
  CAD_DIMENSION,
  CAD_POST_LAYOUT,
  CAD_PROVISIONAL_GROUND_CLEARANCE_MM,
  getCadClearancePx,
  getCadPostOuterBounds,
  type CadPostBounds,
} from './cad-style'

/**
 * Provisional gap rules taken from the CAD elevation *style* reference.
 * Not confirmed Steelyes workshop values — always labelled provisional in notes
 * until Marius closes width/gap intake questions.
 */
export const CAD_PROVISIONAL_CENTER_GAP_MM = 10
export const CAD_PROVISIONAL_SIDE_GAP_MM = { min: 10, max: 30 } as const

export type CadDimensionLayerInput = {
  bounds: CadPostBounds
  widthMm: number
  heightMm: number
  leafCount: number
  showPosts: boolean
  /** Visual clearance under the frame (px). Defaults from height + frame size. */
  clearancePx?: number
}

export type CadDimensionLayer = {
  primitives: GateRenderPrimitive[]
  labels: GateRenderLabel[]
  notes: string[]
}

const DIM = CAD_DIMENSION

function arrowHorizontal(
  id: string,
  tipX: number,
  tipY: number,
  pointing: 'left' | 'right',
): GateRenderPrimitive {
  const dir = pointing === 'right' ? 1 : -1
  const len = DIM.arrowLengthPx
  const half = DIM.arrowWidthPx / 2
  return {
    kind: 'path',
    id,
    d: `M ${tipX} ${tipY} L ${tipX - dir * len} ${tipY - half} L ${tipX - dir * len} ${tipY + half} Z`,
    fill: DIM.color,
    stroke: 'none',
  }
}

function arrowVertical(
  id: string,
  tipX: number,
  tipY: number,
  pointing: 'up' | 'down',
): GateRenderPrimitive {
  const dir = pointing === 'down' ? 1 : -1
  const len = DIM.arrowLengthPx
  const half = DIM.arrowWidthPx / 2
  return {
    kind: 'path',
    id,
    d: `M ${tipX} ${tipY} L ${tipX - half} ${tipY - dir * len} L ${tipX + half} ${tipY - dir * len} Z`,
    fill: DIM.color,
    stroke: 'none',
  }
}

function horizontalChain(options: {
  id: string
  x1: number
  x2: number
  y: number
  objectTopY: number
  label: string
  labelYOffset?: number
}): { primitives: GateRenderPrimitive[]; labels: GateRenderLabel[] } {
  const { id, x1, x2, y, objectTopY, label, labelYOffset = -8 } = options
  const stroke = DIM.color
  const strokeWidth = DIM.strokeWidth
  const overshoot = DIM.extensionOvershootPx
  const gap = DIM.extensionGapPx

  const primitives: GateRenderPrimitive[] = [
    {
      kind: 'line',
      id: `${id}-ext-start`,
      x1,
      y1: objectTopY + gap,
      x2: x1,
      y2: y + overshoot,
      stroke,
      strokeWidth: DIM.extensionStrokeWidth,
      strokeLinecap: 'square',
    },
    {
      kind: 'line',
      id: `${id}-ext-end`,
      x1: x2,
      y1: objectTopY + gap,
      x2: x2,
      y2: y + overshoot,
      stroke,
      strokeWidth: DIM.extensionStrokeWidth,
      strokeLinecap: 'square',
    },
    {
      kind: 'line',
      id: `${id}-line`,
      x1,
      y1: y,
      x2,
      y2: y,
      stroke,
      strokeWidth,
      strokeLinecap: 'square',
    },
    arrowHorizontal(`${id}-arrow-start`, x1, y, 'left'),
    arrowHorizontal(`${id}-arrow-end`, x2, y, 'right'),
  ]

  const labels: GateRenderLabel[] = [
    {
      id: `${id}-label`,
      x: (x1 + x2) / 2,
      y: y + labelYOffset,
      text: label,
      anchor: 'middle',
      size: DIM.labelFontSizePx,
      fill: stroke,
      weight: DIM.labelFontWeight,
    },
  ]

  return { primitives, labels }
}

function verticalChain(options: {
  id: string
  x: number
  y1: number
  y2: number
  objectRightX: number
  label: string
  labelSide?: 'left' | 'right'
}): { primitives: GateRenderPrimitive[]; labels: GateRenderLabel[] } {
  const { id, x, y1, y2, objectRightX, label, labelSide = 'left' } = options
  const stroke = DIM.color
  const strokeWidth = DIM.strokeWidth
  const overshoot = DIM.extensionOvershootPx
  const gap = DIM.extensionGapPx

  const primitives: GateRenderPrimitive[] = [
    {
      kind: 'line',
      id: `${id}-ext-start`,
      x1: objectRightX - gap,
      y1: y1,
      x2: x - overshoot,
      y2: y1,
      stroke,
      strokeWidth: DIM.extensionStrokeWidth,
      strokeLinecap: 'square',
    },
    {
      kind: 'line',
      id: `${id}-ext-end`,
      x1: objectRightX - gap,
      y1: y2,
      x2: x - overshoot,
      y2: y2,
      stroke,
      strokeWidth: DIM.extensionStrokeWidth,
      strokeLinecap: 'square',
    },
    {
      kind: 'line',
      id: `${id}-line`,
      x1: x,
      y1,
      x2: x,
      y2,
      stroke,
      strokeWidth,
      strokeLinecap: 'square',
    },
    arrowVertical(`${id}-arrow-start`, x, y1, 'up'),
    arrowVertical(`${id}-arrow-end`, x, y2, 'down'),
  ]

  const labels: GateRenderLabel[] = [
    {
      id: `${id}-label`,
      x: labelSide === 'left' ? x - 10 : x + 10,
      y: (y1 + y2) / 2 + 5,
      text: label,
      anchor: labelSide === 'left' ? 'end' : 'start',
      size: DIM.labelFontSizePx,
      fill: stroke,
      weight: DIM.labelFontWeight,
    },
  ]

  return { primitives, labels }
}

/**
 * Full CAD dimension stack for technical elevation:
 * - gate height + provisional ground clearance (left)
 * - overall height when posts shown (further left)
 * - gate width (bottom)
 * - opening between pillars min/max (below width)
 * - centre gap (double leaf)
 * - side gap min/max callouts at pillars
 */
export function buildCadDimensionLayer(input: CadDimensionLayerInput): CadDimensionLayer {
  const { bounds, widthMm, heightMm, leafCount, showPosts } = input
  const gateLeft = bounds.frameX
  const gateRight = bounds.frameX + bounds.frameWidth
  const gateTop = bounds.frameY
  const gateBottom = bounds.frameY + bounds.frameHeight
  const clearancePx =
    input.clearancePx ?? getCadClearancePx(heightMm, bounds.frameHeight)
  /** Ground bar sits below the frame so the provisional clearance gap reads on the sheet. */
  const groundTop = gateBottom + clearancePx

  const primitives: GateRenderPrimitive[] = []
  const labels: GateRenderLabel[] = []
  const notes: string[] = [
    `Ground clearance ${CAD_PROVISIONAL_GROUND_CLEARANCE_MM} mm and side/centre gaps are provisional CAD layout values until Marius confirms workshop rules.`,
  ]

  // --- Vertical: gate height (drawn leaf / panel) ---
  const heightChainX = gateLeft - DIM.heightChainOffsetPx
  const gateHeight = verticalChain({
    id: 'cad-dim-gate-height',
    x: heightChainX,
    y1: gateTop,
    y2: gateBottom,
    objectRightX: gateLeft,
    label: `${heightMm}`,
  })
  primitives.push(...gateHeight.primitives)
  labels.push(...gateHeight.labels)

  // --- Vertical: clearance (frame bottom → ground bar) ---
  const clearanceChainX = gateLeft - DIM.heightChainOffsetPx + 28
  const clearance = verticalChain({
    id: 'cad-dim-clearance',
    x: clearanceChainX,
    y1: gateBottom,
    y2: groundTop,
    objectRightX: gateLeft,
    label: `${CAD_PROVISIONAL_GROUND_CLEARANCE_MM}`,
  })
  primitives.push(...clearance.primitives)
  labels.push(...clearance.labels)

  // --- Vertical: overall (posts + gate + clearance) when posts shown ---
  if (showPosts) {
    const postTop = gateTop - CAD_POST_LAYOUT.extendAboveFramePx - 10
    const overallX = gateLeft - DIM.heightChainOffsetPx - 36
    const overallMm =
      heightMm +
      CAD_PROVISIONAL_GROUND_CLEARANCE_MM +
      Math.round(((CAD_POST_LAYOUT.extendAboveFramePx + 10) / bounds.frameHeight) * heightMm)
    const overall = verticalChain({
      id: 'cad-dim-overall-height',
      x: overallX,
      y1: postTop,
      y2: groundTop,
      objectRightX: gateLeft - CAD_POST_LAYOUT.gapFromGatePx - CAD_POST_LAYOUT.widthPx,
      label: `${overallMm}`,
    })
    primitives.push(...overall.primitives)
    labels.push(...overall.labels)
    notes.push(
      'Overall height includes provisional post cap extension — confirm with Marius before treating as fabrication datum.',
    )
  }

  // --- Horizontal: gate width ---
  const widthY = gateBottom + DIM.widthChainOffsetPx
  const widthChain = horizontalChain({
    id: 'cad-dim-gate-width',
    x1: gateLeft,
    x2: gateRight,
    y: widthY,
    objectTopY: gateBottom,
    label: `${widthMm}`,
  })
  primitives.push(...widthChain.primitives)
  labels.push(...widthChain.labels)

  // --- Horizontal: opening between pillars (min / max) ---
  if (showPosts) {
    const { leftX, rightX } = getCadPostOuterBounds(bounds)
    const pillarInnerLeft = leftX + CAD_POST_LAYOUT.widthPx
    const pillarInnerRight = rightX - CAD_POST_LAYOUT.widthPx
    const openingY = widthY + 36
    const openingMin = widthMm + CAD_PROVISIONAL_SIDE_GAP_MM.min * 2
    const openingMax = widthMm + CAD_PROVISIONAL_SIDE_GAP_MM.max * 2
    const opening = horizontalChain({
      id: 'cad-dim-opening',
      x1: pillarInnerLeft,
      x2: pillarInnerRight,
      y: openingY,
      objectTopY: groundTop,
      label: `min: ${openingMin} / max: ${openingMax}`,
      labelYOffset: -8,
    })
    primitives.push(...opening.primitives)
    labels.push(...opening.labels)

    // Side gap callouts (top of pillars)
    const sideGapY = gateTop - 22
    for (const [side, x1, x2] of [
      ['left', pillarInnerLeft, gateLeft],
      ['right', gateRight, pillarInnerRight],
    ] as const) {
      const mid = (x1 + x2) / 2
      primitives.push(
        {
          kind: 'line',
          id: `cad-dim-side-gap-${side}-line`,
          x1,
          y1: sideGapY,
          x2,
          y2: sideGapY,
          stroke: DIM.color,
          strokeWidth: DIM.strokeWidth,
          strokeLinecap: 'square',
        },
        arrowHorizontal(`cad-dim-side-gap-${side}-arrow-a`, x1, sideGapY, 'left'),
        arrowHorizontal(`cad-dim-side-gap-${side}-arrow-b`, x2, sideGapY, 'right'),
      )
      labels.push({
        id: `cad-dim-side-gap-${side}-label`,
        x: mid,
        y: sideGapY - 8,
        text: `min: ${CAD_PROVISIONAL_SIDE_GAP_MM.min}mm / max: ${CAD_PROVISIONAL_SIDE_GAP_MM.max}mm`,
        anchor: 'middle',
        size: 11,
        fill: DIM.color,
        weight: 600,
      })
    }
  }

  // --- Centre meeting gap (double leaf) ---
  if (leafCount >= 2) {
    const centerX = bounds.frameX + bounds.frameWidth / 2
    const gapHalfPx = 5
    const gapY = gateTop + bounds.frameHeight * 0.42
    primitives.push(
      {
        kind: 'line',
        id: 'cad-dim-center-gap-line',
        x1: centerX - gapHalfPx,
        y1: gapY,
        x2: centerX + gapHalfPx,
        y2: gapY,
        stroke: DIM.color,
        strokeWidth: DIM.strokeWidth,
        strokeLinecap: 'square',
      },
      arrowHorizontal('cad-dim-center-gap-arrow-a', centerX - gapHalfPx, gapY, 'left'),
      arrowHorizontal('cad-dim-center-gap-arrow-b', centerX + gapHalfPx, gapY, 'right'),
    )
    labels.push({
      id: 'cad-dim-center-gap-label',
      x: centerX,
      y: gapY - 10,
      text: `${CAD_PROVISIONAL_CENTER_GAP_MM}`,
      anchor: 'middle',
      size: 12,
      fill: DIM.color,
      weight: 700,
    })
  }

  labels.push({
    id: 'cad-dim-unit-hint',
    x: gateRight,
    y: widthY + (showPosts ? 56 : 20),
    text: 'mm',
    anchor: 'end',
    size: 12,
    fill: CAD_COLORS.inkMuted,
    weight: 500,
  })

  return { primitives, labels, notes }
}
