'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import type { AdminActionResult } from '@/lib/admin/admin-action-result'
import { requireAdmin } from '@/lib/admin/require-admin'
import { getServiceRoleClient } from '@/lib/supabase/server'

const MarkHandledSchema = z.object({
  id: z.string().uuid(),
  handled: z.enum(['true', 'false']),
})

export async function markInboxEmailHandled(formData: FormData): Promise<AdminActionResult> {
  const parsed = MarkHandledSchema.safeParse({
    id: formData.get('id'),
    handled: formData.get('handled'),
  })

  if (!parsed.success) return { error: 'Dati non validi.' }

  const denied = await requireAdmin()
  if (denied) return denied

  const client = getServiceRoleClient()
  const { error } = await client
    .from('inbound_emails')
    .update({ handled: parsed.data.handled === 'true' })
    .eq('id', parsed.data.id)

  if (error) return { error: error.message }

  revalidatePath('/admin/inbox')
  return { success: true }
}
