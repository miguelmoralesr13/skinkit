import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type StatTrend = 'up' | 'down' | 'neutral'

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode
  value: ReactNode
  /** Variación (ej. "+12%"). Se colorea según `trend`. */
  delta?: ReactNode
  trend?: StatTrend
  /** Ícono opcional a la izquierda. */
  icon?: ReactNode
}

/**
 * Stat headless — muestra una métrica: etiqueta, valor grande y variación opcional. La
 * forma y el color de la variación (según [data-trend]) los da el CSS.
 *
 * Contrato:
 *   [data-sk="stat"]        raíz
 *   [data-part="icon"]      ícono (opcional)
 *   [data-part="label"]     etiqueta
 *   [data-part="value"]     el número/valor grande
 *   [data-part="delta"]     [data-trend up|down|neutral]  variación
 */
export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, delta, trend = 'neutral', icon, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} data-sk="stat" className={cx('sk-stat', className)} {...rest}>
      {icon ? (
        <span data-part="icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div data-part="content">
        <div data-part="label">{label}</div>
        <div data-part="value">{value}</div>
        {delta != null ? (
          <div data-part="delta" data-trend={trend}>
            {delta}
          </div>
        ) : null}
      </div>
    </div>
  )
})
