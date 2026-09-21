import { DEFAULT_RAILHEAD_VARIANT_CATALOG } from './railheads'

/**
 * Customer-facing Steelyes series names.
 * Workshop / photo files keep the supplier slug (RH32). Official marketing
 * names can replace a row via RAILHEAD_SERIES_OVERRIDES without renaming files.
 */
const RAILHEAD_SERIES_OVERRIDES: Record<string, string> = {}

export function railheadWorkshopCode(slug: string): string {
  return slug.replace(/-dog$/i, '')
}

function parseWorkshopCode(code: string): { n: number; suffix: string } | null {
  const match = /^RH(\d+)([A-Z]*)$/i.exec(code)
  if (!match) return null
  return { n: Number(match[1]), suffix: (match[2] ?? '').toUpperCase() }
}

function compareWorkshopCodes(a: string, b: string): number {
  const left = parseWorkshopCode(a)
  const right = parseWorkshopCode(b)
  if (left && right) {
    if (left.n !== right.n) return left.n - right.n
    return left.suffix.localeCompare(right.suffix)
  }
  return a.localeCompare(b)
}

function uniqueWorkshopCodes(): string[] {
  const codes = new Set<string>()
  for (const entry of DEFAULT_RAILHEAD_VARIANT_CATALOG.entries) {
    codes.add(railheadWorkshopCode(entry.slug))
  }
  return Array.from(codes).sort(compareWorkshopCodes)
}

const STEELYES_SERIES_CODES = uniqueWorkshopCodes()

export function listSteelyesRailheadSeries(): readonly string[] {
  return STEELYES_SERIES_CODES
}

export function railheadSeriesIndex(slug: string): number | null {
  const index = STEELYES_SERIES_CODES.indexOf(railheadWorkshopCode(slug))
  return index >= 0 ? index + 1 : null
}

export function railheadSeriesLabel(slug: string): string {
  const code = railheadWorkshopCode(slug)
  const override = RAILHEAD_SERIES_OVERRIDES[code]
  if (override) return override
  const index = railheadSeriesIndex(slug)
  if (index == null) return 'Selected series'
  return `Series ${String(index).padStart(2, '0')}`
}

export function railheadWorkshopLabel(slug: string): string {
  return `${railheadSeriesLabel(slug)} (${railheadWorkshopCode(slug)})`
}
