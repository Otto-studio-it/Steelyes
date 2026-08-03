import type { GateType } from '@steelyes/gate-engine'

/**
 * Day-14 honesty tiers (DELIVERY_ROADMAP_2W):
 * - configure: full flow
 * - schematic: explore with labelled schematic (not fabrication-truth)
 * - enquire: do not configure — contact sales
 */
export type GateTypeAvailability = 'configure' | 'schematic' | 'enquire'

const AVAILABILITY: Record<GateType, GateTypeAvailability> = {
  double_swing: 'configure',
  single_swing: 'configure',
  tracked_sliding: 'configure',
  cantilever_sliding: 'configure',
  bifolding_double_swing: 'configure',
  single_bifolding: 'configure',
  telescopic_sliding: 'configure',
  radius_sliding: 'configure',
}

export function getGateTypeAvailability(gateType: GateType): GateTypeAvailability {
  return AVAILABILITY[gateType]
}

export function gateTypeAvailabilityLabel(availability: GateTypeAvailability): string {
  switch (availability) {
    case 'configure':
      return 'Configure'
    case 'schematic':
      return 'Schematic'
    case 'enquire':
      return 'Enquire'
  }
}
