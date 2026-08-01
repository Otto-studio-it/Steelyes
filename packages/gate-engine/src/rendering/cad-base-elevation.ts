/**
 * CAD base elevations — photo-guided topology (docs/frontend/2d-masters).
 *
 * Style contract (foto-intake CAD screenshot):
 * - Orthographic front elevation, white paper, black ink
 * - Brick/hatch posts, solid ground bar
 * - No baked sample millimetre labels in the gate geometry
 *   (live dims stay on the separate cad-dimensions layer)
 *
 * Linea guida convention in source photos:
 * - red = moving gate leaf/panel
 * - cyan = posts / track / motor / technical fixed parts
 */

import type { GateConfig } from '../types'
import { clamp, getLeafCount, hasOption, isSlidingGate } from '../internal/shared'
import { getCantileverTailRatio } from '../rules/cantilever'
import { getRadiusLeafCount } from '../rules/radius'
import { getTelescopicPanelCount, TELESCOPIC_LEAF_TAIL_MM } from '../rules/telescopic'
import { getBifoldPanelsPerLeaf, isBifoldGate } from '../rules/bifold'
import { SHIP_PICKET_SPACING_MM } from '../rules/ship-defaults'
import type { GateRenderPrimitive } from './render-plan'
import { CAD_COLORS, CAD_POST_LAYOUT, CAD_STROKES } from './cad-style'

export type CadBaseFrame = {
  frameX: number
  frameY: number
  frameWidth: number
  frameHeight: number
}

const INK = CAD_COLORS.ink
const FRAME = CAD_STROKES.gateFrame
const MEMBER = CAD_STROKES.gateMember
const HW = CAD_STROKES.hardware

function pushRect(
  out: GateRenderPrimitive[],
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  strokeWidth = FRAME,
): void {
  out.push({
    kind: 'rect',
    id,
    x,
    y,
    width: w,
    height: h,
    rx: 0,
    fill: 'none',
    stroke: INK,
    strokeWidth,
  })
}

function pushLine(
  out: GateRenderPrimitive[],
  id: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  strokeWidth = MEMBER,
): void {
  out.push({
    kind: 'line',
    id,
    x1,
    y1,
    x2,
    y2,
    stroke: INK,
    strokeWidth,
    strokeLinecap: 'square',
  })
}

/** Posts are drawn by buildCadMountingPosts in buildGateRenderPlan (clearance-aware). */

function pushVictorianLeaf(
  out: GateRenderPrimitive[],
  args: {
    idPrefix: string
    x: number
    y: number
    width: number
    height: number
    picketCount: number
    middleBar: boolean
    archedTop: boolean
    /** Swan-neck peak toward hinge side (double-swing driveway language). */
    archSide?: 'left' | 'right' | 'center'
    dogBars?: boolean
    dogBarCount?: number
  },
): void {
  const {
    idPrefix,
    x,
    y,
    width,
    height,
    picketCount,
    middleBar,
    archedTop,
    archSide = 'center',
    dogBars = false,
    dogBarCount = 0,
  } = args
  const inset = 6
  const topRailY = archedTop ? y + 30 : y + 14
  const bottomRailY = y + height - 14
  const midRailY = y + height * 0.48
  const dogRailY = y + height * 0.7

  pushRect(out, `${idPrefix}-frame`, x, y, width, height, FRAME)

  if (archedTop) {
    // Swan-neck: hinge side high, meeting stile lower — classic UK double-swing CAD.
    let d: string
    if (archSide === 'left') {
      d = `M ${x + inset} ${y + 6} Q ${x + width * 0.38} ${y - 26}, ${x + width - inset} ${y + 34}`
    } else if (archSide === 'right') {
      d = `M ${x + inset} ${y + 34} Q ${x + width * 0.62} ${y - 26}, ${x + width - inset} ${y + 6}`
    } else {
      d = `M ${x + inset} ${y + 28} Q ${x + width / 2} ${y - 22}, ${x + width - inset} ${y + 28}`
    }
    out.push({
      kind: 'path',
      id: `${idPrefix}-arch`,
      d,
      fill: 'none',
      stroke: INK,
      strokeWidth: MEMBER + 0.4,
      strokeLinecap: 'square',
    })
    // Inner arch rail for professional double-line top
    const inner =
      archSide === 'left'
        ? `M ${x + inset + 4} ${y + 16} Q ${x + width * 0.38} ${y - 10}, ${x + width - inset - 4} ${y + 40}`
        : archSide === 'right'
          ? `M ${x + inset + 4} ${y + 40} Q ${x + width * 0.62} ${y - 10}, ${x + width - inset - 4} ${y + 16}`
          : `M ${x + inset + 4} ${y + 36} Q ${x + width / 2} ${y - 6}, ${x + width - inset - 4} ${y + 36}`
    out.push({
      kind: 'path',
      id: `${idPrefix}-arch-inner`,
      d: inner,
      fill: 'none',
      stroke: INK,
      strokeWidth: MEMBER * 0.85,
      strokeLinecap: 'square',
    })
  } else {
    pushLine(out, `${idPrefix}-top-rail`, x + inset, topRailY, x + width - inset, topRailY)
  }

  pushLine(out, `${idPrefix}-bottom-rail`, x + inset, bottomRailY, x + width - inset, bottomRailY)

  if (middleBar) {
    pushLine(out, `${idPrefix}-mid-rail`, x + inset, midRailY, x + width - inset, midRailY)
  }

  if (dogBars) {
    pushLine(out, `${idPrefix}-dog-rail`, x + inset, dogRailY, x + width - inset, dogRailY, FRAME)
  }

  const span = width - inset * 2
  const picketBottom = dogBars ? dogRailY - 2 : bottomRailY - 4
  const picketTop = archedTop ? topRailY + 4 : topRailY + 8

  for (let i = 0; i < picketCount; i += 1) {
    const px = x + inset + (span * (i + 0.5)) / picketCount
    pushLine(out, `${idPrefix}-picket-${i}`, px, picketTop, px, picketBottom, MEMBER)
  }

  if (dogBars && dogBarCount > 0) {
    const count = clamp(dogBarCount, 4, 22)
    for (let i = 0; i < count; i += 1) {
      const px = x + inset + (span * (i + 0.5)) / count
      pushLine(out, `${idPrefix}-dog-${i}`, px, dogRailY + 2, px, bottomRailY - 2, MEMBER)
    }
  }
}

function pushCompositeLeaf(
  out: GateRenderPrimitive[],
  args: {
    idPrefix: string
    x: number
    y: number
    width: number
    height: number
    bayCount: number
    /** Swing photo language = vertical boards; sliding CAD = horizontal cladding. */
    boardOrientation?: 'horizontal' | 'vertical'
  },
): void {
  const { idPrefix, x, y, width, height, bayCount, boardOrientation = 'horizontal' } = args
  const inset = 8
  pushRect(out, `${idPrefix}-frame`, x, y, width, height, FRAME)
  pushLine(out, `${idPrefix}-top-rail`, x + inset, y + 12, x + width - inset, y + 12)
  pushLine(out, `${idPrefix}-bottom-rail`, x + inset, y + height - 12, x + width - inset, y + height - 12)
  pushLine(out, `${idPrefix}-mid-rail`, x + inset, y + height * 0.5, x + width - inset, y + height * 0.5)

  for (let bay = 1; bay < bayCount; bay += 1) {
    const bx = x + (width * bay) / bayCount
    pushLine(out, `${idPrefix}-mullion-${bay}`, bx, y + 8, bx, y + height - 8)
  }

  if (boardOrientation === 'vertical') {
    const boardCount = clamp(Math.round(width / 18), 8, 20)
    for (let i = 1; i < boardCount; i += 1) {
      const bx = x + (width * i) / boardCount
      pushLine(out, `${idPrefix}-board-${i}`, bx, y + 14, bx, y + height - 14, MEMBER * 0.8)
    }
  } else {
    const boardCount = clamp(Math.round(height / 28), 6, 14)
    for (let i = 1; i < boardCount; i += 1) {
      const by = y + (height * i) / boardCount
      pushLine(out, `${idPrefix}-board-${i}`, x + inset, by, x + width - inset, by, MEMBER * 0.85)
    }
  }
}

function pushHinges(
  out: GateRenderPrimitive[],
  leafX: number,
  leafY: number,
  leafHeight: number,
  side: 'left' | 'right',
): void {
  const hx = side === 'left' ? leafX - 2 : leafX
  for (const [i, ratio] of [
    [0, 0.12],
    [1, 0.88],
  ] as const) {
    const hy = leafY + leafHeight * ratio
    pushRect(out, `hinge-${side}-${i}`, hx - (side === 'left' ? 8 : 0), hy - 6, 10, 12, HW)
  }
}

function pushManualHandle(
  out: GateRenderPrimitive[],
  x: number,
  midY: number,
): void {
  pushRect(out, 'manual-handle-plate', x - 7, midY - 28, 14, 56, HW)
  pushLine(out, 'manual-handle-grip', x, midY - 18, x, midY + 18, HW)
}

function buildSwingCadBase(config: GateConfig, frame: CadBaseFrame): GateRenderPrimitive[] {
  const out: GateRenderPrimitive[] = []
  const leafCount = getLeafCount(config.gateType)
  const gap = leafCount > 1 ? 8 : 0
  const leafWidth = (frame.frameWidth - gap) / leafCount
  const picketCount = clamp(
    Math.round((config.widthMm / leafCount) / SHIP_PICKET_SPACING_MM),
    5,
    18,
  )
  const arched = hasOption(config, 'arched_top')
  const dogBars = hasOption(config, 'dog_bars')
  const dogBarCount = dogBars
    ? clamp(Math.round((config.widthMm / leafCount) / 55), 6, 16)
    : 0
  const middleBar = true
  const composite = config.style === 'composite_boards'
  const bifold = isBifoldGate(config.gateType)
  const panelsPerLeaf = bifold ? getBifoldPanelsPerLeaf(config.gateType) : 1

  for (let leaf = 0; leaf < leafCount; leaf += 1) {
    const x = frame.frameX + leaf * (leafWidth + gap)
    const idPrefix = `leaf-${leaf + 1}`
    const archSide: 'left' | 'right' | 'center' =
      leafCount === 1 ? 'center' : leaf === 0 ? 'left' : 'right'

    if (composite) {
      pushCompositeLeaf(out, {
        idPrefix,
        x,
        y: frame.frameY,
        width: leafWidth,
        height: frame.frameHeight,
        bayCount: bifold ? panelsPerLeaf : 1,
        boardOrientation: 'vertical',
      })
    } else {
      pushVictorianLeaf(out, {
        idPrefix,
        x,
        y: frame.frameY,
        width: leafWidth,
        height: frame.frameHeight,
        picketCount,
        middleBar,
        archedTop: arched,
        archSide: arched ? archSide : 'center',
        dogBars,
        dogBarCount,
      })
    }

    if (bifold && panelsPerLeaf >= 2) {
      // 50/50 fold stile (CA-09/10) — solid stile + hinge ticks so it reads as a real panel joint
      const foldX = x + leafWidth * 0.5
      pushLine(out, `bifold-fold-stile-${leaf + 1}`, foldX, frame.frameY + 8, foldX, frame.frameY + frame.frameHeight - 8, FRAME)
      for (const [hi, ratio] of [
        [0, 0.18],
        [1, 0.82],
      ] as const) {
        pushRect(
          out,
          `bifold-fold-hinge-${leaf + 1}-${hi}`,
          foldX - 5,
          frame.frameY + frame.frameHeight * ratio - 5,
          10,
          10,
          HW,
        )
      }
    }

    pushHinges(out, leaf === 0 ? x : x + leafWidth, frame.frameY, frame.frameHeight, leaf === 0 ? 'left' : 'right')
  }

  if (leafCount > 1) {
    const centerX = frame.frameX + frame.frameWidth / 2
    pushRect(out, 'center-latch-plate', centerX - 10, frame.frameY + frame.frameHeight * 0.35, 20, frame.frameHeight * 0.3, HW)
  }

  if (!config.motorised) {
    const handleX =
      leafCount > 1
        ? frame.frameX + frame.frameWidth / 2 - 28
        : frame.frameX + frame.frameWidth - 36
    pushManualHandle(out, handleX, frame.frameY + frame.frameHeight * 0.5)
  }

  if (bifold) {
    // Stack pack (~100 mm) OUTSIDE beyond hinge-side post — open footprint cue, not a gap in the opening.
    // Preview default = hinge-left (CA-10); real L/R chosen at quote.
    const packW = 14
    const leftOuter =
      frame.frameX - CAD_POST_LAYOUT.gapFromGatePx - CAD_POST_LAYOUT.widthPx - packW - 6
    out.push({
      kind: 'rect',
      id: 'bifold-stack-left',
      x: leftOuter,
      y: frame.frameY + frame.frameHeight * 0.22,
      width: packW,
      height: frame.frameHeight * 0.56,
      rx: 0,
      fill: 'none',
      stroke: INK,
      strokeWidth: MEMBER,
      strokeDasharray: '4 4',
      opacity: 0.7,
    })
    // Double bifold only: matching stack on the right hinge post
    if (leafCount === 2) {
      const rightOuter =
        frame.frameX + frame.frameWidth + CAD_POST_LAYOUT.gapFromGatePx + CAD_POST_LAYOUT.widthPx + 6
      out.push({
        kind: 'rect',
        id: 'bifold-stack-right',
        x: rightOuter,
        y: frame.frameY + frame.frameHeight * 0.22,
        width: packW,
        height: frame.frameHeight * 0.56,
        rx: 0,
        fill: 'none',
        stroke: INK,
        strokeWidth: MEMBER,
        strokeDasharray: '4 4',
        opacity: 0.7,
      })
    }
  }

  // Single bifold: latch/receiver on the free post (opposite hinge) — linea guida language
  if (bifold && leafCount === 1) {
    const rightPostInner = frame.frameX + frame.frameWidth + CAD_POST_LAYOUT.gapFromGatePx
    pushRect(
      out,
      'bifold-receiver-slot',
      rightPostInner - 2,
      frame.frameY + frame.frameHeight * 0.28,
      8,
      frame.frameHeight * 0.4,
      HW,
    )
    pushRect(
      out,
      'bifold-leading-bumper',
      frame.frameX + frame.frameWidth - 6,
      frame.frameY + 12,
      5,
      frame.frameHeight - 24,
      HW,
    )
  }

  // Ground clearance cue under leaf (intake 50 mm — schematic)
  pushLine(
    out,
    'swing-ground-clearance',
    frame.frameX + 24,
    frame.frameY + frame.frameHeight + 12,
    frame.frameX + frame.frameWidth - 24,
    frame.frameY + frame.frameHeight + 12,
    MEMBER,
  )

  return out
}

function buildSlidingCadBase(config: GateConfig, frame: CadBaseFrame): GateRenderPrimitive[] {
  const out: GateRenderPrimitive[] = []
  const isCantilever = config.gateType === 'cantilever_sliding'
  const isTelescopic = config.gateType === 'telescopic_sliding'
  const isRadius = config.gateType === 'radius_sliding'
  const isTracked = config.gateType === 'tracked_sliding'
  const composite = config.style === 'composite_boards'
  const trackY = frame.frameY + frame.frameHeight + 10

  /**
   * Cantilever (photo-locked from `foto /steel cantilever sliding gate`):
   * - Clear opening between posts = LEAF only (100% of frame).
   * - Triangular counterbalance sits AFTER the parking/guide post — never inside the opening.
   * - No ground track across the driveway opening.
   */
  if (isCantilever) {
    return buildCantileverCadBase(config, frame, composite)
  }

  /**
   * Tracked (photo-locked from `foto /traked sliding steel gate`):
   * - Closed elevation: leaf spans post-to-post with no misleading empty gap in the opening.
   * - Ground track under the clear opening.
   * - Runback / parking stack drawn OUTSIDE beyond the parking-side post (schematic).
   */
  if (isTracked) {
    return buildTrackedCadBase(config, frame, composite)
  }

  /**
   * Telescopic (photo-locked from `foto /telescopic slidings gates`):
   * - LOCKED = 3 overlapping panels (CA-11); 2-leaf Combiarialdo = VARIANT.
   * - Closed: leaves longer than opening/n so overlaps read; depth stagger + plan cue.
   * - N parallel ground tracks; front face = motor-side leaf; stack ~1/n outside parking post.
   */
  if (isTelescopic) {
    return buildTelescopicCadBase(config, frame, composite)
  }

  /**
   * Radius / round-the-corner (photo-locked from `foto /radius slidings gates`):
   * - LOCKED = articulated panel train on a single curved track (CA-12 path always curved).
   * - NOT telescopic overlap — panels hinge end-to-end and park ~90° beside the wall.
   * - When arched_top: every panel crest is curved.
   */
  if (isRadius) {
    return buildRadiusCadBase(config, frame, composite)
  }

  // Fallback (should not hit — all sliding types handled above).
  pushLine(out, 'track-line', frame.frameX + 16, trackY, frame.frameX + frame.frameWidth - 16, trackY, MEMBER + 1)
  return out
}

/**
 * Radius sliding — photo-locked closed elevation + plan path cue.
 * Source: `foto /radius slidings gates` (linea guida + product renders).
 * Note: `Screenshot … 20.13.46.png` is a telescopic misfile — ignore for topology.
 */
function buildRadiusCadBase(
  config: GateConfig,
  frame: CadBaseFrame,
  composite: boolean,
): GateRenderPrimitive[] {
  const out: GateRenderPrimitive[] = []
  const openingW = frame.frameWidth
  const panelX = frame.frameX
  const panelY = frame.frameY
  const panelH = frame.frameHeight
  const trackY = panelY + panelH + 10
  const leafCount = getRadiusLeafCount(config.widthMm)
  const leafW = openingW / leafCount
  const archedTop = hasOption(config, 'arched_top') && !composite
  const dogBars = hasOption(config, 'dog_bars') && !composite
  const dogBarCount = dogBars ? clamp(Math.round(config.widthMm / leafCount / 70), 4, 12) : 0
  const picketsPerLeaf = clamp(Math.round(config.widthMm / leafCount / SHIP_PICKET_SPACING_MM), 3, 10)

  // Curved ground track under clear opening (CA-12 differentiator vs straight tracked).
  out.push({
    kind: 'path',
    id: 'track-line',
    d: `M ${panelX + 8} ${trackY + 2} Q ${panelX + openingW * 0.55} ${trackY + 28}, ${panelX + openingW - 4} ${trackY + 4}`,
    fill: 'none',
    stroke: INK,
    strokeWidth: MEMBER + 1.2,
    strokeLinecap: 'round',
  })

  // Articulated panels spanning post-to-post (train, not overlap).
  for (let i = 0; i < leafCount; i += 1) {
    const x = panelX + i * leafW
    const gap = 2
    const idPrefix = `radius-leaf-${i}`
    if (composite) {
      pushCompositeLeaf(out, {
        idPrefix,
        x: x + gap,
        y: panelY,
        width: leafW - gap * 2,
        height: panelH,
        bayCount: 1,
      })
    } else {
      pushVictorianLeaf(out, {
        idPrefix,
        x: x + gap,
        y: panelY,
        width: leafW - gap * 2,
        height: panelH,
        picketCount: picketsPerLeaf,
        middleBar: true,
        archedTop,
        archSide: 'center',
        dogBars,
        dogBarCount,
      })
    }

    // Hinge stile between panels (linea guida / product renders).
    if (i > 0) {
      pushLine(out, `radius-hinge-${i}`, x, panelY + 10, x, panelY + panelH - 10, FRAME)
      // Hinge ticks (top + bottom)
      pushRect(out, `radius-hinge-tick-top-${i}`, x - 3, panelY + 16, 6, 8, HW)
      pushRect(out, `radius-hinge-tick-bot-${i}`, x - 3, panelY + panelH - 28, 6, 8, HW)
      // Wheel cue under hinge on track
      pushRect(out, `radius-wheel-${i}`, x - 4, trackY - 2, 8, 7, HW)
    }
  }

  // Receiver post (left) + corner guide post (right / curve apex).
  const leftPostInner = frame.frameX - CAD_POST_LAYOUT.gapFromGatePx
  pushRect(out, 'radius-receiver-slot', leftPostInner - 8, panelY + panelH * 0.2, 8, panelH * 0.55, HW)

  const rightPostInner = frame.frameX + frame.frameWidth + CAD_POST_LAYOUT.gapFromGatePx
  pushRect(
    out,
    'radius-guide-post',
    rightPostInner,
    panelY + 4,
    CAD_POST_LAYOUT.widthPx,
    panelH - 4,
    FRAME,
  )
  pushRect(
    out,
    'radius-upper-guide',
    rightPostInner + 6,
    panelY + 12,
    CAD_POST_LAYOUT.widthPx - 12,
    12,
    HW,
  )
  pushRect(out, 'radius-motor-pad', rightPostInner + 4, trackY + 10, Math.min(56, CAD_POST_LAYOUT.widthPx + 20), 12, HW)

  // Plan cue: track turns ~90° into park zone beside wall (outside parking post).
  const parkX = rightPostInner + CAD_POST_LAYOUT.widthPx + 10
  const parkY = trackY + 8
  out.push({
    kind: 'path',
    id: 'radius-path-cue',
    d: `M ${panelX + openingW - 8} ${trackY + 4} Q ${panelX + openingW + 36} ${trackY + 6}, ${parkX + 8} ${parkY + 36}`,
    fill: 'none',
    stroke: INK,
    strokeWidth: MEMBER,
    strokeLinecap: 'round',
  })
  // Parked panel stubs along the side wall (plan language).
  for (let i = 0; i < Math.min(3, leafCount); i += 1) {
    out.push({
      kind: 'rect',
      id: `radius-park-leaf-${i}`,
      x: parkX + 4 + i * 3,
      y: parkY + 20 + i * 14,
      width: 11,
      height: 12,
      rx: 0,
      fill: 'none',
      stroke: INK,
      strokeWidth: MEMBER,
      strokeDasharray: '4 3',
      opacity: 0.7,
    })
  }

  if (!config.motorised) {
    pushManualHandle(out, panelX + openingW - leafW / 2 - 8, panelY + panelH * 0.5)
  }

  return out
}

/**
 * Telescopic sliding — photo-locked elevation + plan cue.
 * Source: `foto /telescopic slidings gates` + user diagrams.
 *
 * - LOCKED = **3 overlapping panels** (CA-11; linea guida; industrial installs).
 * - 2-leaf Combiarialdo / L=C/2+300 = VARIANT topology, not FROM default.
 * - Closed: leaves longer than opening/n so overlaps are obvious (tail cue ~300 mm).
 * - Depth stagger + plan strip = “come si vedono dall’altro” (stacked parallel planes).
 * - N parallel ground tracks; front face = motor-side leaf; stack ~1/n outside parking post.
 */
function buildTelescopicCadBase(
  config: GateConfig,
  frame: CadBaseFrame,
  composite: boolean,
): GateRenderPrimitive[] {
  const out: GateRenderPrimitive[] = []
  const openingW = frame.frameWidth
  const panelX = frame.frameX
  const panelY = frame.frameY
  const panelH = frame.frameHeight
  const trackY = panelY + panelH + 10
  const n = getTelescopicPanelCount()
  const widthMm = Math.max(1, config.widthMm)
  // Leaf longer than opening/n (tech sheet: L = C/n + ~300) so closed overlaps read clearly.
  const leafW = openingW * (1 / n) + (TELESCOPIC_LEAF_TAIL_MM / widthMm) * openingW
  const overlapPx = n > 1 ? (n * leafW - openingW) / (n - 1) : 0
  const stepX = leafW - overlapPx
  const archedTop = hasOption(config, 'arched_top') && !composite
  const dogBars = hasOption(config, 'dog_bars') && !composite
  const dogBarCount = dogBars ? clamp(Math.round(config.widthMm / n / 70), 5, 14) : 0
  const picketsPerSeg = clamp(Math.round(config.widthMm / n / SHIP_PICKET_SPACING_MM), 3, 12)
  const depthStep = 7

  // N parallel ground tracks (one per leaf plane).
  for (let t = 0; t < n; t += 1) {
    const y = trackY + 1 + t * 5
    pushLine(out, `telescopic-track-${t}`, panelX, y, panelX + openingW, y, t === 0 ? MEMBER + 1.2 : MEMBER)
  }

  // Rear leaf first → front (motor-side) last. Depth stagger shows stacked planes.
  for (let i = n - 1; i >= 0; i -= 1) {
    const depth = i // 0 = front/motor-side lead
    const x = panelX + i * stepX + depth * 2
    const y = panelY + depth * depthStep
    const w = leafW - depth * 2
    const h = panelH - depth * depthStep
    const idPrefix = `telescopic-segment-${i}`

    // Ghost offset = depth cue (“dall’altro”) behind each rear leaf.
    if (depth > 0) {
      out.push({
        kind: 'rect',
        id: `${idPrefix}-depth-ghost`,
        x: x + 8,
        y: y + 6,
        width: w,
        height: h,
        rx: 0,
        fill: 'none',
        stroke: INK,
        strokeWidth: MEMBER * 0.75,
        strokeDasharray: '4 4',
        opacity: 0.35,
      })
    }

    if (composite) {
      pushCompositeLeaf(out, {
        idPrefix,
        x,
        y,
        width: w,
        height: h,
        bayCount: 1,
      })
    } else {
      pushVictorianLeaf(out, {
        idPrefix,
        x,
        y,
        width: w,
        height: h,
        picketCount: picketsPerSeg,
        middleBar: true,
        archedTop,
        archSide: 'center',
        dogBars,
        dogBarCount,
      })
    }

    // Explicit overlap stile — double vertical where leaves stack.
    if (i > 0) {
      const seamX = x + 4
      pushLine(out, `${idPrefix}-overlap-stile`, seamX, y + 8, seamX, y + h - 8, FRAME)
    }
  }

  // Motor-side front-face cue on lead panel (CA-11: front = motor-side).
  pushLine(out, 'telescopic-motor-side-marker', panelX + 10, panelY + 14, panelX + 10, panelY + panelH - 14, HW)

  // Receiver (latch) + guide portal on parking side (linea guida / tech 3-panel).
  const leftPostInner = frame.frameX - CAD_POST_LAYOUT.gapFromGatePx
  pushRect(out, 'telescopic-receiver-slot', leftPostInner - 8, panelY + panelH * 0.2, 8, panelH * 0.55, HW)

  const rightPostInner = frame.frameX + frame.frameWidth + CAD_POST_LAYOUT.gapFromGatePx
  // U-portal guide: two uprights + top yoke.
  pushRect(out, 'telescopic-guide-leg-a', rightPostInner - 2, panelY + 8, 6, panelH - 12, FRAME)
  pushRect(
    out,
    'telescopic-guide-leg-b',
    rightPostInner + CAD_POST_LAYOUT.widthPx - 4,
    panelY + 8,
    6,
    panelH - 12,
    MEMBER,
  )
  pushRect(
    out,
    'telescopic-guide-yoke',
    rightPostInner - 2,
    panelY + 8,
    CAD_POST_LAYOUT.widthPx + 4,
    10,
    HW,
  )
  pushRect(
    out,
    'telescopic-guide-rollers',
    rightPostInner - 2,
    panelY + panelH - 28,
    CAD_POST_LAYOUT.widthPx + 4,
    20,
    HW,
  )

  // “Space to open” / stack OUTSIDE parking post (~1/n opening for n-panel telescopic).
  const rightPostOuter = rightPostInner + CAD_POST_LAYOUT.widthPx
  const stackX = rightPostOuter + 8
  const stackW = Math.min(120, Math.round(openingW / n + 12))
  out.push({
    kind: 'rect',
    id: 'telescopic-stack-zone',
    x: stackX,
    y: panelY + 16,
    width: stackW,
    height: panelH - 32,
    rx: 0,
    fill: 'none',
    stroke: INK,
    strokeWidth: MEMBER,
    strokeDasharray: '6 5',
    opacity: 0.65,
  })
  for (let t = 0; t < n; t += 1) {
    const y = trackY + 1 + t * 5
    pushLine(out, `telescopic-stack-track-${t}`, panelX + openingW, y, stackX + stackW, y, MEMBER)
  }
  pushRect(out, 'telescopic-motor-pad', stackX + 6, trackY + 8 + n * 5, Math.min(64, stackW - 10), 12, HW)

  // Plan cue under elevation — parallel overlapping leaves (how they read from above / “dall’altro”).
  const planY = trackY + 10 + n * 5
  const planH = 7
  const planGap = 4
  for (let i = n - 1; i >= 0; i -= 1) {
    const x = panelX + i * stepX
    out.push({
      kind: 'rect',
      id: `telescopic-plan-leaf-${i}`,
      x,
      y: planY + i * (planH + planGap),
      width: leafW,
      height: planH,
      rx: 0,
      fill: 'none',
      stroke: INK,
      strokeWidth: MEMBER,
      opacity: 0.85,
    })
  }

  if (!config.motorised) {
    pushManualHandle(out, panelX + leafW - 36, panelY + panelH * 0.5)
  }

  return out
}

/**
 * Tracked elevation — closed front view from linea guida:
 * leaf fills the clear opening; track under opening; runback beyond parking post.
 */
function buildTrackedCadBase(
  config: GateConfig,
  frame: CadBaseFrame,
  composite: boolean,
): GateRenderPrimitive[] {
  const out: GateRenderPrimitive[] = []
  const panelX = frame.frameX
  const panelY = frame.frameY
  const panelW = frame.frameWidth
  const panelH = frame.frameHeight
  const trackY = panelY + panelH + 10

  const dogBars = hasOption(config, 'dog_bars')
  const dogBarCount = dogBars ? clamp(Math.round(config.widthMm / 70), 8, 28) : 0

  // Leaf = 100% clear opening (no parked-short leaf that leaves a fake gap)
  if (composite) {
    pushCompositeLeaf(out, {
      idPrefix: 'tracked-leaf',
      x: panelX,
      y: panelY,
      width: panelW,
      height: panelH,
      bayCount: 3,
      boardOrientation: 'horizontal',
    })
  } else {
    pushVictorianLeaf(out, {
      idPrefix: 'tracked-leaf',
      x: panelX,
      y: panelY,
      width: panelW,
      height: panelH,
      picketCount: clamp(Math.round(config.widthMm / SHIP_PICKET_SPACING_MM), 10, 28),
      middleBar: true,
      archedTop: hasOption(config, 'arched_top'),
      archSide: 'center',
      dogBars,
      dogBarCount,
    })
  }

  // Bottom box / wheel rail under full leaf
  pushRect(out, 'tracked-leaf-bottom-box', panelX + 4, panelY + panelH - 18, panelW - 8, 16, FRAME)

  // Ground track across the CLEAR OPENING (tracked differentiator vs cantilever)
  pushLine(out, 'tracked-ground-rail', panelX, trackY + 4, panelX + panelW, trackY + 4, MEMBER + 1.2)
  // Wheel ticks on track (schematic)
  for (let i = 0; i < 5; i += 1) {
    const wx = panelX + 24 + ((panelW - 48) * i) / 4
    pushRect(out, `tracked-wheel-${i}`, wx - 5, trackY - 2, 10, 8, HW)
  }

  // Catch / receiver cues on left post face (closed against left post)
  const leftPostInner = frame.frameX - CAD_POST_LAYOUT.gapFromGatePx
  pushRect(out, 'tracked-receiver-slot', leftPostInner - 8, panelY + panelH * 0.2, 8, panelH * 0.55, HW)

  // Guide / anti-lift on right post — does NOT eat into leaf width
  const rightPostInner = frame.frameX + frame.frameWidth + CAD_POST_LAYOUT.gapFromGatePx
  pushRect(
    out,
    'tracked-guide-rollers',
    rightPostInner - 2,
    panelY + panelH - 30,
    CAD_POST_LAYOUT.widthPx + 4,
    24,
    HW,
  )
  pushRect(
    out,
    'tracked-upper-guide',
    rightPostInner + 10,
    panelY + 12,
    CAD_POST_LAYOUT.widthPx - 20,
    12,
    HW,
  )

  // Runback / parking stack OUTSIDE beyond the right (parking) post — not inside the opening
  const rightPostOuter = rightPostInner + CAD_POST_LAYOUT.widthPx
  const runbackX = rightPostOuter + 8
  const runbackW = Math.min(110, Math.round(panelW * 0.14))
  out.push({
    kind: 'rect',
    id: 'tracked-runback-zone',
    x: runbackX,
    y: panelY + 16,
    width: runbackW,
    height: panelH - 32,
    rx: 0,
    fill: 'none',
    stroke: INK,
    strokeWidth: MEMBER,
    strokeDasharray: '6 5',
    opacity: 0.65,
  })
  // Track continues schematically into runback
  pushLine(
    out,
    'tracked-runback-rail',
    panelX + panelW,
    trackY + 4,
    runbackX + runbackW,
    trackY + 4,
    MEMBER,
  )
  pushRect(out, 'tracked-motor-pad', runbackX + 8, trackY + 10, Math.min(72, runbackW - 12), 14, HW)

  if (!config.motorised) {
    pushManualHandle(out, panelX + panelW - 36, panelY + panelH * 0.5)
  }

  return out
}

/**
 * Cantilever elevation — photo language from linea guida + industrial renders:
 * leaf spans posts; triangular tail continues past the guide/parking post.
 */
function buildCantileverCadBase(
  config: GateConfig,
  frame: CadBaseFrame,
  composite: boolean,
): GateRenderPrimitive[] {
  const out: GateRenderPrimitive[] = []
  const panelX = frame.frameX
  const panelY = frame.frameY
  const panelW = frame.frameWidth
  const panelH = frame.frameHeight
  const trackY = panelY + panelH + 10
  const tailRatio = getCantileverTailRatio(config.widthMm)
  const tailW = Math.max(72, Math.round(panelW * tailRatio))

  // Leaf fills 100% of clear opening between brick posts
  const dogBars = hasOption(config, 'dog_bars')
  const dogBarCount = dogBars ? clamp(Math.round(config.widthMm / 70), 8, 28) : 0
  if (composite) {
    pushCompositeLeaf(out, {
      idPrefix: 'cantilever-leaf',
      x: panelX,
      y: panelY,
      width: panelW,
      height: panelH,
      bayCount: 3,
      boardOrientation: 'horizontal',
    })
  } else {
    pushVictorianLeaf(out, {
      idPrefix: 'cantilever-leaf',
      x: panelX,
      y: panelY,
      width: panelW,
      height: panelH,
      picketCount: clamp(Math.round(config.widthMm / SHIP_PICKET_SPACING_MM), 10, 28),
      middleBar: true,
      archedTop: hasOption(config, 'arched_top'),
      archSide: 'center',
      dogBars,
      dogBarCount,
    })
  }

  // Heavy bottom rail / rack under the LEAF only (opening)
  pushRect(out, 'cantilever-leaf-bottom-box', panelX + 4, panelY + panelH - 18, panelW - 8, 16, FRAME)

  // Guide / carriage sits at the parking-side post (right) — gate passes through
  const rightPostInner =
    frame.frameX + frame.frameWidth + CAD_POST_LAYOUT.gapFromGatePx
  const rightPostOuter = rightPostInner + CAD_POST_LAYOUT.widthPx
  pushRect(
    out,
    'cantilever-guide-rollers',
    rightPostInner - 4,
    panelY + panelH - 28,
    CAD_POST_LAYOUT.widthPx + 8,
    22,
    HW,
  )
  // Upper guide cue on parking post
  pushRect(
    out,
    'cantilever-upper-guide',
    rightPostInner + 8,
    panelY + 10,
    CAD_POST_LAYOUT.widthPx - 16,
    14,
    HW,
  )

  // Counterbalance TAIL — after the right post (outside the clear opening)
  const tailX = rightPostOuter + 6
  const tailEnd = tailX + tailW
  const leafTrailingX = panelX + panelW

  // Continuous bottom box through post zone into triangle (structural rail)
  pushRect(
    out,
    'cantilever-tail-bottom-box',
    leafTrailingX - 2,
    panelY + panelH - 18,
    tailEnd - (leafTrailingX - 2),
    16,
    FRAME,
  )

  // Right-angle triangle: vertical at start of tail, horizontal top short stub, long diagonal
  pushLine(out, 'cantilever-tail-vertical', tailX, panelY + 6, tailX, panelY + panelH - 18, FRAME)
  pushLine(out, 'cantilever-tail-top', tailX, panelY + 6, tailX + 18, panelY + 6, MEMBER)
  pushLine(out, 'cantilever-tail-diag', tailX, panelY + 6, tailEnd, panelY + panelH - 18, FRAME)
  // Mid brace for professional triangulation (photo language)
  pushLine(
    out,
    'cantilever-tail-brace',
    tailX,
    panelY + panelH * 0.45,
    tailX + tailW * 0.42,
    panelY + panelH * 0.72,
    MEMBER,
  )

  // End post of counterbalance + ground carriage / foundation under tail (not under opening)
  pushRect(out, 'cantilever-tail-end-post', tailEnd - 10, panelY + panelH - 40, 10, 22, HW)
  pushRect(out, 'cantilever-ground-carriage', tailX - 8, trackY + 2, Math.min(tailW + 16, 160), 12, MEMBER)
  pushRect(out, 'cantilever-foundation', tailX - 12, trackY + 16, Math.min(tailW + 28, 180), 8, MEMBER)

  // Soft cue: dashed line under opening only — "no track in clear opening"
  out.push({
    kind: 'line',
    id: 'cantilever-opening-clearance',
    x1: panelX + 12,
    y1: trackY + 6,
    x2: panelX + panelW - 12,
    y2: trackY + 6,
    stroke: INK,
    strokeWidth: MEMBER,
    strokeDasharray: '5 6',
    opacity: 0.45,
  })

  if (!config.motorised) {
    pushManualHandle(out, panelX + panelW - 36, panelY + panelH * 0.5)
  }

  return out
}

/** Build CAD base elevation primitives for any gate type (no dimension labels). */
export function buildCadBaseElevation(
  config: GateConfig,
  frame: CadBaseFrame,
): GateRenderPrimitive[] {
  return isSlidingGate(config.gateType)
    ? buildSlidingCadBase(config, frame)
    : buildSwingCadBase(config, frame)
}
