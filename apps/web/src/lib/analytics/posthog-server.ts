/**
 * Server analytics stubs — PostHog is intentionally not used in production.
 */

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  void distinctId
  void event
  void properties
}
