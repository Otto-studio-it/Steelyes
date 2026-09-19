import { railheadPhotoFileSlug } from '@steelyes/gate-engine'

export function selectedRailheadSlug(
  options: Array<{ key: string; enabled: boolean; variant?: string }>,
): string | null {
  const option = options.find((item) => item.key === 'top_railheads' && item.enabled)
  if (!option) return null
  return option.variant || 'RH32'
}

export function railheadPhotoPath(slug: string): string {
  return `/2d-masters/railheads/photos/${railheadPhotoFileSlug(slug)}.webp`
}
