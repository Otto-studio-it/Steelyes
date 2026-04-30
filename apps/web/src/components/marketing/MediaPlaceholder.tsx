import { cn } from '@/lib/utils'

type MediaPlaceholderProps = {
  label: string
  className?: string
  aspectClassName?: string
}

export function MediaPlaceholder({ label, className, aspectClassName }: MediaPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Image placeholder: ${label}`}
      className={cn(
        'relative flex w-full items-center justify-center overflow-hidden bg-[#E8E6E3] text-[#1A1A1A]/40',
        aspectClassName,
        className,
      )}
    >
      <span className="px-3 text-center font-mono text-[10px] uppercase tracking-[0.2em]">{label}</span>
    </div>
  )
}
