'use server'

import {
  deserializeGateConfig,
  validateGateConfig,
  type GateConfig,
} from '@steelyes/gate-engine'

import {
  configurationPayloadFromConfig,
  gateConfigFromConfigurationRow,
} from '@/lib/configurator/configuration-db'
import { mapGateTypeToDb } from '@/lib/configurator/db-map'
import { createShareToken, isValidShareToken } from '@/lib/configurator/share-token'
import { getServiceRoleClient } from '@/lib/supabase/server'

export type SaveGateConfigurationResult =
  | {
      ok: true
      shareToken: string
      configurationId: string
    }
  | {
      ok: false
      error: string
    }

export async function saveGateConfiguration(
  serializedConfig: string,
): Promise<SaveGateConfigurationResult> {
  try {
    let config: GateConfig

    try {
      config = deserializeGateConfig(serializedConfig)
    } catch {
      return { ok: false, error: 'Invalid configuration payload.' }
    }

    const validation = validateGateConfig(config)
    if (!validation.ok) {
      const firstIssue = validation.issues[0]
      return { ok: false, error: firstIssue?.message ?? 'Configuration failed validation.' }
    }

    const supabase = getServiceRoleClient()
    let lastError: unknown = null

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const shareToken = createShareToken()
      const { data, error } = await supabase
        .from('configurations')
        .insert({
          share_token: shareToken,
          gate_type: mapGateTypeToDb(config.gateType),
          parameters: configurationPayloadFromConfig(config),
        })
        .select('id, share_token')
        .single()

      if (!error && data) {
        return {
          ok: true,
          shareToken: data.share_token,
          configurationId: data.id,
        }
      }

      lastError = error
      console.error(`Configuration save error (attempt ${attempt + 1}):`, error)
    }

    console.error('Configuration save failed after retry:', lastError)
    return { ok: false, error: 'Could not save configuration. Please try again.' }
  } catch (error) {
    console.error('Configuration save error:', error)
    return { ok: false, error: 'Could not save configuration. Please try again.' }
  }
}

export async function loadGateConfigurationByShareToken(
  shareToken: string,
): Promise<GateConfig | null> {
  if (!isValidShareToken(shareToken)) {
    return null
  }

  const supabase = getServiceRoleClient()
  const { data, error } = await supabase
    .from('configurations')
    .select('*')
    .eq('share_token', shareToken)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  try {
    return gateConfigFromConfigurationRow(data)
  } catch {
    return null
  }
}
