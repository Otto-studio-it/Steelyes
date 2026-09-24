'use client'

import { useState } from 'react'
import Image from 'next/image'

type MarketingPhotoProps = {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
}

export function MarketingPhoto({ src, alt, sizes, priority, className }: MarketingPhotoProps) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  return (
    <>
      {state !== 'ready' ? (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-100"
          role="status"
          aria-live="polite"
        >
          <span className="absolute inset-0 bg-zinc-200/80" aria-hidden />
          {state === 'error' ? (
            <span className="relative font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Photo unavailable
            </span>
          ) : (
            <span
              className="relative h-9 w-9 animate-spin rounded-full border-2 border-zinc-300 border-t-steel"
              aria-hidden
            />
          )}
          <span className="sr-only">{state === 'error' ? 'Photo unavailable' : 'Loading photo'}</span>
        </div>
      ) : null}
      {state !== 'error' ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`${className ?? ''} ${state === 'ready' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setState('ready')}
          onError={() => setState('error')}
        />
      ) : null}
    </>
  )
}
