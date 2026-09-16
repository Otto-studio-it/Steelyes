'use client'

import { useMemo } from 'react'
import {
  describeDesignPreview,
  getVictorianTipology,
  resolveCircleOverlays,
  resolveCollarOverlays,
  resolveFinishDefinition,
  resolveSilhouette,
  SilhouetteResolveError,
  type GateConfig,
} from '@steelyes/gate-engine'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { usePrefetchPackMasters } from '@/lib/configurator/prefetch-pack-masters'
import { gateTypeLabel } from '@/lib/configurator/labels'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { DesignRailheadCallout, selectedRailheadSlug } from '@/components/configurator/DesignRailheadCallout'

type TechnicalMasterPreviewProps = {
  config: GateConfig
  compact?: boolean
  collapsible?: boolean
  pinned?: boolean
  studio?: boolean
  className?: string
}

/**
 * Customer Design preview: official 2D masters only (the client-approved visual).
 * Menu changes swap the matching file immediately.
 * Selected railhead SKU is shown as a photo beside the drawing, not on the pickets.
 */
export function TechnicalMasterPreview({
  config,
  compact = false,
  collapsible = false,
  pinned = false,
  studio = false,
  className = '',
}: TechnicalMasterPreviewProps) {
  usePrefetchPackMasters(config.gateType)

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

  const described = useMemo(() => describeDesignPreview(config), [config])

  const circleOverlay = useMemo(() => {
    if (!resolved.ok) return { bands: [], notes: [] as string[] }
    if (resolved.value.bakedOptions.includes('circles')) {
      return { bands: [], notes: ['Circles baked into master SVG'] }
    }
    return resolveCircleOverlays(config)
  }, [config, resolved])

  const collarOverlay = useMemo(() => {
    if (!resolved.ok) return { overlays: [], notes: [] as string[] }
    if (resolved.value.bakedOptions.includes('picket_collars')) {
      return { overlays: [], notes: ['Collars baked into master SVG'] }
    }
    return resolveCollarOverlays(config)
  }, [config, resolved])

  const isCollapsedPeek = !pinned && collapsible && compact && !previewExpanded
  const showFullBody = pinned || !collapsible || previewExpanded || !compact
  const title = gateTypeLabel(config.gateType)
  const tipology = getVictorianTipology(config)
  const circlesOn = config.options.some((option) => option.key === 'circles' && option.enabled)
  const collarsOn = config.options.some((option) => option.key === 'picket_collars' && option.enabled)
  const railheadSku = selectedRailheadSlug(config.options)

  const shellClass = studio
    ? 'border-steel/10 bg-[#F3F2EF] text-steel'
    : 'border-steel/10 bg-paper text-steel'

  const frameClass = studio
    ? 'overflow-hidden border-0 shadow-none rounded-none'
    : 'overflow-hidden rounded-2xl border shadow-[0_12px_32px_rgba(25,20,18,0.08)] lg:rounded-[28px] lg:shadow-[0_24px_64px_rgba(25,20,18,0.14)]'

  return (
    <div
      className={`${frameClass} ${shellClass} ${pinned && !studio ? 'shadow-[0_16px_40px_rgba(25,20,18,0.22)]' : ''} ${className}`}
      data-testid="design-master-preview"
      data-tipology={resolved.ok ? tipology : undefined}
      data-slug={resolved.ok ? resolved.value.slug : undefined}
      data-circles={String(circlesOn)}
      data-collars={String(collarsOn)}
      data-motorised={String(config.motorised)}
      data-railhead={railheadSku ?? undefined}
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
          {described.channels.find((item) => item.key === 'motorised')?.visual === 'same_drawing' ? (
            <span
              className="inline-flex items-center border border-steel/12 bg-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted"
              data-testid="design-drive-badge"
            >
              {config.motorised ? 'Motorised recorded' : 'Manual recorded'}
            </span>
          ) : null}
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
              <div className="flex w-full items-center gap-3">
                <div className={`relative min-w-0 flex-1 ${pinned ? 'max-h-[40vh]' : 'max-h-[min(60vh,640px)]'}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- static public master SVG */}
                  <img
                    key={resolved.value.publicPath}
                    data-testid="design-master-img"
                    src={resolved.value.publicPath}
                    alt={`${title} design master — ${resolved.value.title}`}
                    decoding="sync"
                    fetchPriority="high"
                    className="h-full w-full bg-white object-contain"
                  />
                  {circleOverlay.bands.map((band) => (
                    // eslint-disable-next-line @next/next/no-img-element -- static public overlay SVG
                    <img
                      key={band.id}
                      src={band.publicPath}
                      alt=""
                      aria-hidden
                      className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                    />
                  ))}
                  {collarOverlay.overlays.map((overlay) => (
                    // eslint-disable-next-line @next/next/no-img-element -- static public overlay SVG
                    <img
                      key={overlay.id}
                      src={overlay.publicPath}
                      alt=""
                      aria-hidden
                      className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                    />
                  ))}
                </div>
                {railheadSku ? <DesignRailheadCallout slug={railheadSku} /> : null}
              </div>
            ) : (
              <div
                role="alert"
                className="w-full border border-steel/15 bg-paper px-4 py-6 text-center"
              >
                <p className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
                  Design master missing
                </p>
                <p className="mt-2 font-mono text-xs leading-5 text-muted">{resolved.message}</p>
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
                  <p
                    className="font-mono text-[10px] uppercase tracking-widest text-muted"
                    data-testid="design-master-slug"
                  >
                    Master · {resolved.value.slug.replace(/_/g, ' ')}
                  </p>
                ) : null}
              </div>
            </div>
            <p className="mt-2 font-mono text-[10px] leading-4 text-muted">
              Official 2D master — type, Victorian shape, circles and collars swap this file
              immediately. Size is the millimetre strip. Finish is the swatch.
            </p>
            {described.overlayFallback ? (
              <p className="mt-2 font-mono text-[10px] leading-4 text-steel" data-testid="design-overlay-fallback">
                Some decoration is a generic overlay on this pack (missing baked combo). The Victorian
                shape still matches your selection.
              </p>
            ) : null}
            {railheadSku ? (
              <p className="mt-1 font-mono text-[10px] leading-4 text-muted" data-testid="design-honesty-note">
                Selected railhead {railheadSku} is shown beside the drawing. It is not drawn onto the
                pickets (safe on arched and sliding masters).
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
