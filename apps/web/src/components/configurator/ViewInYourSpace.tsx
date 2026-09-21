'use client'

import { useState, useEffect } from 'react'
import { Smartphone, Download, Copy, Loader2, AlertCircle } from 'lucide-react'
import type { GateConfig } from '@steelyes/gate-engine'

import { exportGateArModel } from '@/lib/configurator/ar/export-gate-ar-model'
import {
  buildQuickLookHref,
  buildSceneViewerIntentHref,
  formatArExpiryLabel,
} from '@/lib/configurator/ar/ar-handoff'
import { captureConfiguratorEvent } from '@/lib/analytics/posthog'

type ViewInYourSpaceProps = {
  config: GateConfig
  disabled?: boolean
  placement?: 'preview' | 'share'
  className?: string
}

type ViewState = 'idle' | 'exporting' | 'uploading' | 'ready' | 'error'

type ArModelUrls = {
  glbUrl: string
  usdzUrl: string
  expiresAt: number
}

function detectPlatform(): 'ios' | 'android' | 'desktop' {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent.toLowerCase()
  if (/(iphone|ipad|ipod)/.test(ua)) return 'ios'
  if (/android/.test(ua)) return 'android'
  return 'desktop'
}

function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text)
  }
  // Fallback for older browsers
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  return Promise.resolve()
}

export function ViewInYourSpace({
  config,
  disabled = false,
  placement = 'preview',
  className = '',
}: ViewInYourSpaceProps) {
  const [viewState, setViewState] = useState<ViewState>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [modelUrls, setModelUrls] = useState<ArModelUrls | null>(null)
  const [platform] = useState(detectPlatform)
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState<string>('')

  // Countdown timer for model expiry
  useEffect(() => {
    if (!modelUrls) return

    const updateCountdown = () => {
      const label = formatArExpiryLabel(modelUrls.expiresAt)
      setCountdown(label)
      if (label === 'Link expired') {
        setViewState('error')
        setErrorMessage('Your AR model has expired. Please generate a new one.')
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [modelUrls])

  const handleViewInAr = async () => {
    if (disabled || viewState === 'exporting' || viewState === 'uploading') return

    // Freeze config snapshot
    const snapshot = structuredClone(config)

    setViewState('exporting')
    setErrorMessage('')
    captureConfiguratorEvent('ar_button_tapped', { placement })

    try {
      // Export to GLB and USDZ
      const exportResult = await exportGateArModel(snapshot)

      setViewState('uploading')

      // Upload GLB
      const glbFormData = new FormData()
      glbFormData.append('model', exportResult.glbBlob, 'gate.glb')

      const glbResponse = await fetch('/api/ar/models', {
        method: 'POST',
        headers: {
          'x-ar-format': 'glb',
        },
        body: await exportResult.glbBlob.arrayBuffer(),
      })

      if (!glbResponse.ok) {
        throw new Error(`GLB upload failed: ${glbResponse.statusText}`)
      }

      const glbData = await glbResponse.json()

      // Upload USDZ
      const usdzResponse = await fetch('/api/ar/models', {
        method: 'POST',
        headers: {
          'x-ar-format': 'usdz',
        },
        body: await exportResult.usdzBlob.arrayBuffer(),
      })

      if (!usdzResponse.ok) {
        throw new Error(`USDZ upload failed: ${usdzResponse.statusText}`)
      }

      const usdzData = await usdzResponse.json()

      // Clean up object URLs
      exportResult.revoke()

      setModelUrls({
        glbUrl: glbData.url,
        usdzUrl: usdzData.url,
        expiresAt: usdzData.expiresAt,
      })
      setViewState('ready')
      captureConfiguratorEvent('ar_export_succeeded', { placement, platform })
      captureConfiguratorEvent('ar_handoff_shown', { placement, platform })
    } catch (error) {
      console.error('AR export failed:', error)
      setViewState('error')
      setErrorMessage(
        error instanceof Error ? error.message : "We couldn't prepare the 3D view. Please try again.",
      )
      captureConfiguratorEvent('ar_export_failed', {
        placement,
        reason: error instanceof Error ? error.message : 'unknown',
      })
    }
  }

  const handleCopyLink = async () => {
    if (!modelUrls) return
    const linkToCopy = platform === 'ios' ? modelUrls.usdzUrl : modelUrls.glbUrl
    try {
      await copyToClipboard(linkToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      captureConfiguratorEvent('ar_link_copied', { placement, platform })
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleRetry = () => {
    setViewState('idle')
    setErrorMessage('')
    setModelUrls(null)
  }

  if (viewState === 'idle') {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={handleViewInAr}
          disabled={disabled}
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-steel/12 bg-white px-5 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={false}
        >
          <Smartphone className="h-4 w-4" aria-hidden />
          View in your space
        </button>
      </div>
    )
  }

  if (viewState === 'exporting' || viewState === 'uploading') {
    return (
      <div className={className}>
        <div className="rounded-xl border border-steel/10 bg-steel/5 px-4 py-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-steel" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-heading text-sm font-bold uppercase tracking-tight text-steel">
                {viewState === 'exporting' ? 'Preparing 3D model…' : 'Uploading…'}
              </p>
              <p className="mt-0.5 text-xs text-muted">This may take a few moments</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (viewState === 'error') {
    return (
      <div className={className}>
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-heading text-sm font-bold uppercase tracking-tight text-red-900">
                Unable to prepare AR view
              </p>
              <p className="mt-1 text-xs text-red-800">
                {errorMessage || "We couldn't prepare the 3D view. Please try again."}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 inline-flex min-h-[36px] items-center justify-center rounded-lg border border-red-300 bg-white px-4 font-heading text-xs font-bold uppercase tracking-tight text-red-900 transition hover:border-red-400 hover:bg-red-50"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (viewState === 'ready' && modelUrls) {
    const quickLookHref = buildQuickLookHref(modelUrls.usdzUrl)
    const sceneViewerHref = buildSceneViewerIntentHref(modelUrls.glbUrl)

    return (
      <div className={className}>
        <div className="rounded-xl border border-steel/10 bg-white px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">AR model ready</p>
            {countdown && countdown !== 'Link expired' && (
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted">{countdown}</p>
            )}
          </div>

          <div className="mt-3 space-y-2">
            {platform === 'ios' && (
              <a
                href={quickLookHref}
                rel="ar"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-primary-dark"
              >
                <Smartphone className="h-4 w-4" aria-hidden />
                Open in AR (iPhone)
              </a>
            )}

            {platform === 'android' && (
              <a
                href={sceneViewerHref}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-bold uppercase tracking-tight text-white transition hover:bg-primary-dark"
              >
                <Smartphone className="h-4 w-4" aria-hidden />
                Open in AR (Android)
              </a>
            )}

            {platform === 'desktop' && (
              <>
                <p className="text-xs text-muted">
                  AR works best in Safari on iPhone or Chrome on Android. You can download the 3D models or copy the
                  link to open on your phone.
                </p>
                <a
                  href={modelUrls.glbUrl}
                  download="steelyes-gate.glb"
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-steel/12 bg-white px-5 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Download 3D model (GLB)
                </a>
                <a
                  href={modelUrls.usdzUrl}
                  download="steelyes-gate.usdz"
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-steel/12 bg-white px-5 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Download 3D model (USDZ)
                </a>
              </>
            )}

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-steel/12 bg-white px-5 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary"
            >
              <Copy className="h-4 w-4" aria-hidden />
              {copied ? 'Link copied!' : 'Copy link'}
            </button>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-steel/12 bg-white px-5 font-heading text-sm font-bold uppercase tracking-tight text-steel transition hover:border-primary/30 hover:text-primary"
            >
              Generate new model
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
