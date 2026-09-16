'use client'

type DesignRailheadCalloutProps = {
  slug: string
}

function railheadPhotoPath(slug: string): string {
  return `/2d-masters/railheads/photos/${slug}.webp`
}

/**
 * Selected railhead SKU beside the official master — not composited on pickets.
 * Safer than overlaying 61 heads onto arched / sliding geometries.
 */
export function DesignRailheadCallout({ slug }: DesignRailheadCalloutProps) {
  return (
    <aside
      className="flex w-[7.5rem] shrink-0 flex-col items-center gap-2 self-center border border-steel/12 bg-white px-2 py-3 sm:w-36"
      data-testid="design-railhead-chip"
      data-sku={slug}
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">Selected head</p>
      {/* eslint-disable-next-line @next/next/no-img-element -- cropped catalogue photo */}
      <img
        src={railheadPhotoPath(slug)}
        alt={`${slug} railhead`}
        className="h-24 w-full object-contain object-bottom sm:h-28"
      />
      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-steel">{slug}</p>
      <p className="text-center font-mono text-[9px] leading-3 text-muted">
        Quote model — beside the drawing, not on the pickets
      </p>
    </aside>
  )
}

export function selectedRailheadSlug(
  options: Array<{ key: string; enabled: boolean; variant?: string }>,
): string | null {
  const option = options.find((item) => item.key === 'top_railheads' && item.enabled)
  if (!option) return null
  return option.variant || 'RH32'
}
