'use client'

import { Maximize2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { PreviewSvg } from '@/components/configurator/ConfiguratorPreview'
import { MobilePreviewSheet } from '@/components/configurator/mobile/MobilePreviewSheet'
import { finishLabel, gateTypeLabel } from '@/lib/configurator/labels'
import { buildGateRenderPlan, type GateConfig, type TenantBundle } from '@steelyes/gate-engine'

type MobilePreviewChipProps = {
  config: GateConfig
  tenant?: TenantBundle
  showDimensionOverlay?: boolean
  onDimensionOverlayClick?: () => void
}

/**
 * Compact 96px live-preview chip. Renders the lightweight installation SVG only
 * (no 3D/photo chunk) and opens the full bottom sheet on tap. Fixed height keeps
 * CLS at zero versus the previous 28vh strip.
 */
export function MobilePreviewChip({
  config,
  tenant,
  showDimensionOverlay = false,
  onDimensionOverlayClick,
}: MobilePreviewChipProps) {
  const [open, setOpen] = useState(false)
  const plan = useMemo(() => buildGateRenderPlan(config, { viewMode: 'installation' }), [config])

  const summary = `${gateTypeLabel(config.gateType)} · ${config.widthMm} × ${config.heightMm} mm · ${finishLabel(config.finish)}`

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-24 w-full items-center gap-3 border border-white/10 bg-steel p-2 text-left transition hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        aria-label="Open full gate preview"
      >
        <span className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-steel">
          <PreviewSvg plan={plan} studio className="h-full w-full scale-[1.2] origin-center" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-white/55">
            Live preview · tap to expand
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
        showSecondaryModes={false}
        showDimensionOverlay={showDimensionOverlay}
        onDimensionOverlayClick={() => {
          setOpen(false)
          onDimensionOverlayClick?.()
        }}
      />
    </>
  )
}
