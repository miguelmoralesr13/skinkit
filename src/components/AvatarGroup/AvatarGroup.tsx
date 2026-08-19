import { Children, forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'
import { Avatar, type AvatarSize } from '../Avatar'

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Máximo de avatares visibles; el resto se resume en un "+N". */
  max?: number
  /** Tamaño aplicado al "+N" de overflow (los avatares traen el suyo). */
  size?: AvatarSize
}

/**
 * AvatarGroup headless — apila avatares superpuestos y resume el excedente en un "+N".
 * El solapamiento y el borde de recorte los da el CSS. Los hijos son <Avatar>.
 *
 * Contrato:
 *   [data-sk="avatar-group"]   raíz
 *   [data-part="overflow"]      el "+N" (usa un Avatar con [data-part=fallback])
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { max, size = 'md', className, children, ...rest },
  ref,
) {
  const items = Children.toArray(children)
  const visible = max != null && items.length > max ? items.slice(0, max) : items
  const overflow = max != null && items.length > max ? items.length - max : 0

  return (
    <div ref={ref} data-sk="avatar-group" className={cx('sk-avatar-group', className)} {...rest}>
      {visible}
      {overflow > 0 ? (
        <span data-part="overflow">
          <Avatar size={size} fallback={`+${overflow}`} />
        </span>
      ) : null}
    </div>
  )
})
