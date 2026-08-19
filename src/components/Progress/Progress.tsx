import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

export type ProgressTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
  | 'neutral'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Valor actual. Omitir (o indeterminate) para progreso indeterminado. */
  value?: number
  max?: number
  /** Progreso sin valor conocido: el CSS lo anima. */
  indeterminate?: boolean
  /** Color del indicador (del theme). 'primary' (default) no emite data-tone. */
  tone?: ProgressTone
}

/**
 * Progress headless — barra de progreso (determinada o indeterminada). role="progressbar"
 * con aria-valuenow/min/max. El indicador se dimensiona con la variable --sk-progress
 * (0–1); la forma/animación las da el CSS.
 *
 * Contrato:
 *   [data-sk="progress"]     raíz (role=progressbar) · [data-indeterminate] si aplica
 *   [data-part="track"]      riel de fondo
 *   [data-part="indicator"]  relleno (width por --sk-progress; animado si indeterminate)
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, indeterminate, tone = 'primary', className, style, ...rest },
  ref,
) {
  const isIndeterminate = indeterminate || value == null
  const clamped = isIndeterminate ? 0 : Math.min(Math.max(value as number, 0), max)
  const ratio = isIndeterminate ? 0 : clamped / max

  return (
    <div
      ref={ref}
      data-sk="progress"
      data-tone={tone === 'primary' ? undefined : tone}
      data-indeterminate={isIndeterminate ? '' : undefined}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={isIndeterminate ? undefined : clamped}
      className={cx('sk-progress', className)}
      style={{ ['--sk-progress' as string]: String(ratio), ...style }}
      {...rest}
    >
      <div data-part="track">
        <div data-part="indicator" />
      </div>
    </div>
  )
})
