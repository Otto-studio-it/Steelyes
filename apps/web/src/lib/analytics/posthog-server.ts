/**
 * Server analytics stubs — PostHog is intentionally not used in production.
 */

export async function captureServerEvent(
  _distinctId: string,
  _event: string,
  _properties?: Record<string, unknown>,
): Promise<void> {
  // no-op
}
