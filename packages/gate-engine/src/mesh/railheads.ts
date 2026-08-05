/**
 * Decorative railhead / finial cues for 3D mesh.
 * Role = `rail` so they sit ABOVE typed heightMm without expanding the
 * Phase 1 clear-opening envelope (CA: height = ground → top rail).
 */

import { getOptionQuantity } from '../internal/shared'
import {
  getExpectedDogBarRailheadCount,
  getExpectedTopRailheadCount,
} from '../rules/geometry'
import type { GateConfig } from '../types'
import type { GateMeshBox } from './types'

const FINIAL_HEIGHT_MM = 28
const FINIAL_WIDTH_MM = 10
/** Fraction down from top — dog-bar spear band (matches Victorian mid rail). */
const DOG_RAILHEAD_FROM_TOP = 0.62

function hasOption(config: GateConfig, key: string): boolean {
  return config.options.some((option) => option.key === key && option.enabled)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Place top finials along a leaf/panel span. Centers sit on the top rail;
 * half the finial rises above typed height (decorative only).
 */
export function pushTopRailheads(
  boxes: GateMeshBox[],
  args: {
    config: GateConfig
    idPrefix: string
    centerX: number
    widthMm: number
    leafHeightMm: number
    /** Span used for count formula (usually full clear opening). */
    countWidthMm?: number
    depthOffsetMm?: number
  },
): void {
  const { config, idPrefix, centerX, widthMm, leafHeightMm, depthOffsetMm = 0 } = args
  if (!hasOption(config, 'top_railheads')) return

  const countWidth = args.countWidthMm ?? config.widthMm
  const count = Math.min(
    getOptionQuantity(config, 'top_railheads'),
    getExpectedTopRailheadCount(countWidth),
  )
  if (count <= 0) return

  const left = centerX - widthMm / 2
  for (let i = 0; i < count; i += 1) {
    const t = (i + 0.5) / count
    const x = left + widthMm * t
    boxes.push({
      kind: 'box',
      id: `${idPrefix}-top-railhead-${i}`,
      widthMm: FINIAL_WIDTH_MM,
      heightMm: FINIAL_HEIGHT_MM,
      depthMm: FINIAL_WIDTH_MM,
      // Mostly above top rail — role rail excluded from envelope AABB.
      positionMm: [x, leafHeightMm + FINIAL_HEIGHT_MM * 0.35, depthOffsetMm],
      role: 'rail',
    })
  }
}

/** Small spear-band finials when dog_bar_railheads is enabled. */
export function pushDogBarRailheads(
  boxes: GateMeshBox[],
  args: {
    config: GateConfig
    idPrefix: string
    centerX: number
    widthMm: number
    leafHeightMm: number
    countWidthMm?: number
    depthOffsetMm?: number
  },
): void {
  const { config, idPrefix, centerX, widthMm, leafHeightMm, depthOffsetMm = 0 } = args
  if (!hasOption(config, 'dog_bar_railheads')) return

  const countWidth = args.countWidthMm ?? config.widthMm
  const count = Math.min(
    getOptionQuantity(config, 'dog_bar_railheads'),
    getExpectedDogBarRailheadCount(countWidth),
  )
  if (count <= 0) return

  const y = leafHeightMm * (1 - clamp(DOG_RAILHEAD_FROM_TOP, 0, 1))
  const left = centerX - widthMm / 2
  for (let i = 0; i < count; i += 1) {
    const t = (i + 0.5) / count
    boxes.push({
      kind: 'box',
      id: `${idPrefix}-dog-railhead-${i}`,
      widthMm: 8,
      heightMm: 14,
      depthMm: 8,
      positionMm: [left + widthMm * t, y, depthOffsetMm],
      role: 'rail',
    })
  }
}
