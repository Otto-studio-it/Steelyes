import { hasOption } from '../internal/shared'
import type { GateConfig, GateOptionKey } from '../types'

export type RuleIssue = {
  field: string
  code: string
  message: string
}

const PROVISIONAL_VICTORIAN_OPTION_KEYS: GateOptionKey[] = [
  'top_railheads',
  'dog_bars',
  'dog_bar_railheads',
  'bushes',
  'spirals',
]

function pushIssue(issues: RuleIssue[], field: string, code: string, message: string): void {
  issues.push({ field, code, message })
}

export function collectCompatibilityIssues(config: GateConfig): RuleIssue[] {
  const issues: RuleIssue[] = []

  if (config.style === 'composite_boards') {
    for (const key of PROVISIONAL_VICTORIAN_OPTION_KEYS) {
      if (hasOption(config, key)) {
        pushIssue(
          issues,
          `options.${key}`,
          'incompatible_option_style',
          'This option is only supported for Traditional Victorian gates in the current release.',
        )
      }
    }
  }

  if (hasOption(config, 'aluminium_panels') && config.style !== 'composite_boards') {
    pushIssue(
      issues,
      'options.aluminium_panels',
      'incompatible_option_style',
      'Aluminium panel upgrade is only available on Composite Boards.',
    )
  }

  if (hasOption(config, 'dog_bar_railheads') && !hasOption(config, 'dog_bars')) {
    pushIssue(
      issues,
      'options.dog_bar_railheads',
      'missing_option_dependency',
      'Dog bar railheads require dog bars to be enabled.',
    )
  }

  return issues
}
