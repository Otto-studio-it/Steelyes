/**
 * Radius sliding definition — CA-12 + photo folder (`foto /radius slidings gates`).
 *
 * Travel path is always curved (~90° round-the-corner). Top profile may be straight
 * or curved (curved top maps to `arched_top`). When arched, EVERY articulated panel
 * gets the curved crest — not only the lead.
 *
 * Topology: articulated panel *train* (hinged end-to-end on one track) — NOT
 * telescopic overlapping leaves. Linea guida / product renders show ~5–6 narrow panels.
 */

export type RadiusTravelPath = 'curved'
export type RadiusTopProfile = 'straight' | 'curved'

export const RADIUS_TRAVEL_PATH: RadiusTravelPath = 'curved'

/**
 * Articulated panel count for schematic CAD (photo-locked).
 * Linea guida ≈ 6; intake “2 / 3 near 2500” was too coarse vs installs.
 */
export function getRadiusLeafCount(clearOpeningMm: number): number {
  if (clearOpeningMm >= 3000) return 6
  if (clearOpeningMm >= 2200) return 5
  return 4
}

export function getRadiusTopProfile(archedTopEnabled: boolean): RadiusTopProfile {
  return archedTopEnabled ? 'curved' : 'straight'
}

export function radiusSchematicNote(archedTopEnabled: boolean): string {
  const top = getRadiusTopProfile(archedTopEnabled)
  return `Radius schematic: travel path always curved (~90° park); articulated multi-panel train on one track; top profile ${top} (arched_top curves every panel). Not a straight-track or telescopic product.`
}
