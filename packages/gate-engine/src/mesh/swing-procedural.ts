import { buildGateGeometryPlan } from '../geometry'
import { getLeafCount } from '../internal/shared'
import { getBifoldPanelsPerLeaf, isBifoldGate } from '../rules/bifold'
import type { GateConfig } from '../types'
import { scaleVisualBoldness } from '../visual-scale'
import type { GateMeshBox, GateMeshCylinder } from './types'

const FRAME_DEPTH_MM = scaleVisualBoldness(45)

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function buildSwingProceduralMembers(
  config: GateConfig,
  mountingPosts: GateMeshBox[],
): { boxes: GateMeshBox[]; cylinders: GateMeshCylinder[] } {
  const geometry = buildGateGeometryPlan(config)
  const leafCount = getLeafCount(config.gateType)
  const halfSpan = config.widthMm / 2
  const leafWidth = config.widthMm / leafCount
  const boxes: GateMeshBox[] = [...mountingPosts]
  const cylinders: GateMeshCylinder[] = []

  const tubeRadius = geometry ? geometry.tubeProfile.outer / 2 : scaleVisualBoldness(20) / 2
  const rails = geometry?.rails ?? {
    top: 0,
    upperMid: 0.14,
    spearBand: 0.62,
    lowerMid: 0.71,
    bottom: 0.98,
  }

  for (let leafIndex = 0; leafIndex < leafCount; leafIndex += 1) {
    const leafCenterX = -halfSpan + leafWidth * (leafIndex + 0.5)
    const leafInnerWidth = leafWidth - scaleVisualBoldness(24)
    const panelsPerLeaf = getBifoldPanelsPerLeaf(config.gateType)
    const bifoldActive = isBifoldGate(config.gateType) && panelsPerLeaf >= 2
    const bifoldGap = bifoldActive ? scaleVisualBoldness(14) : 0
    const bifoldPanelWidth = bifoldActive ? (leafInnerWidth - bifoldGap) / panelsPerLeaf : leafInnerWidth

    boxes.push({
      kind: 'box',
      id: `leaf-frame-${leafIndex + 1}`,
      widthMm: bifoldActive ? bifoldPanelWidth : leafInnerWidth,
      heightMm: config.heightMm - 48,
      depthMm: FRAME_DEPTH_MM * 0.75,
      positionMm: [
        bifoldActive ? leafCenterX - (bifoldPanelWidth + bifoldGap) / 2 : leafCenterX,
        config.heightMm / 2,
        0,
      ],
      role: config.style === 'composite_boards' ? 'panel' : 'frame',
    })

    if (bifoldActive) {
      boxes.push({
        kind: 'box',
        id: `leaf-fold-${leafIndex + 1}`,
        widthMm: bifoldGap,
        heightMm: config.heightMm - 30,
        depthMm: FRAME_DEPTH_MM * 0.56,
        positionMm: [leafCenterX, config.heightMm / 2, FRAME_DEPTH_MM * 0.1],
        role: 'rail',
      })
      boxes.push({
        kind: 'box',
        id: `leaf-frame-${leafIndex + 1}-outer`,
        widthMm: bifoldPanelWidth,
        heightMm: config.heightMm - 48,
        depthMm: FRAME_DEPTH_MM * 0.75,
        positionMm: [
          leafCenterX + (bifoldPanelWidth + bifoldGap) / 2,
          config.heightMm / 2,
          0,
        ],
        role: config.style === 'composite_boards' ? 'panel' : 'frame',
      })
    }

    const railYs = [
      { id: `leaf-${leafIndex + 1}-rail-upper`, ratio: rails.upperMid },
      { id: `leaf-${leafIndex + 1}-rail-spear`, ratio: rails.spearBand },
      { id: `leaf-${leafIndex + 1}-rail-lower`, ratio: rails.lowerMid },
      { id: `leaf-${leafIndex + 1}-rail-bottom`, ratio: rails.bottom },
    ]

    for (const rail of railYs) {
      boxes.push({
        kind: 'box',
        id: rail.id,
        widthMm: bifoldActive ? bifoldPanelWidth - 8 : leafInnerWidth - 8,
        heightMm: scaleVisualBoldness(8),
        depthMm: FRAME_DEPTH_MM * 0.65,
        positionMm: [
          bifoldActive ? leafCenterX - (bifoldPanelWidth + bifoldGap) / 2 : leafCenterX,
          config.heightMm * rail.ratio,
          0,
        ],
        role: 'rail',
      })
    }

    if (config.style !== 'traditional_victorian') {
      continue
    }

    const picketCount = geometry?.pickets.upperCount ?? clamp(Math.round(leafWidth / 110), 6, 14)
    const lowerCount = geometry?.pickets.lowerCount ?? clamp(Math.round(config.widthMm / 90), 12, 20)
    const upperBottomY = config.heightMm * rails.spearBand
    const upperTopY = config.heightMm * (rails.upperMid + 0.02)
    const upperHeight = Math.max(40, upperBottomY - upperTopY)
    const lowerTopY = config.heightMm * rails.lowerMid
    const lowerBottomY = config.heightMm * rails.bottom
    const lowerHeight = Math.max(40, lowerBottomY - lowerTopY)

    for (let picketIndex = 0; picketIndex < picketCount; picketIndex += 1) {
      const ratio = (picketIndex + 0.5) / picketCount
      const x = bifoldActive
        ? leafCenterX - (bifoldPanelWidth + bifoldGap) / 2 + bifoldPanelWidth * ratio
        : leafCenterX - leafInnerWidth / 2 + leafInnerWidth * ratio
      cylinders.push({
        kind: 'cylinder',
        id: `leaf-${leafIndex + 1}-picket-upper-${picketIndex}`,
        radiusMm: tubeRadius,
        heightMm: upperHeight,
        positionMm: [x, upperTopY + upperHeight / 2, 0],
        role: 'bar',
      })
    }

    const kickMultiplier = geometry?.pickets.kickPlateMultiplier ?? 1
    const effectiveLower = Math.round(lowerCount / leafCount) * kickMultiplier
    for (let picketIndex = 0; picketIndex < effectiveLower; picketIndex += 1) {
      const ratio = (picketIndex + 0.5) / effectiveLower
      const x = bifoldActive
        ? leafCenterX - (bifoldPanelWidth + bifoldGap) / 2 + bifoldPanelWidth * ratio
        : leafCenterX - leafInnerWidth / 2 + leafInnerWidth * ratio
      cylinders.push({
        kind: 'cylinder',
        id: `leaf-${leafIndex + 1}-picket-lower-${picketIndex}`,
        radiusMm: tubeRadius * 0.92,
        heightMm: lowerHeight,
        positionMm: [x, lowerTopY + lowerHeight / 2, 0],
        role: 'bar',
      })
    }
  }

  return { boxes, cylinders }
}
