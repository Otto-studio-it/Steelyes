import { getFinishDefinition } from '../finishes'
import { getLeafCount, isSlidingGate } from '../internal/shared'
import { cantileverTailNote, getCantileverTailRatio } from '../rules/cantilever'
import type { GateConfig } from '../types'
import { validateGateConfig } from '../validation'
import { scaleVisualBoldness } from '../visual-scale'
import { buildSwingProceduralMembers } from './swing-procedural'
import {
  type GateMeshBox,
  type GateMeshCylinder,
  type GateMeshPlan,
  MM_TO_SCENE_UNITS,
  mmToSceneUnits,
} from './types'

export { MM_TO_SCENE_UNITS, mmToSceneUnits }
export type { GateMeshBox, GateMeshBoxRole, GateMeshCylinder, GateMeshPlan } from './types'

const FRAME_DEPTH_MM = scaleVisualBoldness(45)
const POST_WIDTH_MM = scaleVisualBoldness(90)

function buildMountingPostMeshBoxes(config: GateConfig): GateMeshBox[] {
  if (!config.posts.enabled || config.posts.material === 'none') {
    return []
  }

  const halfSpan = config.widthMm / 2
  const postWidth = config.posts.material === 'brick' || config.posts.material === 'stone' ? POST_WIDTH_MM * 1.15 : POST_WIDTH_MM
  const totalHeight = config.heightMm + config.posts.extendAboveGateMm + 60
  const baseY = totalHeight / 2

  const boxes: GateMeshBox[] = [
    {
      kind: 'box',
      id: 'left-mount-post',
      widthMm: postWidth,
      heightMm: totalHeight,
      depthMm: FRAME_DEPTH_MM * 1.1,
      positionMm: [-halfSpan - postWidth * 0.65, baseY, 0],
      role: 'post',
    },
    {
      kind: 'box',
      id: 'right-mount-post',
      widthMm: postWidth,
      heightMm: totalHeight,
      depthMm: FRAME_DEPTH_MM * 1.1,
      positionMm: [halfSpan + postWidth * 0.65, baseY, 0],
      role: 'post',
    },
  ]

  if (config.posts.capStyle !== 'flat') {
    const capSize = scaleVisualBoldness(28)
    boxes.push(
      {
        kind: 'box',
        id: 'left-post-cap',
        widthMm: capSize,
        heightMm: capSize,
        depthMm: capSize,
        positionMm: [-halfSpan - postWidth * 0.65, totalHeight + capSize * 0.2, 0],
        role: 'post',
      },
      {
        kind: 'box',
        id: 'right-post-cap',
        widthMm: capSize,
        heightMm: capSize,
        depthMm: capSize,
        positionMm: [halfSpan + postWidth * 0.65, totalHeight + capSize * 0.2, 0],
        role: 'post',
      },
    )
  }

  return boxes
}

function buildSwingMesh(config: GateConfig, leafCount: number): { boxes: GateMeshBox[]; cylinders: GateMeshCylinder[] } {
  const posts = buildMountingPostMeshBoxes(config)
  return buildSwingProceduralMembers(config, posts)
}

function buildSlidingMeshBoxes(config: GateConfig): GateMeshBox[] {
  const isCantilever = config.gateType === 'cantilever_sliding'
  const tailRatio = getCantileverTailRatio(config.widthMm)
  const tailWidth = isCantilever ? config.widthMm * tailRatio : 0
  const panelWidth = isCantilever ? config.widthMm * 0.64 : config.widthMm * 0.88
  const panelHeight = config.heightMm - 56

  const boxes: GateMeshBox[] = [
    ...buildMountingPostMeshBoxes(config),
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
  const swingMesh = isSlidingGate(config.gateType)
    ? null
    : buildSwingMesh(config, getLeafCount(config.gateType))
  const boxes = swingMesh ? swingMesh.boxes : buildSlidingMeshBoxes(config)
  const cylinders = swingMesh?.cylinders ?? []

  const notes = [
    'Procedural 3D mesh derived from the same GateConfig and geometry recipe as the 2D preview.',
    cylinders.length > 0
      ? `${cylinders.length} tube pickets rendered as cylinders for Victorian swing layouts.`
      : 'Frame and panel boxes represent sliding or composite layouts schematically.',
  ]

  if (config.gateType === 'cantilever_sliding') {
    notes.unshift(cantileverTailNote(config.widthMm))
  }

  return {
    gateType: config.gateType,
    finish: config.finish,
    material,
    boxes,
    cylinders,
    notes,
  }
}
