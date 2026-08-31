import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type MarqueeDirection = 'left' | 'right'

export interface MarqueeClassNames {
  track?: string
  group?: string
}

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  direction?: MarqueeDirection
  /** Segundos que tarda una vuelta (menos = más rápido). */
  speed?: number
  /** Pausa la animación al pasar el mouse. */
  pauseOnHover?: boolean
  children: ReactNode
  classNames?: MarqueeClassNames
}

/**
 * Marquee headless — tira de contenido que se desplaza en loop (logos, avisos, tickers). El
 * contenido se duplica para un loop sin costura; la animación la corre el CSS (--sk-marquee-*).
 *
 * Contrato:
 *   [data-sk="marquee"]   [data-direction] [data-pause-hover]   raíz (overflow hidden)
 *   [data-part="track"]   pista que se anima (contiene dos copias del contenido)
 *   [data-part="group"]   cada copia del contenido
 */
export const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(function Marquee(
  { direction = 'left', speed = 20, pauseOnHover, className, style, children, classNames, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-sk="marquee"
      data-direction={direction}
      data-pause-hover={pauseOnHover ? '' : undefined}
      className={cx('sk-marquee', className)}
      style={{ ['--sk-marquee-duration' as string]: `${speed}s`, ...(style as CSSProperties) }}
      {...rest}
    >
      <div data-part="track" className={cx('sk-marquee__track', classNames?.track)}>
        <div data-part="group" className={cx('sk-marquee__group', classNames?.group)}>
          {children}
        </div>
        <div
          data-part="group"
          aria-hidden="true"
          className={cx('sk-marquee__group', classNames?.group)}
        >
          {children}
        </div>
      </div>
    </div>
  )
})
