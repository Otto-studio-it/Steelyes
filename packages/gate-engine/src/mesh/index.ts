import { resolveFinishDefinition } from '../finishes'
import { getLeafCount, isSlidingGate } from '../internal/shared'
import { bifoldSchematicNote, isBifoldGate } from '../rules/bifold'
import { cantileverTailNote } from '../rules/cantilever'
import { radiusSchematicNote } from '../rules/radius'
import { telescopicSchematicNote } from '../rules/telescopic'
import type { GateConfig } from '../types'
import { validateGateConfig } from '../validation'
import { scaleVisualBoldness } from '../visual-scale'
import { buildMeshOpening } from './envelope'
import {
  buildTelescopicOrRadiusMesh,
  buildTrackedOrCantileverMesh,
} from './sliding-procedural'
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

export function buildGateMeshPlan(config: GateConfig): GateMeshPlan {
  const validation = validateGateConfig(config)
  if (!validation.ok) {
    throw new Error('Invalid gate config for mesh generation')
  }

  const material = resolveFinishDefinition(config).material
  const posts = buildMountingPostMeshBoxes(config)

  let boxes: GateMeshBox[]
  let cylinders: GateMeshCylinder[] = []

  if (
    config.gateType === 'tracked_sliding' ||
    config.gateType === 'cantilever_sliding'
  ) {
    const sliding = buildTrackedOrCantileverMesh(config, posts)
    boxes = sliding.boxes
    cylinders = sliding.cylinders
  } else if (
    config.gateType === 'telescopic_sliding' ||
    config.gateType === 'radius_sliding'
  ) {
    const sliding = buildTelescopicOrRadiusMesh(config, posts)
    boxes = sliding.boxes
    cylinders = sliding.cylinders
  } else if (isSlidingGate(config.gateType)) {
    // Fallback — all sliding types should be handled above.
    boxes = posts
  } else {
    const swingMesh = buildSwingMesh(config, getLeafCount(config.gateType))
    boxes = swingMesh.boxes
    cylinders = swingMesh.cylinders
  }

  const workshopEligible =
    config.style === 'traditional_victorian' &&
    cylinders.length > 0 &&
    (config.gateType === 'double_swing' ||
      config.gateType === 'single_swing' ||
      config.gateType === 'bifolding_double_swing' ||
      config.gateType === 'single_bifolding' ||
      config.gateType === 'tracked_sliding' ||
      config.gateType === 'cantilever_sliding' ||
      config.gateType === 'telescopic_sliding' ||
      config.gateType === 'radius_sliding')

  const fidelity = workshopEligible ? 'workshop' : 'schematic'
  const opening = buildMeshOpening(config)
  const archedTop = config.options.some((o) => o.key === 'arched_top' && o.enabled)

  const notes = [
    `AR envelope: clear opening ${opening.clearOpeningMm} × ${opening.heightMm} mm (ground to top rail). Posts and counterbalance sit outside that tape check.`,
    'Procedural 3D mesh derived from the same GateConfig as Design / Installation previews.',
  ]

  if (fidelity === 'workshop') {
    notes.push(
      `${cylinders.length} tube members — workshop mesh (swing / sliding Victorian with options).`,
    )
  } else if (!isSlidingGate(config.gateType) && config.style === 'composite_boards') {
    notes.push('Composite swing mesh: panel leaf with vertical board subdivision (schematic, real mm).')
  } else if (
    (config.gateType === 'tracked_sliding' ||
      config.gateType === 'cantilever_sliding' ||
      config.gateType === 'telescopic_sliding' ||
      config.gateType === 'radius_sliding') &&
    config.style === 'composite_boards'
  ) {
    notes.push('Composite sliding mesh: opening leaf with board subdivision (schematic, real mm).')
  } else {
    notes.push(
      'Schematic frame/panel mesh for AR placement at real millimetre scale (not photoreal CAD).',
    )
  }

  if (
    (config.gateType === 'tracked_sliding' ||
      config.gateType === 'cantilever_sliding' ||
      config.gateType === 'telescopic_sliding' ||
      config.gateType === 'radius_sliding' ||
      !isSlidingGate(config.gateType)) &&
    !config.motorised
  ) {
    notes.push('Manual handle shown on latch side (CA-01). Motorised configs omit handle and motor kit.')
  }

  if (config.gateType === 'tracked_sliding') {
    notes.unshift(
      'Tracked: ground track under clear opening; leaf fills post-to-post; runback outside parking post.',
    )
  }

  if (config.gateType === 'cantilever_sliding') {
    notes.unshift(cantileverTailNote(config.widthMm))
    notes.push('Cantilever: no ground track under the driveway opening — counterbalance tail after parking post.')
  }

  if (config.gateType === 'telescopic_sliding') {
    notes.unshift(telescopicSchematicNote(config.widthMm))
    notes.push(
      'Telescopic: overlapping panels with depth stagger; parallel tracks; stack zone outside parking post.',
    )
  }

  if (config.gateType === 'radius_sliding') {
    notes.unshift(radiusSchematicNote(archedTop))
    notes.push(
      'Radius: articulated hinged train on curved footprint; park stubs outside guide post (not telescopic overlap).',
    )
  }

  if (isBifoldGate(config.gateType)) {
    notes.unshift(bifoldSchematicNote(config.gateType))
    notes.push(
      'Bifold: 50/50 panels per leaf with fold stile + hinge knuckles; stack pack outside hinge post(s).',
    )
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
