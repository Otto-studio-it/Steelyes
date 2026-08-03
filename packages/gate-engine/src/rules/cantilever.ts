/**
 * Cantilever counterbalance tail rule — CA-05 (Marius 2026-07-28).
 *
 * clearOpeningMm  = width the customer enters (distance between posts)
 * tailMm          = round(clearOpeningMm / 3)   — MINIMUM
 * totalAssemblyMm = clearOpeningMm + tailMm
 *
 * Worked example: 4000 → tail 1333 → total run 5333 mm.
 * Both the 2D render plan and the 3D mesh plan must consume this module.
 */

/** Minimum counterbalance tail as a fraction of the clear opening. */
export const CANTILEVER_TAIL_RATIO = 1 / 3

/** @deprecated Use CANTILEVER_TAIL_RATIO — kept briefly for import migration. */
export const CANTILEVER_TAIL_RATIO_AT_4M = CANTILEVER_TAIL_RATIO

export function getCantileverTailRatio(_widthMm?: number): number {
  return CANTILEVER_TAIL_RATIO
}

/** Minimum tail length in mm (nearest mm; matches client 4000 → 1333). */
export function getCantileverTailMm(clearOpeningMm: number): number {
  return Math.round(Math.max(0, clearOpeningMm) * CANTILEVER_TAIL_RATIO)
}

/** Clear opening + minimum tail — parking-side run the site must provide. */
export function getCantileverTotalRunMm(clearOpeningMm: number): number {
  return Math.max(0, clearOpeningMm) + getCantileverTailMm(clearOpeningMm)
}

export type CantileverSiteSpace = {
  clearOpeningMm: number
  tailMm: number
  totalRunMm: number
}

export function getCantileverSiteSpace(clearOpeningMm: number): CantileverSiteSpace {
  const opening = Math.max(0, clearOpeningMm)
  const tailMm = getCantileverTailMm(opening)
  return {
    clearOpeningMm: opening,
    tailMm,
    totalRunMm: opening + tailMm,
  }
}

export function cantileverTailNote(widthMm: number): string {
  const { clearOpeningMm, tailMm, totalRunMm } = getCantileverSiteSpace(widthMm)
  return `Cantilever: opening ${clearOpeningMm} mm needs a minimum counterbalance tail of ${tailMm} mm (1/3) — allow at least ${totalRunMm} mm clear run on the parking side, plus posts and hardware.`
}
