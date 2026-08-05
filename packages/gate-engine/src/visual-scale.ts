/**
 * Visual boldness thickens member cross-sections for on-screen readability.
 *
 * NEVER use this scale for clear-opening width, leaf height, or other
 * tape-check envelope dimensions (CA-08 / AR Phase 1). Those stay true mm.
 */
export const VISUAL_BOLDNESS_SCALE = 1.25

export function scaleVisualBoldness(value: number): number {
  return value * VISUAL_BOLDNESS_SCALE
}
