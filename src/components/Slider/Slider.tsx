import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type SliderTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
  helper?: ReactNode
  /** Muestra el valor actual junto al label (solo visual). */
  value?: number | string
  showValue?: boolean
  /** Color del riel/thumb (del theme, vía accent-color). 'primary' (default) no emite data-tone. */
  tone?: SliderTone
}

/**
 * Slider headless — envuelve un <input type="range"> NATIVO (accesible, teclado incluido).
 * El color del riel/thumb lo pone el skin (accent-color desde los tokens del theme).
 *
 * Contrato:
 *   [data-sk="slider"]       raíz
 *   [data-part="label"]      etiqueta (htmlFor cableado)
 *   [data-part="value"]      valor actual (si showValue)
 *   [data-part="field"]      el <input type=range>
 *   [data-part="helper"]     texto de ayuda
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { label, helper, showValue, value, tone = 'primary', className, id, ...rest },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = helper ? `${fieldId}-helper` : undefined

  return (
    <div
      data-sk="slider"
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-slider', className)}
    >
      {label || showValue ? (
        <div data-part="header">
          {label ? (
            <label data-part="label" htmlFor={fieldId}>
              {label}
            </label>
          ) : null}
          {showValue ? <span data-part="value">{value}</span> : null}
        </div>
      ) : null}
      <input
        ref={ref}
        id={fieldId}
        type="range"
        data-part="field"
        value={value}
        aria-describedby={helperId}
        {...rest}
      />
      {helper ? (
        <span data-part="helper" id={helperId}>
          {helper}
        </span>
      ) : null}
    </div>
  )
})
