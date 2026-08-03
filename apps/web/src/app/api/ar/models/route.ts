import { NextResponse } from 'next/server'

import { getArModel, putArModel } from '@/lib/configurator/ar/ar-model-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Upload a client-exported GLB/USDZ and get a short-lived HTTPS URL for native AR. */
export async function POST(request: Request) {
  const formatHeader = request.headers.get('x-ar-format')
  const format = formatHeader === 'usdz' || formatHeader === 'glb' ? formatHeader : null
  if (!format) {
    return NextResponse.json({ error: 'x-ar-format must be glb or usdz' }, { status: 400 })
  }

  const buffer = await request.arrayBuffer()
  if (buffer.byteLength < 32 || buffer.byteLength > 25 * 1024 * 1024) {
    return NextResponse.json({ error: 'Invalid model payload size' }, { status: 400 })
  }

  const entry = putArModel(format, new Uint8Array(buffer))
  const origin = new URL(request.url).origin
  const url = `${origin}/api/ar/models/${entry.id}.${format}`

  return NextResponse.json({
    id: entry.id,
    format,
    url,
    expiresInSeconds: 15 * 60,
  })
}

export async function GET() {
  return NextResponse.json({ ok: true, store: 'ephemeral' })
}
