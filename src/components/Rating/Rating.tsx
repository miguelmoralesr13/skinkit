import { Star } from 'lucide-react'
import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'
import { useSkinkitMessages } from '../../i18n/context'

export type RatingTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface RatingClassNames {
  star?: string
}

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
  /** Clases adicionales por sub-parte (star). Aditivo: nunca reemplaza la clase base. Misma clase aplica a todas las estrellas. */
  classNames?: RatingClassNames
}

/**
 * Rating headless — puntuación con estrellas (ícono Star de lucide-react). Cada estrella
 * es un botón; el CSS las pinta llenas/vacías vía [data-filled] (fill=currentColor si llena).
 *
 * Contrato:
 *   [data-sk="rating"]      [data-readonly]   raíz (role=radiogroup)
 *   [data-part="star"]      [data-filled]     cada estrella (botón). filled si i <= value
 */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  {
    value = 0,
    max = 5,
    onChange,
    readOnly,
    label: labelProp,
    tone = 'primary',
    className,
    classNames,
    ...rest
  },
  ref,
) {
  const m = useSkinkitMessages()
  const label = labelProp ?? m.rating.label
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
          className={cx('sk-rating__star', classNames?.star)}
        >
          <Star size={20} fill={n <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  )
})
