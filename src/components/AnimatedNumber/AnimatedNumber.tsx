import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

export interface AnimatedNumberProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  value: number
  /** Duración de la animación en ms. */
  duration?: number
  /** Decimales a mostrar. */
  decimals?: number
  /** Formateador propio (recibe el número interpolado). Reemplaza a decimals. */
  format?: (n: number) => string
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * AnimatedNumber headless — anima el conteo desde el valor anterior hasta `value` (métricas,
 * contadores). Sin estilo propio salvo tabular-nums (lo pone el CSS).
 *
 * Contrato:
 *   [data-sk="animated-number"]   raíz (<span>)
 */
export const AnimatedNumber = forwardRef<HTMLSpanElement, AnimatedNumberProps>(
  function AnimatedNumber({ value, duration = 800, decimals = 0, format, className, ...rest }, ref) {
    const [display, setDisplay] = useState(value)
    const fromRef = useRef(value)
    const rafRef = useRef<number | null>(null)

    useEffect(() => {
      const from = fromRef.current
      const to = value
      if (from === to) return
      let start: number | null = null
      const tick = (ts: number) => {
        if (start == null) start = ts
        const t = Math.min((ts - start) / duration, 1)
        setDisplay(from + (to - from) * easeOut(t))
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          fromRef.current = to
        }
      }
      rafRef.current = requestAnimationFrame(tick)
      return () => {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
        fromRef.current = value
      }
    }, [value, duration])

    const text = format ? format(display) : display.toFixed(decimals)

    return (
      <span ref={ref} data-sk="animated-number" className={cx('sk-animated-number', className)} {...rest}>
        {text}
      </span>
    )
  },
)
