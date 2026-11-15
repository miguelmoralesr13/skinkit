import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../lib/cx'
import { useSkinkitMessages } from '../../i18n/context'
import { useOverlayRootProps } from '../../provider/overlayRoot'

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
  flyout: boolean
}
const SidebarContext = createContext<SidebarContextValue>({ collapsed: false, size: 'md', flyout: false })

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Modo colapsado: el CSS muestra sólo íconos (rail). Los Group pasan a flyout al hover/foco. */
  collapsed?: boolean
  /** Opt-in (GAP-028): con `collapsed`, el flyout de cada `Sidebar.Group` se abre también al tocar/clic
   *  y por teclado (Enter/Espacio/→/↓; ↑↓ Home End navegan; Esc/← cierran), queda fijado hasta Esc,
   *  otro clic o un toque fuera, tiene `aria-expanded` y copia el modo claro/oscuro de la app en su
   *  portal. Sin esta prop el colapsado se comporta exactamente como siempre (hover/foco). */
  flyout?: boolean
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
  flyout = false,
  className,
  children,
  ...rest
}: SidebarProps) {
  return (
    <SidebarContext.Provider value={{ collapsed, size, flyout }}>
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
 * hover o foco del trigger —o al TOCARLO/clic—, sus items aparecen en un panel flotante a la
 * derecha del rail (renderizado en un portal a document.body para escapar el `overflow` del aside,
 * que si no lo recortaría; el portal copia el modo claro/oscuro de la app). Con hover/foco cierra
 * al salir el puntero o perder el foco; abierto por clic/tap/teclado queda fijado hasta Esc, otro
 * clic al disparador o un toque fuera. Teclado: Enter/Espacio/→/↓ abren y llevan el foco al primer
 * item; ↑↓ Home End navegan; Esc/← cierran y devuelven el foco al disparador.
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
  const { collapsed, flyout } = useContext(SidebarContext)
  const enhanced = collapsed && flyout
  const [openState, setOpenState] = useState(defaultOpen)
  const open = openProp ?? openState
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    onOpenChange?.(next)
  }

  // Flyout (sólo en modo colapsado): se abre al tocar/clic, con hover o con foco, y por teclado.
  const triggerRef = useRef<HTMLButtonElement>(null)
  const flyoutRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null)
  // «Fijado»: abierto por clic/tap/teclado. Un flyout fijado no se cierra al salir el puntero ni
  // al perder el foco: solo con Esc, otro clic al disparador o un toque fuera.
  const [pinned, setPinned] = useState(false)
  const focusFirst = useRef(false)
  const overlayRoot = useOverlayRootProps(enhanced && flyoutPos != null)

  const openFlyout = () => {
    clearTimeout(closeTimer.current)
    const r = triggerRef.current?.getBoundingClientRect()
    if (r) setFlyoutPos({ top: r.top, left: r.right })
  }
  const closeFlyout = () => {
    clearTimeout(closeTimer.current)
    setFlyoutPos(null)
    setPinned(false)
  }
  const scheduleClose = () => {
    if (enhanced && pinned) return
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setFlyoutPos(null), 120)
  }

  const showFlyout = collapsed && flyoutPos != null && typeof document !== 'undefined'

  // Al salir del modo colapsado o desmontar, no queda nada abierto ni un temporizador vivo.
  useEffect(() => {
    if (!collapsed) {
      setFlyoutPos(null)
      setPinned(false)
    }
  }, [collapsed])
  useEffect(() => () => clearTimeout(closeTimer.current), [])

  // Toque fuera, scroll o resize cierran el flyout abierto.
  useEffect(() => {
    if (!showFlyout || !enhanced) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (groupRef.current?.contains(t) || flyoutRef.current?.contains(t)) return
      closeFlyout()
    }
    const onMove = () => closeFlyout()
    document.addEventListener('pointerdown', onDown, true)
    window.addEventListener('resize', onMove)
    window.addEventListener('scroll', onMove, true)
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      window.removeEventListener('resize', onMove)
      window.removeEventListener('scroll', onMove, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFlyout, enhanced])

  // Apertura por teclado: el foco pasa al primer item del flyout recién montado.
  useEffect(() => {
    if (showFlyout && focusFirst.current) {
      focusFirst.current = false
      flyoutRef.current?.querySelector<HTMLElement>('[data-part="item"]')?.focus()
    }
  }, [showFlyout])

  const flyoutItems = () =>
    Array.from(flyoutRef.current?.querySelectorAll<HTMLElement>('[data-part="item"]') ?? [])

  const onTriggerClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!collapsed) {
      setOpen(!open)
      return
    }
    if (!enhanced) return
    // detail 0 = activación por teclado (Enter/Espacio): entrega el foco al flyout.
    if (flyoutPos != null && pinned) {
      closeFlyout()
      return
    }
    focusFirst.current = e.detail === 0
    setPinned(true)
    openFlyout()
  }

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!enhanced) return
    if (e.key === 'Escape' && flyoutPos != null) {
      e.stopPropagation()
      closeFlyout()
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      focusFirst.current = true
      setPinned(true)
      if (flyoutPos != null) flyoutItems()[0]?.focus()
      else openFlyout()
    }
  }

  const onFlyoutKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = flyoutItems()
    const i = items.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'Escape' || e.key === 'ArrowLeft') {
      e.preventDefault()
      e.stopPropagation()
      closeFlyout()
      triggerRef.current?.focus()
    } else if (e.key === 'Tab') {
      closeFlyout()
      triggerRef.current?.focus()
    } else if (items.length > 0) {
      let next = -1
      if (e.key === 'ArrowDown') next = i < 0 ? 0 : (i + 1) % items.length
      else if (e.key === 'ArrowUp') next = i < 0 ? items.length - 1 : (i - 1 + items.length) % items.length
      else if (e.key === 'Home') next = 0
      else if (e.key === 'End') next = items.length - 1
      if (next >= 0) {
        e.preventDefault()
        items[next]?.focus()
      }
    }
  }

  const trigger = (
    <button
      ref={triggerRef}
      type="button"
      data-part="group-trigger"
      data-state={open ? 'open' : 'closed'}
      aria-expanded={collapsed ? flyoutPos != null : open}
      aria-haspopup={collapsed ? (enhanced ? 'true' : 'menu') : undefined}
      aria-label={enhanced && typeof label === 'string' ? label : undefined}
      className="sk-sidebar__group-trigger"
      onClick={onTriggerClick}
      onKeyDown={onTriggerKeyDown}
    >
      {icon != null && <span data-part="item-icon">{icon}</span>}
      <span data-part="item-label">{label}</span>
      {badge != null && <span data-part="item-badge">{badge}</span>}
      <span data-part="group-indicator" aria-hidden="true" />
    </button>
  )

  return (
    <div
      ref={groupRef}
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

      {/* Modo colapsado: flyout flotante en portal, posicionado junto al trigger. El portal crea
          su propia raíz con el modo claro/oscuro de la app (GAP-006). */}
      {showFlyout &&
        (enhanced
          ? createPortal(
              <div data-skinkit-root="" {...overlayRoot} className="skinkit-root">
                <div
                  ref={flyoutRef}
                  data-part="group-panel"
                  data-flyout=""
                  data-state="open"
                  role="group"
                  aria-label={typeof label === 'string' ? label : undefined}
                  className="sk-sidebar__group-panel sk-sidebar__flyout"
                  style={{ position: 'fixed', top: flyoutPos.top, left: flyoutPos.left }}
                  onPointerEnter={openFlyout}
                  onPointerLeave={scheduleClose}
                  onFocus={openFlyout}
                  onBlur={scheduleClose}
                  onKeyDown={onFlyoutKeyDown}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('[data-part="item"]')) closeFlyout()
                  }}
                >
                  <div data-part="flyout-label">{label}</div>
                  {children}
                </div>
              </div>,
              document.body,
            )
          : createPortal(
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
            ))}
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
