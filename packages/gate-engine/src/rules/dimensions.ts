/**
 * Configurator dimension meaning — CA-08 (2026-07-31).
 *
 * widthMm  = clear opening between post inner faces (luce). Posts are not included.
 * heightMm = ground / threshold to top rail. Railheads sit above and do not count.
 *
 * Applies to every GateType. Cantilever counterbalance tail remains extra (CA-05).
 */

export const WIDTH_MEANING = 'clear_opening_between_posts' as const
export const HEIGHT_MEANING = 'ground_to_top_rail' as const

export type WidthMeaning = typeof WIDTH_MEANING
export type HeightMeaning = typeof HEIGHT_MEANING

export function dimensionMeaningNote(args?: { cantileverTailExtra?: boolean }): string {
  const base =
    'Width is the clear opening between post inner faces (posts not included). Height is ground to top rail — railheads above do not count in the typed height.'
  if (args?.cantileverTailExtra) {
    return `${base} Cantilever counterbalance tail is additional site run beyond that opening.`
  }
  return base
}

/** Worked example for double swing: 3000 clear → two leaves ≈ 1500 each. */
export function clearOpeningLeafWidthMm(clearOpeningMm: number, leafCount: number): number {
  const leaves = Math.max(1, leafCount)
  return Math.round(Math.max(0, clearOpeningMm) / leaves)
}
