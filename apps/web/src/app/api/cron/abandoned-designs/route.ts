import { NextResponse } from 'next/server'

import { sendAbandonedReminderEmail } from '@/lib/email/send'
import { buildUnsubscribePath } from '@/lib/email/unsubscribe-token'
import { buildQuoteSharePath } from '@/lib/configurator/share-token'
import { getServiceRoleClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

const REMINDER_DELAY_HOURS = 24
const REMINDER_MAX_AGE_DAYS = 14
const BATCH_LIMIT = 25
/** Stop retrying an address after this many failed sends (bounces, typos, suppressed). */
const MAX_REMINDER_ATTEMPTS = 3

function absoluteSiteUrl(path: string): string {
  const base = env.NEXT_PUBLIC_SITE_URL ?? 'https://steelyes.co.uk'
  return `${base.replace(/\/$/, '')}${path}`
}

/**
 * Daily job (any scheduler — GET with `Authorization: Bearer $CRON_SECRET`): email a single reminder to customers who saved a
 * design via "email me my design" but never requested a quote. Skips anyone
 * who has since submitted a quote request with the same email.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 })
  }

  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getServiceRoleClient()
  const now = Date.now()
  const newestEligible = new Date(now - REMINDER_DELAY_HOURS * 60 * 60 * 1000).toISOString()
  const oldestEligible = new Date(now - REMINDER_MAX_AGE_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data: captures, error } = await supabase
    .from('design_captures')
    .select('id, email, share_token, reminder_attempts')
    .is('reminder_sent_at', null)
    .is('unsubscribed_at', null)
    .lt('reminder_attempts', MAX_REMINDER_ATTEMPTS)
    .lt('created_at', newestEligible)
    .gt('created_at', oldestEligible)
    // Fewest attempts first: addresses that keep failing can no longer starve the queue.
    .order('reminder_attempts', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(BATCH_LIMIT)

  if (error) {
    console.error('Abandoned-design query error:', error)
    return NextResponse.json({ error: 'Could not load the reminder queue' }, { status: 500 })
  }

  let sent = 0
  let skipped = 0
  let failed = 0

  for (const capture of captures ?? []) {
    const { count } = await supabase
      .from('quote_requests')
      .select('id', { count: 'exact', head: true })
      .eq('email', capture.email)

    if ((count ?? 0) > 0) {
      // Already in the quote pipeline — close the capture without emailing.
      await supabase
        .from('design_captures')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', capture.id)
      skipped += 1
      continue
    }

    // The address opted out through another saved design.
    const { count: optedOut } = await supabase
      .from('design_captures')
      .select('id', { count: 'exact', head: true })
      .eq('email', capture.email)
      .not('unsubscribed_at', 'is', null)

    const unsubscribePath = buildUnsubscribePath(capture.id)

    if ((optedOut ?? 0) > 0 || !unsubscribePath) {
      // No reminder without a working opt-out link.
      await supabase
        .from('design_captures')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', capture.id)
      skipped += 1
      continue
    }

    const delivered = await sendAbandonedReminderEmail({
      email: capture.email,
      shareUrl: absoluteSiteUrl(buildQuoteSharePath(capture.share_token)),
      unsubscribeUrl: absoluteSiteUrl(unsubscribePath),
    })

    if (delivered) {
      await supabase
        .from('design_captures')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', capture.id)
      sent += 1
    } else {
      await supabase
        .from('design_captures')
        .update({ reminder_attempts: capture.reminder_attempts + 1 })
        .eq('id', capture.id)
      failed += 1
    }
  }

  return NextResponse.json({ processed: (captures ?? []).length, sent, skipped, failed })
}
