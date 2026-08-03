import { NextResponse } from 'next/server'

import { getArModel } from '@/lib/configurator/ar/ar-model-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = {
  params: { id: string }
}

export async function GET(_request: Request, context: RouteContext) {
  const raw = context.params.id
  const match = /^([0-9a-f-]{36})\.(glb|usdz)$/i.exec(raw)
  if (!match) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const id = match[1]!
  const format = match[2]!.toLowerCase() as 'glb' | 'usdz'
  const entry = getArModel(id)
  if (!entry || entry.format !== format) {
    return NextResponse.json({ error: 'Model expired or missing' }, { status: 404 })
  }

  return new NextResponse(new Uint8Array(entry.bytes), {
    status: 200,
    headers: {
      'Content-Type': entry.contentType,
      'Content-Length': String(entry.bytes.byteLength),
      'Cache-Control': 'private, max-age=60',
      'Content-Disposition': `inline; filename="steelyes-gate.${entry.format}"`,
    },
  })
}
