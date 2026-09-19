import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { buildTestConfigurationPayload } from './configurator'

type DatabaseClient = SupabaseClient

export function getE2EServiceClient(): DatabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    return null
  }

  return createClient(url, serviceRoleKey)
}

export async function isSupabaseReachable(): Promise<boolean> {
  const supabase = getE2EServiceClient()
  if (!supabase) {
    return false
  }

  try {
    const { error } = await supabase.from('configurations').select('id').limit(1)
    return !error
  } catch {
    return false
  }
}

export async function seedSharedConfiguration(shareToken: string): Promise<boolean> {
  const supabase = getE2EServiceClient()
  if (!supabase) {
    return false
  }

  try {
    const { error } = await supabase.from('configurations').insert({
      share_token: shareToken,
      gate_type: 'double-swing',
      parameters: buildTestConfigurationPayload(),
    })

    if (error) {
      console.warn('seedSharedConfiguration failed:', error.message)
    }

    return !error
  } catch (error) {
    console.warn('seedSharedConfiguration threw:', error)
    return false
  }
}

export async function deleteSharedConfiguration(shareToken: string): Promise<void> {
  const supabase = getE2EServiceClient()
  if (!supabase) {
    return
  }

  await supabase.from('configurations').delete().eq('share_token', shareToken)
}

/** Remove all rows created by an E2E quote submission for the given email. */
export async function deleteQuoteTestData(email: string): Promise<void> {
  const supabase = getE2EServiceClient()
  if (!supabase) {
    return
  }

  const { data: quotes } = await supabase
    .from('quote_requests')
    .select('configuration_id')
    .eq('email', email)

  const configurationIds = (quotes ?? [])
    .map((quote) => quote.configuration_id)
    .filter((id): id is string => Boolean(id))

  await supabase.from('quote_requests').delete().eq('email', email)
  await supabase.from('design_captures').delete().eq('email', email)
  await supabase.from('leads').delete().eq('email', email)

  if (configurationIds.length > 0) {
    await supabase.from('configurations').delete().in('id', configurationIds)
  }
}
