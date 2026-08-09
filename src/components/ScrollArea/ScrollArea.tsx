import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ScrollAreaOrientation
  /** Alto máximo (número = px) para el scroll vertical. */
  maxHeight?: number | string
}

/**
 * ScrollArea headless — región con scroll y barra estilizada por el skin (scrollbar-color /
 * ::-webkit-scrollbar). Mantiene el scroll nativo (rueda, teclado, touch); solo cambia el look.
 *
 * Contrato:
 *   [data-sk="scroll-area"]   [data-orientation]   raíz (viewport con overflow)
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { orientation = 'vertical', maxHeight, className, style, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-sk="scroll-area"
      data-orientation={orientation}
      className={cx('sk-scroll-area', className)}
      style={{ maxHeight, ...(style as CSSProperties) }}
      {...rest}
    >
      {children}
    </div>
  )
})
