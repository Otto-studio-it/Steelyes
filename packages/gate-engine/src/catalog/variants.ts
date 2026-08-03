import type { GateConfig, GateOptionSelection } from '../types'
import type { RuleIssue } from '../rules/compatibility'
import {
  isRailheadOptionKey,
  RAILHEAD_OPTION_KEYS,
  type RailheadOptionKey,
  type RailheadVariantCatalog,
  type RailheadVariantDefinition,
  type VariantAppliesTo,
} from './types'
import { DEFAULT_RAILHEAD_VARIANT_CATALOG } from './railheads'

export function isVariantCatalogBlocked(
  catalog: RailheadVariantCatalog = DEFAULT_RAILHEAD_VARIANT_CATALOG,
): boolean {
  return catalog.status === 'blocked_pending_client'
}

export function getRailheadVariantCatalog(
  catalog: RailheadVariantCatalog = DEFAULT_RAILHEAD_VARIANT_CATALOG,
): RailheadVariantCatalog {
  return catalog
}

function variantAppliesToConfig(entry: RailheadVariantDefinition, config: GateConfig): boolean {
  const rules = entry.appliesTo

  if (rules.styles && !rules.styles.includes(config.style)) {
    return false
  }

  if (rules.gateTypes && !rules.gateTypes.includes(config.gateType)) {
    return false
  }

  if (rules.minWidthMm !== undefined && config.widthMm < rules.minWidthMm) {
    return false
  }

  if (rules.maxWidthMm !== undefined && config.widthMm > rules.maxWidthMm) {
    return false
  }

  return true
}

export function findRailheadVariant(
  slug: string,
  catalog: RailheadVariantCatalog = DEFAULT_RAILHEAD_VARIANT_CATALOG,
): RailheadVariantDefinition | null {
  return catalog.entries.find((entry) => entry.slug === slug) ?? null
}

export function listRailheadVariantsForOption(
  optionKey: RailheadOptionKey,
  config: GateConfig,
  catalog: RailheadVariantCatalog = DEFAULT_RAILHEAD_VARIANT_CATALOG,
): RailheadVariantDefinition[] {
  if (isVariantCatalogBlocked(catalog)) {
    return []
  }

  return catalog.entries.filter(
    (entry) => entry.optionKey === optionKey && variantAppliesToConfig(entry, config),
  )
}

export function collectVariantCatalogIssues(
  config: GateConfig,
  catalog: RailheadVariantCatalog = DEFAULT_RAILHEAD_VARIANT_CATALOG,
): RuleIssue[] {
  const issues: RuleIssue[] = []

  for (const option of config.options) {
    if (!option.enabled || !option.variant) {
      continue
    }

    if (!isRailheadOptionKey(option.key)) {
      issues.push({
        field: `options.${option.key}.variant`,
        code: 'variant_not_supported',
        message: 'Variants are only supported for railhead options in the current release.',
      })
      continue
    }

    if (isVariantCatalogBlocked(catalog)) {
      issues.push({
        field: `options.${option.key}.variant`,
        code: 'variant_catalog_blocked',
        message: 'Variant selection is unavailable until the railhead catalogue is confirmed by the client.',
      })
      continue
    }

    const entry = findRailheadVariant(option.variant, catalog)
    if (!entry) {
      issues.push({
        field: `options.${option.key}.variant`,
        code: 'unknown_variant',
        message: `Railhead variant "${option.variant}" is not in the catalogue.`,
      })
      continue
    }

    if (entry.optionKey !== option.key) {
      issues.push({
        field: `options.${option.key}.variant`,
        code: 'variant_option_mismatch',
        message: `Variant "${option.variant}" does not apply to ${option.key.split('_').join(' ')}.`,
      })
      continue
    }

    if (!variantAppliesToConfig(entry, config)) {
      issues.push({
        field: `options.${option.key}.variant`,
        code: 'variant_incompatible',
        message: `Variant "${entry.label}" is not compatible with the selected gate style, type, or dimensions.`,
      })
    }
  }

  return issues
}

export type ResolvedVariantPricing = {
  slug: string
  label: string
  unitGbp: number | null
  provisional: boolean
  note: string
}

export function resolveRailheadVariantPricing(
  option: GateOptionSelection,
  config: GateConfig,
  catalog: RailheadVariantCatalog = DEFAULT_RAILHEAD_VARIANT_CATALOG,
): ResolvedVariantPricing | null {
  if (!option.enabled || !option.variant || !isRailheadOptionKey(option.key)) {
    return null
  }

  if (isVariantCatalogBlocked(catalog)) {
    return null
  }

  const entry = findRailheadVariant(option.variant, catalog)
  if (!entry || entry.optionKey !== option.key || !variantAppliesToConfig(entry, config)) {
    return null
  }

  return {
    slug: entry.slug,
    label: entry.label,
    unitGbp: entry.unitPriceGbp,
    provisional: entry.status !== 'confirmed',
    note: entry.notes,
  }
}

export function railheadCatalogSummary(
  catalog: RailheadVariantCatalog = DEFAULT_RAILHEAD_VARIANT_CATALOG,
): {
  status: RailheadVariantCatalog['status']
  blockedReason: string
  owner: string
  entryCount: number
  optionKeys: readonly RailheadOptionKey[]
} {
  return {
    status: catalog.status,
    blockedReason: catalog.blockedReason,
    owner: catalog.owner,
    entryCount: catalog.entries.length,
    optionKeys: RAILHEAD_OPTION_KEYS,
  }
}
