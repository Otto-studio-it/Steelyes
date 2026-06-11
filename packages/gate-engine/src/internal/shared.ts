import type { GateConfig, GateOptionKey, GateType } from '../types'

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function hasOption(config: GateConfig, key: GateOptionKey): boolean {
  return config.options.some((option) => option.key === key && option.enabled)
}

export function getOptionQuantity(config: GateConfig, key: GateOptionKey): number {
  const option = config.options.find((item) => item.key === key && item.enabled)
  return option?.quantity && option.quantity > 0 ? option.quantity : 1
}

export function getLeafCount(gateType: GateType): number {
  if (gateType === 'double_swing' || gateType === 'bifolding_double_swing') {
    return 2
  }

  return 1
}

export function isSlidingGate(gateType: GateType): boolean {
  return gateType.includes('sliding')
}
