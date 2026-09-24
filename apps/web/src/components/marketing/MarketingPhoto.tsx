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
          <span className="absolute inset-0 animate-pulse bg-zinc-200/80" aria-hidden />
          <span className="relative font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            {state === 'error' ? 'Photo unavailable' : 'Loading'}
          </span>
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
