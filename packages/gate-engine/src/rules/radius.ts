/**
 * Radius sliding definition — CA-12 (2026-07-31).
 *
 * Travel path is always curved. Top profile may be straight or curved
 * (curved top maps to the arched_top option in the configurator).
 */

export type RadiusTravelPath = 'curved'
export type RadiusTopProfile = 'straight' | 'curved'

export const RADIUS_TRAVEL_PATH: RadiusTravelPath = 'curved'

export function getRadiusTopProfile(archedTopEnabled: boolean): RadiusTopProfile {
  return archedTopEnabled ? 'curved' : 'straight'
}

export function radiusSchematicNote(archedTopEnabled: boolean): string {
  const top = getRadiusTopProfile(archedTopEnabled)
  return `Radius schematic: travel path always curved; top profile ${top} (toggle arched top for a curved crest). Not a straight-track product.`
}
