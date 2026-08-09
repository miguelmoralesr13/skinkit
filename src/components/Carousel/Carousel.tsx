import {
  Children,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  /** Vuelve al principio/fin en los extremos. */
  loop?: boolean
  label?: string
}

/**
 * Carousel headless — muestra un slide a la vez de varios, con anterior/siguiente y puntos.
 * Compuesto: <Carousel> con <Carousel.Slide>. Cuenta los slides y arma los controles solo.
 * La forma (transición, tamaño) la da el skin.
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
  label = 'Carrusel',
  className,
  children,
  style,
  ...rest
}: CarouselProps) {
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
      <div data-part="viewport">
        <div data-part="track">
          {slides.map((slide, i) => (
            <div
              data-part="slide"
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${count}`}
              aria-hidden={i !== current}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        data-part="prev"
        aria-label="Anterior"
        disabled={!loop && current <= 0}
        onClick={() => go(current - 1)}
      >
        ‹
      </button>
      <button
        type="button"
        data-part="next"
        aria-label="Siguiente"
        disabled={!loop && current >= count - 1}
        onClick={() => go(current + 1)}
      >
        ›
      </button>

      {count > 1 ? (
        <div data-part="dots" role="tablist" aria-label="Slides">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              data-part="dot"
              data-active={i === current ? '' : undefined}
              role="tab"
              aria-selected={i === current}
              aria-label={`Ir al slide ${i + 1}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export interface CarouselSlideProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/** Contenedor de un slide. Es transparente: el <Carousel> lo envuelve en su [data-part=slide]. */
function CarouselSlide({ children }: CarouselSlideProps) {
  return <>{children}</>
}

Carousel.Slide = CarouselSlide
