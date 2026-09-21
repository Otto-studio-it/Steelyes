import {
  buildGateMeshPlan,
  mmToSceneUnits,
  type GateConfig,
  type GateMeshBoxRole,
  type GateMeshPlan,
} from '@steelyes/gate-engine'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

function roleColor(role: GateMeshBoxRole, baseHex: string): THREE.Color {
  const color = new THREE.Color(baseHex)
  if (role === 'post') color.offsetHSL(0, -0.06, -0.1)
  if (role === 'rail') color.offsetHSL(0, -0.12, 0.06)
  if (role === 'bar') color.offsetHSL(0, 0.02, 0.04)
  if (role === 'counterweight') color.offsetHSL(0, -0.05, -0.05)
  return color
}

/** Opaque on purpose: USDZ exports `opacity` even when `transparent` is off, and steel is not see-through. */
function buildMaterial(plan: GateMeshPlan, role: GateMeshBoxRole): THREE.MeshStandardMaterial {
  const metalness =
    role === 'post'
      ? plan.material.metalness * 0.65
      : role === 'bar'
        ? Math.min(1, plan.material.metalness * 1.08)
        : role === 'rail'
          ? plan.material.metalness * 0.92
          : plan.material.metalness
  const roughness =
    role === 'panel'
      ? Math.min(1, plan.material.roughness + 0.1)
      : role === 'bar'
        ? Math.max(0.12, plan.material.roughness * 0.85)
        : role === 'post'
          ? Math.min(1, plan.material.roughness + 0.06)
          : plan.material.roughness

  const material = new THREE.MeshStandardMaterial({
    color: roleColor(role, plan.material.colorHex),
    metalness,
    roughness,
  })
  material.name = `steelyes-${role}`
  return material
}

/**
 * Build a Three.js scene graph from GateConfig — metres (mm × 0.001) for AR real scale.
 *
 * One merged mesh + one material per role (≈6 draw calls instead of one per picket), so the
 * GLB / USDZ stay small and Quick Look / Scene Viewer stay smooth on phones.
 *
 * Returns a wrapper `root`: USDZExporter discards the transform of the object it is given,
 * so the floor snap lives on the child `gate` group where both exporters keep it.
 */
export function buildGateThreeGroup(config: GateConfig): {
  root: THREE.Group
  plan: GateMeshPlan
  dispose: () => void
} {
  const plan = buildGateMeshPlan(config)
  const byRole = new Map<GateMeshBoxRole, THREE.BufferGeometry[]>()

  const collect = (
    role: GateMeshBoxRole,
    geometry: THREE.BufferGeometry,
    positionMm: [number, number, number],
  ) => {
    geometry.translate(
      mmToSceneUnits(positionMm[0]),
      mmToSceneUnits(positionMm[1]),
      mmToSceneUnits(positionMm[2]),
    )
    const list = byRole.get(role) ?? []
    list.push(geometry)
    byRole.set(role, list)
  }

  for (const box of plan.boxes) {
    collect(
      box.role,
      new THREE.BoxGeometry(
        mmToSceneUnits(box.widthMm),
        mmToSceneUnits(box.heightMm),
        mmToSceneUnits(box.depthMm),
      ),
      box.positionMm,
    )
  }

  for (const cylinder of plan.cylinders) {
    const radius = mmToSceneUnits(cylinder.radiusMm)
    collect(
      cylinder.role,
      new THREE.CylinderGeometry(radius, radius, mmToSceneUnits(cylinder.heightMm), 12),
      cylinder.positionMm,
    )
  }

  const gate = new THREE.Group()
  gate.name = `steelyes-gate-${config.gateType}`
  const disposables: { dispose: () => void }[] = []

  byRole.forEach((parts, role) => {
    const merged = mergeGeometries(parts, false)
    parts.forEach((part) => part.dispose())
    if (!merged) return
    const material = buildMaterial(plan, role)
    const mesh = new THREE.Mesh(merged, material)
    mesh.name = `gate-${role}`
    gate.add(mesh)
    disposables.push(merged, material)
  })

  // Sit the gate on y=0 so Quick Look / Scene Viewer place the base on the floor.
  const bounds = new THREE.Box3().setFromObject(gate)
  if (Number.isFinite(bounds.min.y)) {
    gate.position.y -= bounds.min.y
  }

  const root = new THREE.Group()
  root.name = 'steelyes-gate-root'
  root.add(gate)
  // Exporters read local matrices; nothing renders this graph, so refresh them explicitly.
  root.updateMatrixWorld(true)

  return {
    root,
    plan,
    dispose: () => disposables.forEach((item) => item.dispose()),
  }
}
