import { NextResponse } from 'next/server'

/** Liveness probe — always 200, even during SITE_HOLD. */
export function GET() {
  return NextResponse.json({ ok: true }, { status: 200 })
}
