import { Fragment, type HTMLAttributes, type LiHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { useList } from './useList'
import { useSkinkitMessages } from '../../i18n/context'

export type ListTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface ListProps<T = unknown> extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Color del ítem activo (del theme). 'primary' (default) no emite data-tone. */
  tone?: ListTone
  /** Modo estático (sin `items`): List.Item's directamente, como children de siempre. */
  children?: ReactNode

  // ── Modo data-driven — pasar `items` activa búsqueda/scroll infinito/virtualización ──
  /** Si se pasa, List entra en modo data-driven: renderiza `items` vía `renderItem` en vez de
   * `children`. Sin esto, todo lo demás en esta sección no hace nada. */
  items?: T[]
  /** Obligatorio junto con `items` — típicamente devuelve un <List.Item>. */
  renderItem?: (item: T, index: number) => ReactNode
  /** Key de cada fila. Default: índice (ok salvo que reordenes items estando `virtualized`). */
  rowKey?: (item: T, index: number) => string | number

  /** Muestra el input de búsqueda. */
  filterable?: boolean
  filterValue?: string
  defaultFilterValue?: string
  /** Si se pasa, la búsqueda es server-driven: List NO filtra — sólo avisa el query, vos le
   * pasás `items` ya filtrado en el próximo render. Sin esto, filtra con `filterItem`. */
  onFilterChange?: (value: string) => void
  filterPlaceholder?: string
  /** Predicado de filtro CLIENTE. Sin esto (y sin onFilterChange), `filterable` muestra el input
   * pero no filtra nada — List no tiene columnas tipadas de las que inferir qué buscar. */
  filterItem?: (item: T, query: string) => boolean

  /** Activa el scroll infinito (sentinel + IntersectionObserver, ver useInfiniteScroll). */
  infinite?: boolean
  hasMore?: boolean
  loadingMore?: boolean
  onLoadMore?: () => void

  /** Ventaneo de filas — mismo mecanismo que DataTable (useVirtualizer), sólo en modo data-driven. */
  virtualized?: boolean
  rowHeight?: number
  /** Alto del contenedor con scroll — requerido junto con `virtualized`. */
  height?: number

  loading?: boolean
  emptyContent?: ReactNode
}

/**
 * List headless, compuesto: <List> · <List.Item>. Dos modos:
 *   - Estático (default): children son List.Item's directos — navegación, resultados chicos.
 *   - Data-driven (pasando `items` + `renderItem`): List maneja búsqueda (cliente o server),
 *     scroll infinito y virtualización por vos — pensado para listas grandes/buscables.
 * La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="list"]           raíz. <ul> en modo estático; <div> en modo data-driven (necesita
 *                                lugar para el toolbar de búsqueda, que no puede ir dentro de un <ul>).
 *   [data-part="toolbar"]      sólo modo data-driven + filterable. [data-part="search"] adentro.
 *   [data-part="items"]        <ul> real en modo data-driven (scrolleable si virtualized).
 *   [data-part="item"]         cada fila (<li>) · [data-active] [data-interactive]
 *   [data-part="icon"|"title"|"description"|"meta"|"actions"]   adentro de item
 *   [data-part="sentinel"]     sólo si `infinite` — dispara onLoadMore al entrar en viewport
 *   [data-part="loading"|"empty"]
 */
export function List<T = unknown>(props: ListProps<T>) {
  const m = useSkinkitMessages()
  const {
    tone = 'primary',
    className,
    children,
    items,
    renderItem,
    rowKey,
    filterable = false,
    filterPlaceholder = m.list.filterPlaceholder,
    infinite = false,
    loadingMore,
    virtualized: _virtualized,
    rowHeight,
    height,
    loading = false,
    emptyContent = m.list.empty,
    // el resto se desestructura para no derramar props internas al DOM
    filterValue: _fv,
    defaultFilterValue: _dfv,
    onFilterChange: _ofc,
    filterItem: _fi,
    hasMore: _hm,
    onLoadMore: _olm,
    ...rest
  } = props

  // Siempre se llama (regla de hooks) — en modo estático se ignora el resultado.
  const model = useList(props)

  const dataMode = items !== undefined
  const dataTone = tone === 'primary' ? undefined : tone

  if (!dataMode) {
    return (
      <ul data-sk="list" role="list" data-tone={dataTone} className={cx('sk-list', className)} {...rest}>
        {children}
      </ul>
    )
  }

  const { scrollRef, sentinelRef, isVirtualized, virtualRows, virtualTotalHeight, processedItems, filterValue, setFilter } =
    model
  const lastVirtualRow = virtualRows[virtualRows.length - 1]
  const bottomSpacerHeight = lastVirtualRow
    ? virtualTotalHeight - lastVirtualRow.start - (rowHeight ?? 0)
    : virtualTotalHeight

  const row = (item: T, index: number) => (
    <Fragment key={rowKey ? rowKey(item, index) : index}>{renderItem!(item, index)}</Fragment>
  )

  return (
    <div data-sk="list" data-tone={dataTone} className={cx('sk-list', className)} {...rest}>
      {filterable && (
        <div data-part="toolbar">
          <input
            data-part="search"
            type="search"
            value={filterValue}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={filterPlaceholder}
            aria-label={m.list.search}
          />
        </div>
      )}

      {loading && (
        <div data-part="loading" role="status">
          Cargando…
        </div>
      )}

      <ul
        data-part="items"
        role="list"
        ref={scrollRef}
        data-virtualized={isVirtualized || undefined}
        style={isVirtualized ? { height, overflowY: 'auto' } : undefined}
      >
        {processedItems.length === 0 && !loading ? (
          <li data-part="empty">{emptyContent}</li>
        ) : isVirtualized ? (
          <>
            {virtualRows[0] && virtualRows[0].start > 0 && (
              <li aria-hidden="true" style={{ height: virtualRows[0].start, padding: 0 }} />
            )}
            {virtualRows.map(({ index }) => row(processedItems[index], index))}
            {bottomSpacerHeight > 0 && <li aria-hidden="true" style={{ height: bottomSpacerHeight, padding: 0 }} />}
          </>
        ) : (
          processedItems.map((item, i) => row(item, i))
        )}
      </ul>

      {infinite && (
        <div ref={sentinelRef} data-part="sentinel">
          {loadingMore ? 'Cargando más…' : null}
        </div>
      )}
    </div>
  )
}

export interface ListItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title'> {
  icon?: ReactNode
  title?: ReactNode
  description?: ReactNode
  /** Texto o acción única a la derecha. Para VARIAS acciones (ej. editar + borrar), usá `actions`. */
  meta?: ReactNode
  /** Fila de acciones (ej. botones ícono). Se renderiza después de `meta`. */
  actions?: ReactNode
  active?: boolean
  /** Si se pasa, la fila es clickeable (foco + Enter). */
  onSelect?: () => void
}

function ListItem({
  icon,
  title,
  description,
  meta,
  actions,
  active,
  onSelect,
  className,
  children,
  ...rest
}: ListItemProps) {
  const interactive = onSelect != null
  return (
    <li
      data-part="item"
      data-active={active ? '' : undefined}
      data-interactive={interactive ? '' : undefined}
      className={cx('sk-list__item', className)}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      aria-current={active ? 'true' : undefined}
      onClick={interactive ? () => onSelect!() : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect!()
              }
            }
          : undefined
      }
      {...rest}
    >
      {icon != null ? (
        <span data-part="icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div data-part="content">
        {title != null ? <div data-part="title">{title}</div> : null}
        {description != null ? <div data-part="description">{description}</div> : null}
        {children}
      </div>
      {meta != null ? <div data-part="meta">{meta}</div> : null}
      {actions != null ? <div data-part="actions">{actions}</div> : null}
    </li>
  )
}

List.Item = ListItem
