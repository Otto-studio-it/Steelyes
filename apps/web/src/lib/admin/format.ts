export function humanizeSlug(value: string): string {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatFinishLabel(finish: string): string {
  return finish === 'metal' ? 'Metallo' : 'Composito'
}
