/**
 * Tracked + cantilever sliding mesh (Phase 3B).
 * Leaf fills clear opening × height (Phase 1 envelope). Victorian / composite /
 * arched / dog_bars match Design CAD language. Tail never enters the opening.
 */

import { getCantileverTailMm } from '../rules/cantilever'
import type { GateConfig } from '../types'
import { scaleVisualBoldness } from '../visual-scale'
import type { GateMeshBox, GateMeshCylinder } from './types'

const FRAME_DEPTH_MM = scaleVisualBoldness(45)
const POST_WIDTH_MM = scaleVisualBoldness(90)
const ARCH_SHOULDER_DROP_MM = 90
const ARCH_SEGMENT_COUNT = 7
const DOG_RAIL_FROM_TOP = 0.7

/** Default Victorian rail ratios (0 = top of opening, 1 = bottom). */
const SLIDING_RAILS = {
  upperMid: 0.14,
  spearBand: 0.5,
  lowerMid: 0.66,
  bottom: 0.96,
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function hasOption(config: GateConfig, key: string): boolean {
  return config.options.some((option) => option.key === key && option.enabled)
}

function meshYFromTopRatio(ratioFromTop: number, leafHeightMm: number): number {
  return leafHeightMm * (1 - clamp(ratioFromTop, 0, 1))
}

function archTopYMm(t: number, leafHeightMm: number): number {
  const drop = Math.min(ARCH_SHOULDER_DROP_MM, leafHeightMm * 0.1)
  const crest = leafHeightMm
  const shoulder = leafHeightMm - drop
  const u = clamp(t, 0, 1)
  const mid = 1 - (2 * u - 1) ** 2
  return shoulder + (crest - shoulder) * mid
}

function postWidthMm(config: GateConfig): number {
  if (!config.posts.enabled || config.posts.material === 'none') return 0
  if (config.posts.material === 'brick' || config.posts.material === 'stone') {
    return POST_WIDTH_MM * 1.15
  }
  return POST_WIDTH_MM
}

function pushCompositeLeaf(
  boxes: GateMeshBox[],
  args: {
    idPrefix: string
    centerX: number
    widthMm: number
    heightMm: number
    /** Tracked CAD uses horizontal cladding; swing uses vertical. */
    orientation: 'horizontal' | 'vertical'
  },
): void {
  const { idPrefix, centerX, widthMm, heightMm, orientation } = args
  const centerY = heightMm / 2
  const left = centerX - widthMm / 2

  boxes.push({
    kind: 'box',
    id: `${idPrefix}-rail-mid`,
    widthMm: widthMm - 16,
    heightMm: scaleVisualBoldness(8),
    depthMm: FRAME_DEPTH_MM * 0.7,
    positionMm: [centerX, heightMm * 0.5, 0],
    role: 'rail',
  })

  if (orientation === 'vertical') {
    const boardCount = clamp(Math.round(widthMm / 95), 6, 16)
    const boardWidth = (widthMm - 20) / boardCount
    for (let board = 0; board < boardCount; board += 1) {
      boxes.push({
        kind: 'box',
        id: `${idPrefix}-board-${board + 1}`,
        widthMm: Math.max(8, boardWidth - 4),
        heightMm: heightMm - 28,
        depthMm: FRAME_DEPTH_MM * 0.55,
        positionMm: [left + 10 + boardWidth * (board + 0.5), centerY, FRAME_DEPTH_MM * 0.08],
        role: 'bar',
      })
    }
    return
  }

  const boardCount = clamp(Math.round(heightMm / 140), 5, 12)
  const boardHeight = (heightMm - 28) / boardCount
  for (let board = 0; board < boardCount; board += 1) {
    boxes.push({
      kind: 'box',
      id: `${idPrefix}-board-${board + 1}`,
      widthMm: widthMm - 20,
      heightMm: Math.max(8, boardHeight - 4),
      depthMm: FRAME_DEPTH_MM * 0.55,
      positionMm: [centerX, 14 + boardHeight * (board + 0.5), FRAME_DEPTH_MM * 0.08],
      role: 'bar',
    })
  }
}

function pushVictorianSlidingLeaf(
  boxes: GateMeshBox[],
  cylinders: GateMeshCylinder[],
  args: {
    idPrefix: string
    centerX: number
    widthMm: number
    heightMm: number
    archedTop: boolean
    dogBars: boolean
    tubeRadius: number
  },
): void {
  const { idPrefix, centerX, widthMm, heightMm, archedTop, dogBars, tubeRadius } = args
  const left = centerX - widthMm / 2
  const picketCount = clamp(Math.round(widthMm / 100), 10, 28)
  const dogBarCount = dogBars ? clamp(Math.round(widthMm / 70), 8, 28) : 0

  if (archedTop) {
    const usable = widthMm - 16
    const segmentWidth = usable / ARCH_SEGMENT_COUNT
    for (let i = 0; i < ARCH_SEGMENT_COUNT; i += 1) {
      const tMid = (i + 0.5) / ARCH_SEGMENT_COUNT
      boxes.push({
        kind: 'box',
        id: `${idPrefix}-arch-seg-${i + 1}`,
        widthMm: segmentWidth * 0.92,
        heightMm: scaleVisualBoldness(10),
        depthMm: FRAME_DEPTH_MM * 0.7,
        positionMm: [
          left + 8 + segmentWidth * (i + 0.5),
          archTopYMm(tMid, heightMm) - 6,
          0,
        ],
        role: 'rail',
      })
    }
  }

  const railSpecs = [
    ...(archedTop ? [] : [{ id: `${idPrefix}-rail-upper`, ratio: SLIDING_RAILS.upperMid }]),
    { id: `${idPrefix}-rail-mid`, ratio: SLIDING_RAILS.spearBand },
    { id: `${idPrefix}-rail-lower`, ratio: SLIDING_RAILS.lowerMid },
    { id: `${idPrefix}-rail-bottom`, ratio: SLIDING_RAILS.bottom },
  ]

  for (const rail of railSpecs) {
    boxes.push({
      kind: 'box',
      id: rail.id,
      widthMm: widthMm - 8,
      heightMm: scaleVisualBoldness(rail.ratio === SLIDING_RAILS.bottom ? 14 : 8),
      depthMm: FRAME_DEPTH_MM * 0.65,
      positionMm: [centerX, meshYFromTopRatio(rail.ratio, heightMm), 0],
      role: 'rail',
    })
  }

  if (dogBars) {
    boxes.push({
      kind: 'box',
      id: `${idPrefix}-dog-rail`,
      widthMm: widthMm - 8,
      heightMm: scaleVisualBoldness(8),
      depthMm: FRAME_DEPTH_MM * 0.65,
      positionMm: [centerX, meshYFromTopRatio(DOG_RAIL_FROM_TOP, heightMm), 0],
      role: 'rail',
    })
  }

  const picketBottomY = dogBars
    ? meshYFromTopRatio(DOG_RAIL_FROM_TOP, heightMm) + 4
    : meshYFromTopRatio(SLIDING_RAILS.spearBand, heightMm)

  for (let i = 0; i < picketCount; i += 1) {
    const t = (i + 0.5) / picketCount
    const x = left + widthMm * t
    const topY = archedTop
      ? archTopYMm(t, heightMm) - 14
      : meshYFromTopRatio(SLIDING_RAILS.upperMid + 0.02, heightMm)
    const height = Math.max(40, topY - picketBottomY)
    cylinders.push({
      kind: 'cylinder',
      id: `${idPrefix}-picket-${i}`,
      radiusMm: tubeRadius,
      heightMm: height,
      positionMm: [x, picketBottomY + height / 2, 0],
      role: 'bar',
    })
  }

  if (dogBars && dogBarCount > 0) {
    const dogTopY = meshYFromTopRatio(DOG_RAIL_FROM_TOP, heightMm) - 4
    const dogBottomY = meshYFromTopRatio(SLIDING_RAILS.bottom, heightMm) + 4
    const dogHeight = Math.max(30, dogTopY - dogBottomY)
    for (let i = 0; i < dogBarCount; i += 1) {
      const t = (i + 0.5) / dogBarCount
      cylinders.push({
        kind: 'cylinder',
        id: `${idPrefix}-dog-bar-${i}`,
        radiusMm: tubeRadius * 0.85,
        heightMm: dogHeight,
        positionMm: [left + widthMm * t, dogBottomY + dogHeight / 2, 0],
        role: 'bar',
      })
    }
  } else {
    const lowerCount = clamp(Math.round(widthMm / 90), 12, 28)
    const lowerTopY = meshYFromTopRatio(SLIDING_RAILS.lowerMid, heightMm)
    const lowerBottomY = meshYFromTopRatio(SLIDING_RAILS.bottom, heightMm)
    const lowerHeight = Math.max(40, lowerTopY - lowerBottomY)
    for (let i = 0; i < lowerCount; i += 1) {
      const t = (i + 0.5) / lowerCount
      cylinders.push({
        kind: 'cylinder',
        id: `${idPrefix}-picket-lower-${i}`,
        radiusMm: tubeRadius * 0.92,
        heightMm: lowerHeight,
        positionMm: [left + widthMm * t, lowerBottomY + lowerHeight / 2, 0],
        role: 'bar',
      })
    }
  }
}

function pushCantileverTail(
  boxes: GateMeshBox[],
  args: {
    halfSpan: number
    postWidth: number
    tailWidth: number
    heightMm: number
  },
): void {
  const { halfSpan, postWidth, tailWidth, heightMm } = args
  const tailStartX = halfSpan + postWidth * 0.65 + postWidth / 2
  const tailCenterX = tailStartX + tailWidth / 2
  const centerY = heightMm / 2

  // Mass of counterbalance (excluded from opening envelope).
  boxes.push({
    kind: 'box',
    id: 'counterbalance-tail',
    widthMm: tailWidth,
    heightMm: heightMm * 0.35,
    depthMm: FRAME_DEPTH_MM * 0.85,
    positionMm: [tailCenterX, heightMm * 0.2, 0],
    role: 'counterweight',
  })

  // Vertical stile at parking post exit.
  boxes.push({
    kind: 'box',
    id: 'cantilever-tail-vertical',
    widthMm: scaleVisualBoldness(12),
    heightMm: heightMm - 20,
    depthMm: FRAME_DEPTH_MM * 0.7,
    positionMm: [tailStartX + 6, centerY, 0],
    role: 'counterweight',
  })

  // Stepped diagonal brace (schematic triangle language from CAD — no mesh rotation API).
  const steps = 5
  for (let i = 0; i < steps; i += 1) {
    const t = (i + 0.5) / steps
    boxes.push({
      kind: 'box',
      id: i === 2 ? 'cantilever-tail-diag' : `cantilever-tail-brace-${i + 1}`,
      widthMm: tailWidth / steps,
      heightMm: scaleVisualBoldness(10),
      depthMm: FRAME_DEPTH_MM * 0.5,
      positionMm: [
        tailStartX + tailWidth * t,
        heightMm * (0.85 - t * 0.7),
        0,
      ],
      role: 'counterweight',
    })
  }

  // Bottom structural rail through tail (not under clear opening).
  boxes.push({
    kind: 'box',
    id: 'cantilever-tail-bottom-rail',
    widthMm: tailWidth + 24,
    heightMm: scaleVisualBoldness(16),
    depthMm: FRAME_DEPTH_MM * 0.8,
    positionMm: [tailCenterX, 20, 0],
    role: 'counterweight',
  })
}

/**
 * Build tracked / cantilever sliding members. Telescopic + radius stay in mesh/index.ts.
 */
export function buildTrackedOrCantileverMesh(
  config: GateConfig,
  mountingPosts: GateMeshBox[],
): { boxes: GateMeshBox[]; cylinders: GateMeshCylinder[] } {
  const isCantilever = config.gateType === 'cantilever_sliding'
  const isTracked = config.gateType === 'tracked_sliding'
  const halfSpan = config.widthMm / 2
  const panelWidth = config.widthMm
  const panelHeight = config.heightMm
  const panelCenterY = panelHeight / 2
  const isComposite = config.style === 'composite_boards'
  const archedTop = hasOption(config, 'arched_top') && !isComposite
  const dogBars = hasOption(config, 'dog_bars') && !isComposite
  const tubeRadius = scaleVisualBoldness(20) / 2
  const boxes: GateMeshBox[] = [...mountingPosts]
  const cylinders: GateMeshCylinder[] = []

  // Opening leaf — full clear opening (CA-08 / photo-locked CAD).
  boxes.push({
    kind: 'box',
    id: 'sliding-panel',
    widthMm: panelWidth,
    heightMm: panelHeight,
    depthMm: FRAME_DEPTH_MM * (isComposite ? 0.55 : 0.75),
    positionMm: [0, panelCenterY, 0],
    role: isComposite ? 'panel' : 'frame',
  })

  if (isComposite) {
    pushCompositeLeaf(boxes, {
      idPrefix: isCantilever ? 'cantilever-leaf' : 'tracked-leaf',
      centerX: 0,
      widthMm: panelWidth,
      heightMm: panelHeight,
      orientation: 'horizontal',
    })
  } else {
    pushVictorianSlidingLeaf(boxes, cylinders, {
      idPrefix: isCantilever ? 'cantilever-leaf' : 'tracked-leaf',
      centerX: 0,
      widthMm: panelWidth,
      heightMm: panelHeight,
      archedTop,
      dogBars,
      tubeRadius,
    })
  }

  // Heavy bottom box under leaf (rack / wheel rail cue).
  boxes.push({
    kind: 'box',
    id: isCantilever ? 'cantilever-leaf-bottom-box' : 'tracked-leaf-bottom-box',
    widthMm: panelWidth - 8,
    heightMm: scaleVisualBoldness(16),
    depthMm: FRAME_DEPTH_MM * 0.9,
    positionMm: [0, 18, 0],
    role: 'rail',
  })

  if (isTracked) {
    // Ground track across clear opening only (tracked differentiator vs cantilever).
    boxes.push({
      kind: 'box',
      id: 'sliding-track',
      widthMm: config.widthMm,
      heightMm: 20,
      depthMm: FRAME_DEPTH_MM * 1.1,
      positionMm: [0, 8, FRAME_DEPTH_MM * 0.15],
      role: 'rail',
    })

    // Schematic runback beyond parking post (outside envelope).
    const pw = postWidthMm(config)
    const runbackW = Math.min(400, Math.round(config.widthMm * 0.14))
    const runbackCenterX = halfSpan + pw * 0.65 + pw + runbackW / 2
    boxes.push({
      kind: 'box',
      id: 'tracked-runback-zone',
      widthMm: runbackW,
      heightMm: panelHeight * 0.85,
      depthMm: FRAME_DEPTH_MM * 0.4,
      positionMm: [runbackCenterX, panelCenterY, -FRAME_DEPTH_MM * 0.2],
      role: 'rail',
    })
  }

  if (isCantilever) {
    // No ground track under the driveway opening (CA-05 / audit CONFLICT fix).
    pushCantileverTail(boxes, {
      halfSpan,
      postWidth: postWidthMm(config),
      tailWidth: getCantileverTailMm(config.widthMm),
      heightMm: panelHeight,
    })
  }

  if (!config.motorised) {
    boxes.push({
      kind: 'box',
      id: 'manual-handle-plate',
      widthMm: 14,
      heightMm: 56,
      depthMm: FRAME_DEPTH_MM * 0.4,
      positionMm: [halfSpan - 36, panelHeight * 0.5, FRAME_DEPTH_MM * 0.55],
      role: 'rail',
    })
    cylinders.push({
      kind: 'cylinder',
      id: 'manual-handle-grip',
      radiusMm: 5,
      heightMm: 36,
      positionMm: [halfSpan - 36, panelHeight * 0.5, FRAME_DEPTH_MM * 0.75],
      role: 'rail',
    })
  }

  return { boxes, cylinders }
}
