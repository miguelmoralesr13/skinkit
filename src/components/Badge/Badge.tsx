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
  | 'soft'

/** Tono del Badge `soft` (fondo claro del tono + texto del tono). */
export type BadgeTone = Exclude<BadgeVariant, 'soft'>

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  /** Solo con `variant="soft"`: tono del fondo claro. Sin él, `soft` usa primary. */
  tone?: BadgeTone
}

/**
 * Badge headless — etiqueta/píldora corta (estado, conteo, categoría). Puro presentacional:
 * sin comportamiento, la forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="badge"]       raíz
 *   [data-variant]          neutral | primary | secondary | … | danger | soft
 *   [data-tone]             solo con soft (el tono del fondo claro)
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'neutral', tone, className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      data-sk="badge"
      data-variant={variant}
      data-tone={variant === 'soft' ? tone : undefined}
      className={cx('sk-badge', className)}
      {...rest}
    >
      {children as ReactNode}
    </span>
  )
})
