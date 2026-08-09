import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

export type SeparatorOrientation = 'horizontal' | 'vertical'

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: SeparatorOrientation
  /** Si es solo visual (no separa grupos semánticos), se oculta a lectores de pantalla. */
  decorative?: boolean
}

/**
 * Separator headless — línea divisoria entre bloques o ítems. La forma (grosor, color,
 * espaciado) la da el skin; el componente solo aporta orientación y semántica ARIA.
 *
 * Contrato:
 *   [data-sk="separator"]    raíz
 *   [data-orientation]       horizontal | vertical
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = 'horizontal', decorative = false, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-sk="separator"
      data-orientation={orientation}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={!decorative && orientation === 'vertical' ? 'vertical' : undefined}
      className={cx('sk-separator', className)}
      {...rest}
    />
  )
})
