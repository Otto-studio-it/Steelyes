import type { GateConfig, GateOptionKey } from '@steelyes/gate-engine'

export function updateOption(
  config: GateConfig,
  key: GateOptionKey,
  enabled: boolean,
  quantity?: number,
): GateConfig {
  return {
    ...config,
    options: config.options.map((option) =>
      option.key === key
        ? {
            ...option,
            enabled,
            quantity: quantity ?? (enabled ? option.quantity || 1 : 0),
          }
        : option,
    ),
  }
}

export function setOptionQuantity(config: GateConfig, key: GateOptionKey, quantity: number): GateConfig {
  return {
    ...config,
    options: config.options.map((option) =>
      option.key === key
        ? {
            ...option,
            enabled: quantity > 0,
            quantity,
          }
        : option,
    ),
  }
}
