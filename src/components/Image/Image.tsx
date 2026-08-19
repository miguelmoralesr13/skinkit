import { useState, type CSSProperties, type ImgHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'onLoad'> {
  src: string
  alt: string
  /** Imagen alternativa si `src` falla. Si tampoco carga (o no se pasa), se muestra el fallback. */
  fallbackSrc?: string
  /** Relación de aspecto: número (16/9 = 1.78) o string CSS ('16/9'). */
  ratio?: number | string
  /** object-fit de la imagen. Default 'cover'. */
  fit?: CSSProperties['objectFit']
  /** Esquinas redondeadas (lo define el CSS vía [data-rounded]). */
  rounded?: boolean
  /** Contenido a mostrar cuando la imagen falla (default: un placeholder del CSS). */
  fallback?: ReactNode
}

type Status = 'loading' | 'loaded' | 'error'

/**
 * Image headless — <img> con estado de carga, fallback ante error y relación de aspecto. No estila
 * colores/bordes: expone [data-status]/[data-rounded] y los parts; la forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="image"]     [data-status=loading|loaded|error] [data-rounded]
 *   [data-part="img"]     la imagen
 *   [data-part="fallback"] placeholder cuando falla (y no hay fallbackSrc válido)
 */
export function Image({
  src,
  alt,
  fallbackSrc,
  ratio,
  fit = 'cover',
  rounded,
  fallback,
  className,
  style,
  ...rest
}: ImageProps) {
  const [status, setStatus] = useState<Status>('loading')
  const [currentSrc, setCurrentSrc] = useState(src)
  const [triedFallback, setTriedFallback] = useState(false)

  const onError = () => {
    if (fallbackSrc && !triedFallback) {
      setTriedFallback(true)
      setCurrentSrc(fallbackSrc)
      setStatus('loading')
    } else {
      setStatus('error')
    }
  }

  const aspectRatio =
    ratio == null ? undefined : typeof ratio === 'number' ? String(ratio) : ratio.replace('/', ' / ')

  return (
    <div
      data-sk="image"
      data-status={status}
      data-rounded={rounded ? '' : undefined}
      className={cx('sk-image', className)}
      style={{ aspectRatio, ...(style as CSSProperties) }}
    >
      {status === 'error' ? (
        <div data-part="fallback" role="img" aria-label={alt}>
          {fallback}
        </div>
      ) : (
        <img
          data-part="img"
          src={currentSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setStatus('loaded')}
          onError={onError}
          style={{ objectFit: fit }}
          {...rest}
        />
      )}
    </div>
  )
}
