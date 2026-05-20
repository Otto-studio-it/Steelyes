import type { RailheadVariantCatalog } from './types'

/**
 * Production railhead catalogue — intentionally empty until Marius confirms
 * the variant list, unit prices, and compatibility rules.
 *
 * Do not add speculative variants here. Use tests/fixtures for catalog wiring checks.
 */
export const DEFAULT_RAILHEAD_VARIANT_CATALOG: RailheadVariantCatalog = {
  status: 'blocked_pending_client',
  blockedReason:
    'Awaiting confirmed railhead variant list, unit prices, and compatibility rules from Marius.',
  owner: 'Marius',
  entries: [],
}
