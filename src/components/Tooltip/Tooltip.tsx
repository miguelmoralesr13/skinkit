import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Contenido del tooltip (texto corto). */
  label: ReactNode
  /** Lado donde aparece respecto del trigger. */
  side?: TooltipSide
  /** El elemento que dispara el tooltip (debe ser focuseable para verlo con teclado). */
  children: ReactNode
}

/**
 * Tooltip headless — burbuja de ayuda que aparece al pasar el mouse o enfocar el trigger.
 * NO usa portal: vive en el árbol (así conserva el scope [data-theme]/[data-skin] del
 * provider). El mostrar/ocultar lo hace el skin por CSS (:hover / :focus-within); el
 * posicionamiento por [data-side]. El componente solo aporta estructura y ARIA.
 *
 * Contrato:
 *   [data-sk="tooltip"]      raíz (envuelve trigger + contenido)
 *   [data-side]              top | bottom | left | right
 *   [data-part="trigger"]    envoltura del disparador (aria-describedby → contenido)
 *   [data-part="content"]    la burbuja (role=tooltip); el skin la muestra/oculta
 */
export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  { label, side = 'top', className, children, ...rest },
  ref,
) {
  const id = useId()

  return (
    <span
      ref={ref}
      data-sk="tooltip"
      data-side={side}
      className={cx('sk-tooltip', className)}
      {...rest}
    >
      <span data-part="trigger" aria-describedby={id}>
        {children}
      </span>
      <span data-part="content" role="tooltip" id={id}>
        {label}
      </span>
    </span>
  )
})
