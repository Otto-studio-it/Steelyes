import { Check } from 'lucide-react'

/** Corner tick for the chosen card — selection must not rely on border colour alone. */
export function SelectedCheck({ className = 'right-2 top-2' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white ${className}`}
    >
      <Check className="h-4 w-4" strokeWidth={3} />
    </span>
  )
}
