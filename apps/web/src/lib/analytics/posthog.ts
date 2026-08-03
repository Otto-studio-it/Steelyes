/**
 * Analytics stubs — PostHog is intentionally not used in production.
 * Call sites keep stable event names for a future provider if needed.
 */

export function initPostHog(): void {
  // no-op
}

export function captureConfiguratorEvent(
  event: string,
  properties?: Record<string, unknown>,
): void {
  void event
  void properties
}

export function identifyConfiguratorUser(distinctId: string): void {
  void distinctId
}
