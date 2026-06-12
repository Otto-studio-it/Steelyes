import type { FinishMaterialTokens } from '../finishes'
import type { FinishCode, GateConfig, GateType } from '../types'

export type GateMeshBoxRole = 'frame' | 'panel' | 'post' | 'rail' | 'counterweight' | 'bar'

export type GateMeshBox = {
  kind: 'box'
  id: string
  widthMm: number
  heightMm: number
  depthMm: number
  positionMm: [number, number, number]
  role: GateMeshBoxRole
}

export type GateMeshCylinder = {
  kind: 'cylinder'
  id: string
  radiusMm: number
  heightMm: number
  positionMm: [number, number, number]
  role: GateMeshBoxRole
}

export type GateMeshPlan = {
  gateType: GateType
  finish: FinishCode
  material: FinishMaterialTokens
  boxes: GateMeshBox[]
  cylinders: GateMeshCylinder[]
  notes: string[]
}

export const MM_TO_SCENE_UNITS = 0.001

export function mmToSceneUnits(valueMm: number): number {
  return valueMm * MM_TO_SCENE_UNITS
}
