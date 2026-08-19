import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface KbdProps extends HTMLAttributes<HTMLElement> {}

/**
 * Kbd headless — representa una tecla o atajo de teclado (⌘, Ctrl, Enter…). Puro
 * presentacional, sobre el elemento semántico <kbd>. La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="kbd"]   raíz (<kbd>)
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, children, ...rest },
  ref,
) {
  return (
    <kbd ref={ref} data-sk="kbd" className={cx('sk-kbd', className)} {...rest}>
      {children as ReactNode}
    </kbd>
  )
})
