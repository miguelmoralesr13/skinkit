import { forwardRef, type FieldsetHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: ReactNode
  helper?: ReactNode
  error?: boolean
}

/**
 * Fieldset headless — agrupa campos relacionados con una leyenda. Usa <fieldset>/<legend>
 * nativos: `disabled` deshabilita en cascada TODOS los controles internos. La forma la da
 * el skin.
 *
 * Contrato:
 *   [data-sk="fieldset"]    raíz (<fieldset>) · [data-error]
 *   [data-part="legend"]    la leyenda (<legend>)
 *   [data-part="content"]   los campos
 *   [data-part="helper"]    ayuda / error del grupo
 */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { legend, helper, error, className, children, ...rest },
  ref,
) {
  return (
    <fieldset
      ref={ref}
      data-sk="fieldset"
      data-error={error ? '' : undefined}
      className={cx('sk-fieldset', className)}
      {...rest}
    >
      {legend != null ? <legend data-part="legend">{legend}</legend> : null}
      <div data-part="content">{children}</div>
      {helper != null ? <div data-part="helper">{helper}</div> : null}
    </fieldset>
  )
})
