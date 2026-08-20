import type { HTMLAttributes, ReactNode } from 'react'

/** Fila genérica: cualquier objeto. */
export type Row = Record<string, unknown>

export type SortDir = 'asc' | 'desc'
export interface SortState {
  /** `key` de la columna por la que se ordena. */
  key: string
  dir: SortDir
}

export type ColumnAlign = 'start' | 'center' | 'end'

/** Rol de la columna en modo cards. `field` (default) = label:valor; `hidden` = no se muestra. */
export type CardRole = 'title' | 'subtitle' | 'meta' | 'field' | 'hidden'

/**
 * Definición de una columna — pensada para venir de un JSON. `cell`/`accessor`/`sortFn` son
 * funciones opcionales para casos que un JSON puro no cubre (render custom, orden custom).
 */
export interface ColumnDef<T = Row> {
  /** id único de la columna. Es también la key para leer el valor si no hay `accessor`. */
  key: string
  /** Encabezado de la columna. */
  header: ReactNode
  /** Lee el valor crudo de la fila (para orden/filtro/render por defecto). Default: `row[key]`. */
  accessor?: (row: T) => unknown
  /** Render personalizado de la celda. Default: el valor como texto. */
  cell?: (row: T, value: unknown) => ReactNode
  /** Habilita ordenar por esta columna. */
  sortable?: boolean
  /** Comparador cliente propio (si no, compara por el valor del accessor). */
  sortFn?: (a: T, b: T) => number
  /** Incluir esta columna en el filtro de texto global. Default: true. */
  filterable?: boolean
  /** Alineación del contenido de la columna. */
  align?: ColumnAlign
  /** Ancho CSS de la columna (ej. 120, '12rem', '20%'). */
  width?: string | number
  /** Rol en modo cards. Default: 'field'. */
  cardRole?: CardRole
  /** Oculta la columna por completo (tabla y cards). */
  hidden?: boolean
}

export type ViewMode = 'table' | 'cards'
/**
 * - `client`: la tabla filtra/ordena/pagina en memoria.
 * - `server`: vos manejás page/total; la tabla no corta datos.
 * - `infinite`: scroll infinito (onLoadMore + hasMore), sin paginador.
 * - `none`: muestra todo.
 */
export type PaginationMode = 'client' | 'server' | 'infinite' | 'none'
export type SelectionMode = 'none' | 'single' | 'multiple'

export type RowKey = string | number

export interface DataTableProps<T extends object = Row>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Filas. En modo server, es la página actual ya resuelta por el backend. */
  data: T[]
  /** Columnas (config JSON). */
  columns: ColumnDef<T>[]
  /** Devuelve un id estable por fila (para selección/keys de React). */
  rowKey: (row: T) => RowKey

  // ── selección ──────────────────────────────────────────────
  /** `true` = 'multiple'. Default: 'none'. */
  selection?: SelectionMode | boolean
  /** Controlado: keys seleccionadas. */
  selectedKeys?: RowKey[]
  defaultSelectedKeys?: RowKey[]
  onSelectionChange?: (keys: RowKey[], rows: T[]) => void

  // ── acciones ───────────────────────────────────────────────
  /** Acciones por fila (render en la celda/tarjeta de acciones). */
  rowActions?: (row: T) => ReactNode
  /** Acciones masivas (aparecen en el toolbar cuando hay selección). */
  bulkActions?: (rows: T[], keys: RowKey[]) => ReactNode

  // ── orden ──────────────────────────────────────────────────
  /** Controlado ⇒ el orden lo maneja el server. */
  sort?: SortState | null
  defaultSort?: SortState | null
  /** Si se pasa ⇒ modo server (la tabla NO ordena en memoria). */
  onSortChange?: (sort: SortState | null) => void

  // ── filtro (texto global) ──────────────────────────────────
  /** Muestra el input de búsqueda del toolbar. */
  filterable?: boolean
  filterValue?: string
  defaultFilterValue?: string
  /** Si se pasa ⇒ modo server (la tabla NO filtra en memoria). */
  onFilterChange?: (value: string) => void
  filterPlaceholder?: string

  // ── paginado ───────────────────────────────────────────────
  /** Default: 'client'. */
  pagination?: PaginationMode
  /** Controlado (server). Base 1. */
  page?: number
  defaultPage?: number
  pageSize?: number
  defaultPageSize?: number
  pageSizeOptions?: number[]
  /** Total de filas (requerido en server para calcular páginas). */
  total?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  // infinite
  hasMore?: boolean
  loadingMore?: boolean
  onLoadMore?: () => void

  // ── vista ──────────────────────────────────────────────────
  /** 'auto' cambia a cards bajo `cardBreakpoint`. Default: 'auto'. */
  view?: ViewMode | 'auto'
  /** px de ancho del root por debajo de los cuales 'auto' usa cards. Default: 640. */
  cardBreakpoint?: number
  /** Muestra un botón para alternar tabla/cards manualmente. */
  allowViewToggle?: boolean

  // ── varios útiles ──────────────────────────────────────────
  density?: 'comfortable' | 'compact'
  stickyHeader?: boolean
  loading?: boolean
  emptyContent?: ReactNode
  caption?: ReactNode

  // ── virtualización (solo view='table', fila de alto fijo) ──
  /** Renderiza solo las filas visibles (+ overscan) en vez de `rows` completo. Requiere
   * `rowHeight` y `height`. No aplica en vista 'cards' (contenido de alto variable). */
  virtualized?: boolean
  /** Alto en px de cada fila — uniforme, requerido cuando `virtualized`. */
  rowHeight?: number
  /** Alto en px del viewport con scroll — requerido cuando `virtualized`. */
  height?: number
}
