import { buildGateGeometryPlan } from '../geometry'
import { getLeafCount } from '../internal/shared'
import { getBifoldPanelsPerLeaf, isBifoldGate } from '../rules/bifold'
import type { GateConfig } from '../types'
import { scaleVisualBoldness } from '../visual-scale'
import type { GateMeshBox, GateMeshCylinder } from './types'

/** Frame depth — boldness OK (cross-section only). */
const FRAME_DEPTH_MM = scaleVisualBoldness(45)

/**
 * True-mm clearances inside the clear opening. Do NOT run these through
 * scaleVisualBoldness — they shrink the AR tape envelope.
 */
const MEETING_GAP_MM = 6
const BIFOLD_GAP_MM = 10

/** Arch shoulder drop stays inside typed heightMm (CA-08 / Phase 1 envelope). */
const ARCH_SHOULDER_DROP_MM = 90
const ARCH_SEGMENT_COUNT = 7
/** Fraction down from top of leaf (CAD / SVG Y-down), dog rail band. */
const DOG_RAIL_FROM_TOP = 0.7

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function hasOption(config: GateConfig, key: string): boolean {
  return config.options.some((option) => option.key === key && option.enabled)
}

type ArchSide = 'left' | 'right' | 'center'

/**
 * Geometry rail ratios are 0 = top of opening, 1 = bottom.
 * Mesh Y is metres-up from ground: convert with (1 - ratio) * heightMm.
 */
function meshYFromTopRatio(ratioFromTop: number, leafHeightMm: number): number {
  return leafHeightMm * (1 - clamp(ratioFromTop, 0, 1))
}

/**
 * Swan-neck top Y (mm from ground). Crest = leafHeightMm (envelope top).
 * Shoulders drop by ARCH_SHOULDER_DROP_MM — never above leafHeightMm.
 */
function archTopYMm(t: number, side: ArchSide, leafHeightMm: number): number {
  const drop = Math.min(ARCH_SHOULDER_DROP_MM, leafHeightMm * 0.1)
  const crest = leafHeightMm
  const shoulder = leafHeightMm - drop
  const u = clamp(t, 0, 1)

  if (side === 'center') {
    const mid = 1 - (2 * u - 1) ** 2
    return shoulder + (crest - shoulder) * mid
  }

  if (side === 'left') {
    // Hinge (left) high → meeting (right) lower.
    return crest - drop * (u * u)
  }

  // Right leaf: meeting (left) lower → hinge (right) high.
  const v = 1 - u
  return crest - drop * (v * v)
}

function pushCompositeBoards(
  boxes: GateMeshBox[],
  args: {
    idPrefix: string
    centerX: number
    widthMm: number
    heightMm: number
    centerY: number
  },
): void {
  const { idPrefix, centerX, widthMm, heightMm, centerY } = args
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

  const boardCount = clamp(Math.round(widthMm / 95), 6, 14)
  const boardWidth = (widthMm - 20) / boardCount
  for (let board = 0; board < boardCount; board += 1) {
    const x = left + 10 + boardWidth * (board + 0.5)
    boxes.push({
      kind: 'box',
      id: `${idPrefix}-board-${board + 1}`,
      widthMm: Math.max(8, boardWidth - 4),
      heightMm: heightMm - 28,
      depthMm: FRAME_DEPTH_MM * 0.55,
      positionMm: [x, centerY, FRAME_DEPTH_MM * 0.08],
      // Inside leaf AABB — does not expand Phase 1 envelope.
      role: 'bar',
    })
  }
}

function pushArchTopRail(
  boxes: GateMeshBox[],
  args: {
    leafIndex: number
    centerX: number
    widthMm: number
    leafHeightMm: number
    archSide: ArchSide
  },
): void {
  const { leafIndex, centerX, widthMm, leafHeightMm, archSide } = args
  const left = centerX - widthMm / 2
  const usable = widthMm - 16
  const segmentWidth = usable / ARCH_SEGMENT_COUNT

  for (let i = 0; i < ARCH_SEGMENT_COUNT; i += 1) {
    const t0 = i / ARCH_SEGMENT_COUNT
    const t1 = (i + 1) / ARCH_SEGMENT_COUNT
    const tMid = (t0 + t1) / 2
    const y = archTopYMm(tMid, archSide, leafHeightMm) - 6
    const x = left + 8 + segmentWidth * (i + 0.5)
    boxes.push({
      kind: 'box',
      id: `leaf-${leafIndex + 1}-arch-seg-${i + 1}`,
      widthMm: segmentWidth * 0.92,
      heightMm: scaleVisualBoldness(10),
      depthMm: FRAME_DEPTH_MM * 0.7,
      positionMm: [x, y, 0],
      role: 'rail',
    })
  }
}

function pushManualHandle(
  boxes: GateMeshBox[],
  cylinders: GateMeshCylinder[],
  args: { xMm: number; yMm: number },
): void {
  const { xMm, yMm } = args
  // role 'rail' — excluded from opening envelope AABB (Phase 1).
  boxes.push({
    kind: 'box',
    id: 'manual-handle-plate',
    widthMm: 14,
    heightMm: 56,
    depthMm: FRAME_DEPTH_MM * 0.4,
    positionMm: [xMm, yMm, FRAME_DEPTH_MM * 0.55],
    role: 'rail',
  })
  cylinders.push({
    kind: 'cylinder',
    id: 'manual-handle-grip',
    radiusMm: 5,
    heightMm: 36,
    positionMm: [xMm, yMm, FRAME_DEPTH_MM * 0.75],
    role: 'rail',
  })
}

export function buildSwingProceduralMembers(
  config: GateConfig,
  mountingPosts: GateMeshBox[],
): { boxes: GateMeshBox[]; cylinders: GateMeshCylinder[] } {
  const geometry = buildGateGeometryPlan(config)
  const leafCount = getLeafCount(config.gateType)
  const halfSpan = config.widthMm / 2
  const bayWidth = config.widthMm / leafCount
  const boxes: GateMeshBox[] = [...mountingPosts]
  const cylinders: GateMeshCylinder[] = []
  const isComposite = config.style === 'composite_boards'
  const archedTop =
    Boolean(geometry?.features.archedTop) || (hasOption(config, 'arched_top') && !isComposite)
  const dogBars = hasOption(config, 'dog_bars') && !isComposite

  const tubeRadius = geometry ? geometry.tubeProfile.outer / 2 : scaleVisualBoldness(20) / 2
  const leafHeightMm = config.heightMm
  const leafCenterY = leafHeightMm / 2
  const rails = geometry?.rails ?? {
    top: 0,
    upperMid: 0.14,
    spearBand: 0.62,
    lowerMid: 0.71,
    bottom: 0.98,
  }

  for (let leafIndex = 0; leafIndex < leafCount; leafIndex += 1) {
    const bayLeft = -halfSpan + bayWidth * leafIndex
    const meetingInsetLeft = leafIndex > 0 ? MEETING_GAP_MM / 2 : 0
    const meetingInsetRight = leafIndex < leafCount - 1 ? MEETING_GAP_MM / 2 : 0
    const leafInnerWidth = bayWidth - meetingInsetLeft - meetingInsetRight
    const leafCenterX = bayLeft + meetingInsetLeft + leafInnerWidth / 2
    const archSide: ArchSide =
      leafCount === 1 ? 'center' : leafIndex === 0 ? 'left' : 'right'

    const panelsPerLeaf = getBifoldPanelsPerLeaf(config.gateType)
    const bifoldActive = isBifoldGate(config.gateType) && panelsPerLeaf >= 2
    const bifoldGap = bifoldActive ? BIFOLD_GAP_MM : 0
    const bifoldPanelWidth = bifoldActive ? (leafInnerWidth - bifoldGap) / panelsPerLeaf : leafInnerWidth

    const primaryCenterX = bifoldActive
      ? leafCenterX - (bifoldPanelWidth + bifoldGap) / 2
      : leafCenterX
    const primaryWidth = bifoldActive ? bifoldPanelWidth : leafInnerWidth

    // Outer leaf box anchors the clear-opening envelope (width × height exact).
    boxes.push({
      kind: 'box',
      id: `leaf-frame-${leafIndex + 1}`,
      widthMm: primaryWidth,
      heightMm: leafHeightMm,
      depthMm: FRAME_DEPTH_MM * (isComposite ? 0.55 : 0.75),
      positionMm: [primaryCenterX, leafCenterY, 0],
      role: isComposite ? 'panel' : 'frame',
    })

    if (bifoldActive) {
      boxes.push({
        kind: 'box',
        id: `leaf-fold-${leafIndex + 1}`,
        widthMm: bifoldGap,
        heightMm: leafHeightMm - 20,
        depthMm: FRAME_DEPTH_MM * 0.56,
        positionMm: [leafCenterX, leafCenterY, FRAME_DEPTH_MM * 0.1],
        role: 'rail',
      })
      boxes.push({
        kind: 'box',
        id: `leaf-frame-${leafIndex + 1}-outer`,
        widthMm: bifoldPanelWidth,
        heightMm: leafHeightMm,
        depthMm: FRAME_DEPTH_MM * (isComposite ? 0.55 : 0.75),
        positionMm: [
          leafCenterX + (bifoldPanelWidth + bifoldGap) / 2,
          leafCenterY,
          0,
        ],
        role: isComposite ? 'panel' : 'frame',
      })
    }

    if (isComposite) {
      pushCompositeBoards(boxes, {
        idPrefix: `leaf-${leafIndex + 1}`,
        centerX: primaryCenterX,
        widthMm: primaryWidth,
        heightMm: leafHeightMm,
        centerY: leafCenterY,
      })
      if (bifoldActive) {
        pushCompositeBoards(boxes, {
          idPrefix: `leaf-${leafIndex + 1}-outer`,
          centerX: leafCenterX + (bifoldPanelWidth + bifoldGap) / 2,
          widthMm: bifoldPanelWidth,
          heightMm: leafHeightMm,
          centerY: leafCenterY,
        })
      }
      continue
    }

    const railSpecs = [
      ...(archedTop ? [] : [{ id: `leaf-${leafIndex + 1}-rail-upper`, ratio: rails.upperMid }]),
      { id: `leaf-${leafIndex + 1}-rail-spear`, ratio: rails.spearBand },
      { id: `leaf-${leafIndex + 1}-rail-lower`, ratio: rails.lowerMid },
      { id: `leaf-${leafIndex + 1}-rail-bottom`, ratio: rails.bottom },
    ]

    if (archedTop) {
      pushArchTopRail(boxes, {
        leafIndex,
        centerX: primaryCenterX,
        widthMm: primaryWidth,
        leafHeightMm,
        archSide,
      })
    }

    for (const rail of railSpecs) {
      boxes.push({
        kind: 'box',
        id: rail.id,
        widthMm: primaryWidth - 8,
        heightMm: scaleVisualBoldness(8),
        depthMm: FRAME_DEPTH_MM * 0.65,
        positionMm: [primaryCenterX, meshYFromTopRatio(rail.ratio, leafHeightMm), 0],
        role: 'rail',
      })
    }

    if (dogBars) {
      boxes.push({
        kind: 'box',
        id: `leaf-${leafIndex + 1}-dog-rail`,
        widthMm: primaryWidth - 8,
        heightMm: scaleVisualBoldness(8),
        depthMm: FRAME_DEPTH_MM * 0.65,
        positionMm: [primaryCenterX, meshYFromTopRatio(DOG_RAIL_FROM_TOP, leafHeightMm), 0],
        role: 'rail',
      })
    }

    if (config.style !== 'traditional_victorian') {
      continue
    }

    const picketCount = geometry?.pickets.upperCount ?? clamp(Math.round(bayWidth / 110), 6, 14)
    const dogBarCount = dogBars ? clamp(Math.round(bayWidth / 55), 6, 16) : 0
    const leafLeft = primaryCenterX - primaryWidth / 2

    // Main pickets: underside of top / arch → dog rail (or spear band).
    const picketBottomY = dogBars
      ? meshYFromTopRatio(DOG_RAIL_FROM_TOP, leafHeightMm) + 4
      : meshYFromTopRatio(rails.spearBand, leafHeightMm)

    for (let picketIndex = 0; picketIndex < picketCount; picketIndex += 1) {
      const t = (picketIndex + 0.5) / picketCount
      const x = leafLeft + primaryWidth * t
      const topY = archedTop
        ? archTopYMm(t, archSide, leafHeightMm) - 14
        : meshYFromTopRatio(rails.upperMid + 0.02, leafHeightMm)
      const height = Math.max(40, topY - picketBottomY)
      cylinders.push({
        kind: 'cylinder',
        id: `leaf-${leafIndex + 1}-picket-upper-${picketIndex}`,
        radiusMm: tubeRadius,
        heightMm: height,
        positionMm: [x, picketBottomY + height / 2, 0],
        role: 'bar',
      })
    }

    if (dogBars && dogBarCount > 0) {
      const dogTopY = meshYFromTopRatio(DOG_RAIL_FROM_TOP, leafHeightMm) - 4
      const dogBottomY = meshYFromTopRatio(rails.bottom, leafHeightMm) + 4
      const dogHeight = Math.max(30, dogTopY - dogBottomY)
      for (let dogIndex = 0; dogIndex < dogBarCount; dogIndex += 1) {
        const t = (dogIndex + 0.5) / dogBarCount
        const x = leafLeft + primaryWidth * t
        cylinders.push({
          kind: 'cylinder',
          id: `leaf-${leafIndex + 1}-dog-bar-${dogIndex}`,
          radiusMm: tubeRadius * 0.85,
          heightMm: dogHeight,
          positionMm: [x, dogBottomY + dogHeight / 2, 0],
          role: 'bar',
        })
      }
    } else {
      const lowerCount =
        geometry?.pickets.lowerCount ?? clamp(Math.round(config.widthMm / 90), 12, 20)
      const kickMultiplier = geometry?.pickets.kickPlateMultiplier ?? 1
      const effectiveLower = Math.round(lowerCount / leafCount) * kickMultiplier
      const lowerTopY = meshYFromTopRatio(rails.lowerMid, leafHeightMm)
      const lowerBottomY = meshYFromTopRatio(rails.bottom, leafHeightMm)
      const lowerHeight = Math.max(40, lowerTopY - lowerBottomY)

      for (let picketIndex = 0; picketIndex < effectiveLower; picketIndex += 1) {
        const t = (picketIndex + 0.5) / effectiveLower
        const x = leafLeft + primaryWidth * t
        cylinders.push({
          kind: 'cylinder',
          id: `leaf-${leafIndex + 1}-picket-lower-${picketIndex}`,
          radiusMm: tubeRadius * 0.92,
          heightMm: lowerHeight,
          positionMm: [x, lowerBottomY + lowerHeight / 2, 0],
          role: 'bar',
        })
      }
    }
  }

  // CA-01: manual handle only — never motor kit geometry.
  if (!config.motorised) {
    const handleX =
      leafCount > 1 ? -MEETING_GAP_MM / 2 - 20 : halfSpan - bayWidth * 0.12
    pushManualHandle(boxes, cylinders, {
      xMm: handleX,
      yMm: leafHeightMm * 0.5,
    })
  }

  return { boxes, cylinders }
}
