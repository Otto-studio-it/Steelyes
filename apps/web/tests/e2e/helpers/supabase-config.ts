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

export async function seedSharedConfiguration(shareToken: string): Promise<boolean> {
  const supabase = getE2EServiceClient()
  if (!supabase) {
    return false
  }

  const { error } = await supabase.from('configurations').insert({
    share_token: shareToken,
    gate_type: 'double-swing',
    parameters: buildTestConfigurationPayload(),
  })

  return !error
}

export async function deleteSharedConfiguration(shareToken: string): Promise<void> {
  const supabase = getE2EServiceClient()
  if (!supabase) {
    return
  }

  await supabase.from('configurations').delete().eq('share_token', shareToken)
}
