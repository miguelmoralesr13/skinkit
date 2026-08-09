import { useEffect, useRef } from 'react'
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
}: {
  mode: 'single' | 'multiple'
  checked: boolean
  indeterminate?: boolean
  onToggle: () => void
  label: string
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
      checked={checked}
      onChange={onToggle}
      onClick={(e) => e.stopPropagation()}
      aria-label={label}
    />
  )
}

/**
 * DataTable headless — tabla de datos config-driven (columnas + props JSON). Estructura + contrato;
 * la forma la dan los skins. Ejes independientes cliente/servidor:
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
    className,
    ...rest
  } = props

  const {
    rootRef,
    sentinelRef,
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
      >
        {col.sortable ? (
          <button type="button" data-part="th-button" onClick={() => toggleSort(col.key)}>
            <span data-part="th-label">{col.header}</span>
            <span data-part="sort-icon" aria-hidden="true" />
          </button>
        ) : (
          <span data-part="th-label">{col.header}</span>
        )}
      </th>
    )
  }

  const tableView = (
    <div data-part="scroll">
      <table data-part="table">
        {caption && <caption data-part="caption">{caption}</caption>}
        <thead data-part="thead">
          <tr>
            {hasSelection && (
              <th data-part="th" data-cell="select">
                {selectionMode === 'multiple' && (
                  <SelectionControl
                    mode="multiple"
                    checked={allSelected}
                    indeterminate={someSelected}
                    onToggle={toggleAll}
                    label="Seleccionar todo"
                  />
                )}
              </th>
            )}
            {visibleColumns.map(renderTh)}
            {rowActions && (
              <th data-part="th" data-cell="actions" data-align="end">
                <span data-part="th-label">Acciones</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody data-part="tbody">
          {rows.length === 0 && !loading ? (
            <tr>
              <td data-part="td" colSpan={colSpan}>
                <div data-part="empty">{emptyContent}</div>
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const key = rowKey(row)
              const sel = isSelected(key)
              return (
                <tr key={String(key)} data-part="tr" data-selected={sel || undefined}>
                  {hasSelection && (
                    <td data-part="td" data-cell="select">
                      <SelectionControl
                        mode={selectionMode === 'single' ? 'single' : 'multiple'}
                        checked={sel}
                        onToggle={() => toggleRow(row)}
                        label="Seleccionar fila"
                      />
                    </td>
                  )}
                  {visibleColumns.map((col) => (
                    <td key={col.key} data-part="td" data-align={col.align} style={{ width: col.width }}>
                      {renderCell(col, row)}
                    </td>
                  ))}
                  {rowActions && (
                    <td data-part="td" data-cell="actions" data-align="end">
                      {rowActions(row)}
                    </td>
                  )}
                </tr>
              )
            })
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
    <div data-part="cards">
      {rows.length === 0 && !loading ? (
        <div data-part="empty">{emptyContent}</div>
      ) : (
        rows.map((row) => {
          const key = rowKey(row)
          const sel = isSelected(key)
          return (
            <div key={String(key)} data-part="card" data-selected={sel || undefined}>
              <div data-part="card-header">
                {hasSelection && (
                  <SelectionControl
                    mode={selectionMode === 'single' ? 'single' : 'multiple'}
                    checked={sel}
                    onToggle={() => toggleRow(row)}
                    label="Seleccionar tarjeta"
                  />
                )}
                <div data-part="card-heading">
                  {titleCol && <div data-part="card-title">{renderCell(titleCol, row)}</div>}
                  {subtitleCol && (
                    <div data-part="card-subtitle">{renderCell(subtitleCol, row)}</div>
                  )}
                </div>
                {rowActions && <div data-part="card-actions">{rowActions(row)}</div>}
              </div>
              {fieldCols.length > 0 && (
                <div data-part="card-body">
                  {fieldCols.map((col) => (
                    <div key={col.key} data-part="card-field">
                      <span data-part="card-label">{col.header}</span>
                      <span data-part="card-value">{renderCell(col, row)}</span>
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
        <div data-part="toolbar">
          {filterable && (
            <input
              data-part="search"
              type="search"
              value={filterValue}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={filterPlaceholder}
              aria-label="Buscar en la tabla"
            />
          )}
          <div data-part="toolbar-actions">
            {bulkActions && selectedRows.length > 0 && (
              <div data-part="bulk-actions">
                <span data-part="bulk-count">{selectedRows.length} sel.</span>
                {bulkActions(selectedRows, selectedKeys)}
              </div>
            )}
            {allowViewToggle && (
              <button
                type="button"
                data-part="view-toggle"
                onClick={toggleView}
                aria-label={effectiveView === 'table' ? 'Ver como tarjetas' : 'Ver como tabla'}
              >
                {effectiveView === 'table' ? 'Tarjetas' : 'Tabla'}
              </button>
            )}
          </div>
        </div>
      )}

      {loading && <div data-part="loading" role="status">Cargando…</div>}

      {effectiveView === 'table' ? tableView : cardsView}

      {paginationMode === 'infinite' && (
        <div ref={sentinelRef} data-part="sentinel">
          {loadingMore ? 'Cargando más…' : null}
        </div>
      )}

      {showFooter && (
        <div data-part="footer">
          <div data-part="page-info">
            {rangeStart}–{rangeEnd} de {totalRows}
          </div>
          <div data-part="page-size">
            <label data-part="page-size-label">Filas</label>
            <select
              data-part="page-size-select"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              aria-label="Filas por página"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div data-part="pager">
            <button
              type="button"
              data-part="page-btn"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              aria-label="Página anterior"
            >
              ‹
            </button>
            <span data-part="page-current">
              {page} / {pageCount}
            </span>
            <button
              type="button"
              data-part="page-btn"
              onClick={() => setPage(page + 1)}
              disabled={page >= pageCount}
              aria-label="Página siguiente"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
