import { getFinishDefinition } from '../finishes'
import type { GateConfig } from '../types'
import { validateGateConfig } from '../validation'
import { type GateMeshBox, type GateMeshPlan, MM_TO_SCENE_UNITS, mmToSceneUnits } from './types'

export { MM_TO_SCENE_UNITS, mmToSceneUnits }
export type { GateMeshBox, GateMeshBoxRole, GateMeshPlan } from './types'

const FRAME_DEPTH_MM = 45
const POST_WIDTH_MM = 90

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
      widthMm: leafWidth - 24,
      heightMm: config.heightMm - 48,
      depthMm: FRAME_DEPTH_MM * 0.75,
      positionMm: [centerX, config.heightMm / 2, 0],
      role: config.style === 'composite_boards' ? 'panel' : 'frame',
    })
  }

  return boxes
}

function buildSlidingMeshBoxes(config: GateConfig): GateMeshBox[] {
  const panelWidth = config.widthMm * 0.88
  const panelHeight = config.heightMm - 56

  return [
    {
      kind: 'box',
      id: 'sliding-track',
      widthMm: config.widthMm,
      heightMm: 24,
      depthMm: FRAME_DEPTH_MM,
      positionMm: [0, 12, 0],
      role: 'rail',
    },
    {
      kind: 'box',
      id: 'sliding-panel',
      widthMm: panelWidth,
      heightMm: panelHeight,
      depthMm: FRAME_DEPTH_MM,
      positionMm: [config.widthMm * 0.04, panelHeight / 2 + 28, 0],
      role: config.style === 'composite_boards' ? 'panel' : 'frame',
    },
  ]
}

function getLeafCount(gateType: GateConfig['gateType']): number {
  if (gateType === 'double_swing' || gateType === 'bifolding_double_swing') {
    return 2
  }
  return 1
}

function isSlidingGate(gateType: GateConfig['gateType']): boolean {
  return gateType.includes('sliding')
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

  return {
    gateType: config.gateType,
    finish: config.finish,
    material,
    boxes,
    notes: [
      'Schematic 3D placeholder mesh derived from the same GateConfig as the 2D preview.',
      'Detailed procedural geometry will replace these boxes in a later mesh-builder phase.',
    ],
  }
}
