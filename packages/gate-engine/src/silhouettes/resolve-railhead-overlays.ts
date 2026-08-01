import {
  getExpectedDogBarRailheadCount,
  getExpectedTopRailheadCount,
} from '../rules/geometry'
import { getOptionQuantity, hasOption } from '../internal/shared'
import type { GateConfig, GateOptionKey } from '../types'
import { SILHOUETTE_INDEX, type SilhouetteIndex } from './resolve-silhouette'

export type RailheadOverlayRow = 'top' | 'dog'

export type RailheadOverlayInstance = {
  id: string
  row: RailheadOverlayRow
  /** 0–1 across the full master image width (centre of instance). */
  xRatio: number
  /**
   * 0–1 from top of the master image — where the *base* of the railhead sits
   * (top rail / dog rail). Head draws upward from this anchor.
   */
  anchorYRatio: number
  publicPath: string
  slug: string
  code: string
  title: string
  heightMm: number
  widthMm: number
}

export type RailheadOverlayPlan = {
  instances: RailheadOverlayInstance[]
  /** Count rule is still provisional until Marius signs open.railhead_count_rule. */
  countRuleStatus: 'provisional'
  notes: string[]
}

/**
 * Master SVG paper is 1200×860 with a shared Victorian elevation layout.
 * These ratios place overlays on the top / dog rails without inventing new CAD.
 * (See double_swing silhouettes: leaf-*-top-rail y=164, leaf-*-dog-rail y=514.)
 */
export const RAILHEAD_OVERLAY_LAYOUT = {
  topAnchorYRatio: 164 / 860,
  dogAnchorYRatio: 514 / 860,
  /** Horizontal band of the clear opening inside the paper (pillars outside). */
  openingStartXRatio: 126 / 1200,
  openingEndXRatio: 1074 / 1200,
  /** Default SKU when option is on but no variant picked yet. */
  defaultSlug: 'RH32',
} as const

type RailheadIndexEntry = NonNullable<SilhouetteIndex['railheads']>['silhouettes'][string]

function overlaySlugFromVariant(variant: string | undefined, fallback: string): string {
  if (!variant) return fallback
  // Dog-bar catalogue slugs reuse the same SVG (RH32-dog → RH32).
  return variant.replace(/-dog$/i, '')
}

function lookupRailhead(
  slug: string,
  index: SilhouetteIndex,
): RailheadIndexEntry | null {
  const pack = index.railheads
  if (!pack) return null
  return pack.silhouettes[slug] ?? null
}

function placeRow(
  row: RailheadOverlayRow,
  count: number,
  entry: RailheadIndexEntry,
  layout: typeof RAILHEAD_OVERLAY_LAYOUT,
): RailheadOverlayInstance[] {
  if (count <= 0) return []

  const start = layout.openingStartXRatio
  const end = layout.openingEndXRatio
  const span = end - start
  const anchorYRatio = row === 'top' ? layout.topAnchorYRatio : layout.dogAnchorYRatio

  const instances: RailheadOverlayInstance[] = []
  for (let index = 0; index < count; index += 1) {
    const xRatio = start + ((index + 0.5) / count) * span
    instances.push({
      id: `${row}-railhead-${index}`,
      row,
      xRatio,
      anchorYRatio,
      publicPath: entry.publicPath,
      slug: entry.slug,
      code: entry.code,
      title: entry.title,
      heightMm: entry.height_mm,
      widthMm: entry.width_mm,
    })
  }
  return instances
}

function resolveRow(
  config: Pick<GateConfig, 'widthMm' | 'options'>,
  optionKey: Extract<GateOptionKey, 'top_railheads' | 'dog_bar_railheads'>,
  row: RailheadOverlayRow,
  expectedCount: number,
  index: SilhouetteIndex,
  layout: typeof RAILHEAD_OVERLAY_LAYOUT,
  notes: string[],
): RailheadOverlayInstance[] {
  if (!hasOption(config, optionKey)) return []

  const option = config.options.find((item) => item.key === optionKey)
  const slug = overlaySlugFromVariant(option?.variant, layout.defaultSlug)
  const entry = lookupRailhead(slug, index)
  if (!entry) {
    notes.push(`No preloaded railhead SVG for variant "${slug}" — row ${row} skipped.`)
    return []
  }

  const quantity = getOptionQuantity(config, optionKey)
  const count = Math.min(quantity > 0 ? quantity : expectedCount, expectedCount)
  if (!option?.variant) {
    notes.push(`Using default railhead ${layout.defaultSlug} until a variant is selected.`)
  }

  return placeRow(row, count, entry, layout)
}

/**
 * Phase 2 — place preloaded railhead SVG overlays on a Technical master.
 *
 * Count / spacing stay provisional (same divisors as geometry guidance).
 * Never invents CAD shapes — only indexes existing `/2d-masters/railheads/` files.
 */
export function resolveRailheadOverlays(
  config: Pick<GateConfig, 'widthMm' | 'heightMm' | 'options'>,
  index: SilhouetteIndex = SILHOUETTE_INDEX,
  layout: typeof RAILHEAD_OVERLAY_LAYOUT = RAILHEAD_OVERLAY_LAYOUT,
): RailheadOverlayPlan {
  const notes: string[] = []

  if (!index.railheads) {
    return {
      instances: [],
      countRuleStatus: 'provisional',
      notes: ['Railhead overlay pack missing from silhouette index.'],
    }
  }

  const top = resolveRow(
    config,
    'top_railheads',
    'top',
    getExpectedTopRailheadCount(config.widthMm),
    index,
    layout,
    notes,
  )
  const dog = resolveRow(
    config,
    'dog_bar_railheads',
    'dog',
    getExpectedDogBarRailheadCount(config.widthMm),
    index,
    layout,
    notes,
  )

  if (top.length || dog.length) {
    notes.push('Railhead count and spacing are provisional until Marius signs the count rule.')
  }

  return {
    instances: [...top, ...dog],
    countRuleStatus: 'provisional',
    notes,
  }
}
