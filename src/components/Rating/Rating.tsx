import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

export type RatingTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Valor actual (0..max). */
  value?: number
  max?: number
  /** Se invoca con el nuevo valor al elegir una estrella. */
  onChange?: (value: number) => void
  /** Solo lectura: muestra el valor pero no se puede cambiar. */
  readOnly?: boolean
  label?: string
  /** Color de las estrellas llenas (del theme). 'primary' (default) no emite data-tone. */
  tone?: RatingTone
}

/**
 * Rating headless — puntuación con estrellas (u otro glyph que ponga el skin). Cada estrella
 * es un botón; el skin las pinta llenas/vacías vía [data-filled]. La forma la da el skin.
 *
 * Contrato:
 *   [data-sk="rating"]      [data-readonly]   raíz (role=radiogroup)
 *   [data-part="star"]      [data-filled]     cada estrella (botón). filled si i <= value
 */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  { value = 0, max = 5, onChange, readOnly, label = 'Puntuación', tone = 'primary', className, ...rest },
  ref,
) {
  const stars = Array.from({ length: max }, (_, i) => i + 1)

  return (
    <div
      ref={ref}
      data-sk="rating"
      data-readonly={readOnly ? '' : undefined}
      data-tone={tone === 'primary' ? undefined : tone}
      role="radiogroup"
      aria-label={label}
      className={cx('sk-rating', className)}
      {...rest}
    >
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          data-part="star"
          data-filled={n <= value ? '' : undefined}
          role="radio"
          aria-checked={n === value}
          aria-label={`${n} de ${max}`}
          disabled={readOnly}
          tabIndex={readOnly ? -1 : 0}
          onClick={() => onChange?.(n)}
        >
          ★
        </button>
      ))}
    </div>
  )
})
