import { DEFAULT_PICKET_OUTER_MM, DEFAULT_TUBE_OUTER_MM } from '../geometry/constants'
import { scaleVisualBoldness } from '../visual-scale'
import type { GateMeshBox } from './types'

/** Face width of the leaf's perimeter box section (stiles + top / bottom members). */
export const LEAF_FRAME_PROFILE_MM = scaleVisualBoldness(DEFAULT_TUBE_OUTER_MM)

/** Victorian picket tube radius — shared by swing and sliding leaves. */
export const PICKET_TUBE_RADIUS_MM = scaleVisualBoldness(DEFAULT_PICKET_OUTER_MM) / 2

export type LeafPerimeterFrameArgs = {
  id: string
  centerX: number
  widthMm: number
  heightMm: number
  depthMm: number
  depthOffsetMm?: number
  /**
   * Arched leaves take their top from arch segments; stiles then stop where the arch
   * meets them (mm from ground). Defaults: straight top member at heightMm.
   */
  arch?: { leftTopMm: number; rightTopMm: number }
}

/**
 * Open perimeter frame for a Victorian leaf: two stiles + bottom member (+ straight top).
 *
 * Replaces the former solid width × height box, which hid every picket and rail inside an
 * opaque slab in 3D / AR. The outer extents are unchanged (stiles on the leaf edges, bottom
 * on the ground datum, tallest member at heightMm), so the CA-08 opening envelope still
 * measures clear opening × ground-to-top-rail.
 */
export function pushLeafPerimeterFrame(boxes: GateMeshBox[], args: LeafPerimeterFrameArgs): void {
  const { id, centerX, widthMm, heightMm, depthMm, depthOffsetMm = 0, arch } = args
  const profile = Math.min(LEAF_FRAME_PROFILE_MM, widthMm / 4, heightMm / 4)
  const innerWidth = Math.max(1, widthMm - profile * 2)
  const stiles = [
    { suffix: 'stile-left', x: centerX - widthMm / 2 + profile / 2, topMm: arch?.leftTopMm ?? heightMm },
    { suffix: 'stile-right', x: centerX + widthMm / 2 - profile / 2, topMm: arch?.rightTopMm ?? heightMm },
  ]

  for (const stile of stiles) {
    boxes.push({
      kind: 'box',
      id: `${id}-${stile.suffix}`,
      widthMm: profile,
      heightMm: stile.topMm,
      depthMm,
      positionMm: [stile.x, stile.topMm / 2, depthOffsetMm],
      role: 'frame',
    })
  }

  boxes.push({
    kind: 'box',
    id: `${id}-bottom`,
    widthMm: innerWidth,
    heightMm: profile,
    depthMm,
    positionMm: [centerX, profile / 2, depthOffsetMm],
    role: 'frame',
  })

  if (!arch) {
    boxes.push({
      kind: 'box',
      id: `${id}-top`,
      widthMm: innerWidth,
      heightMm: profile,
      depthMm,
      positionMm: [centerX, heightMm - profile / 2, depthOffsetMm],
      role: 'frame',
    })
  }
}
