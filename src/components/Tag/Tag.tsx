import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type TagVariant =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant
  /** Si se pasa, aparece un botón × que lo invoca (chip removible). */
  onRemove?: () => void
}

/**
 * Tag headless — etiqueta/chip, opcionalmente removible (filtros, selecciones). A diferencia
 * de Badge (puro adorno), Tag puede llevar un botón de quitar. La forma la da el skin.
 *
 * Contrato:
 *   [data-sk="tag"]         raíz
 *   [data-variant]          neutral | primary | danger
 *   [data-part="label"]     texto
 *   [data-part="remove"]    botón × (si hay onRemove)
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { variant = 'neutral', onRemove, className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      data-sk="tag"
      data-variant={variant}
      className={cx('sk-tag', className)}
      {...rest}
    >
      <span data-part="label">{children as ReactNode}</span>
      {onRemove ? (
        <button type="button" data-part="remove" aria-label="Quitar" onClick={onRemove}>
          ×
        </button>
      ) : null}
    </span>
  )
})
