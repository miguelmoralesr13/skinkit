import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type NavTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Modo colapsado: el skin muestra sólo íconos (rail). */
  collapsed?: boolean
  /** Color del ítem activo (del theme). 'primary' (default) no emite data-tone. */
  tone?: NavTone
  children?: ReactNode
}

/**
 * Sidebar headless — navegación vertical de app. Compound: Sidebar + Sidebar.Section +
 * Sidebar.Item. `collapsed` deja un rail de sólo íconos (lo resuelve el skin). Sólo estructura.
 *
 * Contrato:
 *   [data-sk="sidebar"]        raíz (<aside>) · [data-collapsed]
 *   [data-part="section"]      grupo de items · [data-part="section-label"] su título
 *   [data-part="item"]         item (<a>/<button>) · [data-active] + aria-current
 *   [data-part="item-icon"] · [data-part="item-label"] · [data-part="item-badge"]
 */
export function Sidebar({ collapsed, tone = 'primary', className, children, ...rest }: SidebarProps) {
  return (
    <aside
      data-sk="sidebar"
      data-collapsed={collapsed ? '' : undefined}
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-sidebar', className)}
      {...rest}
    >
      {children}
    </aside>
  )
}

export interface SidebarSectionProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
}

function SidebarSection({ label, className, children, ...rest }: SidebarSectionProps) {
  return (
    <div data-part="section" className={cx('sk-sidebar__section', className)} {...rest}>
      {label != null && <div data-part="section-label">{label}</div>}
      {children}
    </div>
  )
}

export interface SidebarItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
  icon?: ReactNode
  badge?: ReactNode
}

function SidebarItem({ active, icon, badge, className, children, ...rest }: SidebarItemProps) {
  return (
    <a
      data-part="item"
      data-active={active ? '' : undefined}
      aria-current={active ? 'page' : undefined}
      className={cx('sk-sidebar__item', className)}
      {...rest}
    >
      {icon != null && <span data-part="item-icon">{icon}</span>}
      <span data-part="item-label">{children}</span>
      {badge != null && <span data-part="item-badge">{badge}</span>}
    </a>
  )
}

Sidebar.Section = SidebarSection
Sidebar.Item = SidebarItem
