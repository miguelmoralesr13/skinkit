import {
  forwardRef,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'

export type AvatarSize = 'sm' | 'md' | 'lg'
export type AvatarTone =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** URL de la imagen. Si falta o falla la carga, se muestra el fallback. */
  src?: string
  /** Texto alternativo de la imagen (accesibilidad). */
  alt?: string
  /** Qué mostrar sin imagen: iniciales o un ícono. */
  fallback?: ReactNode
  size?: AvatarSize
  /** Color del fondo de fallback (del theme). 'neutral' (default) no emite data-tone. */
  tone?: AvatarTone
}

/**
 * Avatar headless — imagen de perfil con fallback (iniciales/ícono) cuando no hay `src`
 * o la imagen falla. La forma (tamaño real, redondeo) la da el CSS.
 *
 * Contrato:
 *   [data-sk="avatar"]       raíz
 *   [data-size]              sm | md | lg
 *   [data-part="image"]      la <img> (solo si hay src y cargó ok)
 *   [data-part="fallback"]   contenido alternativo (iniciales/ícono)
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt = '', fallback, size = 'md', tone = 'neutral', className, ...rest },
  ref,
) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])

  const showImage = Boolean(src) && !failed

  return (
    <span
      ref={ref}
      data-sk="avatar"
      data-size={size}
      data-tone={tone === 'neutral' ? undefined : tone}
      className={cx('sk-avatar', className)}
      {...rest}
    >
      {showImage ? (
        <img data-part="image" src={src} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <span data-part="fallback" aria-label={alt || undefined} role={alt ? 'img' : undefined}>
          {fallback}
        </span>
      )}
    </span>
  )
})
