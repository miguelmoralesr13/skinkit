import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { useSkinkitMessages, formatMessage } from '../../i18n/context'
import { KeypadPad } from '../Keypad/KeypadPad'

export type PinInputType = 'numeric' | 'text'

/** Clases opcionales por sub-parte de <PinInput>. Aditivas: nunca reemplazan la clase base. */
export interface PinInputClassNames {
  label?: string
  group?: string
  /** Se aplica a TODAS las casillas (una por dígito). */
  field?: string
  helper?: string
}

/** Métodos imperativos de `<PinInput ref>`. */
export interface PinInputHandle {
  /** Enfoca la primera casilla vacía (o el grupo, en modo `keypad`). */
  focus: () => void
  /** Borra el código, enfoca de nuevo y avisa con `onClear` (p. ej. tras un PIN incorrecto). */
  clear: () => void
}

export interface PinInputProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Se invoca cuando se completan todas las casillas. */
  onComplete?: (value: string) => void
  length?: number
  type?: PinInputType
  /** Muestra puntos en vez de los caracteres (códigos sensibles). */
  mask?: boolean
  disabled?: boolean
  label?: ReactNode
  helper?: ReactNode
  error?: boolean
  className?: string
  /** Clases opcionales por sub-parte (label/group/field/helper). Aditivas. */
  classNames?: PinInputClassNames
  /** Opt-in. Toma el foco al montarse: la primera casilla vacía (o el grupo, con `keypad`). */
  autoFocus?: boolean
  /** Opt-in. Se invoca cuando el código queda vacío (se borra del todo o se llama a `ref.clear()`). */
  onClear?: () => void
  /**
   * Opt-in. Teclado numérico en pantalla bajo las casillas, sin depender del teclado del sistema:
   * las casillas pasan a solo lectura (`inputMode="none"`), el grupo recibe el teclado físico
   * (dígitos, Retroceso, Supr) y cada tecla mide más de 44 px. Solo con `type="numeric"`.
   */
  keypad?: boolean
}

/**
 * PinInput headless — código segmentado (OTP / verificación): una casilla por carácter, con
 * auto-avance, backspace hacia atrás y pegado que se reparte. Controlado o no. La forma la da
 * el CSS.
 *
 * Contrato:
 *   [data-sk="pin-input"]   raíz · [data-error]
 *   [data-part="label"]     etiqueta
 *   [data-part="group"]     fila de casillas
 *   [data-part="field"]     [data-filled]  cada casilla (<input>)
 *   [data-part="helper"]    ayuda / error
 */
export const PinInput = forwardRef<PinInputHandle, PinInputProps>(function PinInput(
  {
  value,
  defaultValue = '',
  onChange,
  onComplete,
  length = 6,
  type = 'numeric',
  mask,
  disabled,
  label,
  helper,
  error,
  className,
  classNames,
  autoFocus,
  onClear,
  keypad: keypadProp,
  },
  ref,
) {
  const keypad = !!keypadProp && type === 'numeric'
  const m = useSkinkitMessages()
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const current = (isControlled ? value : internal) ?? ''
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const chars = Array.from({ length }, (_, i) => current[i] ?? '')

  const groupRef = useRef<HTMLDivElement>(null)

  const commit = (next: string) => {
    const trimmed = next.slice(0, length)
    if (trimmed === '' && current !== '') onClear?.()
    if (!isControlled) setInternal(trimmed)
    onChange?.(trimmed)
    if (trimmed.length === length && !trimmed.includes(' ')) onComplete?.(trimmed)
  }

  const valid = (ch: string) => (type === 'numeric' ? /\d/.test(ch) : ch.length === 1)

  const focus = (i: number) => refs.current[Math.max(0, Math.min(i, length - 1))]?.focus()
  const focusEntry = () => {
    if (keypad) groupRef.current?.focus()
    else focus(Math.min(current.length, length - 1))
  }

  useImperativeHandle(ref, () => ({
    focus: focusEntry,
    clear: () => {
      if (!isControlled) setInternal('')
      onChange?.('')
      onClear?.()
      if (keypad) groupRef.current?.focus()
      else focus(0)
    },
  }))

  useEffect(() => {
    if (autoFocus) focusEntry()
    // Solo al montarse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Modo keypad: teclado en pantalla (y físico sobre el grupo) que agrega o quita al final.
  const pushDigit = (d: string) => {
    if (disabled || current.length >= length) return
    commit(current + d)
  }
  const popDigit = () => {
    if (disabled || current.length === 0) return
    commit(current.slice(0, -1))
  }
  const clearAll = () => {
    if (disabled || current.length === 0) return
    commit('')
  }
  const onGroupKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    if (/^[0-9]$/.test(e.key)) pushDigit(e.key)
    else if (e.key === 'Backspace') popDigit()
    else if (e.key === 'Delete') clearAll()
    else return
    e.preventDefault()
  }

  const setAt = (i: number, ch: string) => {
    const arr = [...chars]
    arr[i] = ch
    commit(arr.join(''))
  }

  const onInput = (i: number, raw: string) => {
    const ch = raw.slice(-1)
    if (!ch) return
    if (!valid(ch)) return
    setAt(i, ch)
    if (i < length - 1) focus(i + 1)
  }

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (chars[i]) {
        setAt(i, '')
      } else if (i > 0) {
        e.preventDefault()
        setAt(i - 1, '')
        focus(i - 1)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focus(i - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focus(i + 1)
    }
  }

  const onPaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    const filtered = (type === 'numeric' ? text.replace(/\D/g, '') : text).slice(0, length - i)
    if (!filtered) return
    const arr = [...chars]
    for (let k = 0; k < filtered.length; k++) arr[i + k] = filtered[k]
    commit(arr.join(''))
    focus(i + filtered.length)
  }

  return (
    <div
      data-sk="pin-input"
      data-error={error ? '' : undefined}
      className={cx('sk-pin-input', className)}
    >
      {label ? (
        <span data-part="label" className={cx('sk-pin-input__label', classNames?.label)}>
          {label}
        </span>
      ) : null}
      <div
        ref={groupRef}
        data-part="group"
        className={cx('sk-pin-input__group', classNames?.group)}
        {...(keypad
          ? {
              role: 'group',
              'aria-label': label ? undefined : m.keypad.label,
              tabIndex: disabled ? undefined : 0,
              'data-keypad': '',
              onKeyDown: onGroupKeyDown,
            }
          : {})}
      >
        {chars.map((ch, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            data-part="field"
            data-filled={ch ? '' : undefined}
            {...(keypad
              ? { 'data-active': i === Math.min(current.length, length - 1) ? '' : undefined, readOnly: true, tabIndex: -1 }
              : {})}
            className={cx('sk-pin-input__field', classNames?.field)}
            type={mask ? 'password' : 'text'}
            inputMode={keypad ? 'none' : type === 'numeric' ? 'numeric' : 'text'}
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            disabled={disabled}
            aria-label={formatMessage(m.pinInput.digit, { index: i + 1 })}
            value={ch}
            onChange={(e) => onInput(i, e.target.value)}
            onKeyDown={keypad ? undefined : (e) => onKeyDown(i, e)}
            onPaste={keypad ? undefined : (e) => onPaste(i, e)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
      {keypad ? (
        <div data-sk="keypad" data-embedded="" className="sk-keypad">
          <KeypadPad
            onDigit={pushDigit}
            onBackspace={popDigit}
            onClear={clearAll}
            disabled={disabled}
            backspaceLabel={m.keypad.backspace}
            clearLabel={m.keypad.clear}
            label={m.keypad.label}
            className="sk-keypad__keys"
          />
        </div>
      ) : null}
      {helper ? (
        <span data-part="helper" className={cx('sk-pin-input__helper', classNames?.helper)}>
          {helper}
        </span>
      ) : null}
    </div>
  )
})
