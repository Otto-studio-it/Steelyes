import { validateGateConfig, type GateConfig, type ValidationIssue } from '@steelyes/gate-engine'

import type { ConfiguratorActId, ConfiguratorStepId } from './navigation'

const STEP_FIELD_PREFIXES: Record<ConfiguratorStepId, string[]> = {
  gate: ['gateType', 'style', 'finish', 'motorised', 'config', 'version'],
  dimensions: ['widthMm', 'heightMm'],
  posts: ['posts'],
  options: ['options'],
  fence: ['fencePanels'],
  summary: [],
}

const ACT_FIELD_PREFIXES: Record<ConfiguratorActId, string[]> = {
  choose: STEP_FIELD_PREFIXES.gate,
  define: [...STEP_FIELD_PREFIXES.dimensions, ...STEP_FIELD_PREFIXES.posts, ...STEP_FIELD_PREFIXES.fence],
  refine: [...STEP_FIELD_PREFIXES.options, 'siteSurveyRequested'],
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

function validateWithPrefixes(config: GateConfig, prefixes: string[]): ValidationIssue[] {
  const result = validateGateConfig(config)
  if (result.ok) {
    return []
  }

  return result.issues.filter((issue) => issueMatchesStep(issue, prefixes))
}

export function validateConfiguratorStep(stepId: ConfiguratorStepId, config: GateConfig): ValidationIssue[] {
  if (stepId === 'summary') {
    const result = validateGateConfig(config)
    return result.ok ? [] : result.issues
  }

  return validateWithPrefixes(config, STEP_FIELD_PREFIXES[stepId])
}

export function validateConfiguratorAct(actId: ConfiguratorActId, config: GateConfig): ValidationIssue[] {
  if (actId === 'summary') {
    const result = validateGateConfig(config)
    return result.ok ? [] : result.issues
  }

  return validateWithPrefixes(config, ACT_FIELD_PREFIXES[actId])
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

export function validateConfiguratorActsBeforeIndex(
  config: GateConfig,
  targetIndex: number,
  acts: readonly { id: ConfiguratorActId }[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  for (let index = 0; index < targetIndex; index += 1) {
    const actId = acts[index]?.id
    if (!actId) {
      continue
    }
    issues.push(...validateConfiguratorAct(actId, config))
  }

  return issues
}
