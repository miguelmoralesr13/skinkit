import { useEffect, useState, type RefObject } from 'react'

// Windowing de altura fija — compartido para que cualquier componente con listas/tablas grandes
// (DataTable hoy; Tree/Combobox mañana) pueda sumarlo sin reinventar el cálculo. Altura variable
// (contenido dinámico por fila) queda fuera a propósito: exige un cache de mediciones bastante
// más complejo, y la inmensa mayoría de tablas de alto rendimiento (incluida esta) asumen fila
// uniforme — quien necesite alturas variables sigue teniendo pagination='server'/'infinite'.

export interface UseVirtualizerOptions {
  /** Cantidad total de ítems (no solo los visibles). */
  count: number
  /** Alto en px de cada ítem — fijo, uniforme. */
  rowHeight: number
  /** Ref al contenedor con scroll (overflow-y: auto/scroll). */
  scrollRef: RefObject<HTMLElement | null>
  /** Ítems extra a renderizar arriba/abajo del viewport, para que el scroll rápido no muestre huecos. */
  overscan?: number
}

export interface VirtualRow {
  index: number
  /** Offset en px desde el inicio de la lista. */
  start: number
}

export interface UseVirtualizerResult {
  virtualRows: VirtualRow[]
  /** Alto total (real) de la lista completa — para que los elementos "espaciadores" reserven el
   * scroll correcto sin renderizar las filas que no se ven. */
  totalHeight: number
}

export function useVirtualizer({
  count,
  rowHeight,
  scrollRef,
  overscan = 6,
}: UseVirtualizerOptions): UseVirtualizerResult {
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    setScrollTop(el.scrollTop)
    setViewportHeight(el.clientHeight)

    const onScroll = () => setScrollTop(el.scrollTop)
    el.addEventListener('scroll', onScroll, { passive: true })

    let ro: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver((entries) => {
        setViewportHeight(entries[0]?.contentRect.height ?? el.clientHeight)
      })
      ro.observe(el)
    }

    return () => {
      el.removeEventListener('scroll', onScroll)
      ro?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRef.current])

  const totalHeight = count * rowHeight
  if (count === 0 || rowHeight <= 0) return { virtualRows: [], totalHeight }

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
  const endIndex = Math.min(count - 1, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan)

  const virtualRows: VirtualRow[] = []
  for (let i = startIndex; i <= endIndex; i++) {
    virtualRows.push({ index: i, start: i * rowHeight })
  }

  return { virtualRows, totalHeight }
}
