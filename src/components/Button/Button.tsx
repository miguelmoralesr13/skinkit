import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type ButtonVariant = 'filled' | 'outlined' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface ButtonClassNames {
  icon?: string
  label?: string
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Tono de color del theme. 'primary' (default) no emite data-tone. */
  tone?: ButtonTone
  iconLeft?: ReactNode
  iconRight?: ReactNode
  /** Clases adicionales por sub-parte (icon/label). Aditivo: nunca reemplaza la clase base. */
  classNames?: ButtonClassNames
}

/**
 * Button headless. No lleva ni un byte de estilo propio: solo estructura + el
 * contrato de datos que el CSS usa para pintarlo.
 *
 * Contrato:
 *   [data-sk="button"]      raíz
 *   [data-variant]          filled | outlined | ghost
 *   [data-size]             sm | md | lg
 *   [data-tone]             secondary | tertiary | success | warning | info | danger
 *                           (ausente = primary; el CSS pinta cada tono con var(--sk-<tono>))
 *   [data-part="icon"]      slot de ícono (izq/der)
 *   [data-part="label"]     texto
 *   :disabled               estado nativo (el CSS lo estila con :disabled)
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'filled',
    size = 'md',
    tone = 'primary',
    iconLeft,
    iconRight,
    className,
    children,
    type,
    classNames,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      data-sk="button"
      data-variant={variant}
      data-size={size}
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-button', className)}
      {...rest}
    >
      {iconLeft ? (
        <span data-part="icon" className={cx('sk-button__icon', classNames?.icon)}>
          {iconLeft}
        </span>
      ) : null}
      {children ? (
        <span data-part="label" className={cx('sk-button__label', classNames?.label)}>
          {children}
        </span>
      ) : null}
      {iconRight ? (
        <span data-part="icon" className={cx('sk-button__icon', classNames?.icon)}>
          {iconRight}
        </span>
      ) : null}
    </button>
  )
})
