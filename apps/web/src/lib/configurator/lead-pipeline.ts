export type EmailMyDesignClientState =
  | { status: 'idle' }
  | { status: 'success'; shareUrl?: string }
  | { status: 'error'; message: string; shareUrl?: string }

export function saveConfigurationUserMessage(error: string | null | undefined): string {
  const trimmed = error?.trim()
  if (trimmed) return trimmed
  return 'Could not save your configuration. Please try again.'
}

export function emailSendFailureState(shareUrl: string): EmailMyDesignClientState {
  return {
    status: 'error',
    message:
      'We saved your design, but the confirmation email did not send. Copy the link below, or try again in a moment.',
    shareUrl,
  }
}

/** A failed quote_requests insert must not block the lead + workshop email path. */
export function shouldFailQuoteWhenQuoteRequestInsertFails(): boolean {
  return false
}
