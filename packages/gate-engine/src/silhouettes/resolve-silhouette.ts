import type { GateConfig, GateOptionKey, GateStyle, GateType } from '../types'
import silhouetteIndex from './silhouette-index.json'

export type SilhouetteLookupWhen = {
  style?: GateStyle | string
  options?: GateOptionKey[] | string[]
  /** Rule fails if any of these options are enabled (keeps circles-only vs circles+collar distinct). */
  withoutOptions?: GateOptionKey[] | string[]
  /** Exact variant match on an enabled option (e.g. picket_collars → every_1). */
  optionVariants?: Record<string, string>
  /** When set, rule only matches that motorised state. */
  motorised?: boolean
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
  /** True when the master SVG itself draws a motor kit (rare — product lock usually omits it). */
  includesMotorKit?: boolean
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

export type SilhouetteResolveInput = Pick<GateConfig, 'gateType' | 'style' | 'options' | 'motorised'>

export type SilhouetteResolution = {
  gateType: GateType
  slug: string
  title: string
  /** Public URL path under apps/web/public (Option A). */
  publicPath: string
  matchedRule: SilhouetteLookupRule
  /** True when the resolved master SVG itself includes motor artwork. */
  masterIncludesMotor: boolean
  /** Option keys already drawn inside the baked master (skip runtime overlays). */
  bakedOptions: readonly string[]
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
  if (typeof when.motorised === 'boolean' && when.motorised !== Boolean(config.motorised)) {
    return false
  }
  const enabled = enabledOptionKeys(config)
  if (when.options?.length) {
    for (const key of when.options) {
      if (!enabled.has(key)) return false
    }
  }
  if (when.withoutOptions?.length) {
    for (const key of when.withoutOptions) {
      if (enabled.has(key)) return false
    }
  }
  if (when.optionVariants) {
    for (const [key, expected] of Object.entries(when.optionVariants)) {
      const option = config.options.find((item) => item.key === key && item.enabled)
      if (!option || option.variant !== expected) return false
    }
  }
  return true
}

/** Higher score wins when multiple rules match — prefers baked deco over tipology fallback. */
export function ruleSpecificity(rule: SilhouetteLookupRule): number {
  const when = rule.when ?? {}
  const options = when.options?.length ?? 0
  const without = when.withoutOptions?.length ?? 0
  const variants = when.optionVariants ? Object.keys(when.optionVariants).length : 0
  const motor = typeof when.motorised === 'boolean' ? 1 : 0
  const style = when.style ? 1 : 0
  return options * 100 + variants * 40 + without * 10 + motor * 5 + style
}

function pickBestRule(
  rules: SilhouetteLookupRule[],
  config: SilhouetteResolveInput,
): SilhouetteLookupRule | undefined {
  let best: SilhouetteLookupRule | undefined
  let bestScore = -1
  for (const rule of rules) {
    if (!ruleMatches(rule, config)) continue
    const score = ruleSpecificity(rule)
    if (score > bestScore) {
      best = rule
      bestScore = score
    }
  }
  return best
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

  const matchedRule = pickBestRule(pack.rules, config)
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
    masterIncludesMotor: Boolean(entry.includesMotorKit),
    bakedOptions: entry.options ?? [],
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
