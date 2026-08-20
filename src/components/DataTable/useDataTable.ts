import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { useVirtualizer, type VirtualRow } from '../../lib/useVirtualizer'
import type {
  ColumnDef,
  DataTableProps,
  PaginationMode,
  Row,
  RowKey,
  SelectionMode,
  SortState,
  ViewMode,
} from './types'

/** Estado controlable: si `controlled` está definido, manda; si no, estado interno. */
function useControllable<V>(
  controlled: V | undefined,
  defaultValue: V,
  onChange?: (v: V) => void,
): [V, (v: V) => void] {
  const [internal, setInternal] = useState(defaultValue)
  const isControlled = controlled !== undefined
  const value = isControlled ? (controlled as V) : internal
  const set = useCallback(
    (v: V) => {
      if (!isControlled) setInternal(v)
      onChange?.(v)
    },
    [isControlled, onChange],
  )
  return [value, set]
}

function defaultCompare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  return String(a).localeCompare(String(b), undefined, { numeric: true })
}

export interface DataTableModel<T> {
  rootRef: RefObject<HTMLDivElement | null>
  scrollRef: RefObject<HTMLDivElement | null>
  sentinelRef: RefObject<HTMLDivElement | null>
  effectiveView: ViewMode
  toggleView: () => void

  // virtualización (view='table' + virtualized únicamente)
  isVirtualized: boolean
  virtualRows: VirtualRow[]
  virtualTotalHeight: number

  visibleColumns: ColumnDef<T>[]
  rows: T[]
  getValue: (col: ColumnDef<T>, row: T) => unknown
  renderCell: (col: ColumnDef<T>, row: T) => ReactNode

  // filtro
  filterValue: string
  setFilter: (v: string) => void

  // orden
  sortState: SortState | null
  toggleSort: (key: string) => void

  // selección
  selectionMode: SelectionMode
  selectedKeys: RowKey[]
  selectedRows: T[]
  isSelected: (key: RowKey) => boolean
  toggleRow: (row: T) => void
  toggleAll: () => void
  allSelected: boolean
  someSelected: boolean

  // paginado
  paginationMode: PaginationMode
  page: number
  pageSize: number
  pageSizeOptions: number[]
  pageCount: number
  totalRows: number
  rangeStart: number
  rangeEnd: number
  setPage: (p: number) => void
  setPageSize: (s: number) => void
}

export function useDataTable<T extends object>(props: DataTableProps<T>): DataTableModel<T> {
  const {
    data,
    columns,
    rowKey,
    selection = 'none',
    selectedKeys: selectedKeysProp,
    defaultSelectedKeys,
    onSelectionChange,
    sort: sortProp,
    defaultSort = null,
    onSortChange,
    filterValue: filterProp,
    defaultFilterValue = '',
    onFilterChange,
    pagination = 'client',
    page: pageProp,
    defaultPage = 1,
    pageSize: pageSizeProp,
    defaultPageSize = 10,
    pageSizeOptions = [10, 25, 50],
    total,
    onPageChange,
    onPageSizeChange,
    view = 'auto',
    cardBreakpoint = 640,
    virtualized = false,
    rowHeight = 0,
  } = props

  const selectionMode: SelectionMode =
    selection === true ? 'multiple' : selection === false ? 'none' : selection

  const rootRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const visibleColumns = useMemo(() => columns.filter((c) => !c.hidden), [columns])

  const getValue = useCallback(
    (col: ColumnDef<T>, row: T): unknown =>
      col.accessor ? col.accessor(row) : (row as Row)[col.key],
    [],
  )
  const renderCell = useCallback(
    (col: ColumnDef<T>, row: T): ReactNode => {
      const value = getValue(col, row)
      if (col.cell) return col.cell(row, value)
      return value == null ? '' : String(value)
    },
    [getValue],
  )

  // ── filtro ────────────────────────────────────────────────
  const filterServer = !!onFilterChange
  const [filterValue, setFilter] = useControllable(filterProp, defaultFilterValue, onFilterChange)

  // ── orden ─────────────────────────────────────────────────
  const sortServer = !!onSortChange
  const [sortState, setSort] = useControllable<SortState | null>(sortProp, defaultSort, onSortChange)
  const toggleSort = useCallback(
    (key: string) => {
      // asc → desc → sin orden
      if (!sortState || sortState.key !== key) setSort({ key, dir: 'asc' })
      else if (sortState.dir === 'asc') setSort({ key, dir: 'desc' })
      else setSort(null)
    },
    [sortState, setSort],
  )

  // ── paginado ──────────────────────────────────────────────
  const [page, setPageRaw] = useControllable(pageProp, defaultPage, onPageChange)
  const [pageSize, setPageSizeRaw] = useControllable(pageSizeProp, defaultPageSize, onPageSizeChange)
  const setPageSize = useCallback(
    (s: number) => {
      setPageSizeRaw(s)
      setPageRaw(1) // cambiar tamaño reinicia a la primera página
    },
    [setPageSizeRaw, setPageRaw],
  )

  // ── pipeline cliente: filtro → orden → (paginado abajo) ────
  const processed = useMemo(() => {
    let rows = data

    if (!filterServer && filterValue.trim()) {
      const q = filterValue.trim().toLowerCase()
      rows = rows.filter((row) =>
        visibleColumns.some((col) => {
          if (col.filterable === false) return false
          const v = col.accessor ? col.accessor(row) : (row as Row)[col.key]
          return v != null && String(v).toLowerCase().includes(q)
        }),
      )
    }

    if (!sortServer && sortState) {
      const col = columns.find((c) => c.key === sortState.key)
      if (col) {
        const base =
          col.sortFn ??
          ((a: T, b: T) =>
            defaultCompare(
              col.accessor ? col.accessor(a) : (a as Row)[col.key],
              col.accessor ? col.accessor(b) : (b as Row)[col.key],
            ))
        rows = [...rows].sort((a, b) => (sortState.dir === 'asc' ? base(a, b) : -base(a, b)))
      }
    }

    return rows
  }, [data, filterServer, filterValue, sortServer, sortState, columns, visibleColumns])

  const filteredCount = processed.length

  const rows = useMemo(() => {
    if (pagination === 'client') {
      const start = (page - 1) * pageSize
      return processed.slice(start, start + pageSize)
    }
    return processed
  }, [processed, pagination, page, pageSize])

  const totalRows =
    pagination === 'server' ? (total ?? data.length) : pagination === 'client' ? filteredCount : filteredCount
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize))
  const setPage = useCallback(
    (p: number) => setPageRaw(Math.min(Math.max(1, p), pageCount)),
    [setPageRaw, pageCount],
  )
  const rangeStart = totalRows === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd =
    pagination === 'server' ? Math.min(page * pageSize, totalRows) : Math.min(page * pageSize, totalRows)

  // ── selección ─────────────────────────────────────────────
  const [selectedKeys, setSelectedKeys] = useState<RowKey[]>(defaultSelectedKeys ?? [])
  const selKeys = selectedKeysProp ?? selectedKeys
  const rowByKey = useMemo(() => {
    const m = new Map<RowKey, T>()
    for (const r of data) m.set(rowKey(r), r)
    return m
  }, [data, rowKey])
  const commitSelection = useCallback(
    (keys: RowKey[]) => {
      if (selectedKeysProp === undefined) setSelectedKeys(keys)
      const rows = keys.map((k) => rowByKey.get(k)).filter((r): r is T => r !== undefined)
      onSelectionChange?.(keys, rows)
    },
    [selectedKeysProp, rowByKey, onSelectionChange],
  )
  const selectedSet = useMemo(() => new Set(selKeys), [selKeys])
  const isSelected = useCallback((key: RowKey) => selectedSet.has(key), [selectedSet])
  const toggleRow = useCallback(
    (row: T) => {
      const key = rowKey(row)
      if (selectionMode === 'single') {
        commitSelection(selectedSet.has(key) ? [] : [key])
        return
      }
      const next = new Set(selectedSet)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      commitSelection([...next])
    },
    [rowKey, selectionMode, selectedSet, commitSelection],
  )
  const pageKeys = useMemo(() => rows.map((r) => rowKey(r)), [rows, rowKey])
  const allSelected = pageKeys.length > 0 && pageKeys.every((k) => selectedSet.has(k))
  const someSelected = !allSelected && pageKeys.some((k) => selectedSet.has(k))
  const toggleAll = useCallback(() => {
    if (allSelected) {
      const rest = selKeys.filter((k) => !pageKeys.includes(k))
      commitSelection(rest)
    } else {
      const merged = new Set(selKeys)
      for (const k of pageKeys) merged.add(k)
      commitSelection([...merged])
    }
  }, [allSelected, selKeys, pageKeys, commitSelection])
  const selectedRows = useMemo(
    () => selKeys.map((k) => rowByKey.get(k)).filter((r): r is T => r !== undefined),
    [selKeys, rowByKey],
  )

  // ── vista responsiva ──────────────────────────────────────
  const [autoView, setAutoView] = useState<ViewMode>('table')
  const [override, setOverride] = useState<ViewMode | null>(null)
  useEffect(() => {
    if (view !== 'auto') return
    const el = rootRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0
      setAutoView(w > 0 && w < cardBreakpoint ? 'cards' : 'table')
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [view, cardBreakpoint])
  const baseView: ViewMode = view === 'auto' ? autoView : view
  const effectiveView = override ?? baseView
  const toggleView = useCallback(
    () => setOverride(effectiveView === 'table' ? 'cards' : 'table'),
    [effectiveView],
  )

  // ── virtualización ────────────────────────────────────────
  const isVirtualized = virtualized && effectiveView === 'table' && rowHeight > 0
  const { virtualRows, totalHeight: virtualTotalHeight } = useVirtualizer({
    count: isVirtualized ? rows.length : 0,
    rowHeight,
    scrollRef,
  })

  // ── scroll infinito ───────────────────────────────────────
  const { hasMore, loadingMore, onLoadMore } = props
  useEffect(() => {
    if (pagination !== 'infinite' || !onLoadMore) return
    const el = sentinelRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasMore && !loadingMore) onLoadMore()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [pagination, onLoadMore, hasMore, loadingMore])

  return {
    rootRef,
    scrollRef,
    sentinelRef,
    effectiveView,
    toggleView,
    isVirtualized,
    virtualRows,
    virtualTotalHeight,
    visibleColumns,
    rows,
    getValue,
    renderCell,
    filterValue,
    setFilter,
    sortState,
    toggleSort,
    selectionMode,
    selectedKeys: selKeys,
    selectedRows,
    isSelected,
    toggleRow,
    toggleAll,
    allSelected,
    someSelected,
    paginationMode: pagination,
    page,
    pageSize,
    pageSizeOptions,
    pageCount,
    totalRows,
    rangeStart,
    rangeEnd,
    setPage,
    setPageSize,
  }
}
