'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { PreviewCanvas } from '@/components/configurator/PreviewCanvas'
import { useSheetSwipeDismiss } from '@/hooks/useSheetSwipeDismiss'
import type { GateConfig, TenantBundle } from '@steelyes/gate-engine'

type MobilePreviewSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: GateConfig
  tenant?: TenantBundle
  showDimensionOverlay?: boolean
  onDimensionOverlayClick?: () => void
  showSecondaryModes?: boolean
}

/**
 * Full-resolution gate preview presented as a bottom sheet (85dvh).
 * Replaces the always-on 28vh strip — the heavy 3D/photo chunks only load here,
 * keeping the in-flow chip lightweight.
 */
export function MobilePreviewSheet({
  open,
  onOpenChange,
  config,
  tenant,
  showDimensionOverlay = false,
  onDimensionOverlayClick,
  showSecondaryModes = true,
}: MobilePreviewSheetProps) {
  const swipe = useSheetSwipeDismiss(() => onOpenChange(false))

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="cfg-sheet-overlay fixed inset-0 z-50 bg-steel/60 backdrop-blur-sm" />
        <Dialog.Content
          className="cfg-sheet-content cfg-sheet-draggable fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col border-t border-white/10 bg-steel focus:outline-none"
          style={{ overscrollBehavior: 'contain', paddingBottom: 'env(safe-area-inset-bottom)', ...swipe.contentStyle }}
        >
          <div className="relative flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <span
              aria-hidden
              className="absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-white/25"
            />
            <div className="flex-1 py-2" {...swipe.handleProps}>
              <Dialog.Title className="font-mono text-xs uppercase tracking-widest text-white/70">
                Gate preview
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-white/20 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Close gate preview"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-3" style={{ overscrollBehavior: 'contain' }}>
            <PreviewCanvas
              config={config}
              tenant={tenant}
              showDimensionOverlay={showDimensionOverlay}
              onDimensionOverlayClick={onDimensionOverlayClick}
              showSecondaryModes={showSecondaryModes}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
