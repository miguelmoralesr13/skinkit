import {
  forwardRef,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { formatMessage, useSkinkitMessages } from '../../i18n/context'

export interface ScheduleGridAxisItem {
  key: string
  label: ReactNode
  /** Texto secundario bajo la etiqueta (ej. un rol o un total). */
  description?: ReactNode
  /** Texto plano para el aria-label de «agregar» (si `label` no es texto). */
  text?: string
}

export interface ScheduleGridEntry {
  key: string
  label: ReactNode
  /** Estado visual vía [data-state]: default | success | warning | danger | info | muted (otros = default). */
  state?: string
  /** Texto accesible adicional del estado (el color nunca es el único canal). */
  stateLabel?: string
}

export interface ScheduleGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Filas (encabezado de fila a la izquierda). */
  rows: ScheduleGridAxisItem[]
  /** Columnas (encabezado arriba). */
  columns: ScheduleGridAxisItem[]
  /** Entradas de una celda. Devolver [] = celda vacía (accionable si hay `onCellClick`). */
  entries: (rowKey: string, columnKey: string) => ScheduleGridEntry[]
  /** Dibujo propio de una entrada (por omisión su `label`). */
  renderEntry?: (entry: ScheduleGridEntry, rowKey: string, columnKey: string) => ReactNode
  /** Clic en una celda VACÍA (agregar). Sin él las celdas vacías no son botones. */
  onCellClick?: (rowKey: string, columnKey: string) => void
  /** Clic en una entrada. Si se pasa, cada entrada es un botón. */
  onEntryClick?: (entry: ScheduleGridEntry, rowKey: string, columnKey: string) => void
  /** Nombre accesible de la cuadrícula. */
  label?: string
  /** Contenido de la esquina superior izquierda. */
  cornerLabel?: ReactNode
  /** aria-label del botón de una celda vacía. Por omisión «Agregar en {fila}, {columna}». */
  addLabel?: (row: ScheduleGridAxisItem, column: ScheduleGridAxisItem) => string
  /** Contenido visible de una celda vacía accionable (por omisión un «+» decorativo). */
  emptyCellContent?: ReactNode
}

const textOf = (i: ScheduleGridAxisItem) => i.text ?? (typeof i.label === 'string' ? i.label : i.key)

/**
 * ScheduleGrid headless — rejilla filas × columnas con varias entradas por celda (turnos por
 * persona y día, recursos por franja). Encabezados de fila y columna fijos al desplazar, scroll
 * horizontal propio, estado por entrada vía [data-state] y celdas vacías accionables.
 *
 * Teclado (patrón grid): flechas, Inicio/Fin (en la fila; con Ctrl, en la cuadrícula) mueven el
 * foco entre celdas; Enter/Espacio activan el botón de la celda. Una sola parada de Tab.
 *
 * Contrato:
 *   [data-sk="schedule-grid"]      raíz (--sk-schedule-grid-columns = nº de columnas)
 *   [data-part="scroll"]           contenedor con scroll horizontal
 *   [data-part="grid"]             role="grid"
 *   [data-part="row"]              role="row"
 *   [data-part="corner"]           esquina (role="columnheader")
 *   [data-part="column-header"]    role="columnheader"
 *   [data-part="row-header"]       role="rowheader"
 *   [data-part="cell"]             role="gridcell" · [data-empty]
 *   [data-part="entry"]            cada entrada · [data-state]
 *   [data-part="add"]              botón de celda vacía
 */
export const ScheduleGrid = forwardRef<HTMLDivElement, ScheduleGridProps>(function ScheduleGrid(
  { rows, columns, entries, renderEntry, onCellClick, onEntryClick, label, cornerLabel, addLabel, emptyCellContent, className, style, ...rest },
  ref,
) {
  const m = useSkinkitMessages()
  const [active, setActive] = useState<[number, number]>([0, 0])
  const gridRef = useRef<HTMLDivElement>(null)

  const cellAt = (r: number, c: number) =>
    gridRef.current?.querySelector<HTMLElement>(`[data-part="cell"][data-row="${r}"][data-col="${c}"]`) ?? null

  const focusCell = (r: number, c: number) => {
    const el = cellAt(r, c)
    if (!el) return
    setActive([r, c])
    const target = el.querySelector<HTMLElement>('button') ?? el
    target.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-part="cell"]')
    if (!cell) return
    const r = Number(cell.dataset.row)
    const c = Number(cell.dataset.col)
    const lastR = rows.length - 1
    const lastC = columns.length - 1
    let next: [number, number] | null = null
    switch (e.key) {
      case 'ArrowRight': next = [r, Math.min(c + 1, lastC)]; break
      case 'ArrowLeft': next = [r, Math.max(c - 1, 0)]; break
      case 'ArrowDown': next = [Math.min(r + 1, lastR), c]; break
      case 'ArrowUp': next = [Math.max(r - 1, 0), c]; break
      case 'Home': next = e.ctrlKey ? [0, 0] : [r, 0]; break
      case 'End': next = e.ctrlKey ? [lastR, lastC] : [r, lastC]; break
    }
    if (!next) return
    e.preventDefault()
    focusCell(next[0], next[1])
  }

  const rootStyle = { '--sk-schedule-grid-columns': columns.length, ...style } as CSSProperties

  return (
    <div ref={ref} data-sk="schedule-grid" className={cx('sk-schedule-grid', className)} style={rootStyle} {...rest}>
      <div data-part="scroll">
        <div
          ref={gridRef}
          role="grid"
          data-part="grid"
          aria-label={label ?? m.scheduleGrid.label}
          aria-rowcount={rows.length + 1}
          aria-colcount={columns.length + 1}
          onKeyDown={onKeyDown}
        >
          <div role="row" data-part="row" aria-rowindex={1}>
            <div role="columnheader" data-part="corner" aria-colindex={1}>
              {cornerLabel}
            </div>
            {columns.map((c, ci) => (
              <div key={c.key} role="columnheader" data-part="column-header" aria-colindex={ci + 2}>
                {c.label}
                {c.description ? <span data-part="description">{c.description}</span> : null}
              </div>
            ))}
          </div>
          {rows.map((r, ri) => (
            <div key={r.key} role="row" data-part="row" aria-rowindex={ri + 2}>
              <div role="rowheader" data-part="row-header" aria-colindex={1}>
                {r.label}
                {r.description ? <span data-part="description">{r.description}</span> : null}
              </div>
              {columns.map((c, ci) => {
                const list = entries(r.key, c.key)
                const empty = list.length === 0
                const isActive = active[0] === ri && active[1] === ci
                const actionable = empty && !!onCellClick
                return (
                  <div
                    key={c.key}
                    role="gridcell"
                    data-part="cell"
                    data-row={ri}
                    data-col={ci}
                    data-empty={empty ? '' : undefined}
                    aria-colindex={ci + 2}
                    tabIndex={isActive && !actionable && !(onEntryClick && !empty) ? 0 : -1}
                  >
                    {empty ? (
                      actionable ? (
                        <button
                          type="button"
                          data-part="add"
                          tabIndex={isActive ? 0 : -1}
                          aria-label={
                            addLabel
                              ? addLabel(r, c)
                              : formatMessage(m.scheduleGrid.addEntry, { row: textOf(r), column: textOf(c) })
                          }
                          onFocus={() => setActive([ri, ci])}
                          onClick={() => onCellClick?.(r.key, c.key)}
                        >
                          <span aria-hidden="true">{emptyCellContent ?? '+'}</span>
                        </button>
                      ) : null
                    ) : (
                      list.map((en, ei) => {
                        const content = renderEntry ? renderEntry(en, r.key, c.key) : en.label
                        const common = {
                          'data-part': 'entry',
                          'data-state': en.state ?? 'default',
                        } as const
                        const extra = en.stateLabel ? <span data-sk="visually-hidden">{en.stateLabel}</span> : null
                        return onEntryClick ? (
                          <button
                            key={en.key}
                            type="button"
                            {...common}
                            tabIndex={isActive && ei === 0 ? 0 : -1}
                            onFocus={() => setActive([ri, ci])}
                            onClick={() => onEntryClick(en, r.key, c.key)}
                          >
                            {content}
                            {extra}
                          </button>
                        ) : (
                          <div key={en.key} {...common}>
                            {content}
                            {extra}
                          </div>
                        )
                      })
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
