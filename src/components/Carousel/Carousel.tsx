import {
  Children,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { useSkinkitMessages, formatMessage } from '../../i18n/context'

export interface CarouselClassNames {
  viewport?: string
  track?: string
  slide?: string
  prev?: string
  next?: string
  dots?: string
  dot?: string
}

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  /** Vuelve al principio/fin en los extremos. */
  loop?: boolean
  label?: string
  classNames?: CarouselClassNames
}

/**
 * Carousel headless — muestra un slide a la vez de varios, con anterior/siguiente y puntos.
 * Compuesto: <Carousel> con <Carousel.Slide>. Cuenta los slides y arma los controles solo.
 * La forma (transición, tamaño) la da el CSS.
 *
 * Contrato:
 *   [data-sk="carousel"]     raíz (role=region)
 *   [data-part="viewport"]   ventana (overflow hidden)
 *   [data-part="track"]      pista desplazable (translateX por --sk-carousel-index)
 *   [data-part="slide"]      cada slide (<Carousel.Slide>)
 *   [data-part="prev"]       botón anterior
 *   [data-part="next"]       botón siguiente
 *   [data-part="dots"]       contenedor de puntos
 *   [data-part="dot"]        [data-active]  cada punto
 */
export function Carousel({
  index,
  defaultIndex = 0,
  onIndexChange,
  loop,
  label: labelProp,
  className,
  children,
  style,
  classNames,
  ...rest
}: CarouselProps) {
  const m = useSkinkitMessages()
  const label = labelProp ?? m.carousel.label
  const slides = Children.toArray(children)
  const count = slides.length
  const isControlled = index !== undefined
  const [internal, setInternal] = useState(defaultIndex)
  const current = Math.min(isControlled ? index : internal, Math.max(count - 1, 0))

  const go = (to: number) => {
    let next = to
    if (loop) next = (to + count) % count
    else next = Math.min(Math.max(to, 0), count - 1)
    if (!isControlled) setInternal(next)
    onIndexChange?.(next)
  }

  return (
    <div
      data-sk="carousel"
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      className={cx('sk-carousel', className)}
      style={{ ['--sk-carousel-index' as string]: String(current), ...(style as CSSProperties) }}
      {...rest}
    >
      <div data-part="viewport" className={cx(classNames?.viewport)}>
        <div data-part="track" className={cx(classNames?.track)}>
          {slides.map((slide, i) => (
            <div
              data-part="slide"
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${count}`}
              aria-hidden={i !== current}
              className={cx(classNames?.slide)}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        data-part="prev"
        aria-label={m.carousel.previous}
        disabled={!loop && current <= 0}
        onClick={() => go(current - 1)}
        className={cx(classNames?.prev)}
      >
        ‹
      </button>
      <button
        type="button"
        data-part="next"
        aria-label={m.carousel.next}
        disabled={!loop && current >= count - 1}
        onClick={() => go(current + 1)}
        className={cx(classNames?.next)}
      >
        ›
      </button>

      {count > 1 ? (
        <div data-part="dots" role="tablist" aria-label={m.carousel.slides} className={cx(classNames?.dots)}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              data-part="dot"
              data-active={i === current ? '' : undefined}
              role="tab"
              aria-selected={i === current}
              aria-label={formatMessage(m.carousel.goToSlide, { index: i + 1 })}
              onClick={() => go(i)}
              className={cx(classNames?.dot)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export interface CarouselSlideProps {
  children: ReactNode
}

/** Contenedor de un slide. Es transparente: el <Carousel> lo envuelve en su [data-part=slide]. */
function CarouselSlide({ children }: CarouselSlideProps) {
  return <>{children}</>
}

Carousel.Slide = CarouselSlide
