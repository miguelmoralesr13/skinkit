import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** Proporción ancho/alto (ej. 16/9, 1, 4/3). Default 16/9. */
  ratio?: number
}

/**
 * AspectRatio headless — mantiene una proporción ancho/alto para su contenido (imagen,
 * video, iframe, mapa). Usa la propiedad CSS `aspect-ratio`. El hijo llena el espacio.
 *
 * Contrato:
 *   [data-sk="aspect-ratio"]   raíz (con la proporción por style)
 *   (el CSS hace que el hijo — img/iframe/video — llene y recorte)
 */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = 16 / 9, className, style, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-sk="aspect-ratio"
      className={cx('sk-aspect-ratio', className)}
      style={{ aspectRatio: String(ratio), ...(style as CSSProperties) }}
      {...rest}
    >
      {children}
    </div>
  )
})
