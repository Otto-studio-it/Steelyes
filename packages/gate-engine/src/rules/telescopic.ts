/**
 * Telescopic sliding geometry — intake 2026-07-26 (CA-13) + CA-11 overlap band.
 *
 * Panel count: Marius intake = 2 (supersedes provisional CA-11 “usually 3”).
 * Overlap at ~4000 mm clear opening remains 80–120 mm (schematic mid 100).
 * Closed stack thickness ~160 mm (intake). Front face = motor-side leaf.
 */

export const TELESCOPIC_DEFAULT_PANEL_COUNT = 2

/** Intake: closed stack thickness cue for 2D detail. */
export const TELESCOPIC_CLOSED_STACK_MM = 160

/** Client band at ~4000 mm clear opening (CA-11). */
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
  return `Telescopic: ${panels} panels (intake), ~${TELESCOPIC_OVERLAP_MM_MIN}–${TELESCOPIC_OVERLAP_MM_MAX} mm overlap (drawing uses ${overlap} mm mid-band). Closed stack ~${TELESCOPIC_CLOSED_STACK_MM} mm. Front face = motor-side panel.`
}
