type ConfiguratorLoadingScreenProps = {
  overlay?: boolean
  label?: string
}

export function ConfiguratorLoadingScreen({
  overlay = false,
  label = 'Loading the configurator',
}: ConfiguratorLoadingScreenProps) {
  return (
    <div
      data-testid="configurator-loading"
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={
        overlay
          ? 'fixed inset-0 z-[70] flex items-center justify-center bg-canvas/95 supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]'
          : 'relative flex min-h-[70dvh] items-center justify-center bg-canvas px-4 py-16'
      }
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 overflow-hidden bg-steel/10" aria-hidden>
        <div className="cfg-loading-bar h-full w-1/3 bg-primary" />
      </div>
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="cfg-loading-ring" aria-hidden />
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">{label}</p>
        <p className="font-heading text-xl font-black uppercase tracking-tight text-steel">Preparing your gate</p>
      </div>
    </div>
  )
}
