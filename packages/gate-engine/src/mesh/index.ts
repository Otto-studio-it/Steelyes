import { resolveFinishDefinition } from '../finishes'
import { getLeafCount, isSlidingGate } from '../internal/shared'
import { bifoldSchematicNote, isBifoldGate } from '../rules/bifold'
import { cantileverTailNote, getCantileverTailMm } from '../rules/cantilever'
import { getTelescopicOverlapMm, getTelescopicPanelCount } from '../rules/telescopic'
import type { GateConfig } from '../types'
import { validateGateConfig } from '../validation'
import { scaleVisualBoldness } from '../visual-scale'
import { buildMeshOpening } from './envelope'
import { buildSwingProceduralMembers } from './swing-procedural'
import {
  type GateMeshBox,
  type GateMeshCylinder,
  type GateMeshPlan,
  MM_TO_SCENE_UNITS,
  mmToSceneUnits,
} from './types'

export { MM_TO_SCENE_UNITS, mmToSceneUnits }
export {
  MESH_ENVELOPE_TOLERANCE_MM,
  buildMeshOpening,
  checkMeshOpeningEnvelope,
  measureMeshOpening,
} from './envelope'
export type {
  GateMeshOpeningCheck,
  GateMeshOpeningMeasurement,
} from './envelope'
export type {
  GateMeshBox,
  GateMeshBoxRole,
  GateMeshCylinder,
  GateMeshFidelity,
  GateMeshOpening,
  GateMeshPlan,
} from './types'

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
  const isTelescopic = config.gateType === 'telescopic_sliding'
  const isRadius = config.gateType === 'radius_sliding'
  const halfSpan = config.widthMm / 2
  // Tail is extra site run beyond the clear opening (CA-05) — never part of widthMm.
  const tailWidth = isCantilever ? getCantileverTailMm(config.widthMm) : 0
  // Opening leaf fills clear opening × ground-to-top-rail (true mm).
  const panelWidth = config.widthMm
  const panelHeight = config.heightMm
  const panelCenterY = panelHeight / 2

  const boxes: GateMeshBox[] = [
    ...buildMountingPostMeshBoxes(config),
    {
      kind: 'box',
      id: 'sliding-track',
      widthMm: config.widthMm,
      heightMm: 24,
      depthMm: FRAME_DEPTH_MM,
      positionMm: [0, 12, isRadius ? FRAME_DEPTH_MM * 0.4 : 0],
      role: 'rail',
    },
  ]

  if (isCantilever) {
    // Counterbalance sits after the parking-side post — outside the clear opening.
    const postWidth =
      config.posts.enabled && config.posts.material !== 'none'
        ? config.posts.material === 'brick' || config.posts.material === 'stone'
          ? POST_WIDTH_MM * 1.15
          : POST_WIDTH_MM
        : 0
    const tailCenterX = halfSpan + postWidth * 0.65 + postWidth / 2 + tailWidth / 2
    boxes.push({
      kind: 'box',
      id: 'counterbalance-tail',
      widthMm: tailWidth,
      heightMm: panelHeight,
      depthMm: FRAME_DEPTH_MM * 0.85,
      positionMm: [tailCenterX, panelCenterY, 0],
      role: 'counterweight',
    })
  }

  if (isRadius) {
    // Schematic articulated train (~90°) — segments still span clear opening in X.
    const segmentCount = 3
    const segmentWidth = panelWidth / segmentCount
    for (let index = 0; index < segmentCount; index += 1) {
      const t = index / Math.max(segmentCount - 1, 1)
      boxes.push({
        kind: 'box',
        id: `radius-segment-${index + 1}`,
        widthMm: segmentWidth,
        heightMm: panelHeight,
        depthMm: FRAME_DEPTH_MM,
        positionMm: [
          -halfSpan + segmentWidth * (index + 0.5),
          panelCenterY,
          Math.sin(t * Math.PI * 0.5) * config.widthMm * 0.18,
        ],
        role: config.style === 'composite_boards' ? 'panel' : 'frame',
      })
    }
  } else if (!isTelescopic) {
    boxes.push({
      kind: 'box',
      id: 'sliding-panel',
      widthMm: panelWidth,
      heightMm: panelHeight,
      depthMm: FRAME_DEPTH_MM,
      positionMm: [0, panelCenterY, 0],
      role: config.style === 'composite_boards' ? 'panel' : 'frame',
    })
  }

  if (isTelescopic) {
    const segmentCount = getTelescopicPanelCount()
    const overlapMm = getTelescopicOverlapMm(config.widthMm)
    // Closed pack spans the clear opening; overlaps are internal (CA-11 schematic).
    const segmentWidth =
      (panelWidth + overlapMm * (segmentCount - 1)) / Math.max(segmentCount, 1)
    for (let index = 0; index < segmentCount; index += 1) {
      const left = -halfSpan + index * (segmentWidth - overlapMm)
      boxes.push({
        kind: 'box',
        id: `telescopic-segment-${index + 1}`,
        widthMm: segmentWidth,
        heightMm: panelHeight,
        depthMm: FRAME_DEPTH_MM * (0.86 - index * 0.05),
        positionMm: [left + segmentWidth / 2, panelCenterY, index * 1.5],
        role: config.style === 'composite_boards' ? 'panel' : 'frame',
      })
    }
  }

  return boxes
}

export function buildGateMeshPlan(config: GateConfig): GateMeshPlan {
  const validation = validateGateConfig(config)
  if (!validation.ok) {
    throw new Error('Invalid gate config for mesh generation')
  }

  const material = resolveFinishDefinition(config).material
  const swingMesh = isSlidingGate(config.gateType)
    ? null
    : buildSwingMesh(config, getLeafCount(config.gateType))
  const boxes = swingMesh ? swingMesh.boxes : buildSlidingMeshBoxes(config)
  const cylinders = swingMesh?.cylinders ?? []
  const fidelity =
    !isSlidingGate(config.gateType) &&
    config.style === 'traditional_victorian' &&
    cylinders.length > 0
      ? 'workshop'
      : 'schematic'
  const opening = buildMeshOpening(config)

  const notes = [
    `AR envelope: clear opening ${opening.clearOpeningMm} × ${opening.heightMm} mm (ground to top rail). Posts and counterbalance sit outside that tape check.`,
    'Procedural 3D mesh derived from the same GateConfig as Design / Installation previews.',
    fidelity === 'workshop'
      ? `${cylinders.length} tube pickets as cylinders — workshop-level swing mesh for AR scale checks.`
      : 'Schematic frame/panel mesh for AR placement at real millimetre scale (not photoreal CAD).',
  ]

  if (config.gateType === 'cantilever_sliding') {
    notes.unshift(cantileverTailNote(config.widthMm))
  }

  if (config.gateType === 'radius_sliding') {
    notes.unshift('Radius sliding shown as a schematic articulated train on a curved footprint.')
  }

  if (isBifoldGate(config.gateType)) {
    notes.unshift(bifoldSchematicNote(config.gateType))
  }

  return {
    gateType: config.gateType,
    finish: config.finish,
    material,
    boxes,
    cylinders,
    fidelity,
    opening,
    notes,
  }
}
