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
  let event: WebhookEventPayload

  try {
    // Inside the try: the SDK constructor throws without a key, which used to surface as a 500
    // that Resend retries forever. Verification itself only needs the webhook secret.
    const resend = new Resend(env.RESEND_API_KEY ?? 're_webhook_verification_only')
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

  const occurredAt = new Date(event.created_at)
  if (Number.isNaN(occurredAt.getTime())) {
    return NextResponse.json({ received: true })
  }
  const occurredAtIso = occurredAt.toISOString()

  // Webhooks arrive out of order: a late `email.sent` must not overwrite `delivered` / `bounced`.
  // Only apply an event that is newer than the last one recorded.
  const { error } = await getServiceRoleClient()
    .from('email_deliveries')
    .update({ status, last_event_at: occurredAtIso })
    .eq('resend_email_id', event.data.email_id)
    .or(`last_event_at.is.null,last_event_at.lte."${occurredAtIso}"`)

  if (error) {
    console.error('Resend webhook update error:', error)
    return NextResponse.json({ error: 'Could not record event' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
