import type { GateType } from '../types'

export type MotorMount = 'underground' | 'arm' | 'rack' | 'hydraulic'

export type GateMotorDefinition = {
  id: string
  brand: string
  label: string
  mount: MotorMount
  gateTypes: GateType[]
  maxLeafWeightKg: number | null
  accessories: string[]
  indicativeOnly: true
  notes: string
}

/** Schematic motor catalog — brands commonly installed on UK metal gates (FAAC, CAME, BFT). */
export const DEFAULT_MOTOR_CATALOG: GateMotorDefinition[] = [
  {
    id: 'came-frog-x-underground',
    brand: 'CAME',
    label: 'FROG-X underground swing',
    mount: 'underground',
    gateTypes: ['double_swing', 'single_swing', 'bifolding_double_swing', 'single_bifolding'],
    maxLeafWeightKg: 400,
    accessories: ['photocells', 'flashing_light', 'control_panel'],
    indicativeOnly: true,
    notes: 'Underground operator for residential and light industrial swing gates.',
  },
  {
    id: 'faac-400-swing-arm',
    brand: 'FAAC',
    label: '400 series swing arm',
    mount: 'arm',
    gateTypes: ['double_swing', 'single_swing'],
    maxLeafWeightKg: 500,
    accessories: ['photocells', 'radio_receiver', 'safety_edge'],
    indicativeOnly: true,
    notes: 'Articulated arm operator — common on UK driveway swing installations.',
  },
  {
    id: 'bft-deimos-sliding',
    brand: 'BFT',
    label: 'Deimos sliding rack',
    mount: 'rack',
    gateTypes: ['tracked_sliding', 'cantilever_sliding', 'telescopic_sliding'],
    maxLeafWeightKg: 800,
    accessories: ['photocells', 'warning_light', 'battery_backup'],
    indicativeOnly: true,
    notes: 'Rack-driven sliding operator for tracked and cantilever systems.',
  },
  {
    id: 'faac-740-sliding',
    brand: 'FAAC',
    label: '740 sliding operator',
    mount: 'rack',
    gateTypes: ['tracked_sliding', 'telescopic_sliding', 'radius_sliding'],
    maxLeafWeightKg: 1000,
    accessories: ['photocells', 'loop_detector', 'control_board'],
    indicativeOnly: true,
    notes: 'Heavy-duty sliding automation for wider openings.',
  },
]

export function listMotorsForGateType(gateType: GateType): GateMotorDefinition[] {
  return DEFAULT_MOTOR_CATALOG.filter((motor) => motor.gateTypes.includes(gateType))
}

export function findMotorDefinition(id: string): GateMotorDefinition | undefined {
  return DEFAULT_MOTOR_CATALOG.find((motor) => motor.id === id)
}
