'use client'

import { useCallback, useRef, useState, type CSSProperties, type PointerEvent } from 'react'

const DISMISS_THRESHOLD_PX = 110

type SwipeDismissHandle = {
  /** Spread onto the sheet's drag handle / header (not the scroll body). */
  handleProps: {
    onPointerDown: (event: PointerEvent<HTMLElement>) => void
    onPointerMove: (event: PointerEvent<HTMLElement>) => void
    onPointerUp: (event: PointerEvent<HTMLElement>) => void
    onPointerCancel: (event: PointerEvent<HTMLElement>) => void
    style: CSSProperties
  }
  /** Apply to Dialog.Content alongside the `cfg-sheet-draggable` class. */
  contentStyle: CSSProperties
}

/**
 * Drag-down-to-dismiss for bottom sheets. Handlers attach to the header/grabber
 * only, so the scrollable body keeps its native scroll (no gesture conflict).
 * Below the threshold the sheet springs back via `.cfg-sheet-draggable`.
 */
export function useSheetSwipeDismiss(onDismiss: () => void): SwipeDismissHandle {
  const [offset, setOffset] = useState(0)
  const startRef = useRef<number | null>(null)
  const dragging = startRef.current !== null

  const onPointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    startRef.current = event.clientY
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }, [])

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (startRef.current === null) return
    setOffset(Math.max(0, event.clientY - startRef.current))
  }, [])

  const finish = useCallback(() => {
    if (startRef.current === null) return
    const shouldDismiss = offset > DISMISS_THRESHOLD_PX
    startRef.current = null
    setOffset(0)
    if (shouldDismiss) onDismiss()
  }, [offset, onDismiss])

  return {
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
      style: { touchAction: 'none', cursor: 'grab' },
    },
    contentStyle: {
      transform: offset ? `translateY(${offset}px)` : undefined,
      // Suppress the spring-back transition while the finger tracks the sheet.
      transition: dragging ? 'none' : undefined,
    },
  }
}
