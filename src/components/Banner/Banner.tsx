import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type BannerVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'info' | 'danger'

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BannerVariant
  icon?: ReactNode
  /** Acción opcional a la derecha (ej. un Button o enlace). */
  action?: ReactNode
  /** Si se pasa, aparece un botón × que lo invoca. */
  onClose?: () => void
}

/**
 * Banner headless — aviso a lo ancho (arriba de una vista o sección). A diferencia de Alert
 * (bloque con título), el Banner es de una línea, horizontal, con acción y cierre opcionales.
 *
 * Contrato:
 *   [data-sk="banner"]      [data-variant]  raíz (role=status)
 *   [data-part="icon"]      ícono (opcional)
 *   [data-part="content"]   mensaje
 *   [data-part="actions"]   acción (opcional)
 *   [data-part="close"]     botón de cierre (si hay onClose)
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  { variant = 'neutral', icon, action, onClose, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-sk="banner"
      data-variant={variant}
      role="status"
      className={cx('sk-banner', className)}
      {...rest}
    >
      {icon ? (
        <span data-part="icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div data-part="content">{children}</div>
      {action ? <div data-part="actions">{action}</div> : null}
      {onClose ? (
        <button type="button" data-part="close" aria-label="Cerrar" onClick={onClose}>
          ×
        </button>
      ) : null}
    </div>
  )
})
