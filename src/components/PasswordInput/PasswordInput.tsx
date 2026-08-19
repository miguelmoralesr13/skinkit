import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
  helper?: ReactNode
  error?: boolean
}

/**
 * PasswordInput headless — campo de contraseña con botón de mostrar/ocultar. Espejo de Input
 * con un toggle que alterna type password/text. La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="password-input"]   raíz · [data-error]
 *   [data-part="label"]     etiqueta
 *   [data-part="control"]   fila campo + toggle
 *   [data-part="field"]     el <input>
 *   [data-part="toggle"]    [data-visible]  botón mostrar/ocultar
 *   [data-part="helper"]    ayuda / error
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ label, helper, error, className, id, ...rest }, ref) {
    const [visible, setVisible] = useState(false)
    const autoId = useId()
    const fieldId = id ?? autoId
    const helperId = helper ? `${fieldId}-helper` : undefined

    return (
      <div
        data-sk="password-input"
        data-error={error ? '' : undefined}
        className={cx('sk-password-input', className)}
      >
        {label ? (
          <label data-part="label" htmlFor={fieldId}>
            {label}
          </label>
        ) : null}
        <div data-part="control">
          <input
            ref={ref}
            id={fieldId}
            data-part="field"
            type={visible ? 'text' : 'password'}
            aria-invalid={error || undefined}
            aria-describedby={helperId}
            {...rest}
          />
          <button
            type="button"
            data-part="toggle"
            data-visible={visible ? '' : undefined}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? '🙈' : '👁'}
          </button>
        </div>
        {helper ? (
          <span data-part="helper" id={helperId}>
            {helper}
          </span>
        ) : null}
      </div>
    )
  },
)
