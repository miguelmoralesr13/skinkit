import { useEffect, useRef, type CSSProperties } from 'react'
import { cx } from '../../lib/cx'
import type { ColumnDef, DataTableProps } from './types'
import { useDataTable } from './useDataTable'

/** Checkbox/radio de selección: setea `indeterminate` por ref y frena la propagación del click. */
function SelectionControl({
  mode,
  checked,
  indeterminate,
  onToggle,
  label,
  className,
}: {
  mode: 'single' | 'multiple'
  checked: boolean
  indeterminate?: boolean
  onToggle: () => void
  label: string
  className?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate
  }, [indeterminate])
  return (
    <input
      ref={ref}
      type={mode === 'single' ? 'radio' : 'checkbox'}
      data-part="select"
      className={className}
      checked={checked}
      onChange={onToggle}
      onClick={(e) => e.stopPropagation()}
      aria-label={label}
    />
  )
}

/**
 * DataTable headless — tabla de datos config-driven (columnas + props JSON). Estructura + contrato;
 * la forma la da el CSS del componente. Ejes independientes cliente/servidor:
 *   - orden: server si pasás onSortChange, si no cliente
 *   - filtro: server si pasás onFilterChange, si no cliente
 *   - paginado: 'client' | 'server' | 'infinite' | 'none'
 * Vistas: 'table' | 'cards' | 'auto' (cards bajo cardBreakpoint). Selección single/multiple,
 * acciones por fila y masivas, sticky header, densidad, estados loading/empty.
 *
 * Contrato (parts principales): toolbar/search/view-toggle, scroll/table/thead/th/tbody/tr/td,
 * cards/card/card-*, footer/pager/page-*, sentinel, empty, select.
 */
export function DataTable<T extends object>(props: DataTableProps<T>) {
  const model = useDataTable(props)
  const {
    // se desestructuran para NO derramar al DOM en ...rest
    data: _data,
    columns: _columns,
    rowKey,
    selection: _selection,
    selectedKeys: _selectedKeys,
    defaultSelectedKeys: _dsk,
    onSelectionChange: _osc,
    rowActions,
    bulkActions,
    sort: _sort,
    defaultSort: _dsort,
    onSortChange: _oscn,
    filterable = false,
    filterValue: _fv,
    defaultFilterValue: _dfv,
    onFilterChange: _ofc,
    filterPlaceholder = 'Buscar…',
    pagination: _pg,
    page: _page,
    defaultPage: _dp,
    pageSize: _ps,
    defaultPageSize: _dps,
    pageSizeOptions: _pso,
    total: _total,
    onPageChange: _opc,
    onPageSizeChange: _opsc,
    hasMore: _hm,
    loadingMore,
    onLoadMore: _olm,
    view: _view,
    cardBreakpoint: _cb,
    allowViewToggle = false,
    density = 'comfortable',
    stickyHeader = false,
    loading = false,
    emptyContent = 'Sin resultados',
    caption,
    virtualized: _virtualized,
    rowHeight,
    height,
    className,
    classNames,
    ...rest
  } = props

  const {
    rootRef,
    scrollRef,
    sentinelRef,
    isVirtualized,
    virtualRows,
    virtualTotalHeight,
    effectiveView,
    toggleView,
    visibleColumns,
    rows,
    renderCell,
    filterValue,
    setFilter,
    sortState,
    toggleSort,
    selectionMode,
    selectedRows,
    selectedKeys,
    isSelected,
    toggleRow,
    toggleAll,
    allSelected,
    someSelected,
    paginationMode,
    page,
    pageSize,
    pageSizeOptions,
    pageCount,
    totalRows,
    rangeStart,
    rangeEnd,
    setPage,
    setPageSize,
  } = model

  const hasSelection = selectionMode !== 'none'
  const colSpan = visibleColumns.length + (hasSelection ? 1 : 0) + (rowActions ? 1 : 0)
  const showToolbar = filterable || allowViewToggle || (!!bulkActions && selectedRows.length > 0)
  const showFooter = paginationMode === 'client' || paginationMode === 'server'

  // celda de encabezado
  const renderTh = (col: ColumnDef<T>) => {
    const sorted = sortState?.key === col.key ? sortState.dir : undefined
    return (
      <th
        key={col.key}
        data-part="th"
        data-sortable={col.sortable || undefined}
        data-sort={sorted}
        data-align={col.align}
        style={{ width: col.width }}
        aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : undefined}
        className={cx('sk-datatable__th', classNames?.th)}
      >
        {col.sortable ? (
          <button
            type="button"
            data-part="th-button"
            onClick={() => toggleSort(col.key)}
            className={cx('sk-datatable__th-button', classNames?.thButton)}
          >
            <span data-part="th-label" className={cx('sk-datatable__th-label', classNames?.thLabel)}>
              {col.header}
            </span>
            <span data-part="sort-icon" aria-hidden="true" className={cx('sk-datatable__sort-icon', classNames?.sortIcon)} />
          </button>
        ) : (
          <span data-part="th-label" className={cx('sk-datatable__th-label', classNames?.thLabel)}>
            {col.header}
          </span>
        )}
      </th>
    )
  }

  const renderRow = (row: T, style?: CSSProperties) => {
    const key = rowKey(row)
    const sel = isSelected(key)
    return (
      <tr
        key={String(key)}
        data-part="tr"
        data-selected={sel || undefined}
        style={style}
        className={cx('sk-datatable__tr', classNames?.tr)}
      >
        {hasSelection && (
          <td data-part="td" data-cell="select" className={cx('sk-datatable__td', classNames?.td)}>
            <SelectionControl
              mode={selectionMode === 'single' ? 'single' : 'multiple'}
              checked={sel}
              onToggle={() => toggleRow(row)}
              label="Seleccionar fila"
              className={cx('sk-datatable__select', classNames?.select)}
            />
          </td>
        )}
        {visibleColumns.map((col) => (
          <td
            key={col.key}
            data-part="td"
            data-align={col.align}
            style={{ width: col.width }}
            className={cx('sk-datatable__td', classNames?.td)}
          >
            {renderCell(col, row)}
          </td>
        ))}
        {rowActions && (
          <td
            data-part="td"
            data-cell="actions"
            data-align="end"
            className={cx('sk-datatable__td', classNames?.td)}
          >
            {rowActions(row)}
          </td>
        )}
      </tr>
    )
  }

  const lastVirtualRow = virtualRows[virtualRows.length - 1]
  const bottomSpacerHeight = lastVirtualRow
    ? virtualTotalHeight - lastVirtualRow.start - (rowHeight ?? 0)
    : virtualTotalHeight

  const tableView = (
    <div
      ref={scrollRef}
      data-part="scroll"
      data-virtualized={isVirtualized || undefined}
      style={isVirtualized ? { height, overflowY: 'auto' } : undefined}
      className={cx('sk-datatable__scroll', classNames?.scroll)}
    >
      <table data-part="table" className={cx('sk-datatable__table', classNames?.table)}>
        {caption && (
          <caption data-part="caption" className={cx('sk-datatable__caption', classNames?.caption)}>
            {caption}
          </caption>
        )}
        <thead data-part="thead" className={cx('sk-datatable__thead', classNames?.thead)}>
          <tr>
            {hasSelection && (
              <th data-part="th" data-cell="select" className={cx('sk-datatable__th', classNames?.th)}>
                {selectionMode === 'multiple' && (
                  <SelectionControl
                    mode="multiple"
                    checked={allSelected}
                    indeterminate={someSelected}
                    onToggle={toggleAll}
                    label="Seleccionar todo"
                    className={cx('sk-datatable__select', classNames?.select)}
                  />
                )}
              </th>
            )}
            {visibleColumns.map(renderTh)}
            {rowActions && (
              <th
                data-part="th"
                data-cell="actions"
                data-align="end"
                className={cx('sk-datatable__th', classNames?.th)}
              >
                <span data-part="th-label" className={cx('sk-datatable__th-label', classNames?.thLabel)}>
                  Acciones
                </span>
              </th>
            )}
          </tr>
        </thead>
        <tbody data-part="tbody" className={cx('sk-datatable__tbody', classNames?.tbody)}>
          {rows.length === 0 && !loading ? (
            <tr>
              <td data-part="td" colSpan={colSpan} className={cx('sk-datatable__td', classNames?.td)}>
                <div data-part="empty" className={cx('sk-datatable__empty', classNames?.empty)}>
                  {emptyContent}
                </div>
              </td>
            </tr>
          ) : isVirtualized ? (
            <>
              {virtualRows[0] && virtualRows[0].start > 0 && (
                <tr aria-hidden="true">
                  <td colSpan={colSpan} style={{ height: virtualRows[0].start, padding: 0, border: 0 }} />
                </tr>
              )}
              {virtualRows.map(({ index }) => renderRow(rows[index], { height: rowHeight }))}
              {bottomSpacerHeight > 0 && (
                <tr aria-hidden="true">
                  <td colSpan={colSpan} style={{ height: bottomSpacerHeight, padding: 0, border: 0 }} />
                </tr>
              )}
            </>
          ) : (
            rows.map((row) => renderRow(row))
          )}
        </tbody>
      </table>
    </div>
  )

  // ── cards ────────────────────────────────────────────────
  const titleCol =
    visibleColumns.find((c) => c.cardRole === 'title') ??
    visibleColumns.find((c) => c.cardRole !== 'hidden')
  const subtitleCol = visibleColumns.find((c) => c.cardRole === 'subtitle')
  const fieldCols = visibleColumns.filter(
    (c) => c.cardRole !== 'hidden' && c !== titleCol && c !== subtitleCol,
  )

  const cardsView = (
    <div data-part="cards" className={cx('sk-datatable__cards', classNames?.cards)}>
      {rows.length === 0 && !loading ? (
        <div data-part="empty" className={cx('sk-datatable__empty', classNames?.empty)}>
          {emptyContent}
        </div>
      ) : (
        rows.map((row) => {
          const key = rowKey(row)
          const sel = isSelected(key)
          return (
            <div
              key={String(key)}
              data-part="card"
              data-selected={sel || undefined}
              className={cx('sk-datatable__card', classNames?.card)}
            >
              <div data-part="card-header" className={cx('sk-datatable__card-header', classNames?.cardHeader)}>
                {hasSelection && (
                  <SelectionControl
                    mode={selectionMode === 'single' ? 'single' : 'multiple'}
                    checked={sel}
                    onToggle={() => toggleRow(row)}
                    label="Seleccionar tarjeta"
                    className={cx('sk-datatable__select', classNames?.select)}
                  />
                )}
                <div data-part="card-heading" className={cx('sk-datatable__card-heading', classNames?.cardHeading)}>
                  {titleCol && (
                    <div data-part="card-title" className={cx('sk-datatable__card-title', classNames?.cardTitle)}>
                      {renderCell(titleCol, row)}
                    </div>
                  )}
                  {subtitleCol && (
                    <div
                      data-part="card-subtitle"
                      className={cx('sk-datatable__card-subtitle', classNames?.cardSubtitle)}
                    >
                      {renderCell(subtitleCol, row)}
                    </div>
                  )}
                </div>
                {rowActions && (
                  <div data-part="card-actions" className={cx('sk-datatable__card-actions', classNames?.cardActions)}>
                    {rowActions(row)}
                  </div>
                )}
              </div>
              {fieldCols.length > 0 && (
                <div data-part="card-body" className={cx('sk-datatable__card-body', classNames?.cardBody)}>
                  {fieldCols.map((col) => (
                    <div key={col.key} data-part="card-field" className={cx('sk-datatable__card-field', classNames?.cardField)}>
                      <span data-part="card-label" className={cx('sk-datatable__card-label', classNames?.cardLabel)}>
                        {col.header}
                      </span>
                      <span data-part="card-value" className={cx('sk-datatable__card-value', classNames?.cardValue)}>
                        {renderCell(col, row)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )

  return (
    <div
      ref={rootRef}
      data-sk="datatable"
      data-view={effectiveView}
      data-density={density}
      data-loading={loading || undefined}
      data-sticky-header={stickyHeader || undefined}
      className={cx('sk-datatable', className)}
      {...rest}
    >
      {showToolbar && (
        <div data-part="toolbar" className={cx('sk-datatable__toolbar', classNames?.toolbar)}>
          {filterable && (
            <input
              data-part="search"
              type="search"
              value={filterValue}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={filterPlaceholder}
              aria-label="Buscar en la tabla"
              className={cx('sk-datatable__search', classNames?.search)}
            />
          )}
          <div data-part="toolbar-actions" className={cx('sk-datatable__toolbar-actions', classNames?.toolbarActions)}>
            {bulkActions && selectedRows.length > 0 && (
              <div data-part="bulk-actions" className={cx('sk-datatable__bulk-actions', classNames?.bulkActions)}>
                <span data-part="bulk-count" className={cx('sk-datatable__bulk-count', classNames?.bulkCount)}>
                  {selectedRows.length} sel.
                </span>
                {bulkActions(selectedRows, selectedKeys)}
              </div>
            )}
            {allowViewToggle && (
              <button
                type="button"
                data-part="view-toggle"
                onClick={toggleView}
                aria-label={effectiveView === 'table' ? 'Ver como tarjetas' : 'Ver como tabla'}
                className={cx('sk-datatable__view-toggle', classNames?.viewToggle)}
              >
                {effectiveView === 'table' ? 'Tarjetas' : 'Tabla'}
              </button>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div data-part="loading" role="status" className={cx('sk-datatable__loading', classNames?.loading)}>
          Cargando…
        </div>
      )}

      {effectiveView === 'table' ? tableView : cardsView}

      {paginationMode === 'infinite' && (
        <div
          ref={sentinelRef}
          data-part="sentinel"
          className={cx('sk-datatable__sentinel', classNames?.sentinel)}
        >
          {loadingMore ? 'Cargando más…' : null}
        </div>
      )}

      {showFooter && (
        <div data-part="footer" className={cx('sk-datatable__footer', classNames?.footer)}>
          <div data-part="page-info" className={cx('sk-datatable__page-info', classNames?.pageInfo)}>
            {rangeStart}–{rangeEnd} de {totalRows}
          </div>
          <div data-part="page-size" className={cx('sk-datatable__page-size', classNames?.pageSize)}>
            <label data-part="page-size-label" className={cx('sk-datatable__page-size-label', classNames?.pageSizeLabel)}>
              Filas
            </label>
            <select
              data-part="page-size-select"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              aria-label="Filas por página"
              className={cx('sk-datatable__page-size-select', classNames?.pageSizeSelect)}
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div data-part="pager" className={cx('sk-datatable__pager', classNames?.pager)}>
            <button
              type="button"
              data-part="page-btn"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              aria-label="Página anterior"
              className={cx('sk-datatable__page-btn', classNames?.pageBtn)}
            >
              ‹
            </button>
            <span data-part="page-current" className={cx('sk-datatable__page-current', classNames?.pageCurrent)}>
              {page} / {pageCount}
            </span>
            <button
              type="button"
              data-part="page-btn"
              onClick={() => setPage(page + 1)}
              disabled={page >= pageCount}
              aria-label="Página siguiente"
              className={cx('sk-datatable__page-btn', classNames?.pageBtn)}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
