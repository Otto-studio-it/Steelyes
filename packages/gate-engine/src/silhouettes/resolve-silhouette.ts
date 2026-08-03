import type { GateConfig, GateOptionKey, GateStyle, GateType } from '../types'
import silhouetteIndex from './silhouette-index.json'

export type SilhouetteLookupWhen = {
  style?: GateStyle | string
  options?: GateOptionKey[] | string[]
}

export type SilhouetteLookupRule = {
  when: SilhouetteLookupWhen
  slug: string
}

export type SilhouetteIndexEntry = {
  slug: string
  title: string
  publicPath: string
  style: string | null
  options: string[]
}

export type SilhouettePackIndex = {
  status: string
  rules: SilhouetteLookupRule[]
  silhouettes: Record<string, SilhouetteIndexEntry>
}

export type SilhouetteIndex = {
  version: number
  updated: string
  publicBasePath: string
  policy: {
    technicalSource: string
    neverInventCad: boolean
    clientMutable: string[]
    serving: string
  }
  packs: Record<string, SilhouettePackIndex>
  railheads: {
    status: string
    silhouettes: Record<
      string,
      {
        slug: string
        code: string
        title: string
        publicPath: string
        height_mm: number
        width_mm: number
        price_ex_vat_gbp: number
        optionKey: string
      }
    >
  } | null
}

export type SilhouetteResolveInput = Pick<GateConfig, 'gateType' | 'style' | 'options'>

export type SilhouetteResolution = {
  gateType: GateType
  slug: string
  title: string
  /** Public URL path under apps/web/public (Option A). */
  publicPath: string
  matchedRule: SilhouetteLookupRule
  /** Fields that may change without swapping the master SVG. */
  clientMutable: readonly string[]
}

export class SilhouetteResolveError extends Error {
  readonly code: 'unknown_gate_type' | 'no_matching_rule' | 'missing_silhouette_file'

  constructor(
    code: SilhouetteResolveError['code'],
    message: string,
  ) {
    super(message)
    this.name = 'SilhouetteResolveError'
    this.code = code
  }
}

export const SILHOUETTE_INDEX = silhouetteIndex as SilhouetteIndex

function enabledOptionKeys(config: SilhouetteResolveInput): Set<string> {
  return new Set(
    config.options.filter((option) => option.enabled).map((option) => option.key),
  )
}

function ruleMatches(rule: SilhouetteLookupRule, config: SilhouetteResolveInput): boolean {
  const when = rule.when ?? {}
  if (when.style && when.style !== config.style) return false
  if (when.options?.length) {
    const enabled = enabledOptionKeys(config)
    for (const key of when.options) {
      if (!enabled.has(key)) return false
    }
  }
  return true
}

/**
 * Resolve the preloaded 2D master for a gate config.
 *
 * Policy (locked Phase 0): masters only — never invent / fall back to live CAD here.
 * Client mm (width/height) are NOT part of the lookup; they belong in the UI strip.
 */
export function resolveSilhouette(
  config: SilhouetteResolveInput,
  index: SilhouetteIndex = SILHOUETTE_INDEX,
): SilhouetteResolution {
  const pack = index.packs[config.gateType]
  if (!pack) {
    throw new SilhouetteResolveError(
      'unknown_gate_type',
      `No preloaded 2D master pack for gateType="${config.gateType}".`,
    )
  }

  const matchedRule = pack.rules.find((rule) => ruleMatches(rule, config))
  if (!matchedRule) {
    throw new SilhouetteResolveError(
      'no_matching_rule',
      `No silhouette lookup rule matched for ${config.gateType} / ${config.style}.`,
    )
  }

  const entry = pack.silhouettes[matchedRule.slug]
  if (!entry) {
    throw new SilhouetteResolveError(
      'missing_silhouette_file',
      `Lookup slug "${matchedRule.slug}" has no silhouette entry for ${config.gateType}.`,
    )
  }

  return {
    gateType: config.gateType,
    slug: entry.slug,
    title: entry.title,
    publicPath: entry.publicPath,
    matchedRule,
    clientMutable: index.policy.clientMutable,
  }
}

/** List every gateType × slug public path (for sync verification / tests). */
export function listSilhouettePublicPaths(index: SilhouetteIndex = SILHOUETTE_INDEX): string[] {
  const paths: string[] = []
  for (const pack of Object.values(index.packs)) {
    for (const entry of Object.values(pack.silhouettes)) {
      paths.push(entry.publicPath)
    }
  }
  return paths
}
