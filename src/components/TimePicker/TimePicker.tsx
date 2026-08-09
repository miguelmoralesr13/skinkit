import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface TimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
  helper?: ReactNode
  error?: boolean
}

/**
 * TimePicker headless — envuelve un <input type="time"> NATIVO (rueda/teclado del sistema,
 * accesible). Espejo de <Input> para elegir una hora. La forma la da el skin.
 *
 * Contrato:
 *   [data-sk="time-picker"]   raíz · [data-error]
 *   [data-part="label"]     etiqueta (htmlFor cableado)
 *   [data-part="field"]     el <input type=time>
 *   [data-part="helper"]    ayuda / error
 */
export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker(
  { label, helper, error, className, id, ...rest },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = helper ? `${fieldId}-helper` : undefined

  return (
    <div
      data-sk="time-picker"
      data-error={error ? '' : undefined}
      className={cx('sk-time-picker', className)}
    >
      {label ? (
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={fieldId}
        type="time"
        data-part="field"
        aria-invalid={error || undefined}
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
