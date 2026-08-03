/**
 * Analytics stubs — PostHog is intentionally not used in production.
 * Call sites keep stable event names for a future provider if needed.
 */

export function initPostHog(): void {
  // no-op
}

export function captureConfiguratorEvent(
  _event: string,
  _properties?: Record<string, unknown>,
): void {
  // no-op
}

export function identifyConfiguratorUser(_distinctId: string): void {
  // no-op
}
