/**
 * Telescopic sliding geometry — CA-11 (2026-07-31).
 *
 * Default 3 panels. Overlap at ~4000 mm clear opening is 80–120 mm (schematic mid 100).
 * Front-most panel (approach face) is the motor-side leaf.
 */

export const TELESCOPIC_DEFAULT_PANEL_COUNT = 3

/** Client band at ~4000 mm clear opening. */
export const TELESCOPIC_OVERLAP_MM_MIN = 80
export const TELESCOPIC_OVERLAP_MM_MAX = 120

/** Mid-band used for labelled schematic until a tighter formula arrives. */
export const TELESCOPIC_OVERLAP_MM_SCHEMATIC = 100

export type TelescopicFrontPanel = 'motor_side'

export const TELESCOPIC_FRONT_PANEL: TelescopicFrontPanel = 'motor_side'

export function getTelescopicPanelCount(): number {
  return TELESCOPIC_DEFAULT_PANEL_COUNT
}

export function getTelescopicOverlapMm(_clearOpeningMm?: number): number {
  return TELESCOPIC_OVERLAP_MM_SCHEMATIC
}

export function telescopicSchematicNote(clearOpeningMm: number): string {
  const panels = getTelescopicPanelCount()
  const overlap = getTelescopicOverlapMm(clearOpeningMm)
  return `Telescopic schematic: ${panels} panels, ~${TELESCOPIC_OVERLAP_MM_MIN}–${TELESCOPIC_OVERLAP_MM_MAX} mm overlap (drawing uses ${overlap} mm mid-band at ~4000 mm). Front face = motor-side panel.`
}
