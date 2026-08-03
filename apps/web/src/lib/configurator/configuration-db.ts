import {
  deserializeGateConfig,
  serializeGateConfig,
  type GateConfig,
  type SerializedGateConfigV1,
} from '@steelyes/gate-engine'

import type { Database } from '@/types/database.types'

type ConfigurationRow = Database['public']['Tables']['configurations']['Row']

export type StoredConfigurationPayload = SerializedGateConfigV1 & {
  savedAt?: string
}

export function configurationPayloadFromConfig(config: GateConfig): StoredConfigurationPayload {
  return {
    ...serializeGateConfig(config),
    savedAt: new Date().toISOString(),
  }
}

export function gateConfigFromConfigurationRow(row: ConfigurationRow): GateConfig {
  return deserializeGateConfig(row.parameters as StoredConfigurationPayload)
}
