export type AdminActionResult = { success: true } | { error: string }

export function isAdminActionError(
  result: AdminActionResult
): result is { error: string } {
  return 'error' in result && typeof result.error === 'string'
}
