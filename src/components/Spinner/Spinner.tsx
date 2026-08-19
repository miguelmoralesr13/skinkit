import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

export type SpinnerSize = 'sm' | 'md' | 'lg'
export type SpinnerTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
  | 'neutral'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize
  /** Color del spinner (del theme). 'primary' (default) no emite data-tone. */
  tone?: SpinnerTone
  /** Texto para lectores de pantalla (el CSS lo oculta visualmente). */
  label?: string
}

/**
 * Spinner headless — indicador de carga indeterminado. La animación de giro la define el
 * CSS (@keyframes sk-spin); el componente solo aporta estructura + semántica de estado.
 *
 * Contrato:
 *   [data-sk="spinner"]      raíz (role=status; el CSS la anima)
 *   [data-size]              sm | md | lg
 *   [data-part="label"]      texto para lectores (el CSS lo oculta visualmente)
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', tone = 'primary', label = 'Cargando…', className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      data-sk="spinner"
      data-size={size}
      data-tone={tone === 'primary' ? undefined : tone}
      role="status"
      className={cx('sk-spinner', className)}
      {...rest}
    >
      <span data-part="label">{label}</span>
    </span>
  )
})
