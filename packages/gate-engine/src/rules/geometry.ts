import type { GateConfig, GateOptionKey } from '../types'

export type RuleIssue = {
  field: string
  code: string
  message: string
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function hasOption(config: GateConfig, key: GateOptionKey): boolean {
  return config.options.some((option) => option.key === key && option.enabled)
}

function getOptionQuantity(config: GateConfig, key: GateOptionKey): number {
  const option = config.options.find((item) => item.key === key && item.enabled)
  return option?.quantity && option.quantity > 0 ? option.quantity : 1
}

export function getExpectedTopRailheadCount(widthMm: number): number {
  return clamp(Math.round(widthMm / 190), 6, 14)
}

export function getExpectedDogBarRailheadCount(widthMm: number): number {
  return clamp(Math.round(widthMm / 220), 4, 10)
}

export function getExpectedDogBarCount(widthMm: number): number {
  return clamp(2 + Math.round(widthMm / 850), 2, 5)
}

export function getDecorativeBarCapacity(config: GateConfig): number {
  if (config.gateType.includes('sliding')) {
    return clamp(Math.round(config.widthMm / 230), 6, 14)
  }

  return clamp(Math.round(config.widthMm / 210), 8, 16)
}

function pushIssue(issues: RuleIssue[], field: string, code: string, message: string): void {
  issues.push({ field, code, message })
}

export function collectGeometryIssues(config: GateConfig): RuleIssue[] {
  const issues: RuleIssue[] = []

  if (hasOption(config, 'top_railheads')) {
    const expectedCount = getExpectedTopRailheadCount(config.widthMm)
    const actualCount = getOptionQuantity(config, 'top_railheads')
    if (actualCount > expectedCount) {
      pushIssue(
        issues,
        'options.top_railheads',
        'geometry_count_mismatch',
        `Top railheads cannot exceed ${expectedCount} items for a ${config.widthMm}mm wide gate.`,
      )
    }
  }

  if (hasOption(config, 'dog_bar_railheads')) {
    const expectedCount = getExpectedDogBarRailheadCount(config.widthMm)
    const actualCount = getOptionQuantity(config, 'dog_bar_railheads')
    if (actualCount > expectedCount) {
      pushIssue(
        issues,
        'options.dog_bar_railheads',
        'geometry_count_mismatch',
        `Dog bar railheads cannot exceed ${expectedCount} items for a ${config.widthMm}mm wide gate.`,
      )
    }
  }

  if (hasOption(config, 'dog_bars')) {
    const expectedCount = getExpectedDogBarCount(config.widthMm)
    const actualCount = getOptionQuantity(config, 'dog_bars')
    if (actualCount > expectedCount) {
      pushIssue(
        issues,
        'options.dog_bars',
        'geometry_count_mismatch',
        `Dog bars cannot exceed ${expectedCount} items for a ${config.widthMm}mm wide gate.`,
      )
    }
  }

  if (hasOption(config, 'bushes')) {
    const capacity = getDecorativeBarCapacity(config)
    const actualCount = getOptionQuantity(config, 'bushes')
    if (actualCount > capacity) {
      pushIssue(
        issues,
        'options.bushes',
        'geometry_quantity_exceeds_capacity',
        `Bushes cannot exceed ${capacity} items for this gate width and mechanism.`,
      )
    }
  }

  if (hasOption(config, 'spirals')) {
    const capacity = getDecorativeBarCapacity(config)
    const actualCount = getOptionQuantity(config, 'spirals')
    if (actualCount > capacity) {
      pushIssue(
        issues,
        'options.spirals',
        'geometry_quantity_exceeds_capacity',
        `Spirals cannot exceed ${capacity} items for this gate width and mechanism.`,
      )
    }
  }

  return issues
}
