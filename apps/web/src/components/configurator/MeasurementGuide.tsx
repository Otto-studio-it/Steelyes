'use client'

import { ChevronDown, Ruler } from 'lucide-react'
import { useState } from 'react'

/**
 * Collapsible plain-language guide for measuring the gate opening,
 * with a simple diagram. Rough measurements are fine — final sizes
 * are confirmed at the site survey.
 */
export function MeasurementGuide() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-steel/10 bg-paper">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex min-h-[48px] w-full items-center justify-between gap-3 px-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-tight text-steel">
          <Ruler className="h-4 w-4 text-primary" aria-hidden />
          Not sure how to measure?
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="border-t border-steel/10 px-4 py-4">
          <svg
            viewBox="0 0 320 150"
            role="img"
            aria-label="Diagram: width is measured between the inner faces of the posts, height from the ground to the top of the gate"
            className="w-full max-w-md"
          >
            {/* Ground */}
            <line x1="10" y1="130" x2="310" y2="130" stroke="currentColor" strokeWidth="2" className="text-steel/40" />
            {/* Posts */}
            <rect x="30" y="20" width="16" height="110" fill="currentColor" className="text-steel/70" />
            <rect x="274" y="20" width="16" height="110" fill="currentColor" className="text-steel/70" />
            {/* Gate leaves (schematic bars) */}
            <rect x="50" y="40" width="106" height="90" fill="none" stroke="currentColor" strokeWidth="2" className="text-steel/50" />
            <rect x="164" y="40" width="106" height="90" fill="none" stroke="currentColor" strokeWidth="2" className="text-steel/50" />
            {[70, 90, 110, 130, 184, 204, 224, 244].map((x) => (
              <line key={x} x1={x} y1="44" x2={x} y2="126" stroke="currentColor" strokeWidth="1.5" className="text-steel/30" />
            ))}
            {/* Width arrow between inner post faces */}
            <line x1="50" y1="28" x2="270" y2="28" stroke="#9E000C" strokeWidth="1.5" markerStart="url(#mg-arrow-l)" markerEnd="url(#mg-arrow-r)" />
            <rect x="128" y="18" width="64" height="18" fill="white" />
            <text x="160" y="31" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#9E000C">
              WIDTH
            </text>
            {/* Height arrow */}
            <line x1="304" y1="40" x2="304" y2="130" stroke="#9E000C" strokeWidth="1.5" markerStart="url(#mg-arrow-u)" markerEnd="url(#mg-arrow-d)" />
            <text x="300" y="90" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#9E000C" transform="rotate(-90 300 90)">
              HEIGHT
            </text>
            <defs>
              <marker id="mg-arrow-l" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M8 0 L0 4 L8 8" fill="none" stroke="#9E000C" strokeWidth="1.5" />
              </marker>
              <marker id="mg-arrow-r" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0 0 L8 4 L0 8" fill="none" stroke="#9E000C" strokeWidth="1.5" />
              </marker>
              <marker id="mg-arrow-u" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0 8 L4 0 L8 8" fill="none" stroke="#9E000C" strokeWidth="1.5" />
              </marker>
              <marker id="mg-arrow-d" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0 0 L4 8 L8 0" fill="none" stroke="#9E000C" strokeWidth="1.5" />
              </marker>
            </defs>
          </svg>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-deep">
            <li>
              <strong className="text-steel">Width:</strong> measure the clear opening between the inner faces of your
              posts, pillars, or walls — where the gate will sit.
            </li>
            <li>
              <strong className="text-steel">Height:</strong> measure from the ground to where you want the top of the
              gate. 1000&nbsp;mm is about waist height; 1800&nbsp;mm is full privacy height.
            </li>
            <li>
              Use a metal tape measure and note the size in millimetres (1&nbsp;metre = 1000&nbsp;mm,
              1&nbsp;foot ≈ 305&nbsp;mm).
            </li>
          </ol>

          <p className="mt-3 border-l-4 border-primary/40 bg-primary/5 px-3 py-2 text-sm leading-6 text-muted-deep">
            A rough measurement is fine — we confirm exact sizes at the site survey before anything is fabricated.
          </p>
        </div>
      ) : null}
    </div>
  )
}
