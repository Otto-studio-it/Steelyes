import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getServiceRoleClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

const IngestSchema = z.object({
  gmailThreadId: z.string().min(1),
  fromEmail: z.string().min(1),
  subject: z.string().default(''),
  snippet: z.string().default(''),
  category: z.enum(['preventivo', 'reclamo', 'fattura', 'garanzia', 'generico']).default('generico'),
  receivedAt: z.string().datetime(),
})

/**
 * Logs a direct email to info@steelyes.co.uk for the unified /admin/inbox
 * view. Called by scripts/gmail-inbox-autoack.gs after it auto-acks and
 * triage-labels a thread in Gmail — Resend cannot receive mail, so this is
 * the only way the app learns a customer wrote in directly.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (request.headers.get('authorization') !== `Bearer ${env.INBOX_INGEST_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = IngestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = getServiceRoleClient()
  const { error } = await supabase.from('inbound_emails').upsert(
    {
      gmail_thread_id: parsed.data.gmailThreadId,
      from_email: parsed.data.fromEmail,
      subject: parsed.data.subject,
      snippet: parsed.data.snippet,
      category: parsed.data.category,
      received_at: parsed.data.receivedAt,
    },
    { onConflict: 'gmail_thread_id' },
  )

  if (error) {
    console.error('inbound_emails upsert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
