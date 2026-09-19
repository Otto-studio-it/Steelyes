/** Resend attachment shape for the workshop quote PDF. */
export type WorkshopPdfAttachment = {
  filename: string
  content: Buffer
  contentType: 'application/pdf'
}

export function workshopPdfAttachment(input: {
  filename: string
  bytes: Uint8Array
}): WorkshopPdfAttachment | null {
  if (!input.filename.toLowerCase().endsWith('.pdf')) return null
  if (input.bytes.byteLength < 100) return null
  return {
    filename: input.filename,
    content: Buffer.from(input.bytes),
    contentType: 'application/pdf',
  }
}
