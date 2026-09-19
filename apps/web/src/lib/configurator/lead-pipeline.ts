import { buildQuoteSharePath, isValidShareToken } from '@/lib/configurator/share-token'

export type EmailMyDesignClientState =
  | { status: 'idle' }
  | { status: 'success'; shareUrl?: string }
  | { status: 'error'; message: string; shareUrl?: string }

export type TurnstileFailureReason = 'missing_token' | 'rejected' | 'unavailable'

export function saveConfigurationUserMessage(error: string | null | undefined): string {
  const trimmed = error?.trim()
  if (trimmed) return trimmed
  return 'Could not save your configuration. Please try again.'
}

export function turnstileFailureMessage(reason: TurnstileFailureReason): string {
  if (reason === 'unavailable') {
    return 'The security check could not be verified. Please try again in a moment.'
  }
  return 'Please complete the security check and try again.'
}

export function emailSendFailureState(shareUrl: string): EmailMyDesignClientState {
  return {
    status: 'error',
    message:
      'We saved your design, but the confirmation email did not send. Copy the link below, or try again in a moment.',
    shareUrl,
  }
}

export function emailMyDesignUnexpectedFailureState(shareUrl?: string): EmailMyDesignClientState {
  return {
    status: 'error',
    message: shareUrl
      ? 'Something went wrong after saving your design. Copy the link below, or try again in a moment.'
      : 'Something went wrong. Please try again.',
    ...(shareUrl ? { shareUrl } : {}),
  }
}

/** A failed quote_requests insert must not block the lead + workshop email path. */
export function shouldFailQuoteWhenQuoteRequestInsertFails(): boolean {
  return false
}

/** Keep the share path on the lead even when the configuration row cannot be reloaded. */
export function quoteLeadMessage(input: {
  message: string
  shareToken: string
  configurationSummary: string
}): string {
  const parts: string[] = []
  const body = input.message.trim()
  if (body) parts.push(body)

  if (isValidShareToken(input.shareToken)) {
    parts.push(`Configuration reference: ${buildQuoteSharePath(input.shareToken)}`)
  }

  const summary = input.configurationSummary.trim()
  if (summary) {
    parts.push(`Configuration summary: ${summary}`)
  }

  return parts.join('\n\n')
}
