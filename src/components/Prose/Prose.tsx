import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface ProseProps extends HTMLAttributes<HTMLDivElement> {
  /** Densidad tipográfica. */
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
}

/**
 * Prose headless — contenedor para texto largo (artículos, markdown renderizado, contenido de un
 * CMS) que da estilo tipográfico legible a su HTML hijo (h1–h6, p, ul/ol, blockquote, code, a,
 * img, hr, table). El componente NO trae estilos: sólo marca el contenedor y su tamaño; el CSS del
 * componente estiliza los descendientes.
 *
 * Contrato:
 *   [data-sk="prose"]        raíz; envuelve HTML arbitrario
 *   [data-size]              sm | md | lg
 *
 * El CSS targetea descendientes por tag: [data-sk="prose"] h2 { ... }, etc.
 */
export function Prose({ size = 'md', className, children, ...rest }: ProseProps) {
  return (
    <div data-sk="prose" data-size={size} className={cx('sk-prose', className)} {...rest}>
      {children}
    </div>
  )
}
