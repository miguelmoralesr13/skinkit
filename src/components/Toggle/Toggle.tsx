import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type ToggleSize = 'sm' | 'md' | 'lg'
export type ToggleTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Estado presionado (controlado). */
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  size?: ToggleSize
  /** Color del estado presionado (del theme). 'primary' (default) no emite data-tone. */
  tone?: ToggleTone
}

/**
 * Toggle headless — botón de DOS estados que queda presionado (ej. negrita en una toolbar).
 * A diferencia de Switch (control de formulario on/off), esto es una acción con estado.
 * aria-pressed + [data-state]. Controlado o no. La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="toggle"]   [data-state] [data-size]   raíz (on|off · sm|md|lg)
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { pressed, defaultPressed = false, onPressedChange, size = 'md', tone = 'primary', className, children, onClick, type, ...rest },
  ref,
) {
  const isControlled = pressed !== undefined
  const [internal, setInternal] = useState(defaultPressed)
  const on = isControlled ? pressed : internal

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      data-sk="toggle"
      data-state={on ? 'on' : 'off'}
      data-size={size}
      data-tone={tone === 'primary' ? undefined : tone}
      aria-pressed={on}
      className={cx('sk-toggle', className)}
      onClick={(e) => {
        onClick?.(e)
        const next = !on
        if (!isControlled) setInternal(next)
        onPressedChange?.(next)
      }}
      {...rest}
    >
      {children as ReactNode}
    </button>
  )
})
