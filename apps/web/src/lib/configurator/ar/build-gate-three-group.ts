import {
  buildGateMeshPlan,
  mmToSceneUnits,
  type GateConfig,
  type GateMeshPlan,
} from '@steelyes/gate-engine'
import * as THREE from 'three'

export type BuildGateThreeGroupOptions = {
  /** Studio lighting accents for the in-app 3D tab (not used for AR export). */
  studio?: boolean
  castShadow?: boolean
  /** Snap group so its lowest point sits on y=0 (required for Quick Look / Scene Viewer). */
  snapToFloor?: boolean
}

function roleOpacity(role: string): number {
  if (role === 'panel') return 0.92
  if (role === 'rail') return 0.75
  if (role === 'bar') return 0.88
  if (role === 'counterweight') return 0.88
  return 1
}

function isDarkFinish(baseHex: string): boolean {
  const color = new THREE.Color(baseHex)
  const hsl = { h: 0, s: 0, l: 0 }
  color.getHSL(hsl)
  return hsl.l < 0.42
}

function roleColor(role: string, baseHex: string, studio: boolean): THREE.Color {
  const color = new THREE.Color(baseHex)
  if (role === 'post') color.offsetHSL(0, -0.08, -0.12)
  if (role === 'rail') color.offsetHSL(0, -0.2, 0.08)
  if (role === 'counterweight') color.offsetHSL(0, -0.05, -0.05)
  if (studio && isDarkFinish(baseHex)) {
    color.offsetHSL(0, -0.04, 0.34)
  }
  return color
}

function buildMaterial(
  plan: GateMeshPlan,
  role: string,
  studio: boolean,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: roleColor(role, plan.material.colorHex, studio),
    metalness: role === 'post' ? plan.material.metalness * 0.7 : plan.material.metalness,
    roughness: role === 'panel' ? plan.material.roughness + 0.08 : plan.material.roughness,
    transparent: role === 'panel' || role === 'counterweight',
    opacity: roleOpacity(role),
    emissive: studio && isDarkFinish(plan.material.colorHex) ? new THREE.Color('#c8c2b8') : undefined,
    emissiveIntensity: studio && isDarkFinish(plan.material.colorHex) ? 0.14 : 0,
  })
}

/**
 * Build a Three.js group from GateConfig — metres (mm × 0.001) for AR real scale.
 * Shared by the 3D preview tab and AR export so both use the same mesh envelope.
 */
export function buildGateThreeGroup(
  config: GateConfig,
  options: BuildGateThreeGroupOptions = {},
): {
  group: THREE.Group
  plan: GateMeshPlan
  dispose: () => void
} {
  const { studio = false, castShadow = false, snapToFloor = true } = options
  const plan = buildGateMeshPlan(config)
  const group = new THREE.Group()
  group.name = `steelyes-gate-${config.gateType}`

  const geometries: THREE.BufferGeometry[] = []
  const materials: THREE.Material[] = []

  for (const box of plan.boxes) {
    const geometry = new THREE.BoxGeometry(
      mmToSceneUnits(box.widthMm),
      mmToSceneUnits(box.heightMm),
      mmToSceneUnits(box.depthMm),
    )
    const material = buildMaterial(plan, box.role, studio)
    geometries.push(geometry)
    materials.push(material)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = castShadow
    mesh.receiveShadow = castShadow
    mesh.position.set(
      mmToSceneUnits(box.positionMm[0]),
      mmToSceneUnits(box.positionMm[1]),
      mmToSceneUnits(box.positionMm[2]),
    )
    mesh.name = box.id
    group.add(mesh)
  }

  for (const cylinder of plan.cylinders) {
    const geometry = new THREE.CylinderGeometry(
      mmToSceneUnits(cylinder.radiusMm),
      mmToSceneUnits(cylinder.radiusMm),
      mmToSceneUnits(cylinder.heightMm),
      12,
    )
    const material = buildMaterial(plan, cylinder.role, studio)
    geometries.push(geometry)
    materials.push(material)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = castShadow
    mesh.receiveShadow = castShadow
    mesh.position.set(
      mmToSceneUnits(cylinder.positionMm[0]),
      mmToSceneUnits(cylinder.positionMm[1]),
      mmToSceneUnits(cylinder.positionMm[2]),
    )
    mesh.name = cylinder.id
    group.add(mesh)
  }

  // Sit the gate on y=0 so Quick Look / Scene Viewer place the base on the floor.
  if (snapToFloor) {
    const bounds = new THREE.Box3().setFromObject(group)
    if (Number.isFinite(bounds.min.y)) {
      group.position.y -= bounds.min.y
    }
  }

  return {
    group,
    plan,
    dispose: () => {
      for (const geometry of geometries) geometry.dispose()
      for (const material of materials) material.dispose()
    },
  }
}
