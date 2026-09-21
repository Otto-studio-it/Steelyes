import { buildGateGeometryPlan } from '../geometry'
import { getLeafCount } from '../internal/shared'
import { getBifoldPanelsPerLeaf, isBifoldGate } from '../rules/bifold'
import type { GateConfig } from '../types'
import { scaleVisualBoldness } from '../visual-scale'
import { LEAF_FRAME_PROFILE_MM, PICKET_TUBE_RADIUS_MM, pushLeafPerimeterFrame } from './leaf-frame'
import { pushDogBarRailheads, pushTopRailheads } from './railheads'
import type { GateMeshBox, GateMeshCylinder } from './types'

/** Frame depth — boldness OK (cross-section only). */
const FRAME_DEPTH_MM = scaleVisualBoldness(45)

/**
 * True-mm clearances inside the clear opening. Do NOT run these through
 * scaleVisualBoldness — they shrink the AR tape envelope.
 */
const MEETING_GAP_MM = 6
/** Fold stile width between 50/50 bifold panels (CA-09). */
const BIFOLD_FOLD_STILE_MM = 12
/** Depth offset so outer panel reads as a fold in 3D (inside leaf AABB). */
const BIFOLD_PANEL_DEPTH_OFFSET_MM = FRAME_DEPTH_MM * 0.22
/** Stack-pack cue outside hinge post — open footprint, not opening gap. */
const BIFOLD_STACK_PACK_W_MM = 14

/** Arch shoulder drop stays inside typed heightMm (CA-08 / Phase 1 envelope). */
const ARCH_SHOULDER_DROP_MM = 90
/** Odd, so one segment is centred on the crest and reaches heightMm exactly. */
const ARCH_SEGMENT_COUNT = 15
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

/** Map panel-local t (0–1) onto leaf-wide t for continuous arch across bifold panels. */
function leafArchT(panelLocalT: number, panelIndex: number, panelsPerLeaf: number): number {
  if (panelsPerLeaf <= 1) {
    return clamp(panelLocalT, 0, 1)
  }
  return clamp((panelIndex + clamp(panelLocalT, 0, 1)) / panelsPerLeaf, 0, 1)
}

function pushCompositeBoards(
  boxes: GateMeshBox[],
  args: {
    idPrefix: string
    centerX: number
    widthMm: number
    heightMm: number
    centerY: number
    depthOffsetMm?: number
  },
): void {
  const { idPrefix, centerX, widthMm, heightMm, centerY, depthOffsetMm = 0 } = args
  const left = centerX - widthMm / 2

  boxes.push({
    kind: 'box',
    id: `${idPrefix}-rail-mid`,
    widthMm: widthMm - 16,
    heightMm: scaleVisualBoldness(8),
    depthMm: FRAME_DEPTH_MM * 0.7,
    positionMm: [centerX, heightMm * 0.5, depthOffsetMm],
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
      positionMm: [x, centerY, depthOffsetMm + FRAME_DEPTH_MM * 0.08],
      // Inside leaf AABB — does not expand Phase 1 envelope.
      role: 'bar',
    })
  }
}

function pushArchTopRail(
  boxes: GateMeshBox[],
  args: {
    idPrefix: string
    centerX: number
    widthMm: number
    leafHeightMm: number
    archSide: ArchSide
    panelIndex: number
    panelsPerLeaf: number
    depthOffsetMm?: number
  },
): void {
  const {
    idPrefix,
    centerX,
    widthMm,
    leafHeightMm,
    archSide,
    panelIndex,
    panelsPerLeaf,
    depthOffsetMm = 0,
  } = args
  const left = centerX - widthMm / 2
  // Spans between the stiles.
  const usable = widthMm - LEAF_FRAME_PROFILE_MM * 2
  const segmentWidth = usable / ARCH_SEGMENT_COUNT

  for (let i = 0; i < ARCH_SEGMENT_COUNT; i += 1) {
    const t0 = i / ARCH_SEGMENT_COUNT
    const t1 = (i + 1) / ARCH_SEGMENT_COUNT
    const tMid = (t0 + t1) / 2
    const leafT = leafArchT(tMid, panelIndex, panelsPerLeaf)
    const topY = archTopYMm(leafT, archSide, leafHeightMm)
    // The arch is the leaf's top frame member: same section as the stiles, and it counts
    // toward the opening envelope (crest = heightMm).
    const segHeight = LEAF_FRAME_PROFILE_MM
    boxes.push({
      kind: 'box',
      id: `${idPrefix}-arch-seg-${i + 1}`,
      widthMm: segmentWidth + 1,
      heightMm: segHeight,
      depthMm: FRAME_DEPTH_MM * 0.75,
      positionMm: [left + LEAF_FRAME_PROFILE_MM + segmentWidth * (i + 0.5), topY - segHeight / 2, depthOffsetMm],
      role: 'frame',
    })
  }
}

function pushBifoldFoldStile(
  boxes: GateMeshBox[],
  args: {
    leafIndex: number
    foldX: number
    leafHeightMm: number
    leafCenterY: number
  },
): void {
  const { leafIndex, foldX, leafHeightMm, leafCenterY } = args

  boxes.push({
    kind: 'box',
    id: `leaf-fold-${leafIndex + 1}`,
    widthMm: BIFOLD_FOLD_STILE_MM,
    heightMm: leafHeightMm - 20,
    depthMm: FRAME_DEPTH_MM * 0.85,
    positionMm: [foldX, leafCenterY, BIFOLD_PANEL_DEPTH_OFFSET_MM * 0.5],
    role: 'rail',
  })

  // Hinge knuckles — CAD bifold-fold-hinge ticks at ~18% / 82% height.
  for (const [hi, ratioFromTop] of [
    [0, 0.18],
    [1, 0.82],
  ] as const) {
    boxes.push({
      kind: 'box',
      id: `leaf-fold-hinge-${leafIndex + 1}-${hi}`,
      widthMm: 10,
      heightMm: 10,
      depthMm: FRAME_DEPTH_MM * 1.05,
      positionMm: [foldX, meshYFromTopRatio(ratioFromTop, leafHeightMm), FRAME_DEPTH_MM * 0.35],
      role: 'rail',
    })
  }
}

function pushBifoldStackPacks(
  boxes: GateMeshBox[],
  args: {
    leafCount: number
    halfSpan: number
    leafHeightMm: number
    mountingPosts: GateMeshBox[]
  },
): void {
  const { leafCount, halfSpan, leafHeightMm, mountingPosts } = args
  const leftPost = mountingPosts.find((p) => p.id === 'left-mount-post')
  const rightPost = mountingPosts.find((p) => p.id === 'right-mount-post')
  const packH = leafHeightMm * 0.56
  const packY = leafHeightMm * 0.5

  const leftOuterX = leftPost
    ? leftPost.positionMm[0] - leftPost.widthMm / 2 - BIFOLD_STACK_PACK_W_MM / 2 - 6
    : -halfSpan - 80
  boxes.push({
    kind: 'box',
    id: 'bifold-stack-left',
    widthMm: BIFOLD_STACK_PACK_W_MM,
    heightMm: packH,
    depthMm: FRAME_DEPTH_MM * 0.5,
    positionMm: [leftOuterX, packY, 0],
    role: 'rail',
  })

  if (leafCount === 2) {
    const rightOuterX = rightPost
      ? rightPost.positionMm[0] + rightPost.widthMm / 2 + BIFOLD_STACK_PACK_W_MM / 2 + 6
      : halfSpan + 80
    boxes.push({
      kind: 'box',
      id: 'bifold-stack-right',
      widthMm: BIFOLD_STACK_PACK_W_MM,
      heightMm: packH,
      depthMm: FRAME_DEPTH_MM * 0.5,
      positionMm: [rightOuterX, packY, 0],
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

type RailSpec = { id: string; ratio: number }

function pushVictorianPanel(
  boxes: GateMeshBox[],
  cylinders: GateMeshCylinder[],
  args: {
    idPrefix: string
    centerX: number
    widthMm: number
    leafHeightMm: number
    archSide: ArchSide
    panelIndex: number
    panelsPerLeaf: number
    archedTop: boolean
    dogBars: boolean
    railSpecs: RailSpec[]
    rails: {
      upperMid: number
      spearBand: number
      lowerMid: number
      bottom: number
    }
    tubeRadius: number
    picketCount: number
    dogBarCount: number
    lowerPicketCount: number
    depthOffsetMm?: number
  },
): void {
  const {
    idPrefix,
    centerX,
    widthMm,
    leafHeightMm,
    archSide,
    panelIndex,
    panelsPerLeaf,
    archedTop,
    dogBars,
    railSpecs,
    rails,
    tubeRadius,
    picketCount,
    dogBarCount,
    lowerPicketCount,
    depthOffsetMm = 0,
  } = args

  if (archedTop) {
    pushArchTopRail(boxes, {
      idPrefix,
      centerX,
      widthMm,
      leafHeightMm,
      archSide,
      panelIndex,
      panelsPerLeaf,
      depthOffsetMm,
    })
  }

  for (const rail of railSpecs) {
    boxes.push({
      kind: 'box',
      id: `${idPrefix}-${rail.id}`,
      widthMm: widthMm - 8,
      heightMm: scaleVisualBoldness(8),
      depthMm: FRAME_DEPTH_MM * 0.65,
      positionMm: [centerX, meshYFromTopRatio(rail.ratio, leafHeightMm), depthOffsetMm],
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
      positionMm: [centerX, meshYFromTopRatio(DOG_RAIL_FROM_TOP, leafHeightMm), depthOffsetMm],
      role: 'rail',
    })
  }

  const leafLeft = centerX - widthMm / 2
  // Infill is spaced between the stiles, not across the full leaf width.
  const infillLeft = leafLeft + LEAF_FRAME_PROFILE_MM
  const infillWidth = Math.max(1, widthMm - LEAF_FRAME_PROFILE_MM * 2)
  const picketBottomY = dogBars
    ? meshYFromTopRatio(DOG_RAIL_FROM_TOP, leafHeightMm) + 4
    : meshYFromTopRatio(rails.spearBand, leafHeightMm)

  for (let picketIndex = 0; picketIndex < picketCount; picketIndex += 1) {
    const t = (picketIndex + 0.5) / picketCount
    const x = infillLeft + infillWidth * t
    const leafT = leafArchT((x - leafLeft) / widthMm, panelIndex, panelsPerLeaf)
    const topY = archedTop
      ? archTopYMm(leafT, archSide, leafHeightMm) - 14
      : meshYFromTopRatio(rails.upperMid + 0.02, leafHeightMm)
    const height = Math.max(40, topY - picketBottomY)
    cylinders.push({
      kind: 'cylinder',
      id: `${idPrefix}-picket-upper-${picketIndex}`,
      radiusMm: tubeRadius,
      heightMm: height,
      positionMm: [x, picketBottomY + height / 2, depthOffsetMm],
      role: 'bar',
    })
  }

  if (dogBars && dogBarCount > 0) {
    const dogTopY = meshYFromTopRatio(DOG_RAIL_FROM_TOP, leafHeightMm) - 4
    const dogBottomY = meshYFromTopRatio(rails.bottom, leafHeightMm) + 4
    const dogHeight = Math.max(30, dogTopY - dogBottomY)
    for (let dogIndex = 0; dogIndex < dogBarCount; dogIndex += 1) {
      const t = (dogIndex + 0.5) / dogBarCount
      const x = infillLeft + infillWidth * t
      cylinders.push({
        kind: 'cylinder',
        id: `${idPrefix}-dog-bar-${dogIndex}`,
        radiusMm: tubeRadius * 0.85,
        heightMm: dogHeight,
        positionMm: [x, dogBottomY + dogHeight / 2, depthOffsetMm],
        role: 'bar',
      })
    }
  } else {
    const lowerTopY = meshYFromTopRatio(rails.lowerMid, leafHeightMm)
    const lowerBottomY = meshYFromTopRatio(rails.bottom, leafHeightMm)
    const lowerHeight = Math.max(40, lowerTopY - lowerBottomY)

    for (let picketIndex = 0; picketIndex < lowerPicketCount; picketIndex += 1) {
      const t = (picketIndex + 0.5) / lowerPicketCount
      const x = infillLeft + infillWidth * t
      cylinders.push({
        kind: 'cylinder',
        id: `${idPrefix}-picket-lower-${picketIndex}`,
        radiusMm: tubeRadius * 0.92,
        heightMm: lowerHeight,
        positionMm: [x, lowerBottomY + lowerHeight / 2, depthOffsetMm],
        role: 'bar',
      })
    }
  }
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
  const bifoldActive = isBifoldGate(config.gateType)
  const panelsPerLeaf = bifoldActive ? getBifoldPanelsPerLeaf(config.gateType) : 1

  // geometry.tubeProfile is the 40 mm frame tube — pickets are the lighter infill tube.
  const tubeRadius = PICKET_TUBE_RADIUS_MM
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

    const foldStile = bifoldActive && panelsPerLeaf >= 2 ? BIFOLD_FOLD_STILE_MM : 0
    const panelWidth =
      panelsPerLeaf >= 2 ? (leafInnerWidth - foldStile) / panelsPerLeaf : leafInnerWidth

    if (bifoldActive && panelsPerLeaf >= 2) {
      pushBifoldFoldStile(boxes, {
        leafIndex,
        foldX: leafCenterX,
        leafHeightMm,
        leafCenterY,
      })
    }

    for (let panelIndex = 0; panelIndex < panelsPerLeaf; panelIndex += 1) {
      // 50/50 panels either side of centre fold stile (CA-09).
      const panelCenterX =
        panelsPerLeaf >= 2
          ? leafCenterX + (panelIndex === 0 ? -1 : 1) * ((panelWidth + foldStile) / 2)
          : leafCenterX
      const depthOffsetMm =
        bifoldActive && panelIndex > 0 ? BIFOLD_PANEL_DEPTH_OFFSET_MM : 0
      const idPrefix =
        panelsPerLeaf >= 2 && panelIndex > 0
          ? `leaf-${leafIndex + 1}-outer`
          : `leaf-${leafIndex + 1}`
      const frameId =
        panelsPerLeaf >= 2 && panelIndex > 0
          ? `leaf-frame-${leafIndex + 1}-outer`
          : `leaf-frame-${leafIndex + 1}`

      // Outer leaf members anchor the clear-opening envelope (width × height exact).
      // Composite = solid boarded panel; Victorian = open perimeter frame so pickets show.
      if (isComposite) {
        boxes.push({
          kind: 'box',
          id: frameId,
          widthMm: panelWidth,
          heightMm: leafHeightMm,
          depthMm: FRAME_DEPTH_MM * 0.55,
          positionMm: [panelCenterX, leafCenterY, depthOffsetMm],
          role: 'panel',
        })
      } else {
        pushLeafPerimeterFrame(boxes, {
          id: frameId,
          centerX: panelCenterX,
          widthMm: panelWidth,
          heightMm: leafHeightMm,
          depthMm: FRAME_DEPTH_MM * 0.75,
          depthOffsetMm,
          arch: archedTop
            ? {
                leftTopMm: archTopYMm(leafArchT(0, panelIndex, panelsPerLeaf), archSide, leafHeightMm),
                rightTopMm: archTopYMm(leafArchT(1, panelIndex, panelsPerLeaf), archSide, leafHeightMm),
              }
            : undefined,
        })
      }

      if (isComposite) {
        pushCompositeBoards(boxes, {
          idPrefix,
          centerX: panelCenterX,
          widthMm: panelWidth,
          heightMm: leafHeightMm,
          centerY: leafCenterY,
          depthOffsetMm,
        })
        continue
      }

      if (config.style !== 'traditional_victorian') {
        const railSpecs: RailSpec[] = [
          ...(archedTop ? [] : [{ id: 'rail-upper', ratio: rails.upperMid }]),
          { id: 'rail-spear', ratio: rails.spearBand },
          { id: 'rail-lower', ratio: rails.lowerMid },
          { id: 'rail-bottom', ratio: rails.bottom },
        ]
        if (archedTop) {
          pushArchTopRail(boxes, {
            idPrefix,
            centerX: panelCenterX,
            widthMm: panelWidth,
            leafHeightMm,
            archSide,
            panelIndex,
            panelsPerLeaf,
            depthOffsetMm,
          })
        }
        for (const rail of railSpecs) {
          boxes.push({
            kind: 'box',
            id: `${idPrefix}-${rail.id}`,
            widthMm: panelWidth - 8,
            heightMm: scaleVisualBoldness(8),
            depthMm: FRAME_DEPTH_MM * 0.65,
            positionMm: [panelCenterX, meshYFromTopRatio(rail.ratio, leafHeightMm), depthOffsetMm],
            role: 'rail',
          })
        }
        continue
      }

      const picketCount = clamp(Math.round(panelWidth / 110), 4, 10)
      const dogBarCount = dogBars ? clamp(Math.round(panelWidth / 55), 4, 12) : 0
      const lowerBase =
        geometry?.pickets.lowerCount ?? clamp(Math.round(config.widthMm / 90), 12, 20)
      const kickMultiplier = geometry?.pickets.kickPlateMultiplier ?? 1
      const lowerPicketCount = Math.max(
        3,
        Math.round((lowerBase / leafCount / panelsPerLeaf) * kickMultiplier),
      )

      const railSpecs: RailSpec[] = [
        ...(archedTop ? [] : [{ id: 'rail-upper', ratio: rails.upperMid }]),
        { id: 'rail-spear', ratio: rails.spearBand },
        { id: 'rail-lower', ratio: rails.lowerMid },
        { id: 'rail-bottom', ratio: rails.bottom },
      ]

      pushVictorianPanel(boxes, cylinders, {
        idPrefix,
        centerX: panelCenterX,
        widthMm: panelWidth,
        leafHeightMm,
        archSide,
        panelIndex,
        panelsPerLeaf,
        archedTop,
        dogBars,
        railSpecs,
        rails,
        tubeRadius,
        picketCount,
        dogBarCount,
        lowerPicketCount,
        depthOffsetMm,
      })
    }

    // Railheads once per leaf (not per bifold panel) — decorative above top rail.
    pushTopRailheads(boxes, {
      config,
      idPrefix: `leaf-${leafIndex + 1}`,
      centerX: leafCenterX,
      widthMm: leafInnerWidth,
      leafHeightMm,
      countWidthMm: config.widthMm,
    })
    pushDogBarRailheads(boxes, {
      config,
      idPrefix: `leaf-${leafIndex + 1}`,
      centerX: leafCenterX,
      widthMm: leafInnerWidth,
      leafHeightMm,
      countWidthMm: config.widthMm,
    })
  }

  if (bifoldActive) {
    pushBifoldStackPacks(boxes, {
      leafCount,
      halfSpan,
      leafHeightMm,
      mountingPosts,
    })
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
