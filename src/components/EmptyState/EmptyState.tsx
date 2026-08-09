import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  description?: ReactNode
  /** Ícono/ilustración arriba del título. */
  icon?: ReactNode
  /** Acciones (botones) al pie. */
  children?: ReactNode
}

/**
 * EmptyState headless — mensaje para cuando no hay contenido (lista vacía, sin resultados).
 * Ícono + título + descripción + acciones opcionales. La forma la da el skin.
 *
 * Contrato:
 *   [data-sk="empty"]           raíz
 *   [data-part="icon"]          ícono/ilustración (opcional)
 *   [data-part="title"]         título
 *   [data-part="description"]   texto de apoyo (opcional)
 *   [data-part="actions"]       acciones (children, opcional)
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, description, icon, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} data-sk="empty" className={cx('sk-empty', className)} {...rest}>
      {icon ? (
        <div data-part="icon" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <div data-part="title">{title}</div>
      {description ? <div data-part="description">{description}</div> : null}
      {children ? <div data-part="actions">{children}</div> : null}
    </div>
  )
})
