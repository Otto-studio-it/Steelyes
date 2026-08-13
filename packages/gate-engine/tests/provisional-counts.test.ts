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
  it('exposes bay-locked CA-14 helpers behind PROVISIONAL_COUNT_RULES', () => {
    expect(PROVISIONAL_COUNT_RULES.status).toBe('provisional_pending_bay_impl')
    expect(PROVISIONAL_COUNT_RULES.intakeQuestions).toContain('open.railhead_variants')
    // CA-14: one per ~100 mm bay (minus edge) — 2800 → ~27
    expect(getExpectedTopRailheadCount(2800)).toBe(
      Math.min(40, Math.max(4, Math.round(2800 / 100) - 1)),
    )
  })

  it('emits guidance severity only — never hard workshop language', () => {
    const base = createGateConfig(createGatePreset('double_swing'))
    const config = {
      ...base,
      options: base.options.map((option) =>
        option.key === 'dog_bars'
          ? { ...option, enabled: true, quantity: 80 }
          : option,
      ),
    }

    const issues = collectGeometryIssues(config)
    expect(issues.length).toBeGreaterThan(0)
    expect(issues.every(isProvisionalCountGuidance)).toBe(true)
    expect(issues.every((issue) => !/cannot exceed/i.test(issue.message))).toBe(true)
  })
})
