/**
 * Telescopic sliding geometry — CA-11 + photo folder (`foto /telescopic slidings gates`).
 *
 * Panel count: **3** (CA-11 “di solito 3”; linea guida + industrial installs).
 * 2-leaf Combiarialdo sheet / formula LA=LB=C/2+300 remains a product VARIANT, not FROM default.
 * Overlap at ~4000 mm clear opening: 80–120 mm (schematic mid 100) — CA-11 band.
 * Structural leaf-tail language from 2-leaf tech sheet: +300 mm beyond C/n (schematic cue).
 * Closed stack thickness ~160 mm (intake). Front face = motor-side leaf.
 */

export const TELESCOPIC_DEFAULT_PANEL_COUNT = 3

/** Intake: closed stack thickness cue for 2D detail. */
export const TELESCOPIC_CLOSED_STACK_MM = 160

/** Client band at ~4000 mm clear opening (CA-11). */
export const TELESCOPIC_OVERLAP_MM_MIN = 80
export const TELESCOPIC_OVERLAP_MM_MAX = 120

/** Mid-band used for labelled schematic until a tighter formula arrives. */
export const TELESCOPIC_OVERLAP_MM_SCHEMATIC = 100

/**
 * Tech-sheet leaf extension beyond C/n (from 2-leaf formula L = C/2 + 300).
 * Used as elevation readability cue so panels clearly overlap; not a quoted dim.
 */
export const TELESCOPIC_LEAF_TAIL_MM = 300

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
  return `Telescopic: ${panels} overlapping panels (CA-11), ~${TELESCOPIC_OVERLAP_MM_MIN}–${TELESCOPIC_OVERLAP_MM_MAX} mm overlap (drawing uses ${overlap} mm mid-band). Leaf tail cue ~${TELESCOPIC_LEAF_TAIL_MM} mm. Closed stack ~${TELESCOPIC_CLOSED_STACK_MM} mm. Front face = motor-side panel.`
}
