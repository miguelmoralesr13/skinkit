import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type BadgeVariant =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

/**
 * Badge headless — etiqueta/píldora corta (estado, conteo, categoría). Puro presentacional:
 * sin comportamiento, la forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="badge"]       raíz
 *   [data-variant]          neutral | primary | danger
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'neutral', className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      data-sk="badge"
      data-variant={variant}
      className={cx('sk-badge', className)}
      {...rest}
    >
      {children as ReactNode}
    </span>
  )
})
