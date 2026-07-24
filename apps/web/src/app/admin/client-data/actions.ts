'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import type { AdminActionResult } from '@/lib/admin/admin-action-result'
import { requireAdmin } from '@/lib/admin/require-admin'
import { getQuestionById, type IntakeAnswerStatus } from '@/lib/client-intake/questions'
import { buildIntakeExportPdf } from '@/lib/client-intake/export-pdf'
import {
  computeProgress,
  createIntakeSession,
  getIntakeAnswers,
  getLatestIntakeSession,
  setSessionStatus,
  upsertIntakeAnswer,
  type IntakeSessionRow,
} from '@/lib/client-intake/session'

export async function ensureIntakeSession(): Promise<
  AdminActionResult & { session?: IntakeSessionRow }
> {
  const denied = await requireAdmin()
  if (denied) return denied

  const existing = await getLatestIntakeSession()
  if (existing) {
    revalidatePath('/admin/client-data')
    return { success: true, session: existing }
  }

  const session = await createIntakeSession('Marius')
  revalidatePath('/admin/client-data')
  return { success: true, session }
}

export async function createNewIntakeSession(): Promise<
  AdminActionResult & { session?: IntakeSessionRow }
> {
  const denied = await requireAdmin()
  if (denied) return denied

  const session = await createIntakeSession('Marius')
  revalidatePath('/admin/client-data')
  return { success: true, session }
}

const AdminSaveSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().min(1).max(120),
  value: z.unknown(),
  status: z.enum(['proposed', 'confirmed', 'provisional', 'missing']),
})

export async function adminSaveIntakeAnswer(input: {
  sessionId: string
  questionId: string
  value: unknown
  status: IntakeAnswerStatus
}): Promise<AdminActionResult> {
  const denied = await requireAdmin()
  if (denied) return denied

  const parsed = AdminSaveSchema.safeParse(input)
  if (!parsed.success) return { error: 'Dati non validi.' }

  const question = getQuestionById(parsed.data.questionId)
  if (!question) return { error: 'Domanda sconosciuta.' }

  await upsertIntakeAnswer({
    sessionId: parsed.data.sessionId,
    questionId: question.id,
    section: question.section,
    value: parsed.data.value,
    status: parsed.data.status,
    source: 'admin',
  })

  revalidatePath('/admin/client-data')
  return { success: true }
}

export async function adminSetIntakeStatus(
  sessionId: string,
  status: 'in_progress' | 'submitted' | 'locked',
): Promise<AdminActionResult> {
  const denied = await requireAdmin()
  if (denied) return denied

  if (!z.string().uuid().safeParse(sessionId).success) return { error: 'Sessione non valida.' }
  await setSessionStatus(sessionId, status)
  revalidatePath('/admin/client-data')
  return { success: true }
}

export async function exportIntakePdfAction(
  sessionId: string,
): Promise<{ error: string } | { success: true; filename: string; base64: string }> {
  const denied = await requireAdmin()
  if (denied) return denied

  if (!z.string().uuid().safeParse(sessionId).success) return { error: 'Sessione non valida.' }

  const client = (await import('@/lib/supabase/server')).getServiceRoleClient()
  const { data: sessionRow, error } = await client
    .from('client_intake_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle()

  if (error || !sessionRow) return { error: 'Sessione non trovata.' }

  const answers = await getIntakeAnswers(sessionId)
  const progress = computeProgress(answers)
  const bytes = await buildIntakeExportPdf({
    clientName: sessionRow.client_name,
    sessionStatus: sessionRow.status,
    generatedAt: new Date().toLocaleString('it-IT'),
    progress,
    answers: answers.map((a) => ({
      question_id: a.question_id,
      value_json: a.value_json,
      status: a.status,
      source: a.source,
      updated_at: a.updated_at,
    })),
  })

  return {
    success: true,
    filename: `steelyes-intake-${new Date().toISOString().slice(0, 10)}.pdf`,
    base64: Buffer.from(bytes).toString('base64'),
  }
}
