import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode
  footer?: ReactNode
}

/**
 * Card headless.
 *
 * Contrato:
 *   [data-sk="card"]        raíz
 *   [data-part="header"]    cabecera (opcional)
 *   [data-part="body"]      contenido
 *   [data-part="footer"]    pie (opcional)
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { header, footer, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} data-sk="card" className={cx('sk-card', className)} {...rest}>
      {header ? <div data-part="header">{header}</div> : null}
      <div data-part="body">{children}</div>
      {footer ? <div data-part="footer">{footer}</div> : null}
    </div>
  )
})
