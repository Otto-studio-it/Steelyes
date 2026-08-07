'use client'

import type { GateConfig } from '@steelyes/gate-engine'

import { TechnicalMasterPreview } from '@/components/configurator/TechnicalMasterPreview'

type ConfiguratorPreviewProps = {
  config: GateConfig
  /** @deprecated Only Design masters are shown; non-technical modes are ignored. */
  viewMode?: string
  compact?: boolean
  collapsible?: boolean
  pinned?: boolean
  studio?: boolean
  className?: string
}

/** Customer preview = official 2D Design masters only. */
export function ConfiguratorPreview({
  config,
  compact,
  collapsible,
  pinned,
  studio,
  className,
}: ConfiguratorPreviewProps) {
  return (
    <TechnicalMasterPreview
      config={config}
      compact={compact}
      collapsible={collapsible}
      pinned={pinned}
      studio={studio}
      className={className}
    />
  )
}
