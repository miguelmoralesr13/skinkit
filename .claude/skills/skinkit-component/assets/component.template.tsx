import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface XxxProps extends HTMLAttributes<HTMLDivElement> {
  // …props propias tipadas…
  variant?: 'a' | 'b'
}

/**
 * Xxx headless — sin estilo propio; la forma la da el skin.
 *
 * Contrato:
 *   [data-sk="xxx"]         raíz
 *   [data-variant]          a | b
 *   [data-part="..."]       sub-partes estilables
 */
export const Xxx = forwardRef<HTMLDivElement, XxxProps>(function Xxx(
  { variant = 'a', className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-sk="xxx"
      data-variant={variant}
      className={cx('sk-xxx', className)}
      {...rest}
    >
      <span data-part="label">{children as ReactNode}</span>
    </div>
  )
})
