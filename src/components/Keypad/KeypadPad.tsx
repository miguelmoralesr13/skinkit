import { cx } from '../../lib/cx'

export interface KeypadPadProps {
  onDigit: (digit: string) => void
  onBackspace: () => void
  onClear?: () => void
  disabled?: boolean
  backspaceLabel: string
  clearLabel: string
  label: string
  className?: string
  keyClassName?: string
}

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

/**
 * Rejilla 3×4 de teclas (1-9, limpiar, 0, borrar). Pieza interna que comparten `Keypad` (importe
 * entero) y `PinInput` en modo `keypad` (cadena con ceros a la izquierda). No va en el índice público.
 * Las teclas no toman el foco al tocarlas (`mousedown` cancelado): el foco se queda en quien recibe
 * el teclado físico.
 */
export function KeypadPad({
  onDigit,
  onBackspace,
  onClear,
  disabled,
  backspaceLabel,
  clearLabel,
  label,
  className,
  keyClassName,
}: KeypadPadProps) {
  const keep = (e: { preventDefault: () => void }) => e.preventDefault()
  return (
    <div data-part="keys" role="group" aria-label={label} className={className}>
      {DIGITS.map((d) => (
        <button
          key={d}
          type="button"
          data-part="key"
          data-key={d}
          className={cx('sk-keypad__key', keyClassName)}
          tabIndex={-1}
          disabled={disabled}
          onMouseDown={keep}
          onClick={() => onDigit(d)}
        >
          {d}
        </button>
      ))}
      <button
        type="button"
        data-part="key"
        data-key="clear"
        className={cx('sk-keypad__key', keyClassName)}
        tabIndex={-1}
        disabled={disabled || !onClear}
        aria-label={clearLabel}
        onMouseDown={keep}
        onClick={() => onClear?.()}
      >
        C
      </button>
      <button
        type="button"
        data-part="key"
        data-key="0"
        className={cx('sk-keypad__key', keyClassName)}
        tabIndex={-1}
        disabled={disabled}
        onMouseDown={keep}
        onClick={() => onDigit('0')}
      >
        0
      </button>
      <button
        type="button"
        data-part="key"
        data-key="backspace"
        className={cx('sk-keypad__key', keyClassName)}
        tabIndex={-1}
        disabled={disabled}
        aria-label={backspaceLabel}
        onMouseDown={keep}
        onClick={onBackspace}
      >
        ⌫
      </button>
    </div>
  )
}
