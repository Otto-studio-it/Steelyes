import { NextResponse } from 'next/server'
import { Resend, type WebhookEventPayload } from 'resend'

import { env } from '@/lib/env'
import { getServiceRoleClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const STATUS_BY_EVENT: Partial<Record<WebhookEventPayload['type'], string>> = {
  'email.sent': 'sent',
  'email.delivered': 'delivered',
  'email.delivery_delayed': 'delayed',
  'email.bounced': 'bounced',
  'email.complained': 'complained',
  'email.failed': 'failed',
  'email.suppressed': 'suppressed',
}

export async function POST(request: Request): Promise<NextResponse> {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'RESEND_WEBHOOK_SECRET not configured' }, { status: 503 })
  }

  const payload = await request.text()
  const resend = new Resend(env.RESEND_API_KEY)
  let event: WebhookEventPayload

  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get('svix-id') ?? '',
        timestamp: request.headers.get('svix-timestamp') ?? '',
        signature: request.headers.get('svix-signature') ?? '',
      },
      webhookSecret,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const status = STATUS_BY_EVENT[event.type]
  if (!status || !('email_id' in event.data)) {
    return NextResponse.json({ received: true })
  }

  const { error } = await getServiceRoleClient()
    .from('email_deliveries')
    .update({ status, last_event_at: event.created_at })
    .eq('resend_email_id', event.data.email_id)

  if (error) {
    console.error('Resend webhook update error:', error)
    return NextResponse.json({ error: 'Could not record event' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
