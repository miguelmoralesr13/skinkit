import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
} from 'react'
import { cx } from '../../lib/cx'

export type ColorSwatchSize = 'sm' | 'md' | 'lg'

export interface ColorSwatchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Color CSS a mostrar (ej. "#2f6df6", "tomato", "hsl(...)"). */
  color: string
  size?: ColorSwatchSize
  /** Marca la muestra como elegida (para grupos de selección). */
  selected?: boolean
}

/**
 * ColorSwatch headless — muestra un color (chip). Interactivo: es un <button>, con estado
 * [data-selected] para grupos de selección. El color va por style (contenido, no theme); la
 * forma (tamaño, radio, check) la da el skin.
 *
 * Contrato:
 *   [data-sk="color-swatch"]   [data-size] [data-selected]   raíz (<button>)
 *   (expone --sk-swatch con el color)
 */
export const ColorSwatch = forwardRef<HTMLButtonElement, ColorSwatchProps>(function ColorSwatch(
  { color, size = 'md', selected, className, style, type, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      data-sk="color-swatch"
      data-size={size}
      data-selected={selected ? '' : undefined}
      aria-pressed={selected}
      title={color}
      className={cx('sk-color-swatch', className)}
      style={{ ['--sk-swatch' as string]: color, ...(style as CSSProperties) }}
      {...rest}
    />
  )
})
