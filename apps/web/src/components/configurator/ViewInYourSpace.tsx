'use client'

import * as Dialog from '@radix-ui/react-dialog'
import type { GateConfig } from '@steelyes/gate-engine'
import { AlertTriangle, Box, Check, Copy, Download, Loader2, Smartphone, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { captureConfiguratorEvent } from '@/lib/analytics/posthog'
import {
  AR_MODEL_TTL_SECONDS,
  buildQuickLookHref,
  buildSceneViewerHttpsHref,
  buildSceneViewerIntentHref,
  formatArExpiryLabel,
} from '@/lib/configurator/ar/ar-handoff'
import {
  exportGateArModel,
  type GateArExportResult,
} from '@/lib/configurator/ar/export-gate-ar-model'
import { CONFIGURATOR_3D_PREVIEW_ENABLED } from '@/lib/configurator/features'
import { gateTypeLabel } from '@/lib/configurator/labels'

type ViewInYourSpaceProps = {
  config: GateConfig
  className?: string
}

type HostedModel = {
  url: string
  expiresAt: number
  phoneReachable: boolean
}

type HostedUrls = {
  glb: HostedModel | null
  usdz: HostedModel | null
}

type ExportState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; result: GateArExportResult; hosted: HostedUrls }
  | { status: 'error'; message: string }

/** Minimal poster so iOS shows the Quick Look AR badge (`rel="ar"` requires an <img>). */
const QUICK_LOOK_POSTER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80">
      <rect width="120" height="80" fill="#1f2933"/>
      <rect x="18" y="16" width="84" height="52" fill="none" stroke="#e8ece6" stroke-width="3"/>
      <line x1="60" y1="16" x2="60" y2="68" stroke="#e8ece6" stroke-width="2"/>
    </svg>`,
  )

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function isLikelyIos(): boolean {
  if (typeof navigator === 'undefined') return false
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

function isLikelyAndroid(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android/i.test(navigator.userAgent)
}

async function hostModel(blob: Blob, format: 'glb' | 'usdz'): Promise<HostedModel> {
  const response = await fetch('/api/ar/models', {
    method: 'POST',
    headers: { 'x-ar-format': format },
    body: blob,
  })
  if (!response.ok) {
    let detail = `HTTP ${response.status}`
    try {
      const payload = (await response.json()) as { error?: string }
      if (payload.error) detail = payload.error
    } catch {
      // ignore
    }
    throw new Error(`Could not host ${format.toUpperCase()}: ${detail}`)
  }
  const payload = (await response.json()) as {
    url?: string
    expiresAt?: number
    phoneReachable?: boolean
  }
  if (!payload.url) throw new Error(`Missing hosted ${format.toUpperCase()} URL`)
  return {
    url: payload.url,
    expiresAt: payload.expiresAt ?? Date.now() + AR_MODEL_TTL_SECONDS * 1000,
    phoneReachable: payload.phoneReachable !== false,
  }
}

type CopiedLink = 'iphone' | 'android' | null

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}

function earliestExpiry(hosted: HostedUrls): number | null {
  const times = [hosted.glb?.expiresAt, hosted.usdz?.expiresAt].filter(
    (value): value is number => typeof value === 'number',
  )
  if (times.length === 0) return null
  return Math.min(...times)
}

export function ViewInYourSpaceButton({ config, className = '' }: ViewInYourSpaceProps) {
  const [open, setOpen] = useState(false)
  const [exportState, setExportState] = useState<ExportState>({ status: 'idle' })
  const [copied, setCopied] = useState<CopiedLink>(null)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const resultRef = useRef<GateArExportResult | null>(null)

  useEffect(() => {
    return () => {
      resultRef.current?.revoke()
      resultRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!open) return

    let cancelled = false
    setExportState({ status: 'loading' })
    resultRef.current?.revoke()
    resultRef.current = null

    void exportGateArModel(config)
      .then(async (result) => {
        if (cancelled) {
          result.revoke()
          return
        }
        resultRef.current = result

        const [glbSettled, usdzSettled] = await Promise.allSettled([
          hostModel(result.glbBlob, 'glb'),
          hostModel(result.usdzBlob, 'usdz'),
        ])

        if (cancelled) {
          result.revoke()
          return
        }

        const hosted: HostedUrls = {
          glb: glbSettled.status === 'fulfilled' ? glbSettled.value : null,
          usdz: usdzSettled.status === 'fulfilled' ? usdzSettled.value : null,
        }

        setExportState({ status: 'ready', result, hosted })
        captureConfiguratorEvent('ar model exported', {
          gate_type: config.gateType,
          fidelity: result.fidelity,
          width_mm: config.widthMm,
          height_mm: config.heightMm,
          hosted_glb: Boolean(hosted.glb),
          hosted_usdz: Boolean(hosted.usdz),
          phone_reachable:
            (hosted.glb?.phoneReachable ?? true) && (hosted.usdz?.phoneReachable ?? true),
        })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setExportState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Could not build the AR model.',
        })
      })

    return () => {
      cancelled = true
    }
  }, [open, config])

  useEffect(() => {
    if (exportState.status !== 'ready') return
    if (!exportState.hosted.glb && !exportState.hosted.usdz) return
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [exportState])

  if (!CONFIGURATOR_3D_PREVIEW_ENABLED) return null

  const ios = isLikelyIos()
  const android = isLikelyAndroid()
  const hosted = exportState.status === 'ready' ? exportState.hosted : null
  const expiresAt = hosted ? earliestExpiry(hosted) : null
  const expired = expiresAt !== null && nowMs >= expiresAt
  const showLocalhostWarning = Boolean(
    (hosted?.glb && !hosted.glb.phoneReachable) ||
      (hosted?.usdz && !hosted.usdz.phoneReachable),
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex min-h-[44px] items-center justify-center gap-2 border border-steel/15 bg-steel px-4 font-mono text-xs uppercase tracking-widest text-white transition hover:bg-steel/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel/40 ${className}`}
      >
        <Smartphone className="h-4 w-4" aria-hidden />
        View in your space
      </button>

      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) {
            resultRef.current?.revoke()
            resultRef.current = null
            setExportState({ status: 'idle' })
            setCopied(null)
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-steel/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-x-3 bottom-3 z-50 max-h-[90dvh] overflow-y-auto border border-steel/10 bg-canvas p-4 shadow-xl focus:outline-none sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(520px,92vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:bottom-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Dialog.Title className="font-heading text-lg font-black uppercase tracking-tight text-steel">
                  View in your space
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm leading-6 text-muted-deep">
                  AR works on a phone only. The model is real scale — tape the clear opening (
                  {config.widthMm} × {config.heightMm} mm, ground to top rail). Scale is locked in
                  Quick Look / Scene Viewer. Posts and cantilever tails sit outside that check.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-steel/12 text-muted"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </Dialog.Close>
            </div>

            <div className="mt-4 border border-steel/10 bg-white p-4">
              {exportState.status === 'loading' ? (
                <div className="flex min-h-[160px] flex-col items-center justify-center gap-3 text-muted">
                  <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
                  <p className="font-mono text-xs uppercase tracking-widest">Building AR model…</p>
                </div>
              ) : null}

              {exportState.status === 'error' ? (
                <div role="alert" className="min-h-[120px] px-2 py-8 text-center">
                  <p className="font-heading text-sm font-bold uppercase text-steel">Export failed</p>
                  <p className="mt-2 text-sm text-muted-deep">{exportState.message}</p>
                </div>
              ) : null}

              {exportState.status === 'ready' ? (
                <div className="space-y-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    {exportState.result.fidelity === 'workshop' ? 'Workshop mesh' : 'Schematic mesh'} ·
                    clear opening {config.widthMm} × {config.heightMm} mm · real scale ·{' '}
                    {gateTypeLabel(config.gateType)}
                  </p>
                  {exportState.result.notes[0] ? (
                    <p className="text-xs leading-5 text-muted-deep">{exportState.result.notes[0]}</p>
                  ) : null}

                  {expiresAt && !expired ? (
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      {formatArExpiryLabel(expiresAt, nowMs)}
                    </p>
                  ) : null}

                  {expired ? (
                    <div
                      role="alert"
                      className="flex items-start gap-2 border border-steel/15 bg-paper px-3 py-2 text-sm text-muted-deep"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-steel" aria-hidden />
                      <p>
                        AR links expired. Close this dialog and open <strong>View in your space</strong>{' '}
                        again, or download GLB / USDZ below.
                      </p>
                    </div>
                  ) : null}

                  {showLocalhostWarning ? (
                    <div
                      role="status"
                      className="flex items-start gap-2 border border-steel/15 bg-paper px-3 py-2 text-sm text-muted-deep"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-steel" aria-hidden />
                      <p>
                        This link is on localhost / a private network — it will not open on your
                        phone. Use a public HTTPS deploy, or download the model and AirDrop / share
                        the file.
                      </p>
                    </div>
                  ) : null}

                  {!expired && hosted?.usdz && ios ? (
                    <a
                      rel="ar"
                      href={buildQuickLookHref(hosted.usdz.url)}
                      className="flex min-h-[48px] items-center justify-center gap-2 bg-steel px-4 font-mono text-xs uppercase tracking-widest text-white"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- data URI poster required by Quick Look */}
                      <img
                        src={QUICK_LOOK_POSTER}
                        alt=""
                        width={40}
                        height={28}
                        className="h-7 w-10 border border-white/20 object-cover"
                      />
                      Open in AR (Quick Look)
                    </a>
                  ) : null}

                  {!expired && hosted?.glb && android ? (
                    <a
                      href={buildSceneViewerIntentHref(hosted.glb.url)}
                      className="flex min-h-[48px] items-center justify-center gap-2 bg-steel px-4 font-mono text-xs uppercase tracking-widest text-white"
                    >
                      <Smartphone className="h-4 w-4" aria-hidden />
                      Open in AR (Scene Viewer)
                    </a>
                  ) : null}

                  {!expired && hosted && (hosted.glb || hosted.usdz) && !ios && !android ? (
                    <div className="space-y-2">
                      <p className="text-xs leading-5 text-muted-deep">
                        Copy a link, paste it in Messages / WhatsApp / Notes, then open it on your
                        phone. Links expire in about {Math.round(AR_MODEL_TTL_SECONDS / 60)} minutes.
                      </p>
                      {hosted.usdz ? (
                        <button
                          type="button"
                          onClick={() => {
                            void copyText(buildQuickLookHref(hosted.usdz!.url)).then((ok) => {
                              if (!ok) return
                              setCopied('iphone')
                              window.setTimeout(() => setCopied(null), 2000)
                              captureConfiguratorEvent('ar phone link copied', {
                                gate_type: config.gateType,
                                target: 'iphone',
                              })
                            })
                          }}
                          className="flex min-h-[48px] w-full items-center justify-center gap-2 border border-steel/15 bg-paper px-4 font-mono text-xs uppercase tracking-widest text-steel"
                        >
                          {copied === 'iphone' ? (
                            <Check className="h-4 w-4" aria-hidden />
                          ) : (
                            <Copy className="h-4 w-4" aria-hidden />
                          )}
                          {copied === 'iphone' ? 'Copied iPhone link' : 'Copy iPhone link (USDZ)'}
                        </button>
                      ) : (
                        <p className="text-xs text-muted-deep">
                          iPhone USDZ hosting failed — download USDZ below.
                        </p>
                      )}
                      {hosted.glb ? (
                        <button
                          type="button"
                          onClick={() => {
                            // Copy the Scene Viewer HTTPS URL so Android opens AR when possible.
                            void copyText(buildSceneViewerHttpsHref(hosted.glb!.url)).then((ok) => {
                              if (!ok) return
                              setCopied('android')
                              window.setTimeout(() => setCopied(null), 2000)
                              captureConfiguratorEvent('ar phone link copied', {
                                gate_type: config.gateType,
                                target: 'android',
                              })
                            })
                          }}
                          className="flex min-h-[48px] w-full items-center justify-center gap-2 border border-steel/15 bg-paper px-4 font-mono text-xs uppercase tracking-widest text-steel"
                        >
                          {copied === 'android' ? (
                            <Check className="h-4 w-4" aria-hidden />
                          ) : (
                            <Copy className="h-4 w-4" aria-hidden />
                          )}
                          {copied === 'android' ? 'Copied Android link' : 'Copy Android link (GLB)'}
                        </button>
                      ) : (
                        <p className="text-xs text-muted-deep">
                          Android GLB hosting failed — download GLB below.
                        </p>
                      )}
                    </div>
                  ) : null}

                  {!hosted?.glb && !hosted?.usdz ? (
                    <p className="text-xs leading-5 text-muted-deep">
                      Hosting the temporary AR link failed — download the model below and open it on
                      your phone (Files → Quick Look, or Scene Viewer).
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                disabled={exportState.status !== 'ready'}
                onClick={() => {
                  if (exportState.status !== 'ready') return
                  downloadBlob(exportState.result.glbBlob, `steelyes-${config.gateType}.glb`)
                }}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-steel/12 bg-white px-3 font-mono text-xs uppercase tracking-widest text-steel disabled:opacity-40"
              >
                <Download className="h-3.5 w-3.5" aria-hidden />
                Download GLB
              </button>
              <button
                type="button"
                disabled={exportState.status !== 'ready'}
                onClick={() => {
                  if (exportState.status !== 'ready') return
                  downloadBlob(exportState.result.usdzBlob, `steelyes-${config.gateType}.usdz`)
                }}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-steel/12 bg-white px-3 font-mono text-xs uppercase tracking-widest text-steel disabled:opacity-40"
              >
                <Box className="h-3.5 w-3.5" aria-hidden />
                Download USDZ
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
