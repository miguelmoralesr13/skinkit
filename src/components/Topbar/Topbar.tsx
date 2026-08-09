import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type TopbarTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface TopbarProps extends HTMLAttributes<HTMLElement> {
  /** Color del ítem de nav activo (del theme). 'primary' (default) no emite data-tone. */
  tone?: TopbarTone
  children?: ReactNode
}

/**
 * Topbar headless — barra superior de app. Compound: Topbar + Topbar.Brand + Topbar.Nav +
 * Topbar.Item + Topbar.Actions. Sólo estructura + contrato; la forma la da el skin.
 *
 * Contrato:
 *   [data-sk="topbar"]        raíz (<header>)
 *   [data-part="brand"]       logo/nombre
 *   [data-part="nav"]         contenedor de items
 *   [data-part="item"]        item de navegación (<a>/<button>); [data-active] + aria-current
 *   [data-part="actions"]     zona de acciones (derecha)
 */
export function Topbar({ tone = 'primary', className, children, ...rest }: TopbarProps) {
  return (
    <header
      data-sk="topbar"
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-topbar', className)}
      {...rest}
    >
      {children}
    </header>
  )
}

function TopbarBrand({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-part="brand" className={cx('sk-topbar__brand', className)} {...rest}>
      {children}
    </div>
  )
}

function TopbarNav({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <nav data-part="nav" className={cx('sk-topbar__nav', className)} {...rest}>
      {children}
    </nav>
  )
}

export interface TopbarItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
  icon?: ReactNode
}

function TopbarItem({ active, icon, className, children, ...rest }: TopbarItemProps) {
  return (
    <a
      data-part="item"
      data-active={active ? '' : undefined}
      aria-current={active ? 'page' : undefined}
      className={cx('sk-topbar__item', className)}
      {...rest}
    >
      {icon != null && <span data-part="item-icon">{icon}</span>}
      {children}
    </a>
  )
}

function TopbarActions({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-part="actions" className={cx('sk-topbar__actions', className)} {...rest}>
      {children}
    </div>
  )
}

Topbar.Brand = TopbarBrand
Topbar.Nav = TopbarNav
Topbar.Item = TopbarItem
Topbar.Actions = TopbarActions
