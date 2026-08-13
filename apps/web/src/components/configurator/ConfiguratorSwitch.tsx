'use client'

type ConfiguratorSwitchProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  description?: string
  id?: string
  disabled?: boolean
}

export function ConfiguratorSwitch({
  checked,
  onCheckedChange,
  label,
  description,
  id,
  disabled = false,
}: ConfiguratorSwitchProps) {
  const switchId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex items-start justify-between gap-4 ${disabled ? 'opacity-70' : ''}`}>
      <div className="min-w-0">
        <label
          htmlFor={switchId}
          className="block font-heading text-sm font-bold uppercase tracking-tight text-steel"
        >
          {label}
        </label>
        {description ? (
          <p id={`${switchId}-desc`} className="mt-1 text-sm leading-6 text-muted-deep">
            {description}
          </p>
        ) : null}
      </div>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        aria-describedby={description ? `${switchId}-desc` : undefined}
        onClick={() => {
          if (disabled) return
          onCheckedChange(!checked)
        }}
        className={`relative inline-flex h-12 w-[72px] shrink-0 items-center border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
          checked ? 'border-primary bg-primary' : 'border-steel/20 bg-white'
        }`}
      >
        <span
          className={`inline-block h-9 w-9 transform border border-steel/10 bg-white transition-transform ${
            checked ? 'translate-x-[34px]' : 'translate-x-1'
          }`}
          aria-hidden
        />
        <span className="sr-only">{checked ? 'On' : 'Off'}</span>
      </button>
    </div>
  )
}
