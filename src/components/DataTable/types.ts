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

/**
 * Clases por sub-parte (todas opcionales). Las keys son los `data-part` reales de DataTable.tsx
 * en camelCase. Partes repetidas (fila, celda, header de columna, checkbox de selección, botón de
 * paginación, etc.) comparten una sola clase para todas sus instancias — no hay callback por-fila.
 */
export interface DataTableClassNames {
  /** [data-part="toolbar"]. */
  toolbar?: string
  /** [data-part="search"]: input de búsqueda del toolbar. */
  search?: string
  /** [data-part="toolbar-actions"]. */
  toolbarActions?: string
  /** [data-part="bulk-actions"]. */
  bulkActions?: string
  /** [data-part="bulk-count"]. */
  bulkCount?: string
  /** [data-part="view-toggle"]. */
  viewToggle?: string
  /** [data-part="loading"]. */
  loading?: string
  /** [data-part="scroll"]: contenedor con overflow-x (y overflow-y si virtualized). */
  scroll?: string
  /** [data-part="table"]. */
  table?: string
  /** [data-part="caption"]. */
  caption?: string
  /** [data-part="thead"]. */
  thead?: string
  /** [data-part="th"]: cada celda de encabezado — misma clase para todas. */
  th?: string
  /** [data-part="th-button"]: botón interno del th ordenable. */
  thButton?: string
  /** [data-part="th-label"]: texto del th (con o sin botón de orden). */
  thLabel?: string
  /** [data-part="sort-icon"]. */
  sortIcon?: string
  /** [data-part="tbody"]. */
  tbody?: string
  /** [data-part="tr"]: cada fila de la tabla — misma clase para todas. */
  tr?: string
  /** [data-part="td"]: cada celda de datos — misma clase para todas. */
  td?: string
  /** [data-part="empty"]: estado vacío (tabla o cards). */
  empty?: string
  /** [data-part="select"]: el input checkbox/radio de selección (header y/o filas/cards). */
  select?: string
  /** [data-part="cards"]: contenedor de la vista de tarjetas. */
  cards?: string
  /** [data-part="card"]: cada tarjeta — misma clase para todas. */
  card?: string
  /** [data-part="card-header"]. */
  cardHeader?: string
  /** [data-part="card-heading"]. */
  cardHeading?: string
  /** [data-part="card-title"]. */
  cardTitle?: string
  /** [data-part="card-subtitle"]. */
  cardSubtitle?: string
  /** [data-part="card-actions"]. */
  cardActions?: string
  /** [data-part="card-body"]. */
  cardBody?: string
  /** [data-part="card-field"]: cada par label/valor — misma clase para todas. */
  cardField?: string
  /** [data-part="card-label"]. */
  cardLabel?: string
  /** [data-part="card-value"]. */
  cardValue?: string
  /** [data-part="sentinel"]: disparador del scroll infinito. */
  sentinel?: string
  /** [data-part="footer"]. */
  footer?: string
  /** [data-part="page-info"]. */
  pageInfo?: string
  /** [data-part="page-size"]. */
  pageSize?: string
  /** [data-part="page-size-label"]. */
  pageSizeLabel?: string
  /** [data-part="page-size-select"]. */
  pageSizeSelect?: string
  /** [data-part="pager"]. */
  pager?: string
  /** [data-part="page-btn"]: botones anterior/siguiente — misma clase para ambos. */
  pageBtn?: string
  /** [data-part="page-current"]. */
  pageCurrent?: string
}

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

  // ── personalización ──────────────────────────────────────────
  /** Clases por sub-parte (ver `DataTableClassNames`). */
  classNames?: DataTableClassNames
}
