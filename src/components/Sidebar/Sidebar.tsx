import { useState, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react'
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
  /** Modo colapsado: el CSS muestra sólo íconos (rail). */
  collapsed?: boolean
  /** Color del ítem activo (del theme). 'primary' (default) no emite data-tone. */
  tone?: NavTone
  children?: ReactNode
}

/**
 * Sidebar headless — navegación vertical de app. Compound: Sidebar + Sidebar.Header +
 * Sidebar.Section + Sidebar.Group + Sidebar.Item + Sidebar.Footer. `collapsed` deja un rail de
 * sólo íconos (lo resuelve el CSS). Sólo estructura.
 *
 * Contrato:
 *   [data-sk="sidebar"]        raíz (<aside>) · [data-collapsed]. Scroll interno; Header/Footer
 *                               quedan fijos arriba/abajo vía position:sticky (ver sidebar.css).
 *   [data-part="header"] · [data-part="footer"]   slots fijos (logo/switcher, perfil de usuario)
 *   [data-part="section"]      grupo estático de items · [data-part="section-label"] su título
 *   [data-part="group"]        grupo COLAPSABLE de items, ver Sidebar.Group más abajo
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

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode
  label: ReactNode
  badge?: ReactNode
  /** Estado inicial (no controlado). Default: cerrado. */
  defaultOpen?: boolean
  /** Estado controlado — si se pasa, el grupo deja de manejar su propio estado. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Grupo de nav COLAPSABLE (a diferencia de Sidebar.Section, que es estático): un trigger
 * (ícono + label + badge + chevron) que muestra/oculta Sidebar.Item's anidados. Cada grupo
 * maneja su propio estado — a diferencia de Accordion, varios grupos pueden estar abiertos a la
 * vez (es el comportamiento esperado en un sidebar real), así que no hace falta el hook
 * compartido useAccordion acá, alcanza con estado local por grupo.
 *
 * En modo `collapsed` (rail de íconos) el trigger se reduce a sólo ícono y el panel queda
 * oculto — no hay flyout al pasar el mouse en esta versión (ver usage en Sidebar.catalog.ts).
 */
function SidebarGroup({
  icon,
  label,
  badge,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  className,
  children,
  ...rest
}: SidebarGroupProps) {
  const [openState, setOpenState] = useState(defaultOpen)
  const open = openProp ?? openState
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    onOpenChange?.(next)
  }

  return (
    <div data-part="group" data-state={open ? 'open' : 'closed'} className={cx('sk-sidebar__group', className)} {...rest}>
      <button
        type="button"
        data-part="group-trigger"
        data-state={open ? 'open' : 'closed'}
        aria-expanded={open}
        className="sk-sidebar__group-trigger"
        onClick={() => setOpen(!open)}
      >
        {icon != null && <span data-part="item-icon">{icon}</span>}
        <span data-part="item-label">{label}</span>
        {badge != null && <span data-part="item-badge">{badge}</span>}
        <span data-part="group-indicator" aria-hidden="true" />
      </button>
      <div data-part="group-panel" data-state={open ? 'open' : 'closed'} hidden={!open}>
        {children}
      </div>
    </div>
  )
}

function SidebarHeader({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-part="header" className={cx('sk-sidebar__header', className)} {...rest}>
      {children}
    </div>
  )
}

function SidebarFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-part="footer" className={cx('sk-sidebar__footer', className)} {...rest}>
      {children}
    </div>
  )
}

Sidebar.Section = SidebarSection
Sidebar.Item = SidebarItem
Sidebar.Group = SidebarGroup
Sidebar.Header = SidebarHeader
Sidebar.Footer = SidebarFooter
