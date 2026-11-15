import { Children, cloneElement, isValidElement, useId, type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
  helper?: ReactNode
  /** Mensaje de error. Si está presente, marca [data-error] y reemplaza al helper. */
  error?: string
  required?: boolean
  /** id del control interno, para wirear el <label htmlFor>. */
  htmlFor?: string
  /**
   * Opt-in. Asocia la etiqueta con el control: genera un `id` y se lo pasa al único hijo (o usa el
   * `id` que ese hijo ya traiga, o `htmlFor`) y cablea `<label htmlFor>`; así el control tiene
   * nombre accesible. Sin efecto si se pasa un hijo que no es un elemento único. Default `false`.
   */
  associateLabel?: boolean
  children?: ReactNode
}

/**
 * Field headless — envoltorio de campo con label + control + helper/error, para dar markup y
 * a11y consistentes a CUALQUIER control (incluso los que no traen label/error propios, como
 * Slider, o widgets a medida). No estila: sólo el contrato; la forma la da el CSS.
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
  associateLabel,
  className,
  children,
  ...rest
}: FieldProps) {
  if (associateLabel) {
    return <FieldAssociated {...{ label, helper, error, required, htmlFor, className, ...rest }}>{children}</FieldAssociated>
  }
  return renderField({ label, helper, error, required, htmlFor, className, rest, content: children })
}

function FieldAssociated({ children, ...props }: Omit<FieldProps, 'associateLabel'>) {
  const { label, helper, error, required, htmlFor, className, ...rest } = props
  const autoId = useId()
  let controlId = htmlFor
  let content = children
  {
    const only = Children.count(children) === 1 ? Children.toArray(children)[0] : null
    if (isValidElement(only) && typeof only.type !== 'symbol') {
      const el = only as ReactElement<{ id?: string }>
      controlId = htmlFor ?? el.props.id ?? autoId
      content = el.props.id === controlId ? el : cloneElement(el, { id: controlId })
    }
  }
  return renderField({ label, helper, error, required, htmlFor: controlId, className, rest, content })
}

interface RenderArgs extends Pick<FieldProps, 'label' | 'helper' | 'error' | 'required' | 'htmlFor' | 'className'> {
  rest: HTMLAttributes<HTMLDivElement>
  content: ReactNode
}

function renderField({ label, helper, error, required, htmlFor: controlId, className, rest, content }: RenderArgs) {
  return (
    <div data-sk="field" data-error={error ? '' : undefined} className={cx('sk-field', className)} {...rest}>
      {label != null && (
        <label data-part="label" htmlFor={controlId}>
          {label}
          {required && (
            <span data-part="required" aria-hidden="true">
              {' *'}
            </span>
          )}
        </label>
      )}
      <div data-part="control">{content}</div>
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
