'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Maximize2, X } from 'lucide-react'
import { useState } from 'react'

import { ColourFitPreview } from '@/components/configurator/ColourFitPreview'
import { ConfiguratorPreview } from '@/components/configurator/ConfiguratorPreview'
import { cn } from '@/lib/utils'
import type { GateConfig, TenantBundle } from '@steelyes/gate-engine'

type PreviewMode = 'design' | 'colour_fit'

type PreviewCanvasProps = {
  config: GateConfig
  compact?: boolean
  strip?: boolean
  className?: string
  /** @deprecated Tenant feature flags for schematic modes are unused. */
  tenant?: TenantBundle
  showDimensionOverlay?: boolean
  onDimensionOverlayClick?: () => void
  /** @deprecated Use allowColourFit. */
  showSecondaryModes?: boolean
  /** Colour fit is a configurator helper. Share/quote stays on the official master. */
  allowColourFit?: boolean
}

/**
 * Default customer preview is the official Design master.
 * Colour fit is live CAD (finish / mm / middle bar) and does not replace the master.
 */
export function PreviewCanvas({
  config,
  compact = false,
  strip = false,
  className = '',
  showDimensionOverlay = false,
  onDimensionOverlayClick,
  allowColourFit = true,
}: PreviewCanvasProps) {
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [mode, setMode] = useState<PreviewMode>('design')
  const previewMode: PreviewMode = allowColourFit ? mode : 'design'

  const previewCompact = strip || compact
  const minHeight = strip ? 'min-h-[28vh]' : 'min-h-[clamp(280px,44vh,520px)]'

  const canvas = (
    <div
      className={`overflow-hidden border border-steel/10 bg-[#F3F2EF] ${minHeight}`}
      data-testid="configurator-preview-pinned"
    >
      <div className={`flex items-center justify-between gap-2 ${strip ? 'px-3 py-2' : 'px-4 pt-4'}`}>
        {allowColourFit ? (
          <div className="flex gap-1" role="tablist" aria-label="Preview drawing">
            <button
              type="button"
              role="tab"
              aria-selected={previewMode === 'design'}
              onClick={() => setMode('design')}
              className={cn(
                'min-h-[36px] px-3 font-mono text-xs uppercase tracking-widest transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel/30',
                previewMode === 'design' ? 'bg-steel text-white' : 'text-steel hover:bg-white',
              )}
            >
              Design
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={previewMode === 'colour_fit'}
              onClick={() => setMode('colour_fit')}
              className={cn(
                'min-h-[36px] px-3 font-mono text-xs uppercase tracking-widest transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel/30',
                previewMode === 'colour_fit' ? 'bg-steel text-white' : 'text-steel hover:bg-white',
              )}
            >
              Colour fit
            </button>
          </div>
        ) : (
          <span className="font-mono text-xs uppercase tracking-widest text-steel">Design</span>
        )}
        {strip ? (
          <button
            type="button"
            onClick={() => setFullscreenOpen(true)}
            className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center border border-steel/15 text-muted transition hover:text-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel/30"
            aria-label="Open fullscreen preview"
          >
            <Maximize2 className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="relative">
        {previewMode === 'colour_fit' ? (
          <ColourFitPreview config={config} compact={previewCompact} />
        ) : (
          <ConfiguratorPreview
            config={config}
            viewMode="technical"
            compact={previewCompact}
            collapsible={false}
            pinned
            studio
            className="rounded-none border-0 shadow-none"
          />
        )}
        {showDimensionOverlay ? (
          <button
            type="button"
            onClick={onDimensionOverlayClick}
            className="absolute bottom-3 left-3 border border-white/20 bg-steel/90 px-3 py-2 font-mono text-xs uppercase tracking-widest text-white transition hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label={`Opening size ${config.widthMm} by ${config.heightMm} millimetres. Click to edit dimensions.`}
          >
            {config.widthMm} × {config.heightMm} mm
          </button>
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
                {previewMode === 'colour_fit' ? 'Colour fit preview' : 'Design preview'}
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
            <div className="flex-1 overflow-hidden bg-[#F3F2EF]">
              {previewMode === 'colour_fit' ? (
                <ColourFitPreview config={config} compact={false} />
              ) : (
                <ConfiguratorPreview
                  config={config}
                  viewMode="technical"
                  compact={false}
                  collapsible={false}
                  pinned
                  studio
                  className="rounded-none border-0 shadow-none"
                />
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
