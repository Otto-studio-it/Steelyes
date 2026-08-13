import {
  getExpectedTopRailheadCount,
  type GateConfig,
  type GateOptionKey,
} from '@steelyes/gate-engine'

const DEFAULT_RAILHEAD_VARIANT = 'RH32'
const DEFAULT_COLLAR_VARIANT = 'every_1'

export function updateOption(
  config: GateConfig,
  key: GateOptionKey,
  enabled: boolean,
  quantity?: number,
): GateConfig {
  return {
    ...config,
    options: config.options.map((option) => {
      if (option.key !== key) return option

      if (!enabled) {
        return {
          ...option,
          enabled: false,
          quantity: 0,
          variant: undefined,
        }
      }

      // Railheads / dog bars / circles / collars: on/off only — never ask for qty.
      if (key === 'top_railheads') {
        return {
          ...option,
          enabled: true,
          quantity: Math.max(1, getExpectedTopRailheadCount(config.widthMm)),
          variant: option.variant ?? DEFAULT_RAILHEAD_VARIANT,
        }
      }

      if (key === 'picket_collars') {
        return {
          ...option,
          enabled: true,
          quantity: 1,
          variant: option.variant ?? DEFAULT_COLLAR_VARIANT,
        }
      }

      if (key === 'dog_bars' || key === 'circles') {
        return {
          ...option,
          enabled: true,
          quantity: 1,
          variant: undefined,
        }
      }

      return {
        ...option,
        enabled: true,
        quantity: quantity ?? (option.quantity || 1),
      }
    }),
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

export function setOptionVariant(
  config: GateConfig,
  key: GateOptionKey,
  variant: string | undefined,
): GateConfig {
  return {
    ...config,
    options: config.options.map((option) =>
      option.key === key
        ? {
            ...option,
            variant,
          }
        : option,
    ),
  }
}
