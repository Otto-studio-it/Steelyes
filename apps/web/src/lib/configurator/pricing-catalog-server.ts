import { DEFAULT_PRICING_CATALOG } from '@steelyes/gate-engine'
import type { PricingCatalog } from '@steelyes/gate-engine'

import { getServiceRoleClient } from '@/lib/supabase/server'

import { buildPricingCatalogFromDbRows } from './pricing-catalog'

/**
 * Loads the live pricing catalog from Supabase (admin-managed `public.gates`
 * and `public.gate_options`). Falls back to the engine default catalog whenever
 * the DB is unreachable, unseeded, or env is not configured.
 */
export async function fetchPricingCatalog(): Promise<PricingCatalog> {
  try {
    const supabase = getServiceRoleClient()

    const [gatesResult, optionsResult] = await Promise.all([
      supabase.from('gates').select('type, finish, base_price_manual_gbp, base_price_auto_gbp'),
      supabase.from('gate_options').select('slug, flat_price_gbp, per_unit_price_gbp, notes'),
    ])

    const gateRows = gatesResult.data
    const optionRows = optionsResult.data

    if (gatesResult.error || !gateRows || gateRows.length === 0) {
      if (optionRows && optionRows.length > 0) {
        return buildPricingCatalogFromDbRows([], optionRows)
      }
      return DEFAULT_PRICING_CATALOG
    }

    return buildPricingCatalogFromDbRows(gateRows, optionRows ?? [])
  } catch {
    return DEFAULT_PRICING_CATALOG
  }
}
