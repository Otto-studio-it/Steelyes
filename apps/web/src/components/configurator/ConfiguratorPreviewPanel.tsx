'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { ConfiguratorPreview } from '@/components/configurator/ConfiguratorPreview'
import { captureConfiguratorEvent } from '@/lib/analytics/posthog'
import { CONFIGURATOR_3D_PREVIEW_ENABLED } from '@/lib/configurator/features'
import type { GateConfig } from '@steelyes/gate-engine'

const ConfiguratorPreview3D = dynamic(
  () => import('@/components/configurator/ConfiguratorPreview3D').then((module) => module.ConfiguratorPreview3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-white/10 bg-steel/90 px-4 text-sm text-white/70">
        Loading 3D preview…
      </div>
    ),
  },
)

const ConfiguratorPhotoPreview = dynamic(
  () => import('@/components/configurator/ConfiguratorPhotoPreview').then((module) => module.ConfiguratorPhotoPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-steel/10 bg-paper px-4 text-sm text-muted">
        Loading photo simulation…
      </div>
    ),
  },
)

export type ConfiguratorPreviewMode = 'installation' | 'technical' | 'plan' | 'photo' | '3d'

type ConfiguratorPreviewPanelProps = {
  config: GateConfig
  compact?: boolean
  collapsible?: boolean
  pinned?: boolean
  className?: string
  mode?: ConfiguratorPreviewMode
  allowModeSwitch?: boolean
  tenant?: import('@steelyes/gate-engine').TenantBundle
}

const MODE_OPTIONS: { id: ConfiguratorPreviewMode; label: string }[] = [
  { id: 'installation', label: 'Installation' },
  { id: 'technical', label: 'Technical' },
  { id: 'plan', label: 'Plan' },
  { id: 'photo', label: 'Photo' },
  { id: '3d', label: '3D' },
]

function PreviewModeTabs({
  mode,
  pinned,
  visibleModes,
  onSelect,
}: {
  mode: ConfiguratorPreviewMode
  pinned: boolean
  visibleModes: { id: ConfiguratorPreviewMode; label: string }[]
  onSelect: (mode: ConfiguratorPreviewMode) => void
}) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 ${pinned ? 'px-4 pt-4' : 'mb-3'}`}>
      <p className={`font-mono text-[10px] uppercase tracking-[0.24em] ${pinned ? 'text-white/55' : 'text-muted'}`}>
        Preview mode
      </p>
      <div
        className={`inline-flex rounded-full border p-1 ${
          pinned ? 'border-white/15 bg-white/10' : 'border-steel/10 bg-white shadow-sm'
        }`}
      >
        {visibleModes.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              onSelect(option.id)
              captureConfiguratorEvent('preview mode changed', { mode: option.id })
            }}
            className={`min-h-[40px] rounded-full px-4 font-mono text-[10px] uppercase tracking-[0.18em] transition ${
              mode === option.id
                ? pinned
                  ? 'bg-white text-steel'
                  : 'bg-steel text-white'
                : pinned
                  ? 'text-white/70 hover:text-white'
                  : 'text-muted hover:text-primary'
            }`}
            aria-pressed={mode === option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ConfiguratorPreviewPanel({
  config,
  compact = false,
  collapsible = false,
  pinned = false,
  className = '',
  mode: controlledMode,
  allowModeSwitch = true,
  tenant,
}: ConfiguratorPreviewPanelProps) {
  const [internalMode, setInternalMode] = useState<ConfiguratorPreviewMode>('installation')
  const [load3dChunk, setLoad3dChunk] = useState(false)
  const [loadPhotoChunk, setLoadPhotoChunk] = useState(false)
  const mode = controlledMode ?? internalMode
  const previewCompact = pinned ? false : compact
  const visibleModes = MODE_OPTIONS.filter((option) => {
    if (option.id === '3d' && (!CONFIGURATOR_3D_PREVIEW_ENABLED || tenant?.features.enable3d === false)) {
      return false
    }
    if (option.id === 'plan' && tenant?.features.enablePlanView === false) {
      return false
    }
    if (option.id === 'photo' && tenant?.features.enablePhotoOverlay === false) {
      return false
    }
    return true
  })
  const canSwitch = allowModeSwitch && !compact

  useEffect(() => {
    if (mode === '3d') {
      setLoad3dChunk(true)
    }
    if (mode === 'photo') {
      setLoadPhotoChunk(true)
    }
  }, [mode])

  const previewBody =
    mode === '3d' && CONFIGURATOR_3D_PREVIEW_ENABLED && load3dChunk ? (
      <ConfiguratorPreview3D config={config} compact={previewCompact} studio={pinned || !compact} />
    ) : mode === 'photo' && loadPhotoChunk ? (
      <ConfiguratorPhotoPreview config={config} compact={previewCompact} studio={pinned || !compact} />
    ) : (
      <ConfiguratorPreview
        config={config}
        viewMode={mode === 'technical' ? 'technical' : mode === 'plan' ? 'plan' : 'installation'}
        compact={previewCompact}
        collapsible={pinned ? false : collapsible}
        pinned={pinned}
        studio={pinned || !compact}
        className={pinned ? 'rounded-none border-0 shadow-none' : ''}
      />
    )

  return (
    <div className={className} data-testid={pinned ? 'configurator-preview-pinned' : undefined}>
      {pinned ? (
        <div className="overflow-hidden rounded-[20px] border border-white/10 bg-steel shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          {canSwitch ? (
            <PreviewModeTabs
              mode={mode}
              pinned
              visibleModes={visibleModes}
              onSelect={setInternalMode}
            />
          ) : null}
          {previewBody}
        </div>
      ) : (
        <>
          {canSwitch ? (
            <PreviewModeTabs
              mode={mode}
              pinned={false}
              visibleModes={visibleModes}
              onSelect={setInternalMode}
            />
          ) : null}
          {previewBody}
        </>
      )}

      {!previewCompact ? (
        <p className="mt-2 px-1 text-xs leading-5 text-muted-deep">
          {mode === '3d'
            ? '3D schematic view with mounting posts — final geometry and powder coat may vary.'
            : mode === 'photo'
              ? 'Photo simulation overlays your schematic gate on a reference installation image.'
              : mode === 'plan'
              ? 'Top-down plan view showing driveway layout, opening width, and leaf or panel sweep.'
              : mode === 'installation'
                ? 'Installation view with ground context, shadow, and configurable mounting posts.'
                : 'Technical drawing with dimension annotations for survey and fabrication reference.'}
        </p>
      ) : null}
    </div>
  )
}
