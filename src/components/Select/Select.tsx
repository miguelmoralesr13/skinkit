import { forwardRef, useId, type SelectHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode
  helper?: ReactNode
  error?: boolean
  /** Las <option> van como children. */
  children?: ReactNode
}

/**
 * Select headless — envuelve un <select> NATIVO (accesible y con teclado gratis). Las
 * opciones van como children (<option>). Espejo de <Input> para elegir de una lista.
 *
 * Contrato:
 *   [data-sk="select"]      raíz
 *   [data-error]            presente cuando error=true
 *   [data-part="label"]     etiqueta (htmlFor cableado)
 *   [data-part="field"]     el <select>
 *   [data-part="helper"]    texto de ayuda / error
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, helper, error, className, id, children, ...rest },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = helper ? `${fieldId}-helper` : undefined

  return (
    <div data-sk="select" data-error={error ? '' : undefined} className={cx('sk-select', className)}>
      {label ? (
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
      ) : null}
      <select
        ref={ref}
        id={fieldId}
        data-part="field"
        aria-invalid={error || undefined}
        aria-describedby={helperId}
        {...rest}
      >
        {children}
      </select>
      {helper ? (
        <span data-part="helper" id={helperId}>
          {helper}
        </span>
      ) : null}
    </div>
  )
})
