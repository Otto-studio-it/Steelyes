import {
  INTAKE_QUESTIONS,
  type IntakeAnswerStatus,
} from '@/lib/client-intake/questions'

export type IntakeProgress = {
  total: number
  confirmed: number
  provisional: number
  proposed: number
  missing: number
  blockingMissing: number
  answeredLike: number
}

/** Client-safe progress from a question_id → status map. */
export function computeProgressFromStatuses(
  statuses: ReadonlyMap<string, IntakeAnswerStatus>,
): IntakeProgress {
  let confirmed = 0
  let provisional = 0
  let proposed = 0
  let missing = 0
  let blockingMissing = 0

  for (const q of INTAKE_QUESTIONS) {
    const status = statuses.get(q.id) ?? 'missing'
    if (status === 'confirmed') confirmed += 1
    else if (status === 'provisional') provisional += 1
    else if (status === 'proposed') proposed += 1
    else missing += 1

    if (q.blocking && status !== 'confirmed' && status !== 'provisional') {
      blockingMissing += 1
    }
  }

  return {
    total: INTAKE_QUESTIONS.length,
    confirmed,
    provisional,
    proposed,
    missing,
    blockingMissing,
    answeredLike: confirmed + provisional,
  }
}

export function formatAnswerValue(value: unknown): string {
  if (value == null || value === '') return '—'
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (Array.isArray(value)) {
    return value.map((v) => formatAnswerValue(v)).join(', ')
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    const parts: string[] = []
    if (typeof record.choice === 'string') {
      const choiceLabels: Record<string, string> = {
        confirm: 'Confermato',
        correct: 'Corretto (vedi nota)',
        unsure: 'Non sicuro',
      }
      parts.push(choiceLabels[record.choice] ?? record.choice)
    }
    if (typeof record.note === 'string' && record.note.trim()) {
      parts.push(`Nota: ${record.note.trim()}`)
    }
    for (const [key, val] of Object.entries(record)) {
      if (key === 'choice' || key === 'note' || key === 'statement') continue
      if (val == null || val === '') continue
      parts.push(`${key}: ${String(val)}`)
    }
    if (parts.length === 0) return JSON.stringify(value)
    return parts.join(' · ')
  }
  return String(value)
}
