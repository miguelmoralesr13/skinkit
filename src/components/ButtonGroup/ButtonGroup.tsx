import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

export type ButtonGroupOrientation = 'horizontal' | 'vertical'

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ButtonGroupOrientation
  label?: string
}

/**
 * ButtonGroup headless — junta varios <Button> en un bloque unido (barras de acción,
 * toolbars). El skin colapsa los bordes/radios internos para que se vean pegados.
 *
 * Contrato:
 *   [data-sk="button-group"]  [data-orientation]  raíz (role=group)
 *   (estila los [data-sk="button"] hijos: primero/último/medio)
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { orientation = 'horizontal', label, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-sk="button-group"
      data-orientation={orientation}
      role="group"
      aria-label={label}
      className={cx('sk-button-group', className)}
      {...rest}
    >
      {children}
    </div>
  )
})
