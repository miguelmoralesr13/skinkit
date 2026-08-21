import { useRef, type RefObject } from 'react'
import { useControllable } from '../../lib/useControllable'
import { useInfiniteScroll } from '../../lib/useInfiniteScroll'
import { useVirtualizer, type VirtualRow } from '../../lib/useVirtualizer'
import type { ListProps } from './List'

export interface ListModel<T> {
  scrollRef: RefObject<HTMLUListElement | null>
  sentinelRef: RefObject<HTMLDivElement | null>
  isVirtualized: boolean
  virtualRows: VirtualRow[]
  virtualTotalHeight: number
  processedItems: T[]
  filterValue: string
  setFilter: (v: string) => void
}

/** Sólo se usa cuando <List> recibe `items` (modo data-driven) — ver List.tsx. En modo estático
 * (children) el componente igual la llama (regla de hooks), pero ignora el resultado. */
export function useList<T>(props: ListProps<T>): ListModel<T> {
  const {
    items,
    filterValue: filterProp,
    defaultFilterValue = '',
    onFilterChange,
    filterItem,
    infinite = false,
    hasMore,
    loadingMore,
    onLoadMore,
    virtualized = false,
    rowHeight = 0,
  } = props

  const scrollRef = useRef<HTMLUListElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // ── búsqueda ──────────────────────────────────────────────
  // Server-driven si pasan onFilterChange: List no filtra nada, sólo avisa el query — el
  // consumidor le pasa `items` ya filtrado en el próximo render (mismo criterio que DataTable).
  const filterServer = !!onFilterChange
  const [filterValue, setFilter] = useControllable(filterProp, defaultFilterValue, onFilterChange)

  const all = items ?? []
  const q = filterValue.trim()
  const processedItems =
    filterServer || !q || !filterItem ? all : all.filter((item) => filterItem(item, q))

  // ── virtualización (comparte el mismo hook que DataTable) ──
  const isVirtualized = virtualized && rowHeight > 0 && items !== undefined
  const { virtualRows, totalHeight: virtualTotalHeight } = useVirtualizer({
    count: isVirtualized ? processedItems.length : 0,
    rowHeight,
    scrollRef,
  })

  // ── scroll infinito (comparte el mismo hook que DataTable) ──
  useInfiniteScroll({ enabled: infinite, hasMore, loadingMore, onLoadMore, sentinelRef })

  return {
    scrollRef,
    sentinelRef,
    isVirtualized,
    virtualRows,
    virtualTotalHeight,
    processedItems,
    filterValue,
    setFilter,
  }
}
