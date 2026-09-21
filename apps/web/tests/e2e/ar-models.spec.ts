import { expect, test } from '@playwright/test'

function fakeGlb(): Buffer {
  const bytes = Buffer.alloc(64)
  bytes.write('glTF', 0, 'ascii')
  return bytes
}

function fakeUsdz(): Buffer {
  const bytes = Buffer.alloc(64)
  bytes[0] = 0x50
  bytes[1] = 0x4b
  bytes[2] = 0x03
  bytes[3] = 0x04
  return bytes
}

test.describe('AR model API', () => {
  test('rejects a payload without x-ar-format', async ({ request }) => {
    const response = await request.post('/api/ar/models', { data: fakeGlb() })
    expect(response.status()).toBe(400)
  })

  test('hosts a GLB then serves and expires unknown ids', async ({ request }) => {
    const created = await request.post('/api/ar/models', {
      headers: { 'x-ar-format': 'glb' },
      data: fakeGlb(),
    })
    expect(created.ok()).toBeTruthy()
    const body = (await created.json()) as { url: string; expiresInSeconds: number }
    expect(body.expiresInSeconds).toBe(3600)
    expect(body.url).toMatch(/\/api\/ar\/models\/[0-9a-f-]{36}\.glb$/i)

    const path = new URL(body.url, 'http://localhost:3000').pathname
    const served = await request.get(path)
    expect(served.ok()).toBeTruthy()
    expect(served.headers()['content-type']).toContain('model/gltf-binary')
    expect(served.headers()['access-control-allow-origin']).toBe('*')
    const bytes = await served.body()
    expect(bytes.subarray(0, 4).toString()).toBe('glTF')

    const missing = await request.get('/api/ar/models/00000000-0000-0000-0000-000000000000.glb')
    expect(missing.status()).toBe(410)
    const expired = (await missing.json()) as { code?: string }
    expect(expired.code).toBe('ar_model_expired')
  })

  test('hosts a USDZ with zip magic bytes', async ({ request }) => {
    const created = await request.post('/api/ar/models', {
      headers: { 'x-ar-format': 'usdz' },
      data: fakeUsdz(),
    })
    expect(created.ok()).toBeTruthy()
    const body = (await created.json()) as { url: string }
    const path = new URL(body.url, 'http://localhost:3000').pathname
    const served = await request.get(path)
    expect(served.ok()).toBeTruthy()
    expect(served.headers()['content-type']).toContain('model/vnd.usdz+zip')
  })
})
