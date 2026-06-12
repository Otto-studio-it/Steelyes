import { validateGateConfig, type GateConfig, type ValidationIssue } from '@steelyes/gate-engine'

import type { ConfiguratorStepId } from './constants'

const STEP_FIELD_PREFIXES: Record<ConfiguratorStepId, string[]> = {
  gate: ['gateType', 'style', 'finish', 'motorised', 'siteSurveyRequested', 'config', 'version'],
  dimensions: ['widthMm', 'heightMm'],
  posts: ['posts'],
  options: ['options'],
  fence: ['fencePanels'],
  summary: [],
}

function issueMatchesStep(issue: ValidationIssue, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) =>
      issue.field === prefix ||
      issue.field.startsWith(`${prefix}.`) ||
      issue.field.startsWith(`${prefix}[`),
  )
}

export function validateConfiguratorStep(stepId: ConfiguratorStepId, config: GateConfig): ValidationIssue[] {
  const result = validateGateConfig(config)
  if (result.ok) {
    return []
  }

  if (stepId === 'summary') {
    return result.issues
  }

  return result.issues.filter((issue) => issueMatchesStep(issue, STEP_FIELD_PREFIXES[stepId]))
}

export function validateConfiguratorStepsBeforeIndex(
  config: GateConfig,
  targetIndex: number,
  steps: readonly { id: ConfiguratorStepId }[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  for (let index = 0; index < targetIndex; index += 1) {
    const stepId = steps[index]?.id
    if (!stepId) {
      continue
    }
    issues.push(...validateConfiguratorStep(stepId, config))
  }

  return issues
}
