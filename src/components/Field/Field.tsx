import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
  helper?: ReactNode
  /** Mensaje de error. Si está presente, marca [data-error] y reemplaza al helper. */
  error?: string
  required?: boolean
  /** id del control interno, para wirear el <label htmlFor>. */
  htmlFor?: string
  children?: ReactNode
}

/**
 * Field headless — envoltorio de campo con label + control + helper/error, para dar markup y
 * a11y consistentes a CUALQUIER control (incluso los que no traen label/error propios, como
 * Slider, o widgets a medida). No estila: sólo el contrato; la forma la da el skin.
 *
 * Contrato:
 *   [data-sk="field"]        raíz · [data-error] cuando hay error
 *   [data-part="label"]      la etiqueta (<label htmlFor>) · [data-part="required"] marca *
 *   [data-part="control"]    envuelve al children (el control)
 *   [data-part="helper"]     texto de ayuda
 *   [data-part="error"]      mensaje de error (role=alert)
 */
export function Field({
  label,
  helper,
  error,
  required,
  htmlFor,
  className,
  children,
  ...rest
}: FieldProps) {
  return (
    <div data-sk="field" data-error={error ? '' : undefined} className={cx('sk-field', className)} {...rest}>
      {label != null && (
        <label data-part="label" htmlFor={htmlFor}>
          {label}
          {required && (
            <span data-part="required" aria-hidden="true">
              {' *'}
            </span>
          )}
        </label>
      )}
      <div data-part="control">{children}</div>
      {error ? (
        <div data-part="error" role="alert">
          {error}
        </div>
      ) : (
        helper != null && <div data-part="helper">{helper}</div>
      )}
    </div>
  )
}
