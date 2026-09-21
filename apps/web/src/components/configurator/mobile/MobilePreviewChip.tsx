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
  /**
   * `tall` — large live drawing while the customer picks the look (they are choosing between
   * shapes that differ in small details). `compact` — 96px chip when the screen is needed for
   * inputs / the keyboard.
   */
  size?: 'tall' | 'compact'
}

/**
 * Sticky Design preview for the mobile Quick Path. Renders the official 2D master and opens
 * the full bottom sheet (fullscreen drawing + AR) on tap.
 */
export function MobilePreviewChip({
  config,
  tenant,
  showDimensionOverlay = false,
  onDimensionOverlayClick,
  size = 'compact',
}: MobilePreviewChipProps) {
  const [open, setOpen] = useState(false)

  const master = useMemo(() => {
    try {
      return { ok: true as const, value: resolveSilhouette(config) }
    } catch (error) {
      const message =
        error instanceof SilhouetteResolveError
          ? error.message
          : 'Design drawing is unavailable.'
      return { ok: false as const, message }
    }
  }, [config])

  const dimensions = `${config.widthMm} × ${config.heightMm} mm`
  const finish = finishLabel(config.finish, config.customFinishHex)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex w-full border border-white/10 bg-steel text-left transition hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
          size === 'tall' ? 'flex-col gap-2 p-2' : 'h-24 items-center gap-3 p-2'
        }`}
        aria-label={`Open full gate preview — ${gateTypeLabel(config.gateType)}, ${dimensions}, ${finish}`}
      >
        <span
          className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-[#F3F2EF] ${
            size === 'tall' ? 'h-[clamp(128px,21vh,176px)] w-full' : 'h-20 w-28'
          }`}
        >
          {master.ok ? (
            // eslint-disable-next-line @next/next/no-img-element -- static public master SVG
            <img
              src={master.value.publicPath}
              alt=""
              className={`h-full w-full object-contain object-center ${size === 'tall' ? 'p-1' : 'scale-[1.15]'}`}
            />
          ) : (
            <span className="px-2 text-center font-mono text-xs uppercase tracking-wider text-steel/50">
              Drawing unavailable
            </span>
          )}
          {size === 'tall' ? (
            <span
              aria-hidden
              className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center border border-steel/15 bg-white/90 text-steel"
            >
              <Maximize2 className="h-4 w-4" />
            </span>
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-heading text-sm font-bold uppercase leading-5 tracking-tight text-white">
            {gateTypeLabel(config.gateType)}
          </span>
          <span className="mt-0.5 block font-mono text-xs tabular-nums tracking-wide text-white/70">
            {dimensions} · {finish}
          </span>
        </span>
        {size === 'compact' ? (
          <span
            aria-hidden
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 text-white/80"
          >
            <Maximize2 className="h-4 w-4" />
          </span>
        ) : null}
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
