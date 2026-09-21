export type ArModelUploadResponse = {
  id: string
  format: 'glb' | 'usdz'
  url: string
  expiresAt: number
  expiresInSeconds: number
  phoneReachable: boolean
}

export type GateArHostedModels = {
  glb: ArModelUploadResponse
  usdz: ArModelUploadResponse
  expiresAt: number
  phoneReachable: boolean
}

export class ArModelUploadError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ArModelUploadError'
    this.status = status
    this.code = code
  }
}

async function readErrorPayload(res: Response): Promise<{ error?: string; code?: string }> {
  try {
    return (await res.json()) as { error?: string; code?: string }
  } catch {
    return {}
  }
}

export async function uploadArModel(
  blob: Blob,
  format: 'glb' | 'usdz',
  fetchImpl: typeof fetch = fetch,
): Promise<ArModelUploadResponse> {
  const res = await fetchImpl('/api/ar/models', {
    method: 'POST',
    headers: { 'x-ar-format': format },
    body: blob,
  })

  if (!res.ok) {
    const body = await readErrorPayload(res)
    throw new ArModelUploadError(
      body.error ?? `Upload failed (${res.status})`,
      res.status,
      body.code,
    )
  }

  return (await res.json()) as ArModelUploadResponse
}

export async function uploadGateArModels(
  files: { glbBlob: Blob; usdzBlob: Blob },
  fetchImpl: typeof fetch = fetch,
): Promise<GateArHostedModels> {
  const [glb, usdz] = await Promise.all([
    uploadArModel(files.glbBlob, 'glb', fetchImpl),
    uploadArModel(files.usdzBlob, 'usdz', fetchImpl),
  ])

  return {
    glb,
    usdz,
    expiresAt: Math.min(glb.expiresAt, usdz.expiresAt),
    phoneReachable: glb.phoneReachable && usdz.phoneReachable,
  }
}
