'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

import { ConfiguratorPreview } from '@/components/configurator/ConfiguratorPreview'
import { CONFIGURATOR_3D_PREVIEW_ENABLED } from '@/lib/configurator/features'
import type { GateConfig } from '@steelyes/gate-engine'

const ConfiguratorPreview3D = dynamic(
  () => import('@/components/configurator/ConfiguratorPreview3D').then((module) => module.ConfiguratorPreview3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-[#1B1C1A]/10 bg-[#F7F5F2] px-4 text-sm text-[#5B514D]">
        Loading 3D preview…
      </div>
    ),
  },
)

export type ConfiguratorPreviewMode = '2d' | '3d'

type ConfiguratorPreviewPanelProps = {
  config: GateConfig
  compact?: boolean
  collapsible?: boolean
  className?: string
  mode?: ConfiguratorPreviewMode
  allowModeSwitch?: boolean
}

export function ConfiguratorPreviewPanel({
  config,
  compact = false,
  collapsible = false,
  className = '',
  mode: controlledMode,
  allowModeSwitch = CONFIGURATOR_3D_PREVIEW_ENABLED,
}: ConfiguratorPreviewPanelProps) {
  const [internalMode, setInternalMode] = useState<ConfiguratorPreviewMode>('2d')
  const mode = controlledMode ?? internalMode
  const canSwitch = allowModeSwitch && CONFIGURATOR_3D_PREVIEW_ENABLED && !compact

  return (
    <div className={className}>
      {canSwitch ? (
        <div className="mb-3 inline-flex rounded-full border border-[#1B1C1A]/10 bg-white p-1">
          {(['2d', '3d'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setInternalMode(option)}
              className={`min-h-[40px] rounded-full px-4 font-mono text-[10px] uppercase tracking-[0.18em] transition ${
                mode === option
                  ? 'bg-[#1B1C1A] text-white'
                  : 'text-[#6D615D] hover:text-[#9E000C]'
              }`}
              aria-pressed={mode === option}
            >
              {option} preview
            </button>
          ))}
        </div>
      ) : null}

      {mode === '3d' ? (
        <ConfiguratorPreview3D config={config} compact={compact} />
      ) : (
        <ConfiguratorPreview config={config} compact={compact} collapsible={collapsible} />
      )}

      {!compact ? (
        <p className="mt-2 px-1 text-xs leading-5 text-[#5B514D]">
          {mode === '3d'
            ? '3D preview is schematic and loaded on demand — final geometry and powder coat may vary.'
            : 'Finish preview is schematic — final powder coat may vary.'}
        </p>
      ) : null}
    </div>
  )
}
