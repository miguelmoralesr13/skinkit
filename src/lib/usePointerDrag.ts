import { useCallback, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

// Generaliza el patrón de arrastre por puntero ya usado inline en Resizable.tsx/ComparisonSlider.tsx:
// estado del gesto en un ref (no useState — no hace falta re-render por movimiento),
// setPointerCapture/releasePointerCapture atado directo a los handlers, snapshot del estado
// inicial tomado en onStart (para no depender de props que puedan cambiar a mitad del gesto).
// Flow lo necesita 3 veces (arrastrar un nodo, pan del canvas, arrastrar una conexión) — eso
// justifica extraerlo. No se tocó Resizable/ComparisonSlider para adoptarlo (fuera de alcance).

export interface UsePointerDragOptions<S> {
  /** Corre en pointerdown. Devolver `null`/`false` cancela el gesto (ej. `draggable={false}`).
   * Lo que devuelva queda fijo como snapshot inicial — se lee tal cual en onMove/onEnd. */
  onStart: (e: ReactPointerEvent<HTMLElement>) => S | null | false
  onMove: (delta: { dx: number; dy: number }, state: S, e: ReactPointerEvent<HTMLElement>) => void
  onEnd?: (state: S, e: ReactPointerEvent<HTMLElement>) => void
}

export interface PointerDragHandlers {
  onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void
  onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void
  onPointerUp: (e: ReactPointerEvent<HTMLElement>) => void
}

interface DragRef<S> {
  startClientX: number
  startClientY: number
  state: S
}

export function usePointerDrag<S>(opts: UsePointerDragOptions<S>): PointerDragHandlers {
  const drag = useRef<DragRef<S> | null>(null)
  const optsRef = useRef(opts)
  optsRef.current = opts

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    const state = optsRef.current.onStart(e)
    if (state == null || state === false) return
    drag.current = { startClientX: e.clientX, startClientY: e.clientY, state }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current
    if (!d) return
    optsRef.current.onMove(
      { dx: e.clientX - d.startClientX, dy: e.clientY - d.startClientY },
      d.state,
      e,
    )
  }, [])

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current
    if (!d) return
    drag.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
    optsRef.current.onEnd?.(d.state, e)
  }, [])

  return { onPointerDown, onPointerMove, onPointerUp }
}
