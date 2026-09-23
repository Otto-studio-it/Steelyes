/**
 * Ship defaults — intake PDF 2026-07-26 + CA-01…CA-12 + explicit inventions
 * where Marius left a gap so the configurator can publish (owner: Ruben 2026-07-31).
 *
 * Anything marked SHIP_INVENTED must stay labelled in pricing notes / assumptions.
 * Prefer replacing with Marius confirmation later; do not silently change totals.
 */

/** Intake: +£50 per 100 mm height above reference band top. */
export const SIZE_UPLIFT_HEIGHT_STEP_MM = 100
export const SIZE_UPLIFT_HEIGHT_GBP = 50

/** Intake: +£50 per 200 mm width above reference band top. */
export const SIZE_UPLIFT_WIDTH_STEP_MM = 200
export const SIZE_UPLIFT_WIDTH_GBP = 50

/** Intake: ground clearance 50 mm (swing). */
export const SHIP_GROUND_CLEARANCE_MM = 50

/** Intake: picket spacing ~100 mm. */
export const SHIP_PICKET_SPACING_MM = 100

/** Intake: tracked runback = clear opening + 350 mm (rack + motor). */
export const TRACKED_RUNBACK_EXTRA_MM = 350

/**
 * Railhead unit price mid-band when no SKU selected.
 * Intake range £1.25–£25 — ship mid £12.50 until variant catalog confirmed.
 */
export const SHIP_RAILHEAD_UNIT_GBP = 12.5

/**
 * Aluminium upgrade. Client 2026-09-23: the configurator always shows £200.
 * The older £250 setup + per-panel + per-bar formula is not applied.
 */
export const ALUMINIUM_FLAT_GBP = 200
export const ALUMINIUM_SETUP_GBP = ALUMINIUM_FLAT_GBP
export const ALUMINIUM_PER_PANEL_GBP = 12.5
export const ALUMINIUM_PER_BAR_GBP = 12
/** Intake: composite panel face coverage ~139 mm. */
export const ALUMINIUM_PANEL_FACE_MM = 139
/** Ship invention: count horizontal bars as Victorian rail count. */
export const ALUMINIUM_HORIZONTAL_BARS = 4

/** Finish: standard powder coat included in FROM; face area for any future £55/m². */
export const FINISH_INCLUDED_IN_FROM = true
export const FINISH_EXTRA_RAL_GBP_PER_M2 = 55

export function aluminiumPanelCount(widthMm: number): number {
  return Math.max(1, Math.ceil(Math.max(0, widthMm) / ALUMINIUM_PANEL_FACE_MM))
}

export function aluminiumUpgradeGbp(_widthMm: number): number {
  return ALUMINIUM_FLAT_GBP
}

export function faceAreaM2(widthMm: number, heightMm: number): number {
  return (Math.max(0, widthMm) * Math.max(0, heightMm)) / 1_000_000
}
