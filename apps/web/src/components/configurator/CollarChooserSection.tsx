'use client'

import { useEffect } from 'react'

import { ConfiguratorSwitch } from '@/components/configurator/ConfiguratorSwitch'
import { updateOption } from '@/lib/configurator/option-actions'
import { useConfiguratorConfig, useConfiguratorStore } from '@/store/configuratorStore'

/**
 * On uses the Every picket master (every_1). Every 2nd is not offered — that drawing breaks.
 */
export function CollarChooserSection() {
  const config = useConfiguratorConfig()
  const setConfig = useConfiguratorStore((state) => state.setConfig)

  const selected = config.options.find((option) => option.key === 'picket_collars')
  const enabled = Boolean(selected?.enabled)

  useEffect(() => {
    if (!enabled || selected?.variant === 'every_1' || config.style !== 'traditional_victorian') return
    setConfig(updateOption(config, 'picket_collars', true))
  }, [config, enabled, selected?.variant, setConfig])

  if (config.style !== 'traditional_victorian') {
    return null
  }

  return (
    <section className="border border-steel/10 bg-white p-4" data-testid="collar-chooser">
      <ConfiguratorSwitch
        id="picket-collars"
        checked={enabled}
        onCheckedChange={(on) => setConfig(updateOption(config, 'picket_collars', on))}
        label="Picket collars"
        description="Decorative boss at mid-height on long pickets only — never on dog bars. This swaps the official 2D drawing immediately."
      />
    </section>
  )
}
