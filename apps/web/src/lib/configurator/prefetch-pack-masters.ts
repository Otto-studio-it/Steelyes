import { useEffect } from 'react'
import {
  CIRCLE_OVERLAY_PATHS,
  COLLAR_OVERLAY_PATHS,
  SILHOUETTE_INDEX,
  type GateType,
} from '@steelyes/gate-engine'

function packMasterPaths(gateType: GateType): string[] {
  const pack = SILHOUETTE_INDEX.packs[gateType]
  if (!pack) return []
  return Object.values(pack.silhouettes).map((entry) => entry.publicPath)
}

/**
 * Warm the browser cache for every official master in this pack plus deco overlays
 * so menu changes swap the Design drawing without a blank flash.
 */
export function prefetchPackMasters(gateType: GateType): void {
  if (typeof window === 'undefined') return
  const paths = [
    ...packMasterPaths(gateType),
    ...Object.values(CIRCLE_OVERLAY_PATHS),
    ...Object.values(COLLAR_OVERLAY_PATHS),
  ]
  for (const src of paths) {
    const image = new Image()
    image.src = src
  }
}

export function usePrefetchPackMasters(gateType: GateType): void {
  useEffect(() => {
    prefetchPackMasters(gateType)
  }, [gateType])
}
