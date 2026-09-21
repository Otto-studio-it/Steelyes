'use client'

import { resolveSilhouette, stringifyGateConfig, type GateConfig } from '@steelyes/gate-engine'
import { Box, LoaderCircle } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useMemo, useState } from 'react'

import { captureConfiguratorEvent } from '@/lib/analytics/posthog'
import { detectArClientPlatform, type ArClientPlatform } from '@/lib/configurator/ar/ar-client-platform'
import {
  buildArModelPath,
  buildQuickLookHref,
  buildSceneViewerHttpsHref,
  buildSceneViewerIntentHref,
  isLocalOrPrivateArUrl,
} from '@/lib/configurator/ar/ar-handoff'
import { AR_UI_COPY } from '@/lib/configurator/ar/ar-ui-copy'
import { buildQuoteSharePath } from '@/lib/configurator/share-token'
import { useConfiguratorStore } from '@/store/configuratorStore'

export const VIEW_IN_YOUR_SPACE_ID = 'view-in-your-space'

export type ViewInYourSpaceProps = {
  config: GateConfig
  /** Read-only share page: the design is already saved. The configurator saves on demand. */
  shareToken?: string
  disabled?: boolean
  className?: string
  placement?: 'preview' | 'share'
}

type Handoff = {
  glbUrl: string
  usdzUrl: string
  shareUrl: string
  phoneReachable: boolean
}

type UiState =
  | { status: 'idle' }
  | { status: 'preparing' }
  | { status: 'ready'; handoff: Handoff }
  | { status: 'error' }

const ACTION_CLASS =
  'inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-steel/12 bg-white px-4 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60'

const PRIMARY_CLASS =
  'inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60'

export function ViewInYourSpace({
  config,
  shareToken,
  disabled = false,
  className = '',
  placement = 'preview',
}: ViewInYourSpaceProps) {
  const ensureSavedConfiguration = useConfiguratorStore((state) => state.ensureSavedConfiguration)
  const [state, setState] = useState<UiState>({ status: 'idle' })
  const [platform, setPlatform] = useState<ArClientPlatform>('desktop')
  const [copied, setCopied] = useState<'iphone' | 'android' | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  const configKey = useMemo(() => stringifyGateConfig(config), [config])

  useEffect(() => {
    setPlatform(detectArClientPlatform(navigator.userAgent, navigator.maxTouchPoints || 0))
  }, [])

  // A link belongs to one exact design — any edit sends the customer back to the button.
  useEffect(() => {
    setState({ status: 'idle' })
    setQrDataUrl(null)
  }, [configKey, shareToken])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(null), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const handoff = state.status === 'ready' ? state.handoff : null

  useEffect(() => {
    if (!handoff || platform !== 'desktop') return
    let cancelled = false
    QRCode.toDataURL(handoff.shareUrl, { margin: 1, width: 320 })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url)
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null)
      })
    return () => {
      cancelled = true
    }
  }, [handoff, platform])

  const hrefs = useMemo(() => {
    if (!handoff) return null
    return {
      quickLook: buildQuickLookHref(handoff.usdzUrl),
      sceneIntent: buildSceneViewerIntentHref(handoff.glbUrl),
      sceneHttps: buildSceneViewerHttpsHref(handoff.glbUrl),
    }
  }, [handoff])

  const iosPreviewSrc = useMemo(() => {
    try {
      return resolveSilhouette(config).publicPath
    } catch {
      return `/2d-masters/${config.gateType}/silhouettes/base.svg`
    }
  }, [config])

  async function prepareModel() {
    if (state.status === 'preparing') return

    setCopied(null)
    setState({ status: 'preparing' })
    captureConfiguratorEvent('ar_button_tapped', { placement, gateType: config.gateType })

    try {
      const token = shareToken ?? (await ensureSavedConfiguration())?.shareToken
      if (!token) throw new Error('save_failed')

      const origin = window.location.origin
      const next: Handoff = {
        glbUrl: `${origin}${buildArModelPath(token, 'glb')}`,
        usdzUrl: `${origin}${buildArModelPath(token, 'usdz')}`,
        shareUrl: `${origin}${buildQuoteSharePath(token)}#${VIEW_IN_YOUR_SPACE_ID}`,
        phoneReachable: !isLocalOrPrivateArUrl(origin),
      }

      // Build (and cache) the model this device will open, so a failure shows here, not inside the viewer.
      const warm = await fetch(platform === 'ios' ? next.usdzUrl : next.glbUrl, { method: 'HEAD' })
      if (!warm.ok) throw new Error(`model_${warm.status}`)

      setState({ status: 'ready', handoff: next })
      captureConfiguratorEvent('ar_export_succeeded', { placement, gateType: config.gateType })
      captureConfiguratorEvent('ar_handoff_shown', { placement, platform })
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'export_failed'
      captureConfiguratorEvent('ar_export_failed', { placement, reason })
      setState({ status: 'error' })
    }
  }

  async function copyLink(kind: 'iphone' | 'android', url: string) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard_unavailable')
      await navigator.clipboard.writeText(url)
      setCopied(kind)
    } catch {
      try {
        const input = document.createElement('textarea')
        input.value = url
        input.setAttribute('readonly', '')
        input.style.position = 'fixed'
        input.style.left = '-9999px'
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        setCopied(kind)
      } catch {
        setCopied(null)
      }
    }
  }

  const busy = state.status === 'preparing'

  return (
    <div
      id={VIEW_IN_YOUR_SPACE_ID}
      className={`mt-3 scroll-mt-24 border border-steel/10 bg-white px-4 py-4 ${className}`}
      data-testid="view-in-your-space"
    >
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">On your phone</p>

      {state.status === 'idle' || busy ? (
        <>
          <button
            type="button"
            onClick={() => void prepareModel()}
            disabled={disabled || busy}
            aria-busy={busy}
            className={`${ACTION_CLASS} mt-3`}
          >
            {busy ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Box className="mr-2 h-4 w-4" aria-hidden />
            )}
            {busy ? AR_UI_COPY.preparing : AR_UI_COPY.button}
          </button>
          {busy ? (
            <p role="status" className="sr-only">
              {AR_UI_COPY.preparing}
            </p>
          ) : null}
        </>
      ) : null}

      {state.status === 'error' ? (
        <div className="mt-3">
          <p role="alert" className="text-sm leading-6 text-primary">
            {AR_UI_COPY.errorGeneric}
          </p>
          <button type="button" onClick={() => void prepareModel()} className={`${ACTION_CLASS} mt-3`}>
            {AR_UI_COPY.retry}
          </button>
        </div>
      ) : null}

      {handoff && hrefs ? (
        <div className="mt-3 space-y-3">
          {handoff.phoneReachable ? null : (
            <p className="text-sm leading-6 text-muted-deep">{AR_UI_COPY.privateOrigin}</p>
          )}

          {platform === 'ios' ? (
            <div>
              <div className="relative overflow-hidden rounded-xl border-2 border-primary bg-[#F3F2EF]">
                {/* Safari only hands a link to AR Quick Look when the rel="ar" anchor's ONLY child is an
                    <img>; the "button" bar is therefore a sibling overlay, not a child. */}
                <a rel="ar" href={hrefs.quickLook} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static public master SVG */}
                  <img src={iosPreviewSrc} alt={AR_UI_COPY.openIos} className="h-44 w-full object-contain p-3 pb-14" />
                </a>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 flex min-h-[48px] items-center justify-center gap-2 bg-primary font-heading text-sm font-bold uppercase tracking-tight text-white"
                >
                  <Box className="h-4 w-4" />
                  {AR_UI_COPY.openIos}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-deep">{AR_UI_COPY.openIosHint}</p>
            </div>
          ) : null}

          {platform === 'android' ? (
            <a href={hrefs.sceneIntent} className={PRIMARY_CLASS}>
              <Box className="h-4 w-4" aria-hidden />
              {AR_UI_COPY.openAndroid}
            </a>
          ) : null}

          {platform === 'desktop' ? (
            <>
              <div className="flex items-center gap-4">
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- generated data URL
                  <img
                    src={qrDataUrl}
                    alt="QR code that opens this design on your phone"
                    className="h-32 w-32 shrink-0 border border-steel/10"
                  />
                ) : (
                  <span className="h-32 w-32 shrink-0 border border-steel/10 bg-paper" aria-hidden />
                )}
                <p className="text-sm leading-6 text-muted-deep">{AR_UI_COPY.qrCaption}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <button type="button" className={ACTION_CLASS} onClick={() => void copyLink('iphone', hrefs.quickLook)}>
                  {copied === 'iphone' ? AR_UI_COPY.copied : AR_UI_COPY.copyIphone}
                </button>
                <button type="button" className={ACTION_CLASS} onClick={() => void copyLink('android', hrefs.sceneHttps)}>
                  {copied === 'android' ? AR_UI_COPY.copied : AR_UI_COPY.copyAndroid}
                </button>
                <a href={handoff.glbUrl} download="steelyes-gate.glb" className={ACTION_CLASS}>
                  {AR_UI_COPY.downloadGlb}
                </a>
                <a href={handoff.usdzUrl} download="steelyes-gate.usdz" className={ACTION_CLASS}>
                  {AR_UI_COPY.downloadUsdz}
                </a>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
