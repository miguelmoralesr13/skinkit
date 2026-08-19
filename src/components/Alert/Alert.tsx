import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type AlertVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'info' | 'danger'

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant
  /** Título opcional (negrita) arriba del cuerpo. */
  title?: ReactNode
  /** Ícono opcional a la izquierda. */
  icon?: ReactNode
  /** Si se pasa, se renderiza un botón de cierre que la invoca. */
  onClose?: () => void
}

/**
 * Alert headless — mensaje de feedback (info, aviso, error). role="alert" para que los
 * lectores lo anuncien. Sin estilo propio: la forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="alert"]        raíz (role=alert)
 *   [data-variant]           neutral | primary | danger
 *   [data-part="icon"]       ícono (opcional)
 *   [data-part="content"]    columna de texto
 *   [data-part="title"]      título (opcional)
 *   [data-part="body"]       cuerpo del mensaje
 *   [data-part="close"]      botón de cierre (si hay onClose)
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = 'neutral', title, icon, onClose, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-sk="alert"
      data-variant={variant}
      role="alert"
      className={cx('sk-alert', className)}
      {...rest}
    >
      {icon ? (
        <span data-part="icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div data-part="content">
        {title ? <div data-part="title">{title}</div> : null}
        {children ? <div data-part="body">{children}</div> : null}
      </div>
      {onClose ? (
        <button type="button" data-part="close" aria-label="Cerrar" onClick={onClose}>
          ×
        </button>
      ) : null}
    </div>
  )
})
