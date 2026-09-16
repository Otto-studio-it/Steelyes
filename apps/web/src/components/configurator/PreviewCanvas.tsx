'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Maximize2, X } from 'lucide-react'
import { useState } from 'react'

import { ColourFitPreview } from '@/components/configurator/ColourFitPreview'
import { WorkshopDrawingDisclosure } from '@/components/configurator/WorkshopDrawingDisclosure'
import type { GateConfig, TenantBundle } from '@steelyes/gate-engine'

type PreviewCanvasProps = {
  config: GateConfig
  compact?: boolean
  strip?: boolean
  className?: string
  /** @deprecated Tenant feature flags for schematic modes are unused. */
  tenant?: TenantBundle
  showDimensionOverlay?: boolean
  onDimensionOverlayClick?: () => void
  /** @deprecated Secondary schematic modes removed. */
  showSecondaryModes?: boolean
  /** @deprecated Colour fit is now the default Design drawing. */
  allowColourFit?: boolean
}

/**
 * Customer preview is live CAD (installation). Official masters sit under Workshop drawing.
 */
export function PreviewCanvas({
  config,
  compact = false,
  strip = false,
  className = '',
  showDimensionOverlay = false,
  onDimensionOverlayClick,
}: PreviewCanvasProps) {
  const [fullscreenOpen, setFullscreenOpen] = useState(false)

  const previewCompact = strip || compact
  const minHeight = strip ? 'min-h-[28vh]' : 'min-h-[clamp(280px,44vh,520px)]'

  const canvas = (
    <div
      className={`overflow-hidden border border-steel/10 bg-[#F3F2EF] ${minHeight}`}
      data-testid="configurator-preview-pinned"
    >
      <div className={`flex items-center justify-between gap-2 ${strip ? 'px-3 py-2' : 'px-4 pt-4'}`}>
        <span className="font-mono text-xs uppercase tracking-widest text-steel">Design</span>
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
        <ColourFitPreview config={config} compact={previewCompact} />
        {showDimensionOverlay ? (
          <button
            type="button"
            onClick={onDimensionOverlayClick}
            className="absolute bottom-3 left-3 z-10 border border-white/20 bg-steel/90 px-3 py-2 font-mono text-xs uppercase tracking-widest text-white transition hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label={`Opening size ${config.widthMm} by ${config.heightMm} millimetres. Click to edit dimensions.`}
          >
            {config.widthMm} × {config.heightMm} mm
          </button>
        ) : null}
      </div>

      <WorkshopDrawingDisclosure config={config} />
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
                Design preview
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
            <div className="flex-1 overflow-auto bg-[#F3F2EF]">
              <ColourFitPreview config={config} compact={false} />
              <WorkshopDrawingDisclosure config={config} />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
