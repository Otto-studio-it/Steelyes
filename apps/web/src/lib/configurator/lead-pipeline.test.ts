import { describe, expect, it } from 'vitest'

import {
  emailSendFailureState,
  saveConfigurationUserMessage,
  shouldFailQuoteWhenQuoteRequestInsertFails,
} from './lead-pipeline'

describe('lead-pipeline', () => {
  it('surfaces the engine save error instead of a generic try-again', () => {
    expect(saveConfigurationUserMessage('Width must be between 800mm and 6000mm.')).toBe(
      'Width must be between 800mm and 6000mm.',
    )
  })

  it('falls back when save did not report a reason', () => {
    expect(saveConfigurationUserMessage(null)).toMatch(/try again/i)
  })

  it('keeps a share link when the save-design email fails', () => {
    const state = emailSendFailureState('https://steelyes.co.uk/quote/abc123')
    expect(state).toMatchObject({
      status: 'error',
      shareUrl: 'https://steelyes.co.uk/quote/abc123',
    })
  })

  it('does not fail the customer quote when quote_requests insert fails', () => {
    expect(shouldFailQuoteWhenQuoteRequestInsertFails()).toBe(false)
  })
})
