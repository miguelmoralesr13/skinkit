import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

export type SparklineTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
  | 'neutral'

export interface SparklineClassNames {
  area?: string
  line?: string
  dot?: string
}

export interface SparklineProps extends HTMLAttributes<HTMLSpanElement> {
  data: number[]
  width?: number
  height?: number
  tone?: SparklineTone
  /** Rellena el área bajo la línea. */
  area?: boolean
  /** Punto en el último valor. */
  dot?: boolean
  /** Clases adicionales por sub-parte (area/line/dot). */
  classNames?: SparklineClassNames
}

/**
 * Sparkline headless — mini gráfico de línea (tendencia) en SVG, sin ejes. Auto-escala a los
 * datos. El color viene del theme según [data-tone]. Ideal junto a Stat.
 *
 * Contrato:
 *   [data-sk="sparkline"]   [data-tone]   raíz (<span> con SVG)
 *   [data-part="area"]      relleno bajo la línea (si area)
 *   [data-part="line"]      la línea (polyline)
 *   [data-part="dot"]       punto del último valor (si dot)
 */
export const Sparkline = forwardRef<HTMLSpanElement, SparklineProps>(function Sparkline(
  { data, width = 100, height = 28, tone = 'primary', area, dot, className, classNames, ...rest },
  ref,
) {
  const n = data.length
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const pad = 2
  const stepX = n > 1 ? (width - pad * 2) / (n - 1) : 0
  const y = (v: number) => pad + (1 - (v - min) / span) * (height - pad * 2)
  const points = data.map((v, i) => `${pad + i * stepX},${y(v)}`)
  const last = data[n - 1]

  return (
    <span
      ref={ref}
      data-sk="sparkline"
      data-tone={tone}
      className={cx('sk-sparkline', className)}
      style={{ display: 'inline-flex', width, height }}
      {...rest}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {area && n > 1 ? (
          <polygon
            data-part="area"
            className={cx('sk-sparkline__area', classNames?.area)}
            points={`${pad},${height - pad} ${points.join(' ')} ${width - pad},${height - pad}`}
          />
        ) : null}
        <polyline
          data-part="line"
          className={cx('sk-sparkline__line', classNames?.line)}
          fill="none"
          points={points.join(' ')}
        />
        {dot && n > 0 ? (
          <circle
            data-part="dot"
            className={cx('sk-sparkline__dot', classNames?.dot)}
            cx={pad + (n - 1) * stepX}
            cy={y(last)}
            r={2.5}
          />
        ) : null}
      </svg>
    </span>
  )
})
