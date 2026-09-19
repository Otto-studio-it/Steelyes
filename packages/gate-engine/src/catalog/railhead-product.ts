import { RAILHEAD_PRODUCT_CARDS, type RailheadProductCard } from './railhead-product-cards'

const PHOTO_FILE_ALIASES: Record<string, string> = {
  RH15WO: 'RH15W',
}

export function railheadCatalogSlug(slug: string): string {
  return slug.replace(/-dog$/i, '')
}

/** Public webp basename (no extension). Dog-bar SKUs reuse the top product shot. */
export function railheadPhotoFileSlug(slug: string): string {
  const catalogSlug = railheadCatalogSlug(slug)
  const card = RAILHEAD_PRODUCT_CARDS[catalogSlug]
  if (card?.photoFile) return card.photoFile
  return PHOTO_FILE_ALIASES[catalogSlug] ?? catalogSlug
}

export function railheadProductCard(slug: string): RailheadProductCard | null {
  return RAILHEAD_PRODUCT_CARDS[railheadCatalogSlug(slug)] ?? null
}

export function railheadProductDescription(slug: string): {
  title: string
  sizeLabel: string | null
  detail: string
} {
  const card = railheadProductCard(slug)
  if (!card) {
    return { title: slug, sizeLabel: null, detail: slug }
  }
  const extra = card.flags.length > 0 ? ` · ${card.flags.join(', ')}` : ''
  const sizeLabel = card.sizeMm ? `${card.sizeMm}${extra}` : extra ? extra.slice(3) : null
  return {
    title: card.title,
    sizeLabel,
    detail: sizeLabel ? `${card.title} · ${sizeLabel}` : card.title,
  }
}
