'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import type { AdminActionResult } from '@/lib/admin/admin-action-result'
import { requireAdmin } from '@/lib/admin/require-admin'
import { getServiceRoleClient } from '@/lib/supabase/server'

const UpdateQuoteSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['new', 'contacted', 'quote_sent', 'won', 'lost']),
  admin_notes: z.string().max(2000).optional(),
})

export async function updateQuoteRequest(formData: FormData): Promise<AdminActionResult> {
  const notesRaw = formData.get('admin_notes')
  const parsed = UpdateQuoteSchema.safeParse({
    id: formData.get('id'),
    status: formData.get('status'),
    admin_notes: typeof notesRaw === 'string' ? notesRaw.trim() : undefined,
  })

  if (!parsed.success) return { error: 'Dati non validi.' }

  const denied = await requireAdmin()
  if (denied) return denied

  const client = getServiceRoleClient()
  const { error } = await client
    .from('quote_requests')
    .update({
      status: parsed.data.status,
      admin_notes: parsed.data.admin_notes || null,
    })
    .eq('id', parsed.data.id)

  if (error) return { error: error.message }

  revalidatePath('/admin/quotes')
  return { success: true }
}
