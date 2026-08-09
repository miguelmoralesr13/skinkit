import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type MeterTone =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface MeterProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  min?: number
  max?: number
  /** Debajo de `low` → tono danger automático (si no pasás `tone`). */
  low?: number
  /** Color explícito; si se omite, se deriva de low/high. */
  tone?: MeterTone
  label?: ReactNode
  /** Muestra el valor a la derecha del label. */
  showValue?: boolean
}

/**
 * Meter headless — mide un valor dentro de un rango (uso de disco, batería, score). A
 * diferencia de Progress (avance de una tarea), es una MEDICIÓN estática. role="meter".
 * El relleno usa --sk-meter (0–1); la forma la da el skin.
 *
 * Contrato:
 *   [data-sk="meter"]       raíz · [data-tone]
 *   [data-part="header"]    label + valor (opcional)
 *   [data-part="label"]     etiqueta
 *   [data-part="value"]     valor mostrado
 *   [data-part="track"]     riel
 *   [data-part="indicator"] relleno (ancho por --sk-meter)
 */
export const Meter = forwardRef<HTMLDivElement, MeterProps>(function Meter(
  { value, min = 0, max = 100, low, tone, label, showValue, className, style, ...rest },
  ref,
) {
  const clamped = Math.min(Math.max(value, min), max)
  const ratio = max === min ? 0 : (clamped - min) / (max - min)
  const resolvedTone: MeterTone = tone ?? (low != null && value < low ? 'danger' : 'primary')

  return (
    <div
      ref={ref}
      data-sk="meter"
      data-tone={resolvedTone}
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={min}
      aria-valuemax={max}
      className={cx('sk-meter', className)}
      style={{ ['--sk-meter' as string]: String(ratio), ...(style as CSSProperties) }}
      {...rest}
    >
      {label != null || showValue ? (
        <div data-part="header">
          {label != null ? <span data-part="label">{label}</span> : null}
          {showValue ? <span data-part="value">{clamped}</span> : null}
        </div>
      ) : null}
      <div data-part="track">
        <div data-part="indicator" />
      </div>
    </div>
  )
})
