import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type SwitchTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Texto junto al interruptor. */
  label?: ReactNode
  /** Color del estado encendido (del theme). 'primary' (default) no emite data-tone. */
  tone?: SwitchTone
}

/**
 * Switch (interruptor on/off) headless. Es un checkbox nativo con role="switch": conserva
 * semántica correcta, envío de formularios y `:checked` nativo (funciona uncontrolled, sin
 * estado JS). El CSS oculta el input y pinta `track`/`thumb`.
 *
 * Contrato:
 *   [data-sk="switch"]       raíz (<label>)
 *   [data-part="control"]    el <input type=checkbox role=switch> (el CSS lo oculta)
 *   [data-part="track"]      riel de fondo
 *   [data-part="thumb"]      perilla que se desliza (CSS la mueve con :checked)
 *   [data-part="label"]      texto
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, tone = 'primary', className, ...rest },
  ref,
) {
  return (
    <label
      data-sk="switch"
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-switch', className)}
    >
      <input ref={ref} type="checkbox" role="switch" data-part="control" {...rest} />
      <span data-part="track" aria-hidden="true">
        <span data-part="thumb" />
      </span>
      {label ? <span data-part="label">{label}</span> : null}
    </label>
  )
})
