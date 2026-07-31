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
  tracked_sliding: 'schematic',
  cantilever_sliding: 'schematic',
  bifolding_double_swing: 'schematic',
  single_bifolding: 'schematic',
  telescopic_sliding: 'schematic',
  radius_sliding: 'schematic',
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
