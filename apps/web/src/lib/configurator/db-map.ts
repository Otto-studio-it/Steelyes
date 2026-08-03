import type { GateType } from '@steelyes/gate-engine'
import type { Database } from '@/types/database.types'

export type DbGateType = Database['public']['Enums']['gate_type']

const GATE_TYPE_TO_DB: Record<GateType, DbGateType> = {
  double_swing: 'double-swing',
  single_swing: 'single-swing',
  tracked_sliding: 'sliding',
  cantilever_sliding: 'cantilevered',
  bifolding_double_swing: 'bifolding',
  single_bifolding: 'bifolding-single',
  telescopic_sliding: 'telescopic',
  radius_sliding: 'sliding-radius',
}

export function mapGateTypeToDb(gateType: GateType): DbGateType {
  return GATE_TYPE_TO_DB[gateType]
}
