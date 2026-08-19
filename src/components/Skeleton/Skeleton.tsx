import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

export type SkeletonVariant = 'text' | 'circle' | 'rect'

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: SkeletonVariant
  /** Ancho (número = px). Contenido, no forma → va por style. */
  width?: number | string
  /** Alto (número = px). */
  height?: number | string
}

/**
 * Skeleton headless — placeholder de carga (bloque gris que "respira"). Puro decorativo
 * (aria-hidden). La animación/shimmer y el radio los da el CSS; el tamaño lo pasás vos.
 *
 * Contrato:
 *   [data-sk="skeleton"]     raíz
 *   [data-variant]           text | circle | rect
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, className, style, ...rest },
  ref,
) {
  const sizeStyle: CSSProperties = {
    width,
    height,
    ...style,
  }

  return (
    <span
      ref={ref}
      data-sk="skeleton"
      data-variant={variant}
      aria-hidden="true"
      className={cx('sk-skeleton', className)}
      style={sizeStyle}
      {...rest}
    />
  )
})
