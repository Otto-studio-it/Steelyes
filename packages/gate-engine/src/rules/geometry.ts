import { clamp, getOptionQuantity, hasOption } from '../internal/shared'
import type { GateConfig } from '../types'

export type RuleIssue = {
  field: string
  code: string
  message: string
  /** Guidance never fails validation — provisional workshop guesses only. */
  severity?: 'error' | 'guidance'
}

/**
 * Invented layout helpers used only for schematic preview density.
 * None of these divisors are client-confirmed workshop rules.
 *
 * Open intake questions:
 * - open.railhead_count_rule
 * - open.dog_bars_count_rule
 * - open.circles_count_rule (bushes / spirals capacity)
 */
export const PROVISIONAL_COUNT_RULES = {
  topRailheadDivisorMm: 190,
  topRailheadMin: 6,
  topRailheadMax: 14,
  dogBarRailheadDivisorMm: 220,
  dogBarRailheadMin: 4,
  dogBarRailheadMax: 10,
  dogBarBase: 2,
  dogBarDivisorMm: 850,
  dogBarMin: 2,
  dogBarMax: 5,
  decorativeSwingDivisorMm: 210,
  decorativeSlidingDivisorMm: 230,
  decorativeSwingMin: 8,
  decorativeSwingMax: 16,
  decorativeSlidingMin: 6,
  decorativeSlidingMax: 14,
  intakeQuestions: [
    'open.railhead_count_rule',
    'open.dog_bars_count_rule',
    'open.circles_count_rule',
  ] as const,
  status: 'provisional' as const,
}

const R = PROVISIONAL_COUNT_RULES

export function getExpectedTopRailheadCount(widthMm: number): number {
  return clamp(Math.round(widthMm / R.topRailheadDivisorMm), R.topRailheadMin, R.topRailheadMax)
}

export function getExpectedDogBarRailheadCount(widthMm: number): number {
  return clamp(
    Math.round(widthMm / R.dogBarRailheadDivisorMm),
    R.dogBarRailheadMin,
    R.dogBarRailheadMax,
  )
}

export function getExpectedDogBarCount(widthMm: number): number {
  return clamp(R.dogBarBase + Math.round(widthMm / R.dogBarDivisorMm), R.dogBarMin, R.dogBarMax)
}

export function getDecorativeBarCapacity(config: GateConfig): number {
  if (config.gateType.includes('sliding')) {
    return clamp(
      Math.round(config.widthMm / R.decorativeSlidingDivisorMm),
      R.decorativeSlidingMin,
      R.decorativeSlidingMax,
    )
  }

  return clamp(
    Math.round(config.widthMm / R.decorativeSwingDivisorMm),
    R.decorativeSwingMin,
    R.decorativeSwingMax,
  )
}

function pushGuidance(issues: RuleIssue[], field: string, message: string): void {
  issues.push({
    field,
    code: 'provisional_count_guidance',
    message,
    severity: 'guidance',
  })
}

/**
 * Soft guidance only — never a hard validation failure.
 * Preview may still clamp quantities for schematic layout.
 */
export function collectGeometryIssues(config: GateConfig): RuleIssue[] {
  const issues: RuleIssue[] = []

  if (hasOption(config, 'top_railheads')) {
    const guideCount = getExpectedTopRailheadCount(config.widthMm)
    const actualCount = getOptionQuantity(config, 'top_railheads')
    if (actualCount > guideCount) {
      pushGuidance(
        issues,
        'options.top_railheads',
        `Schematic guide suggests about ${guideCount} top railheads at ${config.widthMm} mm — final count confirmed at survey (open.railhead_count_rule).`,
      )
    }
  }

  if (hasOption(config, 'dog_bar_railheads')) {
    const guideCount = getExpectedDogBarRailheadCount(config.widthMm)
    const actualCount = getOptionQuantity(config, 'dog_bar_railheads')
    if (actualCount > guideCount) {
      pushGuidance(
        issues,
        'options.dog_bar_railheads',
        `Schematic guide suggests about ${guideCount} dog-bar railheads at ${config.widthMm} mm — final count confirmed at survey (open.railhead_count_rule).`,
      )
    }
  }

  if (hasOption(config, 'dog_bars')) {
    const guideCount = getExpectedDogBarCount(config.widthMm)
    const actualCount = getOptionQuantity(config, 'dog_bars')
    if (actualCount > guideCount) {
      pushGuidance(
        issues,
        'options.dog_bars',
        `Schematic guide suggests about ${guideCount} dog bars at ${config.widthMm} mm — final count confirmed at survey (open.dog_bars_count_rule).`,
      )
    }
  }

  if (hasOption(config, 'bushes')) {
    const capacity = getDecorativeBarCapacity(config)
    const actualCount = getOptionQuantity(config, 'bushes')
    if (actualCount > capacity) {
      pushGuidance(
        issues,
        'options.bushes',
        `Schematic guide suggests up to about ${capacity} bushes for this width — final count confirmed at survey (open.circles_count_rule).`,
      )
    }
  }

  if (hasOption(config, 'spirals')) {
    const capacity = getDecorativeBarCapacity(config)
    const actualCount = getOptionQuantity(config, 'spirals')
    if (actualCount > capacity) {
      pushGuidance(
        issues,
        'options.spirals',
        `Schematic guide suggests up to about ${capacity} spirals for this width — final count confirmed at survey (open.circles_count_rule).`,
      )
    }
  }

  return issues
}

/** Guidance issues that must never fail validateGateConfig. */
export function isProvisionalCountGuidance(issue: Pick<RuleIssue, 'code' | 'severity'>): boolean {
  return issue.code === 'provisional_count_guidance' || issue.severity === 'guidance'
}
