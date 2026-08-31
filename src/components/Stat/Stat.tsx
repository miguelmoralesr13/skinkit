import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type StatTrend = 'up' | 'down' | 'neutral'

export interface StatClassNames {
  icon?: string
  content?: string
  label?: string
  value?: string
  delta?: string
}

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode
  value: ReactNode
  /** Variación (ej. "+12%"). Se colorea según `trend`. */
  delta?: ReactNode
  trend?: StatTrend
  /** Ícono opcional a la izquierda. */
  icon?: ReactNode
  /** Clases para personalizar cada sub-parte. */
  classNames?: StatClassNames
}

/**
 * Stat headless — muestra una métrica: etiqueta, valor grande y variación opcional. La
 * forma y el color de la variación (según [data-trend]) los da el CSS.
 *
 * Contrato:
 *   [data-sk="stat"]        raíz
 *   [data-part="icon"]      ícono (opcional)
 *   [data-part="content"]   contenedor de label/value/delta
 *   [data-part="label"]     etiqueta
 *   [data-part="value"]     el número/valor grande
 *   [data-part="delta"]     [data-trend up|down|neutral]  variación
 *
 * `classNames` permite personalizar cada sub-parte (icon/content/label/value/delta).
 */
export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, delta, trend = 'neutral', icon, className, classNames, ...rest },
  ref,
) {
  return (
    <div ref={ref} data-sk="stat" className={cx('sk-stat', className)} {...rest}>
      {icon ? (
        <span data-part="icon" aria-hidden="true" className={cx('sk-stat__icon', classNames?.icon)}>
          {icon}
        </span>
      ) : null}
      <div data-part="content" className={cx('sk-stat__content', classNames?.content)}>
        <div data-part="label" className={cx('sk-stat__label', classNames?.label)}>{label}</div>
        <div data-part="value" className={cx('sk-stat__value', classNames?.value)}>{value}</div>
        {delta != null ? (
          <div data-part="delta" data-trend={trend} className={cx('sk-stat__delta', classNames?.delta)}>
            {delta}
          </div>
        ) : null}
      </div>
    </div>
  )
})
