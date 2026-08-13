'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import type { AdminActionResult } from '@/lib/admin/admin-action-result'
import { requireAdmin } from '@/lib/admin/require-admin'
import { sendQuoteReadyEmail } from '@/lib/email/send'
import { buildQuotePdfPath, buildQuoteSharePath } from '@/lib/configurator/share-token'
import { getServiceRoleClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'

const UpdateQuoteSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['new', 'contacted', 'quote_sent', 'won', 'lost']),
  admin_notes: z.string().max(2000).optional(),
})

function absoluteSiteUrl(path: string): string {
  const base = env.NEXT_PUBLIC_SITE_URL ?? 'https://steelyes.co.uk'
  return `${base.replace(/\/$/, '')}${path}`
}

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

  const { data: existing } = await client
    .from('quote_requests')
    .select('status, email, first_name, configurations ( share_token )')
    .eq('id', parsed.data.id)
    .maybeSingle()

  // Do not mark a quote as sent unless Resend accepted the notification.
  // Keeping the previous status makes a failed send safely retryable.
  if (parsed.data.status === 'quote_sent' && existing && existing.status !== 'quote_sent') {
    const shareToken = existing.configurations?.share_token
    const sent = await sendQuoteReadyEmail({
      quoteRequestId: parsed.data.id,
      firstName: existing.first_name,
      email: existing.email,
      shareUrl: shareToken ? absoluteSiteUrl(buildQuoteSharePath(shareToken)) : absoluteSiteUrl('/configurator'),
      pdfUrl: shareToken ? absoluteSiteUrl(buildQuotePdfPath(shareToken)) : '',
    })
    if (!sent) return { error: 'Email non inviata. Lo stato non è stato modificato; puoi riprovare.' }
  }

  const { error } = await client
    .from('quote_requests')
    .update({ status: parsed.data.status, admin_notes: parsed.data.admin_notes || null })
    .eq('id', parsed.data.id)

  if (error) return { error: error.message }

  revalidatePath('/admin/quotes')
  return { success: true }
}
