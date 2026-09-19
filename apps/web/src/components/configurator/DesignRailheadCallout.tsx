'use client'

import { railheadProductDescription } from '@steelyes/gate-engine'

import { railheadPhotoPath } from '@/lib/configurator/railhead'

type DesignRailheadCalloutProps = {
  slug: string
}

/**
 * Selected railhead SKU beside the official master — not composited on pickets.
 * Safer than overlaying 61 heads onto arched / sliding geometries.
 */
export function DesignRailheadCallout({ slug }: DesignRailheadCalloutProps) {
  const copy = railheadProductDescription(slug)
  return (
    <aside
      className="flex w-full shrink-0 flex-col items-center gap-3 self-stretch border border-steel/15 bg-white px-3 py-4 sm:w-44 lg:w-52"
      data-testid="design-railhead-chip"
      data-sku={slug}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">Railhead</p>
      {/* eslint-disable-next-line @next/next/no-img-element -- cropped catalogue photo */}
      <img
        src={railheadPhotoPath(slug)}
        alt={copy.detail}
        className="h-36 w-full object-contain object-bottom sm:h-44 lg:h-52"
      />
      <p className="font-heading text-sm font-bold uppercase tracking-tight text-steel">{slug}</p>
      {copy.sizeLabel ? (
        <p className="text-center text-xs leading-4 text-muted-deep">{copy.sizeLabel}</p>
      ) : null}
      <p className="text-center text-xs leading-4 text-muted-deep">
        Product photo of this railhead only. Not drawn onto the pickets.
      </p>
    </aside>
  )
}
