import { forwardRef, useId, useState, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface NumberInputProps {
  label?: ReactNode
  helper?: ReactNode
  error?: boolean
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  id?: string
  className?: string
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max)
}

/**
 * NumberInput headless — campo numérico con botones de −/+ que respetan min/max/step.
 * Controlado (value+onChange) o no (defaultValue). La forma la da el skin.
 *
 * Contrato:
 *   [data-sk="number-input"]   raíz · [data-error]
 *   [data-part="label"]        etiqueta
 *   [data-part="control"]      fila − campo +
 *   [data-part="decrement"]    botón −
 *   [data-part="field"]        el <input type=number>
 *   [data-part="increment"]    botón +
 *   [data-part="helper"]       ayuda / error
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    label,
    helper,
    error,
    value,
    defaultValue = 0,
    onChange,
    min = -Infinity,
    max = Infinity,
    step = 1,
    disabled,
    id,
    className,
  },
  ref,
) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const current = isControlled ? value : internal
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = helper ? `${fieldId}-helper` : undefined

  const commit = (v: number) => {
    const c = clamp(v, min, max)
    if (!isControlled) setInternal(c)
    onChange?.(c)
  }

  return (
    <div
      data-sk="number-input"
      data-error={error ? '' : undefined}
      className={cx('sk-number-input', className)}
    >
      {label ? (
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
      ) : null}
      <div data-part="control">
        <button
          type="button"
          data-part="decrement"
          aria-label="Disminuir"
          disabled={disabled || current <= min}
          onClick={() => commit(current - step)}
        >
          −
        </button>
        <input
          ref={ref}
          id={fieldId}
          type="number"
          data-part="field"
          inputMode="numeric"
          value={Number.isFinite(current) ? current : ''}
          min={min === -Infinity ? undefined : min}
          max={max === Infinity ? undefined : max}
          step={step}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          onChange={(e) => {
            const n = e.target.valueAsNumber
            if (!Number.isNaN(n)) commit(n)
          }}
        />
        <button
          type="button"
          data-part="increment"
          aria-label="Aumentar"
          disabled={disabled || current >= max}
          onClick={() => commit(current + step)}
        >
          +
        </button>
      </div>
      {helper ? (
        <span data-part="helper" id={helperId}>
          {helper}
        </span>
      ) : null}
    </div>
  )
})
