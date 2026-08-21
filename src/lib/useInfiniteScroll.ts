import { useEffect, type RefObject } from 'react'

// Sentinel + IntersectionObserver para scroll infinito — extraído de useDataTable.ts porque
// List ahora necesita EXACTAMENTE la misma lógica (ver src/lib/useVirtualizer.ts, mismo criterio:
// compartido para que cualquier componente con "cargar más" pueda sumarlo sin reinventarlo).

export interface UseInfiniteScrollOptions {
  /** Si el modo de scroll infinito está activo (ej. DataTable: pagination==='infinite'). */
  enabled: boolean
  hasMore?: boolean
  loadingMore?: boolean
  onLoadMore?: () => void
  sentinelRef: RefObject<HTMLElement | null>
}

export function useInfiniteScroll({
  enabled,
  hasMore,
  loadingMore,
  onLoadMore,
  sentinelRef,
}: UseInfiniteScrollOptions): void {
  useEffect(() => {
    if (!enabled || !onLoadMore) return
    const el = sentinelRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasMore && !loadingMore) onLoadMore()
    })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, onLoadMore, hasMore, loadingMore])
}
