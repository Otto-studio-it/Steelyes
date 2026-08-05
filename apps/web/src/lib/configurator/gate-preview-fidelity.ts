import type { GateType } from '@steelyes/gate-engine'

/**
 * Preview fidelity for Design masters — honesty badge only.
 * All types remain selectable (`configure`); schematic types get a label.
 *
 * Aligns with CONFIGURATOR_DATA_READINESS / GO_LIVE_LIMITATIONS:
 * swing Victorian ≈ workshop; everything else is labelled schematic.
 */
export type GatePreviewFidelity = 'workshop' | 'schematic'

const FIDELITY: Record<GateType, GatePreviewFidelity> = {
  double_swing: 'workshop',
  single_swing: 'workshop',
  tracked_sliding: 'schematic',
  cantilever_sliding: 'schematic',
  bifolding_double_swing: 'schematic',
  single_bifolding: 'schematic',
  telescopic_sliding: 'schematic',
  radius_sliding: 'schematic',
}

export function getGatePreviewFidelity(gateType: GateType): GatePreviewFidelity {
  return FIDELITY[gateType]
}

export function gatePreviewFidelityLabel(fidelity: GatePreviewFidelity): string {
  switch (fidelity) {
    case 'workshop':
      return 'Workshop'
    case 'schematic':
      return 'Schematic'
  }
}
