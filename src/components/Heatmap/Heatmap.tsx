import { forwardRef, type CSSProperties, type ReactNode, type TableHTMLAttributes } from 'react'
import { cx } from '../../lib/cx'
import { useSkinkitMessages } from '../../i18n/context'

export interface HeatmapAxisItem {
  key: string
  label: ReactNode
}

export interface HeatmapProps extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
  rows: HeatmapAxisItem[]
  columns: HeatmapAxisItem[]
  /** Matriz values[fila][columna]. `null`/`undefined` = «aún no aplica» (distinto de 0). */
  values: Array<Array<number | null | undefined>>
  /** Valor que corresponde a la intensidad mínima. Por omisión el menor valor de la matriz (o 0 si todos son >= 0). */
  min?: number
  /** Valor de intensidad máxima. Por omisión el mayor de la matriz. */
  max?: number
  /** Cómo se escribe cada número. Por omisión `String(value)`. */
  formatValue?: (value: number, rowKey: string, columnKey: string) => string
  /** Título de la tabla (caption visible solo para lectores de pantalla). */
  label?: string
  /** Texto de la celda de la esquina (encabezado de la columna de filas). */
  cornerLabel?: ReactNode
  /** Texto de una celda sin dato. Por omisión «Aún no aplica» (según locale). */
  notApplicableLabel?: string
}

/** Nivel discreto de intensidad 0–4 (refuerzo para CSS/pruebas; el color real es continuo). */
export function heatLevel(ratio: number): 0 | 1 | 2 | 3 | 4 {
  if (!(ratio > 0)) return 0
  return Math.min(4, Math.max(1, Math.ceil(ratio * 4))) as 1 | 2 | 3 | 4
}

/**
 * Heatmap headless — matriz fila × columna donde la intensidad de cada celda refuerza el número
 * (cohortes, actividad por hora/día). Es una <table> real: el número SIEMPRE está escrito y el
 * color es solo refuerzo. Una celda sin dato («aún no aplica») se distingue de un 0.
 *
 * Contrato:
 *   [data-sk="heatmap"]            la <table>
 *   [data-part="caption"]          título (oculto visualmente)
 *   [data-part="corner"]           esquina de encabezados
 *   [data-part="column-header"]    <th scope=col>
 *   [data-part="row-header"]       <th scope=row>
 *   [data-part="cell"]             <td> · [data-state=value|zero|empty] · [data-level=0-4] · --sk-heatmap-intensity 0–1
 */
export const Heatmap = forwardRef<HTMLTableElement, HeatmapProps>(function Heatmap(
  { rows, columns, values, min, max, formatValue, label, cornerLabel, notApplicableLabel, className, ...rest },
  ref,
) {
  const m = useSkinkitMessages()
  const na = notApplicableLabel ?? m.heatmap.notApplicable
  const nums: number[] = []
  for (const r of values) for (const v of r) if (typeof v === 'number' && Number.isFinite(v)) nums.push(v)
  const lo = min ?? (nums.length && Math.min(...nums) < 0 ? Math.min(...nums) : 0)
  const hi = max ?? (nums.length ? Math.max(...nums) : 0)
  const span = hi - lo

  return (
    <table ref={ref} data-sk="heatmap" className={cx('sk-heatmap', className)} {...rest}>
      {label ? <caption data-part="caption">{label}</caption> : null}
      <thead>
        <tr>
          <td data-part="corner">{cornerLabel}</td>
          {columns.map((c) => (
            <th key={c.key} scope="col" data-part="column-header">
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={r.key}>
            <th scope="row" data-part="row-header">
              {r.label}
            </th>
            {columns.map((c, ci) => {
              const v = values[ri]?.[ci]
              if (typeof v !== 'number' || !Number.isFinite(v)) {
                return (
                  <td key={c.key} data-part="cell" data-state="empty" title={na}>
                    <span aria-hidden="true">–</span>
                    <span data-sk="visually-hidden">{na}</span>
                  </td>
                )
              }
              const ratio = span > 0 ? Math.min(1, Math.max(0, (v - lo) / span)) : v > 0 ? 1 : 0
              return (
                <td
                  key={c.key}
                  data-part="cell"
                  data-state={v === 0 ? 'zero' : 'value'}
                  data-level={heatLevel(ratio)}
                  style={{ '--sk-heatmap-intensity': ratio } as CSSProperties}
                >
                  {formatValue ? formatValue(v, r.key, c.key) : String(v)}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
})
