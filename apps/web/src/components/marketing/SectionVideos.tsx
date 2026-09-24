'use client'

import { useEffect, useRef, useState } from 'react'

import type { PageVideo } from '@/lib/marketing/page-videos'

function SilentClip({
  clip,
  music,
}: {
  clip: PageVideo
  music: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [ready, setReady] = useState(false)

  function keepSilent() {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.volume = 0
  }

  useEffect(() => {
    keepSilent()
  }, [])

  function onPlay() {
    keepSilent()
    const video = videoRef.current
    const audio = audioRef.current
    document.querySelectorAll('video').forEach((other) => {
      if (other !== video) other.pause()
    })
    document.querySelectorAll('audio').forEach((other) => {
      if (other !== audio) other.pause()
    })
    void audio?.play()
  }

  function onPause() {
    audioRef.current?.pause()
  }

  return (
    <figure className="space-y-3">
      <div className="relative aspect-video overflow-hidden bg-zinc-900">
        {ready ? null : (
          <div className="absolute inset-0 z-10 flex items-center justify-center" role="status">
            <span
              className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white"
              aria-hidden
            />
            <span className="sr-only">Loading video</span>
          </div>
        )}
        <video
          ref={videoRef}
          src={clip.src}
          muted
          playsInline
          controls
          preload="metadata"
          className="h-full w-full object-cover"
          onLoadedData={() => {
            keepSilent()
            setReady(true)
          }}
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onPause}
          onVolumeChange={keepSilent}
        />
        <audio ref={audioRef} src={music} loop preload="none" />
      </div>
      <figcaption className="font-heading text-sm font-bold uppercase tracking-wide text-steel">
        {clip.caption}
      </figcaption>
    </figure>
  )
}

export function SectionVideos({
  clips,
  music,
}: {
  clips: readonly PageVideo[]
  music: string
}) {
  if (clips.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
      <p className="mb-6 font-mono text-xs uppercase tracking-widest text-primary">Film</p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {clips.map((clip) => (
          <SilentClip key={clip.src} clip={clip} music={music} />
        ))}
      </div>
    </section>
  )
}
