'use client'

import { ConfiguratorPreview } from '@/components/configurator/ConfiguratorPreview'
import type { GateConfig } from '@steelyes/gate-engine'

type ConfiguratorPreviewPanelProps = {
  config: GateConfig
  compact?: boolean
  collapsible?: boolean
  className?: string
  mode?: '2d'
}

export function ConfiguratorPreviewPanel({
  config,
  compact = false,
  collapsible = false,
  className = '',
  mode = '2d',
}: ConfiguratorPreviewPanelProps) {
  if (mode !== '2d') {
    return null
  }

  return (
    <div className={className}>
      <ConfiguratorPreview config={config} compact={compact} collapsible={collapsible} />
      {!compact ? (
        <p className="mt-2 px-1 text-xs leading-5 text-[#5B514D]">
          Finish preview is schematic — final powder coat may vary.
        </p>
      ) : null}
    </div>
  )
}
