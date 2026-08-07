'use client'

import { Maximize2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  resolveSilhouette,
  SilhouetteResolveError,
  type GateConfig,
  type TenantBundle,
} from '@steelyes/gate-engine'

import { MobilePreviewSheet } from '@/components/configurator/mobile/MobilePreviewSheet'
import { finishLabel, gateTypeLabel } from '@/lib/configurator/labels'

type MobilePreviewChipProps = {
  config: GateConfig
  tenant?: TenantBundle
  showDimensionOverlay?: boolean
  onDimensionOverlayClick?: () => void
}

/**
 * Compact 96px Design-preview chip. Renders the preloaded master SVG thumbnail
 * (no live CAD fallback, no 3D/photo chunk) and opens the full bottom sheet on tap.
 * Fixed height keeps CLS at zero versus the previous 28vh strip.
 */
export function MobilePreviewChip({
  config,
  tenant,
  showDimensionOverlay = false,
  onDimensionOverlayClick,
}: MobilePreviewChipProps) {
  const [open, setOpen] = useState(false)

  const resolved = useMemo(() => {
    try {
      return { ok: true as const, value: resolveSilhouette(config) }
    } catch (error) {
      const message =
        error instanceof SilhouetteResolveError
          ? error.message
          : 'Preloaded design master is unavailable for this configuration.'
      return { ok: false as const, message }
    }
  }, [config])

  const summary = `${gateTypeLabel(config.gateType)} · ${config.widthMm} × ${config.heightMm} mm · ${finishLabel(config.finish, config.customFinishHex)}`

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-24 w-full items-center gap-3 border border-white/10 bg-steel p-2 text-left transition hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        aria-label="Open full gate preview"
      >
        <span className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-[#F3F2EF]">
          {resolved.ok ? (
            // eslint-disable-next-line @next/next/no-img-element -- static public master SVG
            <img
              src={resolved.value.publicPath}
              alt=""
              className="h-full w-full scale-[1.15] object-contain object-center"
            />
          ) : (
            <span className="px-2 text-center font-mono text-[9px] uppercase tracking-widest text-steel/50">
              Master unavailable
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-white/55">
            Design preview · tap to expand
          </span>
          <span className="mt-0.5 block truncate font-heading text-sm font-bold uppercase tracking-tight text-white">
            {summary}
          </span>
        </span>
        <span
          aria-hidden
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 text-white/80"
        >
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>

      <MobilePreviewSheet
        open={open}
        onOpenChange={setOpen}
        config={config}
        tenant={tenant}
        showDimensionOverlay={showDimensionOverlay}
        onDimensionOverlayClick={() => {
          setOpen(false)
          onDimensionOverlayClick?.()
        }}
      />
    </>
  )
}
