import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { Menu, type MenuSide } from '../Menu/Menu'
import { useSkinkitMessages } from '../../i18n/context'

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
 * Topbar.Item + Topbar.Search + Topbar.Actions + Topbar.UserMenu + Topbar.IconButton +
 * Topbar.MenuToggle. Sólo estructura + contrato; la forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="topbar"]        raíz (<header>)
 *   [data-part="brand"]       logo/nombre
 *   [data-part="nav"]         contenedor de items
 *   [data-part="item"]        item de navegación (<a>/<button>); [data-active] + aria-current
 *   [data-part="search"]      Topbar.Search — input de búsqueda, sin estado propio
 *   [data-part="actions"]     zona de acciones (derecha)
 *   [data-sk="menu"]          Topbar.UserMenu — compone <Menu> (ver Menu.tsx), no un dropdown nuevo
 *   [data-part="icon-button"] Topbar.IconButton — botón sólo-ícono con badge opcional
 *   [data-part="menu-toggle"] Topbar.MenuToggle — hamburguesa, sin lógica propia (vos manejás el boolean)
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

export interface TopbarSearchProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Ícono a la izquierda del input (típicamente una lupa). */
  icon?: ReactNode
  /** Pista de atajo de teclado a la derecha (ej. "⌘K"). */
  shortcut?: ReactNode
}

/** Input de búsqueda headless — sin estado propio, `value`/`onChange` van por vos. Para un
 * command palette completo, combinalo con CommandMenu (abrilo desde onFocus/onClick acá). */
function TopbarSearch({ icon, shortcut, className, ...rest }: TopbarSearchProps) {
  return (
    <div data-part="search" className={cx('sk-topbar__search', className)}>
      {icon != null && <span data-part="search-icon">{icon}</span>}
      <input data-part="search-input" className="sk-topbar__search-input" {...rest} />
      {shortcut != null && <span data-part="search-shortcut">{shortcut}</span>}
    </div>
  )
}

export interface TopbarUserMenuProps {
  /** Contenido del trigger — típicamente un Avatar + nombre. */
  trigger: ReactNode
  /** Lado del panel respecto al trigger. */
  side?: MenuSide
  /** Topbar.UserMenu.Item's (alias de Menu.Item). */
  children: ReactNode
  className?: string
}

/** Menú de usuario — compone <Menu> en vez de reinventar dropdown/dismiss/teclado: el trigger es
 * tu contenido (avatar+nombre+chevron), el panel es real markup de Menu (mismo [data-part=trigger]
 * / [data-part=content] que ya estila menu.css — cero posicionamiento nuevo acá, sólo un ajuste de
 * layout scopeado bajo [data-sk=topbar] para que el trigger se vea bien en la barra). Cierra con
 * Esc / click afuera / elegir un ítem, igual que Menu. */
function TopbarUserMenu({ trigger, side, children, className }: TopbarUserMenuProps) {
  return (
    <Menu side={side} data-part="user-menu" className={cx('sk-topbar__user-menu', className)}>
      <Menu.Trigger>{trigger}</Menu.Trigger>
      <Menu.Content>{children}</Menu.Content>
    </Menu>
  )
}

export interface TopbarIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  /** `true` = punto sin texto, string/number = contador. Sin dropdown propio — envolvelo en
   * Menu/Popover si necesitás un panel (ej. lista de notificaciones). */
  badge?: ReactNode | true
  /** Obligatorio: el botón es sólo-ícono, así que necesita su propio aria-label. */
  label: string
}

function TopbarIconButton({ icon, badge, label, className, ...rest }: TopbarIconButtonProps) {
  return (
    <button
      type="button"
      data-part="icon-button"
      aria-label={label}
      className={cx('sk-topbar__icon-button', className)}
      {...rest}
    >
      <span data-part="icon-button-icon">{icon}</span>
      {badge != null && (
        <span data-part="icon-button-badge" data-dot={badge === true ? '' : undefined}>
          {badge === true ? null : badge}
        </span>
      )}
    </button>
  )
}

export interface TopbarMenuToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** aria-label del botón. Default: 'Abrir menú'. */
  label?: string
}

/** Botón hamburguesa sin lógica propia — vos manejás el boolean (mismo patrón que `collapsed`
 * de Sidebar) y se lo pasás a <Sidebar collapsed> / <AppShell.Sidebar hidden>. */
function TopbarMenuToggle({ label: labelProp, className, children, ...rest }: TopbarMenuToggleProps) {
  const m = useSkinkitMessages()
  const label = labelProp ?? m.topbar.openMenu
  return (
    <button
      type="button"
      data-part="menu-toggle"
      aria-label={label}
      className={cx('sk-topbar__menu-toggle', className)}
      {...rest}
    >
      {children ?? <span data-part="menu-toggle-icon" aria-hidden="true" />}
    </button>
  )
}

Topbar.Brand = TopbarBrand
Topbar.Nav = TopbarNav
Topbar.Item = TopbarItem
Topbar.Actions = TopbarActions
Topbar.Search = TopbarSearch
TopbarUserMenu.Item = Menu.Item
Topbar.UserMenu = TopbarUserMenu
Topbar.IconButton = TopbarIconButton
Topbar.MenuToggle = TopbarMenuToggle
