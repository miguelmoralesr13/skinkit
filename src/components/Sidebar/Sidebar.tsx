import {
  createContext,
  useContext,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../lib/cx'
import { useSkinkitMessages } from '../../i18n/context'

export type NavTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export type SidebarSize = 'sm' | 'md' | 'lg'

/** Contexto interno: los sub-componentes (Group) necesitan saber si el rail está colapsado
 *  para decidir entre panel inline (modo completo) y flyout flotante (modo rail). */
interface SidebarContextValue {
  collapsed: boolean
  size: SidebarSize
}
const SidebarContext = createContext<SidebarContextValue>({ collapsed: false, size: 'md' })

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Modo colapsado: el CSS muestra sólo íconos (rail). Los Group pasan a flyout al hover/foco. */
  collapsed?: boolean
  /** Densidad de la navegación. Ajusta padding/gap/tamaño de fuente vía [data-size]. */
  size?: SidebarSize
  /** Color del ítem activo (del theme). 'primary' (default) no emite data-tone. */
  tone?: NavTone
  children?: ReactNode
}

/**
 * Sidebar headless — navegación vertical de app. Compound: Sidebar + Sidebar.Header +
 * Sidebar.Section + Sidebar.Group + Sidebar.Item + Sidebar.Action + Sidebar.Toggle +
 * Sidebar.Footer. `collapsed` deja un rail de sólo íconos (lo resuelve el CSS) y convierte cada
 * Sidebar.Group en un flyout flotante al hover/foco. Sólo estructura.
 *
 * Contrato:
 *   [data-sk="sidebar"]        raíz (<aside>) · [data-collapsed] · [data-size] · [data-tone].
 *                               Scroll interno; Header/Footer quedan fijos vía position:sticky.
 *   [data-part="header"] · [data-part="footer"]   slots fijos (logo/switcher, perfil de usuario)
 *   [data-part="toggle"]       botón headless para colapsar/expandir (Sidebar.Toggle)
 *   [data-part="section"]      grupo estático de items · [data-part="section-label"] su título
 *   [data-part="group"]        grupo COLAPSABLE de items, ver Sidebar.Group más abajo
 *   [data-part="item-row"]     wrapper de un item CON acciones · [data-part="item-actions"] su
 *                               contenedor · [data-part="item-action"] cada botón (Sidebar.Action)
 *   [data-part="item"]         item (<a>/<button>) · [data-active] + aria-current
 *   [data-part="item-icon"] · [data-part="item-label"] · [data-part="item-badge"]
 *
 * Personalización: todo lo visual sale de variables `--sk-sidebar-*` (fondo, borde, sombra, radio,
 * ancho, y las de item/action/flyout/toggle). Pisalas con CSS/inline/Tailwind para re-temar sin
 * forkear el componente — ver sidebar.css.
 */
export function Sidebar({
  collapsed = false,
  size = 'md',
  tone = 'primary',
  className,
  children,
  ...rest
}: SidebarProps) {
  return (
    <SidebarContext.Provider value={{ collapsed, size }}>
      <aside
        data-sk="sidebar"
        data-collapsed={collapsed ? '' : undefined}
        data-size={size}
        data-tone={tone === 'primary' ? undefined : tone}
        className={cx('sk-sidebar', className)}
        {...rest}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
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
  /** Acciones al final del item (típicamente <Sidebar.Action>): aparecen al hover/foco. Como el
   *  item es un <a>, las acciones se renderizan como HERMANAS (no dentro del link) — HTML válido:
   *  botones interactivos no pueden vivir adentro de un <a>. Esto envuelve el item en item-row. */
  actions?: ReactNode
}

function SidebarItem({ active, icon, badge, actions, className, children, ...rest }: SidebarItemProps) {
  const link = (
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

  // Sin acciones: el <a> va directo (misma estructura de siempre, sin wrapper extra).
  if (actions == null) return link

  return (
    <div data-part="item-row" className="sk-sidebar__item-row">
      {link}
      <span data-part="item-actions" className="sk-sidebar__item-actions">
        {actions}
      </span>
    </div>
  )
}

export interface SidebarActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Contenido, normalmente un ícono. Poné siempre `aria-label` — es un botón sólo-ícono. */
  children?: ReactNode
}

/** Botón de acción para el trailing de un Sidebar.Item (editar, borrar, +, más opciones…).
 *  Headless: sólo estructura. Pasale `aria-label` porque suele ser sólo-ícono. */
function SidebarAction({ type, className, children, ...rest }: SidebarActionProps) {
  return (
    <button
      type={type ?? 'button'}
      data-part="item-action"
      className={cx('sk-sidebar__item-action', className)}
      {...rest}
    >
      {children}
    </button>
  )
}

export interface SidebarToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

/** Botón headless para colapsar/expandir el rail. No maneja el estado: vos controlás `collapsed`
 *  en Sidebar y cableás el onClick de este botón para invertirlo (ej. en Header o Footer). */
function SidebarToggle({ type, className, children, 'aria-label': ariaLabel, ...rest }: SidebarToggleProps) {
  const m = useSkinkitMessages()
  return (
    <button
      type={type ?? 'button'}
      data-part="toggle"
      aria-label={ariaLabel ?? m.sidebar.toggle}
      className={cx('sk-sidebar__toggle', className)}
      {...rest}
    >
      {children}
    </button>
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
 * En modo `collapsed` (rail de íconos) el panel inline desaparece y el grupo pasa a FLYOUT: al
 * hover o foco del trigger, sus items aparecen en un panel flotante a la derecha del rail
 * (renderizado en un portal a document.body para escapar el `overflow` del aside, que si no lo
 * recortaría). Cierra al salir el mouse / perder el foco.
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
  const { collapsed } = useContext(SidebarContext)
  const [openState, setOpenState] = useState(defaultOpen)
  const open = openProp ?? openState
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    onOpenChange?.(next)
  }

  // Flyout (sólo en modo colapsado)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null)

  const openFlyout = () => {
    clearTimeout(closeTimer.current)
    const r = triggerRef.current?.getBoundingClientRect()
    if (r) setFlyoutPos({ top: r.top, left: r.right })
  }
  const scheduleClose = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setFlyoutPos(null), 120)
  }

  const showFlyout = collapsed && flyoutPos != null && typeof document !== 'undefined'

  const trigger = (
    <button
      ref={triggerRef}
      type="button"
      data-part="group-trigger"
      data-state={open ? 'open' : 'closed'}
      aria-expanded={collapsed ? flyoutPos != null : open}
      aria-haspopup={collapsed ? 'menu' : undefined}
      className="sk-sidebar__group-trigger"
      onClick={() => !collapsed && setOpen(!open)}
    >
      {icon != null && <span data-part="item-icon">{icon}</span>}
      <span data-part="item-label">{label}</span>
      {badge != null && <span data-part="item-badge">{badge}</span>}
      <span data-part="group-indicator" aria-hidden="true" />
    </button>
  )

  return (
    <div
      data-part="group"
      data-state={open ? 'open' : 'closed'}
      className={cx('sk-sidebar__group', className)}
      onPointerEnter={collapsed ? openFlyout : undefined}
      onPointerLeave={collapsed ? scheduleClose : undefined}
      onFocus={collapsed ? openFlyout : undefined}
      onBlur={collapsed ? scheduleClose : undefined}
      {...rest}
    >
      {trigger}

      {/* Modo completo: panel inline con `hidden` nativo (accordion-like). */}
      {!collapsed && (
        <div data-part="group-panel" data-state={open ? 'open' : 'closed'} hidden={!open}>
          {children}
        </div>
      )}

      {/* Modo colapsado: flyout flotante en portal, posicionado junto al trigger. */}
      {showFlyout &&
        createPortal(
          <div
            data-part="group-panel"
            data-flyout=""
            data-state="open"
            className="sk-sidebar__group-panel sk-sidebar__flyout"
            style={{ position: 'fixed', top: flyoutPos.top, left: flyoutPos.left }}
            onPointerEnter={openFlyout}
            onPointerLeave={scheduleClose}
          >
            <div data-part="flyout-label">{label}</div>
            {children}
          </div>,
          document.body,
        )}
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
Sidebar.Action = SidebarAction
Sidebar.Toggle = SidebarToggle
Sidebar.Group = SidebarGroup
Sidebar.Header = SidebarHeader
Sidebar.Footer = SidebarFooter
