import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { useSkinkitI18n } from '../../i18n/context'
import { KeypadPad } from './KeypadPad'

export interface KeypadClassNames {
  display?: string
  keys?: string
  key?: string
  shortcuts?: string
  shortcut?: string
  submit?: string
}

export interface KeypadProps {
  /** Cantidad como ENTERO de la unidad menor (con `decimals={2}`, 1250 es «12.50»). Controlado. */
  value?: number
  defaultValue?: number
  /** Recibe siempre un entero; nunca un decimal. */
  onChange?: (value: number) => void
  /** Se invoca con Enter (teclado físico) o con el botón de aceptar; con ese botón visible solo si se pasa. */
  onSubmit?: (value: number) => void
  /** Cifras decimales que muestra el display (0 = sin decimales). La conversión es del componente. */
  decimals?: number
  /** Cantidades rápidas (en la unidad menor): una fila de botones que fijan el valor. */
  shortcuts?: number[]
  /** Tope de dígitos que acepta (default 9). */
  maxDigits?: number
  /** Texto antes / después del número del display (p. ej. un símbolo de moneda). */
  prefix?: ReactNode
  suffix?: ReactNode
  /** Formato propio del display y de los atajos. Default: `Intl.NumberFormat` con `decimals`. */
  format?: (value: number) => ReactNode
  /** Permite aceptar con valor 0 (default `false`: el botón y Enter esperan una cantidad). */
  allowZero?: boolean
  disabled?: boolean
  /** Toma el foco al montarse, listo para el teclado físico. */
  autoFocus?: boolean
  /** Escucha el teclado físico en toda la página (salvo en campos de texto), no solo con el foco dentro. */
  captureKeys?: boolean
  /** Muestra el display con la cantidad (default `true`). */
  showDisplay?: boolean
  /** Texto del botón de aceptar. Default según `locale`. */
  submitLabel?: ReactNode
  /** Nombre accesible del teclado. */
  label?: string
  className?: string
  classNames?: KeypadClassNames
}

const isEditable = (t: EventTarget | null) => {
  const el = t as HTMLElement | null
  if (!el || !el.tagName) return false
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)
}

/**
 * Keypad headless — teclado numérico en pantalla para teclear cantidades (importes, propinas,
 * cantidades) con teclas grandes y sin el teclado del sistema. Emite un ENTERO de la unidad menor:
 * cada dígito se desplaza a la derecha, y `decimals` solo decide cómo se muestra. Teclado físico:
 * dígitos, Retroceso (borrar), Supr (limpiar) y Enter (aceptar).
 *
 * Contrato:
 *   [data-sk="keypad"]        raíz (role=group, enfocable) · [data-disabled]
 *   [data-part="display"]     <output> con la cantidad · [data-zero] si es 0
 *   [data-part="keys"]        rejilla 3×4 de teclas (role=group)
 *   [data-part="key"]         [data-key="0-9|clear|backspace"]  cada tecla
 *   [data-part="shortcuts"]   fila de cantidades rápidas
 *   [data-part="shortcut"]    [data-value]  cada atajo
 *   [data-part="submit"]      botón de aceptar (si hay `onSubmit`)
 */
export function Keypad({
  value,
  defaultValue = 0,
  onChange,
  onSubmit,
  decimals = 0,
  shortcuts,
  maxDigits = 9,
  prefix,
  suffix,
  format,
  allowZero = false,
  disabled,
  autoFocus,
  captureKeys,
  showDisplay = true,
  submitLabel,
  label,
  className,
  classNames,
}: KeypadProps) {
  const { locale, messages: m } = useSkinkitI18n()
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const current = Math.max(0, Math.trunc((isControlled ? value : internal) ?? 0))
  const rootRef = useRef<HTMLDivElement>(null)
  // Siempre el valor más reciente, para que dos teclas seguidas antes de re-renderizar no se pisen.
  const liveRef = useRef(current)
  liveRef.current = current

  const set = (next: number) => {
    liveRef.current = next
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const digit = (d: string) => {
    if (disabled) return
    const next = liveRef.current * 10 + Number(d)
    if (String(next).length > maxDigits) return
    set(next)
  }
  const backspace = () => {
    if (!disabled) set(Math.floor(liveRef.current / 10))
  }
  const clear = () => {
    if (!disabled && liveRef.current !== 0) set(0)
  }
  const canSubmit = !disabled && (allowZero || liveRef.current > 0)
  const submit = () => {
    if (canSubmit) onSubmit?.(liveRef.current)
  }

  const handleKey = (e: { key: string; ctrlKey: boolean; metaKey: boolean; altKey: boolean; preventDefault: () => void }) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return false
    if (/^[0-9]$/.test(e.key)) digit(e.key)
    else if (e.key === 'Backspace') backspace()
    else if (e.key === 'Delete') clear()
    else if (e.key === 'Enter' && onSubmit) submit()
    else return false
    e.preventDefault()
    return true
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (captureKeys) return
    // Un clic en un atajo o en «aceptar» ya enfocado no debe duplicar con Enter.
    if (e.key === 'Enter' && e.target !== e.currentTarget) return
    handleKey(e)
  }

  // Referencia fresca para el listener global (se reinstala solo al activar/desactivar captureKeys).
  const handleRef = useRef(handleKey)
  handleRef.current = handleKey
  useEffect(() => {
    if (!captureKeys) return
    const onDoc = (e: globalThis.KeyboardEvent) => {
      if (e.defaultPrevented || isEditable(e.target)) return
      if (e.key === 'Enter' && (e.target as HTMLElement | null)?.tagName === 'BUTTON') return
      handleRef.current(e)
    }
    document.addEventListener('keydown', onDoc)
    return () => document.removeEventListener('keydown', onDoc)
  }, [captureKeys])

  useEffect(() => {
    if (autoFocus) rootRef.current?.focus()
  }, [autoFocus])

  const fmt = (n: number): ReactNode =>
    format
      ? format(n)
      : new Intl.NumberFormat(locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(n / 10 ** decimals)

  return (
    <div
      ref={rootRef}
      data-sk="keypad"
      data-disabled={disabled ? '' : undefined}
      role="group"
      aria-label={label ?? m.keypad.label}
      tabIndex={disabled ? undefined : 0}
      className={cx('sk-keypad', className)}
      onKeyDown={onKeyDown}
    >
      {showDisplay ? (
        <output
          data-part="display"
          data-zero={current === 0 ? '' : undefined}
          aria-live="polite"
          className={cx('sk-keypad__display', classNames?.display)}
        >
          {prefix != null ? <span data-part="prefix">{prefix}</span> : null}
          <span data-part="amount">{fmt(current)}</span>
          {suffix != null ? <span data-part="suffix">{suffix}</span> : null}
        </output>
      ) : null}
      {shortcuts && shortcuts.length > 0 ? (
        <div data-part="shortcuts" className={cx('sk-keypad__shortcuts', classNames?.shortcuts)}>
          {shortcuts.map((s) => (
            <button
              key={s}
              type="button"
              data-part="shortcut"
              data-value={s}
              className={cx('sk-keypad__shortcut', classNames?.shortcut)}
              disabled={disabled}
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => set(Math.max(0, Math.trunc(s)))}
            >
              {fmt(s)}
            </button>
          ))}
        </div>
      ) : null}
      <KeypadPad
        onDigit={digit}
        onBackspace={backspace}
        onClear={clear}
        disabled={disabled}
        backspaceLabel={m.keypad.backspace}
        clearLabel={m.keypad.clear}
        label={label ?? m.keypad.label}
        className={cx('sk-keypad__keys', classNames?.keys)}
        keyClassName={classNames?.key}
      />
      {onSubmit ? (
        <button
          type="button"
          data-part="submit"
          className={cx('sk-keypad__submit', classNames?.submit)}
          disabled={!canSubmit}
          onClick={submit}
        >
          {submitLabel ?? m.keypad.submit}
        </button>
      ) : null}
    </div>
  )
}
