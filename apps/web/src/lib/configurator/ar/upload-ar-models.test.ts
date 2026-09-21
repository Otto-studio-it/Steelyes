import { describe, expect, it, vi } from 'vitest'

import { ArModelUploadError, uploadArModel, uploadGateArModels } from './upload-ar-models'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('uploadArModel', () => {
  it('POSTs raw bytes with x-ar-format', async () => {
    const blob = new Blob(['glb'], { type: 'model/gltf-binary' })
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({
        id: '11111111-1111-1111-1111-111111111111',
        format: 'glb',
        url: 'https://steelyes.co.uk/api/ar/models/11111111-1111-1111-1111-111111111111.glb',
        expiresAt: 9_000,
        expiresInSeconds: 3600,
        phoneReachable: true,
      }),
    )

    const result = await uploadArModel(blob, 'glb', fetchImpl)

    expect(fetchImpl).toHaveBeenCalledWith('/api/ar/models', {
      method: 'POST',
      headers: { 'x-ar-format': 'glb' },
      body: blob,
    })
    expect(result.format).toBe('glb')
  })

  it('throws ArModelUploadError on API failure', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ error: 'Payload is not a valid GLB', code: 'invalid' }, 400),
    )

    await expect(uploadArModel(new Blob(['x']), 'glb', fetchImpl)).rejects.toMatchObject({
      name: 'ArModelUploadError',
      status: 400,
      message: 'Payload is not a valid GLB',
    } satisfies Partial<ArModelUploadError>)
  })
})

describe('uploadGateArModels', () => {
  it('uploads both formats and uses the earlier expiry', async () => {
    const fetchImpl = vi.fn(async (_url: string, init?: RequestInit) => {
      const format = (init?.headers as Record<string, string>)['x-ar-format']
      return jsonResponse({
        id: format === 'glb' ? 'g' : 'u',
        format,
        url: `https://steelyes.co.uk/api/ar/models/${format}.${format}`,
        expiresAt: format === 'glb' ? 100 : 80,
        expiresInSeconds: 3600,
        phoneReachable: true,
      })
    })

    const hosted = await uploadGateArModels(
      { glbBlob: new Blob(['g']), usdzBlob: new Blob(['u']) },
      fetchImpl as unknown as typeof fetch,
    )

    expect(fetchImpl).toHaveBeenCalledTimes(2)
    expect(hosted.expiresAt).toBe(80)
    expect(hosted.phoneReachable).toBe(true)
    expect(hosted.glb.format).toBe('glb')
    expect(hosted.usdz.format).toBe('usdz')
  })

  it('does not treat a single success as a complete handoff', async () => {
    const fetchImpl = vi.fn(async (_url: string, init?: RequestInit) => {
      const format = (init?.headers as Record<string, string>)['x-ar-format']
      if (format === 'usdz') {
        return jsonResponse({ error: 'Payload is not a valid USDZ' }, 400)
      }
      return jsonResponse({
        id: 'g',
        format: 'glb',
        url: 'https://steelyes.co.uk/api/ar/models/g.glb',
        expiresAt: 100,
        expiresInSeconds: 3600,
        phoneReachable: true,
      })
    })

    await expect(
      uploadGateArModels(
        { glbBlob: new Blob(['g']), usdzBlob: new Blob(['u']) },
        fetchImpl as unknown as typeof fetch,
      ),
    ).rejects.toBeInstanceOf(ArModelUploadError)
  })
})
