'use client'

import { useMemo } from 'react'
import { resolveSilhouette, SilhouetteResolveError, type GateConfig } from '@steelyes/gate-engine'

import { ConfiguratorPreview } from '@/components/configurator/ConfiguratorPreview'

type WorkshopDrawingDisclosureProps = {
  config: GateConfig
}

/**
 * Official 2D master as a workshop plate. Not the customer Design preview.
 */
export function WorkshopDrawingDisclosure({ config }: WorkshopDrawingDisclosureProps) {
  const resolved = useMemo(() => {
    try {
      return { ok: true as const, value: resolveSilhouette(config) }
    } catch (error) {
      const message =
        error instanceof SilhouetteResolveError
          ? error.message
          : 'Workshop master unavailable for this configuration.'
      return { ok: false as const, message }
    }
  }, [config])

  const slugLabel = resolved.ok ? resolved.value.slug.replace(/_/g, ' ') : 'unavailable'

  return (
    <details className="border-t border-steel/10 bg-white" data-testid="workshop-drawing">
      <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted marker:content-none [&::-webkit-details-marker]:hidden">
        <span>Workshop drawing</span>
        <span data-testid="design-master-slug">Master · {slugLabel}</span>
      </summary>
      <div className="border-t border-steel/8">
        {resolved.ok ? (
          <ConfiguratorPreview
            config={config}
            viewMode="technical"
            compact
            collapsible={false}
            pinned
            studio
            className="rounded-none border-0 shadow-none"
          />
        ) : (
          <p className="px-4 py-4 text-sm text-muted-deep" role="status">
            {resolved.message}
          </p>
        )}
      </div>
    </details>
  )
}
