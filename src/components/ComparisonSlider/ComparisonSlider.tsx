import {
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'

export interface ComparisonSliderProps extends HTMLAttributes<HTMLDivElement> {
  /** Contenido/imagen de fondo (después). */
  after: ReactNode
  /** Contenido/imagen que se revela (antes), recortado por el divisor. */
  before: ReactNode
  /** Posición inicial del divisor (0–100). */
  defaultPosition?: number
  label?: string
}

/**
 * ComparisonSlider headless — compara dos capas (antes/después) con un divisor arrastrable que
 * revela una sobre la otra. Drag con mouse/touch o flechas. Ideal para imágenes. La forma la
 * da el skin.
 *
 * Contrato:
 *   [data-sk="comparison"]   raíz (expone --sk-comparison-pos, 0–100)
 *   [data-part="after"]      capa de fondo (después)
 *   [data-part="before"]     capa recortada (antes)
 *   [data-part="handle"]     el divisor (role=slider, arrastrable/foco)
 */
export function ComparisonSlider({
  after,
  before,
  defaultPosition = 50,
  label = 'Comparar',
  className,
  style,
  ...rest
}: ComparisonSliderProps) {
  const [pos, setPos] = useState(defaultPosition)
  const rootRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const clamp = (v: number) => Math.min(Math.max(v, 0), 100)
  const fromClientX = (clientX: number) => {
    const rect = rootRef.current?.getBoundingClientRect()
    if (!rect) return pos
    return clamp(((clientX - rect.left) / rect.width) * 100)
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    setPos(fromClientX(e.clientX))
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    setPos(fromClientX(e.clientX))
  }
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setPos((p) => clamp(p - 4))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setPos((p) => clamp(p + 4))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setPos(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setPos(100)
    }
  }

  return (
    <div
      ref={rootRef}
      data-sk="comparison"
      className={cx('sk-comparison', className)}
      style={{ ['--sk-comparison-pos' as string]: String(pos), ...(style as CSSProperties) }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      {...rest}
    >
      <div data-part="after">{after}</div>
      <div data-part="before" aria-hidden="true">
        {before}
      </div>
      <div
        data-part="handle"
        role="slider"
        aria-label={label}
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}
