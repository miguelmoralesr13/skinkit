import {
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { Dialog } from '../Dialog'
import { useSkinkitMessages } from '../../i18n/context'

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
 * BottomNav.Item (ícono + label, con submenú opcional en bottom sheet) + BottomNav.Sheet +
 * BottomNav.SheetItem. No se posiciona sola (no es fixed): la ubica el consumidor o el AppShell.
 * Sólo estructura + contrato.
 *
 * Skinnable por TOKENS (no hay prop `skin`): todo el look sale de variables `--sk-bottom-nav-*`
 * (fondo, borde+ancho, sombra, radio, padding, gap, bg/fg de item normal/hover/activo, radio de
 * item, indicador de activo, ícono). Se arma una skin (brutal, sketch, glass…) pisando esas
 * variables en la app — ver bottom-nav.css.
 *
 * Contrato:
 *   [data-sk="bottom-nav"]     raíz (<nav>) · [data-tone]
 *   [data-part="item"]         item (<a> nav / <button> si abre submenú) · [data-active] +
 *                               aria-current
 *   [data-part="item-icon"] · [data-part="item-label"]
 *   [data-part="sheet-item"]   fila del bottom sheet (BottomNav.SheetItem) · [data-active]
 *   [data-part="sheet-item-icon"] · [data-part="sheet-item-label"]
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
  /** Si se pasa, el item deja de ser un link y se vuelve un <button> que abre un bottom sheet
   *  con este contenido (normalmente <BottomNav.SheetItem>s). */
  submenu?: ReactNode
  /** Título del bottom sheet del submenú (encabezado + nombre accesible del diálogo). */
  submenuTitle?: ReactNode
}

function BottomNavItem({
  active,
  icon,
  submenu,
  submenuTitle,
  className,
  children,
  onClick,
  ...rest
}: BottomNavItemProps) {
  const [open, setOpen] = useState(false)

  const inner = (
    <>
      {icon != null && <span data-part="item-icon">{icon}</span>}
      <span data-part="item-label">{children}</span>
    </>
  )

  // Sin submenú: link de navegación normal (misma estructura de siempre).
  if (submenu == null) {
    return (
      <a
        data-part="item"
        data-active={active ? '' : undefined}
        aria-current={active ? 'page' : undefined}
        className={cx('sk-bottom-nav__item', className)}
        onClick={onClick}
        {...rest}
      >
        {inner}
      </a>
    )
  }

  // Con submenú: el item es un <button> que abre el bottom sheet. Las props de <a> restantes no
  // aplican a un <button>, así que sólo reusamos las genéricas (cast controlado a props de button).
  const buttonRest = rest as unknown as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <>
      <button
        type="button"
        data-part="item"
        data-active={active ? '' : undefined}
        aria-current={active ? 'page' : undefined}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cx('sk-bottom-nav__item', className)}
        onClick={(e) => {
          setOpen(true)
          onClick?.(e as unknown as ReactMouseEvent<HTMLAnchorElement>)
        }}
        {...buttonRest}
      >
        {inner}
      </button>
      <BottomNavSheet open={open} onClose={() => setOpen(false)} title={submenuTitle}>
        {submenu}
      </BottomNavSheet>
    </>
  )
}

export interface BottomNavSheetProps {
  open: boolean
  onClose: () => void
  /** Encabezado del sheet (y nombre accesible del diálogo si es texto). */
  title?: ReactNode
  children?: ReactNode
}

/**
 * Bottom sheet del submenú — reusa <Dialog placement="bottom"> (portal, overlay, focus trap, Esc,
 * scroll-lock y ARIA ya resueltos por Dialog). Se abre solo cuando <BottomNav.Item> tiene
 * `submenu`, pero también se puede usar suelto si querés controlar la apertura vos.
 */
function BottomNavSheet({ open, onClose, title, children }: BottomNavSheetProps) {
  const m = useSkinkitMessages()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      placement="bottom"
      className="sk-bottom-nav__sheet"
      classNames={{ panel: 'sk-bottom-nav__sheet-panel' }}
      aria-label={typeof title === 'string' ? title : m.bottomNav.submenu}
    >
      {title != null && (
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
        </Dialog.Header>
      )}
      <Dialog.Body>
        <div data-part="sheet-items" className="sk-bottom-nav__sheet-items">
          {children}
        </div>
      </Dialog.Body>
    </Dialog>
  )
}

export interface BottomNavSheetItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
  icon?: ReactNode
}

/** Fila del bottom sheet (ícono + label). Es un <a> real; pasale href u onClick. */
function BottomNavSheetItem({ active, icon, className, children, ...rest }: BottomNavSheetItemProps) {
  return (
    <a
      data-part="sheet-item"
      data-active={active ? '' : undefined}
      aria-current={active ? 'page' : undefined}
      className={cx('sk-bottom-nav__sheet-item', className)}
      {...rest}
    >
      {icon != null && <span data-part="sheet-item-icon">{icon}</span>}
      <span data-part="sheet-item-label">{children}</span>
    </a>
  )
}

BottomNav.Item = BottomNavItem
BottomNav.Sheet = BottomNavSheet
BottomNav.SheetItem = BottomNavSheetItem
