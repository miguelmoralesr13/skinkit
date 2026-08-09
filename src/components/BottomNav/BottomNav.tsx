import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type BottomNavTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface BottomNavProps extends HTMLAttributes<HTMLElement> {
  /** Color del ítem activo (del theme). 'primary' (default) no emite data-tone. */
  tone?: BottomNavTone
  children?: ReactNode
}

/**
 * BottomNav headless — barra de navegación inferior (tab bar tipo mobile). Compound: BottomNav +
 * BottomNav.Item (ícono + label). No se posiciona sola (no es fixed): la ubica el consumidor o el
 * AppShell. Sólo estructura + contrato.
 *
 * Contrato:
 *   [data-sk="bottom-nav"]     raíz (<nav>)
 *   [data-part="item"]         item (<a>/<button>) · [data-active] + aria-current
 *   [data-part="item-icon"] · [data-part="item-label"]
 */
export function BottomNav({ tone = 'primary', className, children, ...rest }: BottomNavProps) {
  return (
    <nav
      data-sk="bottom-nav"
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-bottom-nav', className)}
      {...rest}
    >
      {children}
    </nav>
  )
}

export interface BottomNavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
  icon?: ReactNode
}

function BottomNavItem({ active, icon, className, children, ...rest }: BottomNavItemProps) {
  return (
    <a
      data-part="item"
      data-active={active ? '' : undefined}
      aria-current={active ? 'page' : undefined}
      className={cx('sk-bottom-nav__item', className)}
      {...rest}
    >
      {icon != null && <span data-part="item-icon">{icon}</span>}
      <span data-part="item-label">{children}</span>
    </a>
  )
}

BottomNav.Item = BottomNavItem
