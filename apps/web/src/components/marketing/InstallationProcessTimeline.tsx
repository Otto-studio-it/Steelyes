'use client'

import { useEffect, useRef, useState } from 'react'

type ProcessItem = {
  n: string
  label: string
  body: string
}

export function InstallationProcessTimeline({ items }: { items: readonly ProcessItem[] }) {
  const listRef = useRef<HTMLOListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const list = listRef.current
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-process-index]'))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top - window.innerHeight * 0.45) - Math.abs(b.boundingClientRect.top - window.innerHeight * 0.45))[0]
        if (visible) setActiveIndex(Number((visible.target as HTMLElement).dataset.processIndex))
      },
      { rootMargin: '-30% 0px -45% 0px', threshold: 0.1 },
    )

    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [])

  return (
    <ol ref={listRef} className="relative border-y border-zinc-200">
      <span className="absolute bottom-5 left-[1.2rem] top-5 w-px bg-zinc-200 md:left-[1.45rem]" aria-hidden>
        <span
          className="block h-full origin-top bg-primary transition-transform duration-300 ease-out"
          style={{ transform: `scaleY(${(activeIndex + 1) / items.length})` }}
        />
      </span>
      {items.map(({ n, label, body }, index) => {
        const active = index === activeIndex
        const passed = index <= activeIndex
        return (
          <li
            key={label}
            data-process-index={index}
            className={`relative flex gap-5 border-b border-zinc-200 py-5 transition-opacity duration-300 last:border-b-0 ${
              active ? 'opacity-100' : 'opacity-70'
            }`}
          >
            <span
              className={`relative z-10 w-10 shrink-0 bg-canvas font-heading text-3xl font-black leading-none transition-colors duration-300 md:text-4xl ${
                passed ? 'text-primary' : 'text-zinc-200'
              }`}
            >
              {n}
            </span>
            <div className={`motion-safe:transition-transform motion-safe:duration-300 ${active ? 'translate-x-1' : ''}`}>
              <h3 className="font-heading text-lg font-bold uppercase md:text-xl">{label}</h3>
              <p className="mt-1.5 text-sm font-light leading-relaxed text-muted-deep">{body}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
