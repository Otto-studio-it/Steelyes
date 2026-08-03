'use client'

import * as Dialog from '@radix-ui/react-dialog'
import type { GateConfig } from '@steelyes/gate-engine'
import { Box, Download, ExternalLink, Loader2, Smartphone, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { captureConfiguratorEvent } from '@/lib/analytics/posthog'
import {
  exportGateArModel,
  type GateArExportResult,
} from '@/lib/configurator/ar/export-gate-ar-model'
import { CONFIGURATOR_3D_PREVIEW_ENABLED } from '@/lib/configurator/features'

type ViewInYourSpaceProps = {
  config: GateConfig
  className?: string
}

type HostedUrls = {
  glbUrl: string
  usdzUrl: string
}

type ExportState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; result: GateArExportResult; hosted: HostedUrls | null }
  | { status: 'error'; message: string }

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
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function isLikelyAndroid(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android/i.test(navigator.userAgent)
}

async function hostModel(blob: Blob, format: 'glb' | 'usdz'): Promise<string> {
  const response = await fetch('/api/ar/models', {
    method: 'POST',
    headers: { 'x-ar-format': format },
    body: blob,
  })
  if (!response.ok) {
    throw new Error(`Could not host ${format.toUpperCase()} model (${response.status})`)
  }
  const payload = (await response.json()) as { url?: string }
  if (!payload.url) throw new Error(`Missing hosted ${format} URL`)
  return payload.url
}

export function ViewInYourSpaceButton({ config, className = '' }: ViewInYourSpaceProps) {
  const [open, setOpen] = useState(false)
  const [exportState, setExportState] = useState<ExportState>({ status: 'idle' })
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

        let hosted: HostedUrls | null = null
        try {
          const [glbUrl, usdzUrl] = await Promise.all([
            hostModel(result.glbBlob, 'glb'),
            hostModel(result.usdzBlob, 'usdz'),
          ])
          hosted = { glbUrl, usdzUrl }
        } catch {
          hosted = null
        }

        if (cancelled) {
          result.revoke()
          return
        }

        setExportState({ status: 'ready', result, hosted })
        captureConfiguratorEvent('ar model exported', {
          gate_type: config.gateType,
          fidelity: result.fidelity,
          width_mm: config.widthMm,
          height_mm: config.heightMm,
          hosted: Boolean(hosted),
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

  if (!CONFIGURATOR_3D_PREVIEW_ENABLED) return null

  const ios = isLikelyIos()
  const android = isLikelyAndroid()

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
                  Place this configured gate at real size with your phone camera. Tap the ground
                  where the gate should start — Apple Quick Look (iPhone) or Google Scene Viewer
                  (Android).
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
                    {exportState.result.fidelity === 'workshop' ? 'Workshop mesh' : 'Schematic mesh'} ·{' '}
                    {config.widthMm} × {config.heightMm} mm · real scale · {config.gateType.replace(/_/g, ' ')}
                  </p>
                  {exportState.result.notes[0] ? (
                    <p className="text-xs leading-5 text-muted-deep">{exportState.result.notes[0]}</p>
                  ) : null}

                  {exportState.hosted && ios ? (
                    <a
                      rel="ar"
                      href={exportState.hosted.usdzUrl}
                      className="flex min-h-[48px] items-center justify-center gap-2 bg-steel px-4 font-mono text-xs uppercase tracking-widest text-white"
                    >
                      <Smartphone className="h-4 w-4" aria-hidden />
                      Open in AR (Quick Look)
                    </a>
                  ) : null}

                  {exportState.hosted && android ? (
                    <a
                      href={`intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(exportState.hosted.glbUrl)}&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`}
                      className="flex min-h-[48px] items-center justify-center gap-2 bg-steel px-4 font-mono text-xs uppercase tracking-widest text-white"
                    >
                      <Smartphone className="h-4 w-4" aria-hidden />
                      Open in AR (Scene Viewer)
                    </a>
                  ) : null}

                  {exportState.hosted && !ios && !android ? (
                    <a
                      href={exportState.hosted.usdzUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-h-[48px] items-center justify-center gap-2 border border-steel/15 bg-paper px-4 font-mono text-xs uppercase tracking-widest text-steel"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden />
                      Open USDZ link on your phone
                    </a>
                  ) : null}

                  {!exportState.hosted ? (
                    <p className="text-xs leading-5 text-muted-deep">
                      Hosting the temporary AR link failed — download the model below and open it on
                      your phone (Files / Scene Viewer).
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
