import { NextResponse } from 'next/server'

import { verifyUnsubscribeToken } from '@/lib/email/unsubscribe-token'
import { checkRateLimit, clientKeyFromHeaders } from '@/lib/security/rate-limit'
import { getServiceRoleClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const UNSUBSCRIBE_LIMIT = { name: 'unsubscribe', limit: 20, windowMs: 10 * 60_000 }
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function page(title: string, body: string, status: number): NextResponse {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${title} | Steelyes</title></head><body style="font-family:system-ui,sans-serif;max-width:32rem;margin:15vh auto;padding:0 1.5rem;color:#1b1c1a"><h1 style="font-size:1.5rem">${title}</h1><p style="line-height:1.6">${body}</p><p><a href="/" style="color:#9e000c">Back to steelyes.co.uk</a></p></body></html>`
  return new NextResponse(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

async function unsubscribe(request: Request): Promise<NextResponse> {
  if (!checkRateLimit(UNSUBSCRIBE_LIMIT, clientKeyFromHeaders(request.headers)).ok) {
    return page('Please try again shortly', 'Too many requests from this address.', 429)
  }

  const url = new URL(request.url)
  const captureId = url.searchParams.get('c') ?? ''
  const token = url.searchParams.get('t') ?? ''

  if (!UUID_PATTERN.test(captureId) || !verifyUnsubscribeToken(captureId, token)) {
    return page('Link not valid', 'This unsubscribe link is not valid. Reply to the email and we will remove you.', 400)
  }

  try {
    const supabase = getServiceRoleClient()
    const { data: capture } = await supabase
      .from('design_captures')
      .select('email')
      .eq('id', captureId)
      .maybeSingle()

    if (capture?.email) {
      // Opt out the address, not just this one saved design.
      await supabase
        .from('design_captures')
        .update({ unsubscribed_at: new Date().toISOString() })
        .eq('email', capture.email)
        .is('unsubscribed_at', null)
    }
  } catch (error) {
    console.error('Unsubscribe failed:', error)
    return page('Something went wrong', 'We could not process that just now. Reply to the email and we will remove you.', 500)
  }

  return page('You are unsubscribed', 'We will not send you any more reminders about saved gate designs.', 200)
}

export async function GET(request: Request) {
  return unsubscribe(request)
}

/** RFC 8058 one-click unsubscribe (List-Unsubscribe-Post). */
export async function POST(request: Request) {
  return unsubscribe(request)
}
