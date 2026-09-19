import { describe, expect, it } from 'vitest'

import {
  emailMyDesignUnexpectedFailureState,
  emailSendFailureState,
  quoteLeadMessage,
  saveConfigurationUserMessage,
  shouldFailQuoteWhenQuoteRequestInsertFails,
  turnstileFailureMessage,
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

  it('keeps the share path on the lead when the configuration row cannot be reloaded', () => {
    expect(
      quoteLeadMessage({
        message: 'Need access notes',
        shareToken: 'AbCdEfGhIj',
        configurationSummary: '',
      }),
    ).toContain('/quote/AbCdEfGhIj')
  })

  it('does not invent a configuration reference from an invalid token', () => {
    expect(
      quoteLeadMessage({
        message: 'Hello',
        shareToken: 'bad token',
        configurationSummary: '',
      }),
    ).toBe('Hello')
  })

  it('distinguishes Turnstile outages from a missing check', () => {
    expect(turnstileFailureMessage('unavailable')).toMatch(/could not be verified/i)
    expect(turnstileFailureMessage('missing_token')).toMatch(/complete the security check/i)
  })

  it('keeps the share link when email-my-design throws after save', () => {
    expect(emailMyDesignUnexpectedFailureState('https://steelyes.co.uk/quote/abc')).toMatchObject({
      status: 'error',
      shareUrl: 'https://steelyes.co.uk/quote/abc',
    })
  })
})
