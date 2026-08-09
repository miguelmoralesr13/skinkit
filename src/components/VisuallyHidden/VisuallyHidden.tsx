import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

/**
 * VisuallyHidden — oculta contenido a la vista pero lo deja disponible para lectores de
 * pantalla (labels de solo-audio, textos de contexto). A diferencia del resto, su CSS de
 * ocultamiento vive en la BASE (skinkit/styles/base), no en un skin: es accesibilidad, no
 * estética, y debe funcionar siempre.
 *
 * Contrato:
 *   [data-sk="visually-hidden"]   raíz (ocultada por la base)
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ className, children, ...rest }, ref) {
    return (
      <span ref={ref} data-sk="visually-hidden" className={cx('sk-visually-hidden', className)} {...rest}>
        {children}
      </span>
    )
  },
)
