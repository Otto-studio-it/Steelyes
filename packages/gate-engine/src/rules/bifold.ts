import type { GateType } from '../types'
import { getLeafCount } from '../internal/shared'

/**
 * Bifold fold geometry — CA-09 / CA-10 (2026-07-31).
 *
 * Always 2 panels per leaf, equal 50/50 split.
 * Collection always on the primary hinge side; left/right handing chosen at quote.
 */

/** Confirmed: panels per main leaf. */
export const BIFOLD_PANELS_PER_LEAF = 2

/** @deprecated Use BIFOLD_PANELS_PER_LEAF */
export const PROVISIONAL_BIFOLD_PANELS_PER_LEAF = BIFOLD_PANELS_PER_LEAF

/** Confirmed equal split. */
export const BIFOLD_PANEL_SPLIT_RATIO = 0.5

/** @deprecated Use BIFOLD_PANEL_SPLIT_RATIO */
export const PROVISIONAL_BIFOLD_PANEL_SPLIT_RATIO = BIFOLD_PANEL_SPLIT_RATIO

/** Handing is chosen at quote; preview default is hinge-left for schematic only. */
export type BifoldCollectionSide = 'hinge_left' | 'hinge_right'

/** Schematic preview default — not a fabrication lock. */
export const BIFOLD_PREVIEW_DEFAULT_HANDING: BifoldCollectionSide = 'hinge_left'

/** @deprecated Use BIFOLD_PREVIEW_DEFAULT_HANDING */
export const PROVISIONAL_SINGLE_BIFOLD_COLLECTION_SIDE = BIFOLD_PREVIEW_DEFAULT_HANDING

export function isBifoldGate(gateType: GateType): boolean {
  return gateType === 'bifolding_double_swing' || gateType === 'single_bifolding'
}

export function getBifoldPanelsPerLeaf(_gateType?: GateType): number {
  return BIFOLD_PANELS_PER_LEAF
}

/** Total folding panels across the opening (leaves × panels per leaf). */
export function getBifoldPanelCount(gateType: GateType): number {
  if (!isBifoldGate(gateType)) {
    return 0
  }
  return getLeafCount(gateType) * getBifoldPanelsPerLeaf(gateType)
}

/**
 * Collection is always on the hinge side (CA-10).
 * Returns the schematic preview handing default; real L/R is set at quote.
 */
export function getBifoldCollectionSide(gateType: GateType): BifoldCollectionSide | 'unconfirmed' {
  if (!isBifoldGate(gateType)) {
    return 'unconfirmed'
  }
  return BIFOLD_PREVIEW_DEFAULT_HANDING
}

export function bifoldSchematicNote(gateType: GateType): string {
  if (!isBifoldGate(gateType)) {
    return ''
  }

  const panels = getBifoldPanelCount(gateType)
  const perLeaf = getBifoldPanelsPerLeaf(gateType)

  if (gateType === 'single_bifolding') {
    return `Bifold: ${panels} folding panels (${perLeaf}/leaf, 50/50). Stack on hinge side — left/right handing chosen at quote (preview shows hinge-left).`
  }

  return `Bifold: ${panels} folding panels (${perLeaf} per leaf, 50/50 equal split).`
}
