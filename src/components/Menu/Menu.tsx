import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { cx } from '../../lib/cx'
import { useDismissable } from '../../lib/useDismissable'

export type MenuSide = 'bottom' | 'top'

interface MenuCtx {
  open: boolean
  setOpen: (v: boolean) => void
  close: () => void
  triggerId: string
  contentId: string
}
const MenuContext = createContext<MenuCtx | null>(null)

function useMenuCtx(part: string): MenuCtx {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error(`skinkit: <Menu.${part}> debe usarse dentro de <Menu>`)
  return ctx
}

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  side?: MenuSide
}

/**
 * Menu (dropdown) headless, compuesto: <Menu> · <Menu.Trigger> · <Menu.Content> · <Menu.Item>.
 * In-tree (sin portal). Abre al click, cierra con Esc / click afuera / elegir un ítem.
 * Teclado ↑ ↓ Home End entre ítems. La forma/posición las da el CSS.
 *
 * Contrato:
 *   [data-sk="menu"]        [data-side]  raíz (envuelve trigger + content)
 *   [data-part="trigger"]   [data-state] el botón (open|closed)
 *   [data-part="content"]   role=menu    el panel (solo cuando está abierto)
 *   [data-part="item"]      role=menuitem cada acción
 */
export function Menu({ side = 'bottom', className, children, ...rest }: MenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerId = useId()
  const contentId = useId()
  const close = () => setOpen(false)

  useDismissable(open, rootRef, close)

  return (
    <div
      ref={rootRef}
      data-sk="menu"
      data-side={side}
      className={cx('sk-menu', className)}
      {...rest}
    >
      <MenuContext.Provider value={{ open, setOpen, close, triggerId, contentId }}>
        {children}
      </MenuContext.Provider>
    </div>
  )
}

function MenuTrigger({ className, children, onClick, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useMenuCtx('Trigger')
  return (
    <button
      type="button"
      data-part="trigger"
      data-state={ctx.open ? 'open' : 'closed'}
      id={ctx.triggerId}
      aria-haspopup="menu"
      aria-expanded={ctx.open}
      aria-controls={ctx.open ? ctx.contentId : undefined}
      className={cx('sk-menu__trigger', className)}
      onClick={(e) => {
        onClick?.(e)
        ctx.setOpen(!ctx.open)
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

function MenuContent({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const ctx = useMenuCtx('Content')
  const contentRef = useRef<HTMLDivElement>(null)

  // Al abrir, foco al primer ítem.
  useEffect(() => {
    if (!ctx.open) return
    const first = contentRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])')
    first?.focus()
  }, [ctx.open])

  if (!ctx.open) return null

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? [],
    )
    if (items.length === 0) return
    const i = items.indexOf(document.activeElement as HTMLElement)
    let next = -1
    switch (e.key) {
      case 'ArrowDown':
        next = i < 0 ? 0 : (i + 1) % items.length
        break
      case 'ArrowUp':
        next = i < 0 ? items.length - 1 : (i - 1 + items.length) % items.length
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = items.length - 1
        break
      default:
        return
    }
    e.preventDefault()
    items[next]?.focus()
  }

  return (
    <div
      ref={contentRef}
      data-part="content"
      role="menu"
      id={ctx.contentId}
      aria-labelledby={ctx.triggerId}
      className={cx('sk-menu__content', className)}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {children}
    </div>
  )
}

export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Se invoca al elegir el ítem (además de cerrar el menú). */
  onSelect?: () => void
}

function MenuItem({ className, children, onSelect, onClick, ...rest }: MenuItemProps) {
  const ctx = useMenuCtx('Item')
  return (
    <button
      type="button"
      data-part="item"
      role="menuitem"
      tabIndex={-1}
      className={cx('sk-menu__item', className)}
      onClick={(e) => {
        onClick?.(e)
        onSelect?.()
        ctx.close()
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

Menu.Trigger = MenuTrigger
Menu.Content = MenuContent
Menu.Item = MenuItem
