/**
 * Cantilever counterbalance tail rule.
 *
 * The only client-confirmed data point is a 4m opening, where the
 * counterbalance tail equals 1/3 of the opening (see
 * docs/frontend/CLIENT_GATE_REQUIREMENTS_REFERENCE.md and the cantilever gate
 * audit). For every other width the tail is rendered at a schematic default
 * ratio; do not interpolate or invent engineering ratios until the client
 * confirms the full sizing table.
 *
 * This module is the single source of truth for the rule: both the 2D render
 * plan and the 3D mesh plan must consume it.
 */

export const CANTILEVER_RULE_WIDTH_MM = 4000
export const CANTILEVER_TAIL_RATIO_AT_4M = 1 / 3
export const CANTILEVER_TAIL_RATIO_DEFAULT = 0.28

export function getCantileverTailRatio(widthMm: number): number {
  return widthMm === CANTILEVER_RULE_WIDTH_MM
    ? CANTILEVER_TAIL_RATIO_AT_4M
    : CANTILEVER_TAIL_RATIO_DEFAULT
}

export function cantileverTailNote(widthMm: number): string {
  return widthMm === CANTILEVER_RULE_WIDTH_MM
    ? 'Cantilever counterbalance tail is shown at a 1/3 ratio for a 4m opening.'
    : 'Cantilever counterbalance tail is shown schematically.'
}
