'use server'

import { z } from 'zod'

import { getQuestionById, type IntakeAnswerStatus } from '@/lib/client-intake/questions'
import {
  computeProgress,
  getIntakeAnswers,
  getIntakeSessionByToken,
  markSessionSubmitted,
  touchSessionNotified,
  upsertIntakeAnswer,
} from '@/lib/client-intake/session'
import { sendClientIntakeUpdateEmail } from '@/lib/email/send'
import { env } from '@/lib/env'

const SaveSchema = z.object({
  token: z.string().min(16).max(128),
  questionId: z.string().min(1).max(120),
  value: z.unknown(),
  status: z.enum(['proposed', 'confirmed', 'provisional', 'missing']),
})

function absoluteUrl(path: string): string {
  const base = env.NEXT_PUBLIC_SITE_URL ?? 'https://steelyes.co.uk'
  return `${base.replace(/\/$/, '')}${path}`
}

function shouldNotify(session: {
  last_notified_at: string | null
  status: string
}): boolean {
  if (session.status === 'locked') return false
  if (!session.last_notified_at) return true
  const last = new Date(session.last_notified_at).getTime()
  // Throttle emails to at most one every 10 minutes
  return Date.now() - last > 10 * 60 * 1000
}

export type IntakeSaveResult =
  | { ok: true; status: IntakeAnswerStatus; updatedAt: string }
  | { ok: false; error: string }

export async function saveIntakeAnswer(input: {
  token: string
  questionId: string
  value: unknown
  status: IntakeAnswerStatus
}): Promise<IntakeSaveResult> {
  const parsed = SaveSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Dati non validi.' }

  const question = getQuestionById(parsed.data.questionId)
  if (!question) return { ok: false, error: 'Domanda sconosciuta.' }

  const session = await getIntakeSessionByToken(parsed.data.token)
  if (!session) return { ok: false, error: 'Link non valido.' }
  if (session.status === 'locked') {
    return { ok: false, error: 'Questa sessione è bloccata. Contatta Steelyes per modifiche.' }
  }

  const row = await upsertIntakeAnswer({
    sessionId: session.id,
    questionId: question.id,
    section: question.section,
    value: parsed.data.value,
    status: parsed.data.status,
    source: 'client',
  })

  if (shouldNotify(session)) {
    const answers = await getIntakeAnswers(session.id)
    const progress = computeProgress(answers)
    await sendClientIntakeUpdateEmail({
      clientName: session.client_name,
      questionLabel: question.label,
      status: parsed.data.status,
      adminUrl: absoluteUrl('/admin/client-data'),
      intakeUrl: absoluteUrl(`/intake/${session.access_token}`),
      progressSummary: `${progress.confirmed} confermati · ${progress.provisional} provvisori · ${progress.blockingMissing} bloccanti aperti`,
    })
    await touchSessionNotified(session.id)
  }

  return { ok: true, status: row.status, updatedAt: row.updated_at }
}

export async function submitIntakeSession(token: string): Promise<IntakeSaveResult> {
  if (typeof token !== 'string' || token.length < 16) {
    return { ok: false, error: 'Token non valido.' }
  }
  const session = await getIntakeSessionByToken(token)
  if (!session) return { ok: false, error: 'Link non valido.' }
  if (session.status === 'locked') {
    return { ok: false, error: 'Sessione già bloccata.' }
  }

  await markSessionSubmitted(session.id)

  const answers = await getIntakeAnswers(session.id)
  const progress = computeProgress(answers)
  await sendClientIntakeUpdateEmail({
    clientName: session.client_name,
    questionLabel: 'Sessione segnata come completata',
    status: 'submitted',
    adminUrl: absoluteUrl('/admin/client-data'),
    intakeUrl: absoluteUrl(`/intake/${session.access_token}`),
    progressSummary: `${progress.confirmed}/${progress.total} confermati · ${progress.blockingMissing} bloccanti ancora aperti`,
  })
  await touchSessionNotified(session.id)

  return { ok: true, status: 'confirmed', updatedAt: new Date().toISOString() }
}
