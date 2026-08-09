import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  helper?: ReactNode
  error?: boolean
}

/**
 * Input headless (label + field + helper).
 *
 * Contrato:
 *   [data-sk="input"]       raíz
 *   [data-error]            presente cuando error=true (el skin lo usa)
 *   [data-part="label"]     etiqueta (htmlFor cableado)
 *   [data-part="field"]     el <input>
 *   [data-part="helper"]    texto de ayuda / error
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helper, error, className, id, ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const helperId = helper ? `${inputId}-helper` : undefined

  return (
    <div
      data-sk="input"
      data-error={error ? '' : undefined}
      className={cx('sk-input', className)}
    >
      {label ? (
        <label data-part="label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
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
