'use client'

import { useMemo } from 'react'
import {
  resolveFinishDefinition,
  resolveSilhouette,
  SilhouetteResolveError,
  type GateConfig,
} from '@steelyes/gate-engine'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { gateTypeLabel } from '@/lib/configurator/labels'
import { useConfiguratorStore } from '@/store/configuratorStore'

type TechnicalMasterPreviewProps = {
  config: GateConfig
  compact?: boolean
  collapsible?: boolean
  pinned?: boolean
  studio?: boolean
  className?: string
}

/**
 * Design preview from preloaded 2D masters only (Phase 1–3).
 * Railhead SKUs are chosen in Refine for quote/email — not composited on the drawing.
 * Never invents live CAD. Client mm render in the strip under the image.
 */
export function TechnicalMasterPreview({
  config,
  compact = false,
  collapsible = false,
  pinned = false,
  studio = false,
  className = '',
}: TechnicalMasterPreviewProps) {
  const previewExpanded = useConfiguratorStore((state) => state.previewExpanded)
  const togglePreviewExpanded = useConfiguratorStore((state) => state.togglePreviewExpanded)
  const finish = resolveFinishDefinition(config)

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

  // Handle is baked into official *manual* masters — never composited in UI.

  const isCollapsedPeek = !pinned && collapsible && compact && !previewExpanded
  const showFullBody = pinned || !collapsible || previewExpanded || !compact
  const title = gateTypeLabel(config.gateType)

  const shellClass = studio
    ? 'border-steel/10 bg-[#F3F2EF] text-steel'
    : 'border-steel/10 bg-paper text-steel'

  const frameClass = studio
    ? 'overflow-hidden border-0 shadow-none rounded-none'
    : 'overflow-hidden rounded-2xl border shadow-[0_12px_32px_rgba(25,20,18,0.08)] lg:rounded-[28px] lg:shadow-[0_24px_64px_rgba(25,20,18,0.14)]'

  return (
    <div
      className={`${frameClass} ${shellClass} ${pinned && !studio ? 'shadow-[0_16px_40px_rgba(25,20,18,0.22)]' : ''} ${className}`}
    >
      <div
        className={`flex items-center justify-between border-b border-steel/10 px-4 ${pinned ? 'py-2.5' : 'py-3 lg:px-5 lg:py-4'}`}
      >
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">Design drawing</p>
          <h2
            className={`mt-0.5 truncate font-heading font-black uppercase tracking-tight text-steel ${
              pinned ? 'text-base sm:text-lg' : 'text-sm lg:mt-1 lg:text-lg'
            }`}
          >
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="inline-flex items-center gap-2 border border-steel/12 bg-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted"
            title="Selected finish colour"
          >
            <span
              className="h-3.5 w-3.5 shrink-0 border border-black/20"
              style={{ backgroundColor: finish.schematic.frame }}
              aria-hidden
            />
            <span className="max-w-[7rem] truncate">{finish.label}</span>
          </div>
          {collapsible && !pinned ? (
            <button
              type="button"
              onClick={togglePreviewExpanded}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-steel/10 bg-white text-muted transition hover:border-steel/35 hover:text-steel"
              aria-expanded={previewExpanded}
              aria-label={previewExpanded ? 'Collapse preview' : 'Expand preview'}
            >
              {previewExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          ) : null}
        </div>
      </div>

      {isCollapsedPeek ? (
        <button
          type="button"
          onClick={togglePreviewExpanded}
          className="flex w-full items-center gap-3 bg-gradient-to-b from-paper to-canvas px-3 py-3 text-left transition hover:from-white hover:to-paper"
          aria-label="Expand design master preview"
        >
          <div className="relative flex h-[72px] w-[112px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-steel/10 bg-white">
            {resolved.ok ? (
              // eslint-disable-next-line @next/next/no-img-element -- static public master SVG
              <img
                src={resolved.value.publicPath}
                alt=""
                className="h-full w-full object-contain object-top p-1"
              />
            ) : (
              <span className="px-2 font-mono text-[10px] text-muted">Master</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-heading text-xs font-bold uppercase tracking-tight text-steel">Design master</p>
            <p className="mt-1 font-mono text-xs tabular-nums text-muted-deep">
              {config.widthMm} × {config.heightMm} mm
            </p>
          </div>
        </button>
      ) : null}

      {showFullBody ? (
        <div
          className={`bg-white ${pinned ? 'flex min-h-[clamp(260px,44vh,480px)] flex-col' : ''}`}
        >
          <div
            className={`flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_55%),linear-gradient(180deg,#FFFFFF,#F4F3F0)] p-3 lg:p-4 ${
              pinned ? 'min-h-0' : ''
            }`}
          >
            {resolved.ok ? (
              // eslint-disable-next-line @next/next/no-img-element -- static public master SVG
              <img
                src={resolved.value.publicPath}
                alt={`${title} design master — ${resolved.value.title}`}
                className={`w-full bg-white object-contain ${pinned ? 'max-h-[40vh]' : 'max-h-[min(60vh,640px)]'}`}
              />
            ) : (
              <div
                role="alert"
                className="w-full border border-steel/15 bg-paper px-4 py-6 text-center"
              >
                <p className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
                  Design master missing
                </p>
                <p className="mt-2 font-mono text-xs leading-5 text-muted">{resolved.message}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted">
                  Live CAD is disabled for Design view
                </p>
              </div>
            )}
          </div>

          <div
            className="border-t border-steel/10 bg-[#F7F6F3] px-4 py-3"
            aria-label="Client dimensions"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
                  Clear opening × height
                </p>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums tracking-tight text-steel sm:text-xl">
                  {config.widthMm}
                  <span className="mx-1.5 text-muted">×</span>
                  {config.heightMm}
                  <span className="ml-2 text-sm font-normal text-muted">mm</span>
                </p>
              </div>
              <div className="text-right">
                {resolved.ok ? (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    Master · {resolved.value.slug.replace(/_/g, ' ')}
                  </p>
                ) : null}
              </div>
            </div>
            <p className="mt-2 font-mono text-[10px] leading-4 text-muted">
              Dimensions are client inputs — not baked into the drawing.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
