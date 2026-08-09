import {
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react'
import { cx } from '../../lib/cx'

export type BackTopTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface BackTopProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Píxeles de scroll a partir de los cuales aparece. */
  threshold?: number
  /** Color del botón (del theme). 'primary' (default) no emite data-tone. */
  tone?: BackTopTone
  /**
   * Contenedor scrolleable a observar/subir. Si se omite, usa la ventana.
   * Pasá un ref al elemento con overflow.
   */
  target?: RefObject<HTMLElement | null>
  /** `smooth` (default) o `auto`. */
  behavior?: ScrollBehavior
  /** Contenido del botón (ej. un ícono ↑). */
  children?: ReactNode
  label?: string
}

/**
 * BackTop headless — botón "volver arriba" que aparece al pasar cierto scroll y sube al tope al
 * hacer click. Estructura + estado; la forma/posición fija la da el skin.
 *
 * Contrato:
 *   [data-sk="back-top"]              el botón
 *   [data-visible="true|false"]       si superó el threshold (los skins animan la aparición)
 */
export function BackTop({
  threshold = 240,
  target,
  behavior = 'smooth',
  className,
  onClick,
  children,
  label = 'Volver arriba',
  tone = 'primary',
  ...rest
}: BackTopProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = target?.current ?? null
    const read = () => (el ? el.scrollTop : window.scrollY)
    const update = () => setVisible(read() > threshold)
    update()
    const source: HTMLElement | Window = el ?? window
    source.addEventListener('scroll', update, { passive: true })
    return () => source.removeEventListener('scroll', update)
  }, [threshold, target])

  const toTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    const el = target?.current
    if (el) el.scrollTo({ top: 0, behavior })
    else window.scrollTo({ top: 0, behavior })
  }

  return (
    <button
      type="button"
      data-sk="back-top"
      data-visible={visible}
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-back-top', className)}
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={toTop}
      {...rest}
    >
      {children ?? '↑'}
    </button>
  )
}
