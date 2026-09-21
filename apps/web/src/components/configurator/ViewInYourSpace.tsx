'use client'

import { Box, LoaderCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { captureConfiguratorEvent } from '@/lib/analytics/posthog'
import { detectArClientPlatform, type ArClientPlatform } from '@/lib/configurator/ar/ar-client-platform'
import {
  buildQuickLookHref,
  buildSceneViewerHttpsHref,
  buildSceneViewerIntentHref,
  formatArExpiryLabel,
} from '@/lib/configurator/ar/ar-handoff'
import { AR_UI_COPY } from '@/lib/configurator/ar/ar-ui-copy'
import { ArModelUploadError, uploadGateArModels } from '@/lib/configurator/ar/upload-ar-models'
import type { GateConfig } from '@steelyes/gate-engine'

export type ViewInYourSpaceProps = {
  config: GateConfig
  disabled?: boolean
  className?: string
  placement?: 'preview' | 'share'
}

type ReadyHandoff = {
  glbUrl: string
  usdzUrl: string
  expiresAt: number
  phoneReachable: boolean
}

type UiState =
  | { status: 'idle' }
  | { status: 'exporting' }
  | { status: 'uploading' }
  | { status: 'ready'; handoff: ReadyHandoff }
  | { status: 'error'; message: string }

const ACTION_CLASS =
  'inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-steel/12 bg-white px-4 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60'

const PRIMARY_CLASS =
  'inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60'

function messageFromError(error: unknown): string {
  if (error instanceof ArModelUploadError && error.code === 'ar_model_expired') {
    return AR_UI_COPY.expired
  }
  if (error instanceof ArModelUploadError) {
    return error.message || AR_UI_COPY.errorGeneric
  }
  if (error instanceof Error && error.message) {
    return AR_UI_COPY.errorGeneric
  }
  return AR_UI_COPY.errorGeneric
}

export function ViewInYourSpace({
  config,
  disabled = false,
  className = '',
  placement = 'preview',
}: ViewInYourSpaceProps) {
  const [state, setState] = useState<UiState>({ status: 'idle' })
  const [platform, setPlatform] = useState<ArClientPlatform>('desktop')
  const [copied, setCopied] = useState<'iphone' | 'android' | null>(null)
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    setPlatform(detectArClientPlatform(navigator.userAgent, navigator.maxTouchPoints || 0))
  }, [])

  const busy = state.status === 'exporting' || state.status === 'uploading'
  const expired =
    state.status === 'ready' && state.handoff.expiresAt <= nowMs

  useEffect(() => {
    if (state.status !== 'ready') return
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [state.status])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(null), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const hrefs = useMemo(() => {
    if (state.status !== 'ready') return null
    return {
      quickLook: buildQuickLookHref(state.handoff.usdzUrl),
      sceneIntent: buildSceneViewerIntentHref(state.handoff.glbUrl),
      sceneHttps: buildSceneViewerHttpsHref(state.handoff.glbUrl),
    }
  }, [state])

  async function prepareModel() {
    if (busy) return

    const snapshot = structuredClone(config)
    setCopied(null)
    setState({ status: 'exporting' })
    captureConfiguratorEvent('ar_button_tapped', { placement, gateType: snapshot.gateType })

    try {
      const { exportGateArModel } = await import('@/lib/configurator/ar/export-gate-ar-model')
      const exported = await exportGateArModel(snapshot)
      setState({ status: 'uploading' })
      try {
        const hosted = await uploadGateArModels({
          glbBlob: exported.glbBlob,
          usdzBlob: exported.usdzBlob,
        })
        const handoff: ReadyHandoff = {
          glbUrl: hosted.glb.url,
          usdzUrl: hosted.usdz.url,
          expiresAt: hosted.expiresAt,
          phoneReachable: hosted.phoneReachable,
        }
        setNowMs(Date.now())
        setState({ status: 'ready', handoff })
        captureConfiguratorEvent('ar_export_succeeded', {
          placement,
          fidelity: exported.fidelity,
          gateType: snapshot.gateType,
        })
        captureConfiguratorEvent('ar_handoff_shown', { placement, platform })
      } finally {
        exported.revoke()
      }
    } catch (error) {
      const reason = error instanceof ArModelUploadError ? error.code ?? error.message : 'export_failed'
      captureConfiguratorEvent('ar_export_failed', { placement, reason })
      setState({ status: 'error', message: messageFromError(error) })
    }
  }

  async function copyLink(kind: 'iphone' | 'android', url: string) {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(kind)
    } catch {
      setCopied(null)
    }
  }

  return (
    <div className={`mt-3 border border-steel/10 bg-white px-4 py-4 ${className}`} data-testid="view-in-your-space">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">On your phone</p>

      {state.status === 'idle' || state.status === 'exporting' || state.status === 'uploading' ? (
        <>
          <button
            type="button"
            onClick={() => void prepareModel()}
            disabled={disabled || busy}
            aria-busy={busy}
            className={`${ACTION_CLASS} mt-3`}
          >
            {busy ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                {state.status === 'uploading' ? AR_UI_COPY.uploading : AR_UI_COPY.preparing}
              </>
            ) : (
              <>
                <Box className="mr-2 h-4 w-4" aria-hidden />
                {AR_UI_COPY.button}
              </>
            )}
          </button>
          {busy ? (
            <p role="status" className="mt-2 text-sm leading-6 text-muted-deep">
              {state.status === 'uploading' ? AR_UI_COPY.uploading : AR_UI_COPY.preparing}
            </p>
          ) : null}
        </>
      ) : null}

      {state.status === 'error' ? (
        <div className="mt-3">
          <p role="alert" className="text-sm leading-6 text-primary">
            {state.message}
          </p>
          <button type="button" onClick={() => void prepareModel()} className={`${ACTION_CLASS} mt-3`}>
            {AR_UI_COPY.retry}
          </button>
        </div>
      ) : null}

      {state.status === 'ready' && hrefs ? (
        <div className="mt-3 space-y-2">
          {expired ? (
            <p role="alert" className="text-sm leading-6 text-primary">
              {AR_UI_COPY.expired}
            </p>
          ) : (
            <p className="text-sm leading-6 text-muted-deep" role="status">
              {state.handoff.phoneReachable
                ? formatArExpiryLabel(state.handoff.expiresAt, nowMs)
                : AR_UI_COPY.privateOrigin}
            </p>
          )}

          {!expired && platform === 'ios' ? (
            <a rel="ar" href={hrefs.quickLook} className={PRIMARY_CLASS}>
              {AR_UI_COPY.openIos}
            </a>
          ) : null}

          {!expired && platform === 'android' ? (
            <a href={hrefs.sceneIntent} className={PRIMARY_CLASS}>
              {AR_UI_COPY.openAndroid}
            </a>
          ) : null}

          {!expired && platform === 'desktop' ? (
            <p className="text-sm leading-6 text-muted-deep">{AR_UI_COPY.unsupported}</p>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              className={ACTION_CLASS}
              onClick={() => void copyLink('iphone', hrefs.quickLook)}
              disabled={expired}
            >
              {copied === 'iphone' ? AR_UI_COPY.copied : AR_UI_COPY.copyIphone}
            </button>
            <button
              type="button"
              className={ACTION_CLASS}
              onClick={() => void copyLink('android', hrefs.sceneHttps)}
              disabled={expired}
            >
              {copied === 'android' ? AR_UI_COPY.copied : AR_UI_COPY.copyAndroid}
            </button>
            <a href={state.handoff.glbUrl} download="steelyes-gate.glb" className={ACTION_CLASS}>
              {AR_UI_COPY.downloadGlb}
            </a>
            <a href={state.handoff.usdzUrl} download="steelyes-gate.usdz" className={ACTION_CLASS}>
              {AR_UI_COPY.downloadUsdz}
            </a>
          </div>

          {expired ? (
            <button type="button" onClick={() => void prepareModel()} className={PRIMARY_CLASS}>
              {AR_UI_COPY.retry}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
