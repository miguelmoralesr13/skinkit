import {
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'

export type PinInputType = 'numeric' | 'text'

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
}

/**
 * PinInput headless — código segmentado (OTP / verificación): una casilla por carácter, con
 * auto-avance, backspace hacia atrás y pegado que se reparte. Controlado o no. La forma la da
 * el skin.
 *
 * Contrato:
 *   [data-sk="pin-input"]   raíz · [data-error]
 *   [data-part="label"]     etiqueta
 *   [data-part="group"]     fila de casillas
 *   [data-part="field"]     [data-filled]  cada casilla (<input>)
 *   [data-part="helper"]    ayuda / error
 */
export function PinInput({
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
}: PinInputProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const current = (isControlled ? value : internal) ?? ''
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const chars = Array.from({ length }, (_, i) => current[i] ?? '')

  const commit = (next: string) => {
    const trimmed = next.slice(0, length)
    if (!isControlled) setInternal(trimmed)
    onChange?.(trimmed)
    if (trimmed.length === length && !trimmed.includes(' ')) onComplete?.(trimmed)
  }

  const valid = (ch: string) => (type === 'numeric' ? /\d/.test(ch) : ch.length === 1)

  const focus = (i: number) => refs.current[Math.max(0, Math.min(i, length - 1))]?.focus()

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
      {label ? <span data-part="label">{label}</span> : null}
      <div data-part="group">
        {chars.map((ch, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            data-part="field"
            data-filled={ch ? '' : undefined}
            type={mask ? 'password' : 'text'}
            inputMode={type === 'numeric' ? 'numeric' : 'text'}
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            disabled={disabled}
            aria-label={`Dígito ${i + 1}`}
            value={ch}
            onChange={(e) => onInput(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={(e) => onPaste(i, e)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
      {helper ? <span data-part="helper">{helper}</span> : null}
    </div>
  )
}
