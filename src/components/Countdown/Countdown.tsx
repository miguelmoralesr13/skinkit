import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

/** Clases opcionales por sub-parte de <Countdown>. Aditivas: nunca reemplazan la clase base. */
export interface CountdownClassNames {
  /** Se aplica a TODOS los bloques (uno por unidad: días/horas/min/seg). */
  segment?: string
  value?: string
  label?: string
}

export interface CountdownProps extends HTMLAttributes<HTMLDivElement> {
  /** Objetivo: ISO string o timestamp (ms). */
  to: string | number
  /** Se invoca al llegar a cero. */
  onComplete?: () => void
  /** Ocultar los días si son 0. */
  hideDaysWhenZero?: boolean
  labels?: { days?: string; hours?: string; minutes?: string; seconds?: string }
  /** Clases opcionales por sub-parte (segment/value/label). Aditivas. */
  classNames?: CountdownClassNames
}

function toMs(to: string | number): number {
  return typeof to === 'number' ? to : new Date(to).getTime()
}
const pad2 = (n: number) => String(n).padStart(2, '0')

/**
 * Countdown headless — cuenta regresiva a un momento (lanzamiento, oferta). Muestra
 * días/horas/minutos/segundos y avisa al llegar a cero. La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="countdown"]   raíz · [data-done] al terminar
 *   [data-part="segment"]   [data-unit=days|hours|minutes|seconds]   cada bloque
 *   [data-part="value"]     el número
 *   [data-part="label"]     la etiqueta de la unidad
 */
export const Countdown = forwardRef<HTMLDivElement, CountdownProps>(function Countdown(
  {
    to,
    onComplete,
    hideDaysWhenZero,
    labels,
    className,
    classNames,
    ...rest
  },
  ref,
) {
  const target = toMs(to)
  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()))
  const doneRef = useRef(false)

  useEffect(() => {
    doneRef.current = false
    const tick = () => {
      const r = Math.max(0, target - Date.now())
      setRemaining(r)
      if (r === 0 && !doneRef.current) {
        doneRef.current = true
        onComplete?.()
      }
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [target, onComplete])

  const total = Math.floor(remaining / 1000)
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  const done = remaining === 0

  const segs: { unit: string; value: number; label: string }[] = [
    { unit: 'days', value: days, label: labels?.days ?? 'días' },
    { unit: 'hours', value: hours, label: labels?.hours ?? 'hs' },
    { unit: 'minutes', value: minutes, label: labels?.minutes ?? 'min' },
    { unit: 'seconds', value: seconds, label: labels?.seconds ?? 'seg' },
  ].filter((s) => !(s.unit === 'days' && hideDaysWhenZero && days === 0))

  return (
    <div
      ref={ref}
      data-sk="countdown"
      data-done={done ? '' : undefined}
      role="timer"
      className={cx('sk-countdown', className)}
      {...rest}
    >
      {segs.map((s) => (
        <div
          key={s.unit}
          data-part="segment"
          data-unit={s.unit}
          className={cx('sk-countdown__segment', classNames?.segment)}
        >
          <span data-part="value" className={cx('sk-countdown__value', classNames?.value)}>
            {s.unit === 'days' ? s.value : pad2(s.value)}
          </span>
          <span data-part="label" className={cx('sk-countdown__label', classNames?.label)}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  )
})
