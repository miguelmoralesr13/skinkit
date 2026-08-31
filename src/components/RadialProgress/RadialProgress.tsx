import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type RadialTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
  | 'neutral'

export interface RadialProgressClassNames {
  track?: string
  indicator?: string
  label?: string
}

export interface RadialProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  /** Diámetro en px. */
  size?: number
  /** Grosor del anillo en px. */
  thickness?: number
  tone?: RadialTone
  /** Muestra el porcentaje en el centro (o pasá children). */
  showValue?: boolean
  children?: ReactNode
  /** Clases adicionales por sub-parte (track, indicator, label). */
  classNames?: RadialProgressClassNames
}

/**
 * RadialProgress headless — progreso circular (anillo). SVG puro; el color del arco viene del
 * theme según [data-tone]. Para el avance lineal, usá Progress.
 *
 * Contrato:
 *   [data-sk="radial-progress"]   raíz · [data-tone] (role=progressbar)
 *   [data-part="track"]           círculo de fondo (SVG)
 *   [data-part="indicator"]       arco de avance (SVG)
 *   [data-part="label"]           texto central
 */
export const RadialProgress = forwardRef<HTMLDivElement, RadialProgressProps>(
  function RadialProgress(
    {
      value = 0,
      max = 100,
      size = 64,
      thickness = 8,
      tone = 'primary',
      showValue,
      className,
      children,
      classNames,
      ...rest
    },
    ref,
  ) {
    const clamped = Math.min(Math.max(value, 0), max)
    const ratio = max === 0 ? 0 : clamped / max
    const r = (size - thickness) / 2
    const c = 2 * Math.PI * r
    const pct = Math.round(ratio * 100)

    return (
      <div
        ref={ref}
        data-sk="radial-progress"
        data-tone={tone}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cx('sk-radial-progress', className)}
        style={{ width: size, height: size }}
        {...rest}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            data-part="track"
            className={cx('sk-radial-progress__track', classNames?.track)}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={thickness}
          />
          <circle
            data-part="indicator"
            className={cx('sk-radial-progress__indicator', classNames?.indicator)}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - ratio)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        {children != null || showValue ? (
          <span data-part="label" className={cx('sk-radial-progress__label', classNames?.label)}>
            {children ?? `${pct}%`}
          </span>
        ) : null}
      </div>
    )
  },
)
