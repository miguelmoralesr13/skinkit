import { forwardRef, useId, type TextareaHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode
  helper?: ReactNode
  error?: boolean
}

/**
 * Textarea headless (label + field + helper), espejo de <Input> para texto multilínea.
 *
 * Contrato:
 *   [data-sk="textarea"]    raíz
 *   [data-error]            presente cuando error=true (el skin lo usa)
 *   [data-part="label"]     etiqueta (htmlFor cableado)
 *   [data-part="field"]     el <textarea>
 *   [data-part="helper"]    texto de ayuda / error
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, helper, error, className, id, ...rest },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = helper ? `${fieldId}-helper` : undefined

  return (
    <div
      data-sk="textarea"
      data-error={error ? '' : undefined}
      className={cx('sk-textarea', className)}
    >
      {label ? (
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={fieldId}
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
