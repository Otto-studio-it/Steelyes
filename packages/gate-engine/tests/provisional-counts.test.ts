import { describe, expect, it } from 'vitest'

import {
  PROVISIONAL_COUNT_RULES,
  collectGeometryIssues,
  createGateConfig,
  createGatePreset,
  getExpectedTopRailheadCount,
  isProvisionalCountGuidance,
} from '../src/index'

describe('provisional count quarantine', () => {
  it('exposes the invented formulas behind PROVISIONAL_COUNT_RULES', () => {
    expect(PROVISIONAL_COUNT_RULES.status).toBe('provisional')
    expect(PROVISIONAL_COUNT_RULES.intakeQuestions).toContain('open.railhead_count_rule')
    expect(getExpectedTopRailheadCount(2800)).toBe(
      Math.min(
        PROVISIONAL_COUNT_RULES.topRailheadMax,
        Math.max(
          PROVISIONAL_COUNT_RULES.topRailheadMin,
          Math.round(2800 / PROVISIONAL_COUNT_RULES.topRailheadDivisorMm),
        ),
      ),
    )
  })

  it('emits guidance severity only — never hard workshop language', () => {
    const config = {
      ...createGateConfig(createGatePreset('double_swing')),
      options: createGateConfig(createGatePreset('double_swing')).options.map((option) =>
        option.key === 'dog_bars'
          ? { ...option, enabled: true, quantity: 9 }
          : option,
      ),
    }

    const issues = collectGeometryIssues(config)
    expect(issues.length).toBeGreaterThan(0)
    expect(issues.every(isProvisionalCountGuidance)).toBe(true)
    expect(issues.every((issue) => !/cannot exceed/i.test(issue.message))).toBe(true)
  })
})
