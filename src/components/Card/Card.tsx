import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface CardClassNames {
  header?: string
  body?: string
  footer?: string
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode
  footer?: ReactNode
  /** Clases adicionales por parte interna (header/body/footer). No reemplaza la clase base. */
  classNames?: CardClassNames
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
  { header, footer, className, children, classNames, ...rest },
  ref,
) {
  return (
    <div ref={ref} data-sk="card" className={cx('sk-card', className)} {...rest}>
      {header ? (
        <div data-part="header" className={cx('sk-card__header', classNames?.header)}>
          {header}
        </div>
      ) : null}
      <div data-part="body" className={cx('sk-card__body', classNames?.body)}>
        {children}
      </div>
      {footer ? (
        <div data-part="footer" className={cx('sk-card__footer', classNames?.footer)}>
          {footer}
        </div>
      ) : null}
    </div>
  )
})
