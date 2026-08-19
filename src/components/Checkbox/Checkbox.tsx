import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'

export type CheckboxTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Texto junto al control. Al ir dentro del <label>, clickearlo togglea. */
  label?: ReactNode
  /** Color del estado marcado (del theme). 'primary' (default) no emite data-tone. */
  tone?: CheckboxTone
  /** Estado indeterminado (visual "parcial"); es una propiedad nativa, no un attr. */
  indeterminate?: boolean
}

/**
 * Checkbox headless. Sin estilo propio: la forma la da el CSS.
 *
 * El input nativo es la fuente de verdad (funciona uncontrolled, sin estado JS): el CSS
 * lo oculta visualmente y pinta el `box`/`indicator` usando los pseudo nativos
 * (`:checked`, `:indeterminate`, `:disabled`, `:focus-visible`).
 *
 * Contrato:
 *   [data-sk="checkbox"]     raíz (<label>)
 *   [data-part="control"]    el <input type=checkbox> (el CSS lo oculta visualmente)
 *   [data-part="box"]        caja visual
 *   [data-part="indicator"]  tilde / guion (marca)
 *   [data-part="label"]      texto
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, indeterminate = false, tone = 'primary', className, ...rest },
  ref,
) {
  const innerRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, [])
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <label
      data-sk="checkbox"
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-checkbox', className)}
    >
      <input ref={innerRef} type="checkbox" data-part="control" {...rest} />
      <span data-part="box" aria-hidden="true">
        <span data-part="indicator" />
      </span>
      {label ? <span data-part="label">{label}</span> : null}
    </label>
  )
})
