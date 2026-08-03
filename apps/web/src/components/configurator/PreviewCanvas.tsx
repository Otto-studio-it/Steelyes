'use client'

import dynamic from 'next/dynamic'
import * as Dialog from '@radix-ui/react-dialog'
import { Maximize2, MoreHorizontal, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { ConfiguratorPreview } from '@/components/configurator/ConfiguratorPreview'
import { ViewInYourSpaceButton } from '@/components/configurator/ViewInYourSpace'
import { captureConfiguratorEvent } from '@/lib/analytics/posthog'
import { CONFIGURATOR_3D_PREVIEW_ENABLED } from '@/lib/configurator/features'
import type { GateConfig, TenantBundle } from '@steelyes/gate-engine'

const ConfiguratorPreview3D = dynamic(
  () => import('@/components/configurator/ConfiguratorPreview3D').then((module) => module.ConfiguratorPreview3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[200px] items-center justify-center border border-white/10 bg-steel px-4 text-sm text-white/70">
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
      <div className="flex min-h-[200px] items-center justify-center border border-white/10 bg-steel px-4 text-sm text-white/70">
        Loading photo simulation…
      </div>
    ),
  },
)

type ConfiguratorPreviewMode = 'installation' | 'technical' | 'plan' | 'photo' | '3d'

type PreviewCanvasProps = {
  config: GateConfig
  compact?: boolean
  strip?: boolean
  className?: string
  tenant?: TenantBundle
  showDimensionOverlay?: boolean
  onDimensionOverlayClick?: () => void
  showSecondaryModes?: boolean
}

// Design (preloaded masters) first; Installation remains for colour / fit schematic.
const PRIMARY_MODES: { id: ConfiguratorPreviewMode; label: string }[] = [
  { id: 'technical', label: 'Design' },
  { id: 'installation', label: 'Installation' },
]

const SECONDARY_MODES: { id: ConfiguratorPreviewMode; label: string }[] = [
  { id: 'plan', label: 'Plan (schematic)' },
  { id: 'photo', label: 'Photo (schematic)' },
  { id: '3d', label: '3D (schematic)' },
]

function filterModes(tenant: TenantBundle | undefined, modes: { id: ConfiguratorPreviewMode; label: string }[]) {
  return modes.filter((option) => {
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
}

function getPreviewViewMode(mode: ConfiguratorPreviewMode): 'installation' | 'technical' | 'plan' {
  if (mode === 'technical') return 'technical'
  if (mode === 'plan') return 'plan'
  return 'installation'
}

function PreviewBody({
  config,
  mode,
  compact,
  load3dChunk,
  loadPhotoChunk,
}: {
  config: GateConfig
  mode: ConfiguratorPreviewMode
  compact: boolean
  load3dChunk: boolean
  loadPhotoChunk: boolean
}) {
  if (mode === '3d' && CONFIGURATOR_3D_PREVIEW_ENABLED && load3dChunk) {
    return <ConfiguratorPreview3D config={config} compact={compact} studio />
  }

  if (mode === 'photo' && loadPhotoChunk) {
    return <ConfiguratorPhotoPreview config={config} compact={compact} studio />
  }

  return (
    <ConfiguratorPreview
      config={config}
      viewMode={getPreviewViewMode(mode)}
      compact={compact}
      collapsible={false}
      pinned
      studio
      className="rounded-none border-0 shadow-none"
    />
  )
}

function ModeControls({
  mode,
  secondaryModes,
  menuOpen,
  onSelect,
  onToggleMenu,
  onFullscreen,
  showFullscreen,
  strip,
}: {
  mode: ConfiguratorPreviewMode
  secondaryModes: { id: ConfiguratorPreviewMode; label: string }[]
  menuOpen: boolean
  onSelect: (mode: ConfiguratorPreviewMode) => void
  onToggleMenu: () => void
  onFullscreen?: () => void
  showFullscreen?: boolean
  strip?: boolean
}) {
  return (
    <div className={`flex items-center justify-between gap-2 ${strip ? 'px-3 py-2' : 'px-4 pt-4'}`}>
      <div className="inline-flex border border-steel/15 bg-white p-0.5">
        {PRIMARY_MODES.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`min-h-[40px] px-3 font-mono text-xs uppercase tracking-widest transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel/30 ${
              mode === option.id ? 'bg-steel text-white' : 'text-muted hover:text-steel'
            }`}
            aria-pressed={mode === option.id}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="relative flex items-center gap-1">
        {secondaryModes.length > 0 ? (
          <>
            <button
              type="button"
              onClick={onToggleMenu}
              className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center border border-steel/15 text-muted transition hover:text-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel/30"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="More preview views"
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden />
            </button>
            {menuOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-full z-20 mt-1 min-w-[140px] border border-steel/12 bg-white py-1 shadow-sm"
              >
                {secondaryModes.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onSelect(option.id)
                      onToggleMenu()
                    }}
                    className={`block w-full px-4 py-2 text-left font-mono text-xs uppercase tracking-widest transition hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel/30 ${
                      mode === option.id ? 'text-steel' : 'text-muted'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </>
        ) : null}
        {showFullscreen ? (
          <button
            type="button"
            onClick={onFullscreen}
            className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center border border-steel/15 text-muted transition hover:text-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel/30"
            aria-label="Open fullscreen preview"
          >
            <Maximize2 className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export function PreviewCanvas({
  config,
  compact = false,
  strip = false,
  className = '',
  tenant,
  showDimensionOverlay = false,
  onDimensionOverlayClick,
  showSecondaryModes = true,
}: PreviewCanvasProps) {
  const [mode, setMode] = useState<ConfiguratorPreviewMode>('technical')
  const [menuOpen, setMenuOpen] = useState(false)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [load3dChunk, setLoad3dChunk] = useState(false)
  const [loadPhotoChunk, setLoadPhotoChunk] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const secondaryModes = showSecondaryModes ? filterModes(tenant, SECONDARY_MODES) : []

  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const handleModeSelect = (nextMode: ConfiguratorPreviewMode) => {
    if (nextMode === '3d') {
      setLoad3dChunk(true)
    }
    if (nextMode === 'photo') {
      setLoadPhotoChunk(true)
    }
    setMode(nextMode)
    captureConfiguratorEvent('preview mode changed', { mode: nextMode })
  }

  const previewCompact = strip || compact
  const minHeight = strip ? 'min-h-[28vh]' : 'min-h-[clamp(280px,44vh,520px)]'

  const canvas = (
    <div className={`overflow-hidden border border-steel/10 bg-[#F3F2EF] ${minHeight}`} data-testid="configurator-preview-pinned">
      <div ref={menuRef}>
        <ModeControls
          mode={mode}
          secondaryModes={secondaryModes}
          menuOpen={menuOpen}
          onSelect={handleModeSelect}
          onToggleMenu={() => setMenuOpen((open) => !open)}
          onFullscreen={() => setFullscreenOpen(true)}
          showFullscreen={strip}
          strip={strip}
        />
      </div>
      <div className="relative">
        <PreviewBody
          config={config}
          mode={mode}
          compact={previewCompact}
          load3dChunk={load3dChunk}
          loadPhotoChunk={loadPhotoChunk}
        />
        {mode === '3d' || mode === 'photo' || mode === 'plan' ? (
          <div className="pointer-events-none absolute left-3 top-3 border border-steel/15 bg-white/90 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            Schematic preview
          </div>
        ) : null}
        {showDimensionOverlay && mode !== 'technical' ? (
          <button
            type="button"
            onClick={onDimensionOverlayClick}
            className="absolute bottom-3 left-3 border border-white/20 bg-steel/90 px-3 py-2 font-mono text-xs uppercase tracking-widest text-white transition hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label={`Opening size ${config.widthMm} by ${config.heightMm} millimetres. Click to edit dimensions.`}
          >
            {config.widthMm} × {config.heightMm} mm
          </button>
        ) : null}
        {CONFIGURATOR_3D_PREVIEW_ENABLED ? (
          <div className="absolute bottom-3 right-3 z-10">
            <ViewInYourSpaceButton config={config} className="shadow-sm" />
          </div>
        ) : null}
      </div>
    </div>
  )

  return (
    <div className={className}>
      {canvas}

      <Dialog.Root open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-steel" />
          <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-steel focus:outline-none">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <Dialog.Title className="font-mono text-xs uppercase tracking-widest text-white/70">
                Gate preview
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-white/20 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  aria-label="Close fullscreen preview"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-hidden">
              <PreviewBody
                config={config}
                mode={mode}
                compact={false}
                load3dChunk={load3dChunk}
                loadPhotoChunk={loadPhotoChunk}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
