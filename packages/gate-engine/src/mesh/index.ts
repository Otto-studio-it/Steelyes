import { getFinishDefinition } from '../finishes'
import { getLeafCount, isSlidingGate } from '../internal/shared'
import { cantileverTailNote, getCantileverTailRatio } from '../rules/cantilever'
import type { GateConfig } from '../types'
import { validateGateConfig } from '../validation'
import { scaleVisualBoldness } from '../visual-scale'
import { type GateMeshBox, type GateMeshPlan, MM_TO_SCENE_UNITS, mmToSceneUnits } from './types'

export { MM_TO_SCENE_UNITS, mmToSceneUnits }
export type { GateMeshBox, GateMeshBoxRole, GateMeshPlan } from './types'

const FRAME_DEPTH_MM = scaleVisualBoldness(45)
const POST_WIDTH_MM = scaleVisualBoldness(90)

function buildSwingMeshBoxes(config: GateConfig, leafCount: number): GateMeshBox[] {
  const halfSpan = config.widthMm / 2
  const leafWidth = config.widthMm / leafCount
  const boxes: GateMeshBox[] = [
    {
      kind: 'box',
      id: 'left-post',
      widthMm: POST_WIDTH_MM,
      heightMm: config.heightMm,
      depthMm: FRAME_DEPTH_MM,
      positionMm: [-halfSpan - POST_WIDTH_MM / 2, config.heightMm / 2, 0],
      role: 'post',
    },
    {
      kind: 'box',
      id: 'right-post',
      widthMm: POST_WIDTH_MM,
      heightMm: config.heightMm,
      depthMm: FRAME_DEPTH_MM,
      positionMm: [halfSpan + POST_WIDTH_MM / 2, config.heightMm / 2, 0],
      role: 'post',
    },
  ]

  for (let index = 0; index < leafCount; index += 1) {
    const centerX = -halfSpan + leafWidth * (index + 0.5)
    boxes.push({
      kind: 'box',
      id: `leaf-${index + 1}`,
      widthMm: leafWidth - scaleVisualBoldness(24),
      heightMm: config.heightMm - 48,
      depthMm: FRAME_DEPTH_MM * 0.75,
      positionMm: [centerX, config.heightMm / 2, 0],
      role: config.style === 'composite_boards' ? 'panel' : 'frame',
    })
  }

  return boxes
}

function buildSlidingMeshBoxes(config: GateConfig): GateMeshBox[] {
  const isCantilever = config.gateType === 'cantilever_sliding'
  const tailRatio = getCantileverTailRatio(config.widthMm)
  const tailWidth = isCantilever ? config.widthMm * tailRatio : 0
  const panelWidth = isCantilever ? config.widthMm * 0.64 : config.widthMm * 0.88
  const panelHeight = config.heightMm - 56

  const boxes: GateMeshBox[] = [
    {
      kind: 'box',
      id: 'sliding-track',
      widthMm: config.widthMm,
      heightMm: 24,
      depthMm: FRAME_DEPTH_MM,
      positionMm: [0, 12, 0],
      role: 'rail',
    },
  ]

  if (isCantilever) {
    boxes.push({
      kind: 'box',
      id: 'counterbalance-tail',
      widthMm: tailWidth,
      heightMm: panelHeight,
      depthMm: FRAME_DEPTH_MM * 0.85,
      positionMm: [tailWidth / 2, panelHeight / 2 + 28, 0],
      role: 'counterweight',
    })
  }

  boxes.push({
    kind: 'box',
    id: 'sliding-panel',
    widthMm: panelWidth,
    heightMm: panelHeight,
    depthMm: FRAME_DEPTH_MM,
    positionMm: [isCantilever ? tailWidth + panelWidth / 2 - 24 : config.widthMm * 0.04, panelHeight / 2 + 28, 0],
    role: config.style === 'composite_boards' ? 'panel' : 'frame',
  })

  return boxes
}

export function buildGateMeshPlan(config: GateConfig): GateMeshPlan {
  const validation = validateGateConfig(config)
  if (!validation.ok) {
    throw new Error('Invalid gate config for mesh generation')
  }

  const material = getFinishDefinition(config.finish).material
  const boxes = isSlidingGate(config.gateType)
    ? buildSlidingMeshBoxes(config)
    : buildSwingMeshBoxes(config, getLeafCount(config.gateType))

  const notes = [
    'Schematic 3D placeholder mesh derived from the same GateConfig as the 2D preview.',
    'Detailed procedural geometry will replace these boxes in a later mesh-builder phase.',
  ]

  if (config.gateType === 'cantilever_sliding') {
    notes.unshift(cantileverTailNote(config.widthMm))
  }

  return {
    gateType: config.gateType,
    finish: config.finish,
    material,
    boxes,
    notes,
  }
}
