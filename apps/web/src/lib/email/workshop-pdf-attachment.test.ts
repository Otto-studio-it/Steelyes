import { describe, expect, it } from 'vitest'

import { workshopPdfAttachment } from './workshop-pdf-attachment'

describe('workshopPdfAttachment', () => {
  it('wraps PDF bytes for Resend', () => {
    const bytes = new Uint8Array(120).fill(37)
    const attachment = workshopPdfAttachment({
      filename: 'steelyes-gate-quote-AbCdEf.pdf',
      bytes,
    })
    expect(attachment).toMatchObject({
      filename: 'steelyes-gate-quote-AbCdEf.pdf',
      contentType: 'application/pdf',
    })
    expect(Buffer.isBuffer(attachment?.content)).toBe(true)
    expect(attachment?.content.byteLength).toBe(120)
  })

  it('rejects empty or non-pdf filenames', () => {
    expect(workshopPdfAttachment({ filename: 'notes.txt', bytes: new Uint8Array(200) })).toBeNull()
    expect(workshopPdfAttachment({ filename: 'x.pdf', bytes: new Uint8Array(10) })).toBeNull()
  })
})
