import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type StackedBarTone =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface StackedBarSegment {
  key: string
  label: string
  /** Magnitud del segmento (>= 0). La proporción sale de value / suma de todos. */
  value: number
  /** Color por token. Si se omite, se reparte por posición. */
  tone?: StackedBarTone
}

export interface StackedBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  segments: StackedBarSegment[]
  /** Qué se está repartiendo ("Ventas por canal"). Encabezado del aria-label generado. */
  label?: string
  /** Muestra la leyenda con etiqueta directa por segmento. */
  showLegend?: boolean
  /** Texto de cada valor (leyenda y aria-label). Por omisión, el porcentaje redondeado. */
  formatValue?: (segment: StackedBarSegment, percent: number) => string
  /** Contenido cuando no hay nada que repartir (suma = 0). */
  empty?: ReactNode
}

const AUTO_TONES: StackedBarTone[] = ['primary', 'secondary', 'tertiary', 'accent', 'info', 'success', 'warning', 'danger']

/**
 * StackedBar headless — cómo se reparte un total en 2–6 partes (una sola barra con segmentos).
 * Progress/Meter son de un solo valor; esto pinta varios. El conjunto es role="img" con un
 * aria-label generado con todas las partes; la leyenda escribe cada etiqueta y su valor (el color
 * nunca es el único canal). Un segmento pequeño no desaparece: el CSS le da un ancho mínimo.
 *
 * Contrato:
 *   [data-sk="stacked-bar"]        raíz
 *   [data-part="bar"]              la barra (role="img"; --sk-stacked-bar-total)
 *   [data-part="segment"]          cada tramo ([data-tone]; flex-grow = value)
 *   [data-part="legend"]           lista de leyenda
 *   [data-part="legend-item"]      cada entrada ([data-tone])
 *   [data-part="swatch"]           muestra de color
 *   [data-part="legend-label"]     etiqueta
 *   [data-part="legend-value"]     valor escrito
 *   [data-part="empty"]            sin datos
 */
export const StackedBar = forwardRef<HTMLDivElement, StackedBarProps>(function StackedBar(
  { segments, label, showLegend = true, formatValue, empty, className, ...rest },
  ref,
) {
  const clean = segments.map((s) => ({ ...s, value: Number.isFinite(s.value) && s.value > 0 ? s.value : 0 }))
  const total = clean.reduce((acc, s) => acc + s.value, 0)
  const fmt = formatValue ?? ((_s: StackedBarSegment, p: number) => `${Math.round(p)}%`)
  const rows = clean.map((s, i) => ({
    seg: s,
    tone: s.tone ?? AUTO_TONES[i % AUTO_TONES.length],
    percent: total > 0 ? (s.value / total) * 100 : 0,
  }))
  const text = rows.map((r) => `${r.seg.label} ${fmt(r.seg, r.percent)}`).join(', ')
  const aria = label ? `${label}: ${text}` : text

  return (
    <div ref={ref} data-sk="stacked-bar" data-empty={total === 0 ? '' : undefined} className={cx('sk-stacked-bar', className)} {...rest}>
      {total === 0 ? (
        empty != null ? <div data-part="empty">{empty}</div> : null
      ) : (
        <div role="img" aria-label={aria} data-part="bar">
          {rows
            .filter((r) => r.seg.value > 0)
            .map((r) => (
              <span
                key={r.seg.key}
                data-part="segment"
                data-tone={r.tone}
                style={{ flexGrow: r.seg.value }}
              />
            ))}
        </div>
      )}
      {showLegend && rows.length > 0 ? (
        <ul data-part="legend">
          {rows.map((r) => (
            <li key={r.seg.key} data-part="legend-item" data-tone={r.tone}>
              <span data-part="swatch" aria-hidden="true" />
              <span data-part="legend-label">{r.seg.label}</span>
              <span data-part="legend-value">{fmt(r.seg, r.percent)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
})
