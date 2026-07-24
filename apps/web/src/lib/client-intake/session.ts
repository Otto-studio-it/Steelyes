import { randomBytes } from 'node:crypto'

import {
  INTAKE_QUESTIONS,
  type IntakeAnswerSource,
  type IntakeAnswerStatus,
} from '@/lib/client-intake/questions'
import { computeProgressFromStatuses, type IntakeProgress } from '@/lib/client-intake/progress'
import { getServiceRoleClient } from '@/lib/supabase/server'
import type { Json } from '@/types/database.types'

export type IntakeSessionRow = {
  id: string
  access_token: string
  client_name: string
  status: 'in_progress' | 'submitted' | 'locked'
  created_at: string
  updated_at: string
  last_client_activity_at: string | null
  last_notified_at: string | null
}

export type IntakeAnswerRow = {
  id: string
  session_id: string
  question_id: string
  section: string
  value_json: Json | null
  status: IntakeAnswerStatus
  source: IntakeAnswerSource
  updated_at: string
}

function newAccessToken(): string {
  return randomBytes(24).toString('base64url')
}

/** Create a session and seed all proposed answers from the catalog. */
export async function createIntakeSession(clientName = 'Marius'): Promise<IntakeSessionRow> {
  const client = getServiceRoleClient()
  const access_token = newAccessToken()

  const { data: session, error } = await client
    .from('client_intake_sessions')
    .insert({ access_token, client_name: clientName, status: 'in_progress' })
    .select('*')
    .single()

  if (error || !session) {
    throw new Error(error?.message ?? 'Impossibile creare la sessione intake.')
  }

  const rows = INTAKE_QUESTIONS.map((q) => {
    if (q.seed) {
      return {
        session_id: session.id,
        question_id: q.id,
        section: q.section,
        value_json: q.seed.value as Json,
        status: q.seed.status,
        source: 'seed' as const,
      }
    }
    return {
      session_id: session.id,
      question_id: q.id,
      section: q.section,
      value_json: null,
      status: 'missing' as const,
      source: 'seed' as const,
    }
  })

  const { error: seedError } = await client.from('client_intake_answers').insert(rows)
  if (seedError) {
    throw new Error(seedError.message)
  }

  return session as IntakeSessionRow
}

export async function getLatestIntakeSession(): Promise<IntakeSessionRow | null> {
  const client = getServiceRoleClient()
  const { data, error } = await client
    .from('client_intake_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return (data as IntakeSessionRow | null) ?? null
}

export async function getIntakeSessionByToken(token: string): Promise<IntakeSessionRow | null> {
  const client = getServiceRoleClient()
  const { data, error } = await client
    .from('client_intake_sessions')
    .select('*')
    .eq('access_token', token)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return (data as IntakeSessionRow | null) ?? null
}

export async function getIntakeAnswers(sessionId: string): Promise<IntakeAnswerRow[]> {
  const client = getServiceRoleClient()
  const { data, error } = await client
    .from('client_intake_answers')
    .select('*')
    .eq('session_id', sessionId)

  if (error) throw new Error(error.message)
  return (data as IntakeAnswerRow[]) ?? []
}

/** Ensure every catalog question has a row. Idempotent under concurrent loads. */
export async function ensureAnswersSeeded(sessionId: string): Promise<IntakeAnswerRow[]> {
  const existing = await getIntakeAnswers(sessionId)
  const existingIds = new Set(existing.map((a) => a.question_id))
  const missing = INTAKE_QUESTIONS.filter((q) => !existingIds.has(q.id))
  if (missing.length === 0) return existing

  const client = getServiceRoleClient()
  const rows = missing.map((q) => {
    if (q.seed) {
      return {
        session_id: sessionId,
        question_id: q.id,
        section: q.section,
        value_json: q.seed.value as Json,
        status: q.seed.status,
        source: 'seed' as const,
      }
    }
    return {
      session_id: sessionId,
      question_id: q.id,
      section: q.section,
      value_json: null,
      status: 'missing' as const,
      source: 'seed' as const,
    }
  })

  const { error } = await client.from('client_intake_answers').upsert(rows, {
    onConflict: 'session_id,question_id',
    ignoreDuplicates: true,
  })

  // Concurrent page loads can still race; treat unique violations as success.
  if (error && !/duplicate key|unique constraint/i.test(error.message)) {
    throw new Error(error.message)
  }

  return getIntakeAnswers(sessionId)
}

export type UpsertAnswerInput = {
  sessionId: string
  questionId: string
  section: string
  value: unknown
  status: IntakeAnswerStatus
  source: IntakeAnswerSource
}

export async function upsertIntakeAnswer(input: UpsertAnswerInput): Promise<IntakeAnswerRow> {
  const client = getServiceRoleClient()
  const now = new Date().toISOString()

  const { data, error } = await client
    .from('client_intake_answers')
    .upsert(
      {
        session_id: input.sessionId,
        question_id: input.questionId,
        section: input.section,
        value_json: input.value as Json,
        status: input.status,
        source: input.source,
        updated_at: now,
      },
      { onConflict: 'session_id,question_id' },
    )
    .select('*')
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Salvataggio fallito.')

  await client
    .from('client_intake_sessions')
    .update({
      updated_at: now,
      ...(input.source === 'client' ? { last_client_activity_at: now } : {}),
    })
    .eq('id', input.sessionId)

  return data as IntakeAnswerRow
}

export async function markSessionSubmitted(sessionId: string): Promise<void> {
  const client = getServiceRoleClient()
  const { error } = await client
    .from('client_intake_sessions')
    .update({ status: 'submitted', updated_at: new Date().toISOString() })
    .eq('id', sessionId)
    .neq('status', 'locked')

  if (error) throw new Error(error.message)
}

export async function setSessionStatus(
  sessionId: string,
  status: IntakeSessionRow['status'],
): Promise<void> {
  const client = getServiceRoleClient()
  const { error } = await client
    .from('client_intake_sessions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', sessionId)

  if (error) throw new Error(error.message)
}

export async function touchSessionNotified(sessionId: string): Promise<void> {
  const client = getServiceRoleClient()
  await client
    .from('client_intake_sessions')
    .update({ last_notified_at: new Date().toISOString() })
    .eq('id', sessionId)
}

export function computeProgress(answers: IntakeAnswerRow[]): IntakeProgress {
  const statuses = new Map<string, IntakeAnswerStatus>(
    answers.map((a) => [a.question_id, a.status]),
  )
  return computeProgressFromStatuses(statuses)
}
