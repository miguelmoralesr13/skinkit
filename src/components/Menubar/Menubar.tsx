import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { useDismissable } from '../../lib/useDismissable'

interface MenubarCtx {
  openId: string | null
  setOpen: (id: string | null) => void
  close: () => void
}
const Ctx = createContext<MenubarCtx | null>(null)
function useMenubar(part: string) {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error(`<Menubar.${part}> debe usarse dentro de <Menubar>.`)
  return ctx
}

export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/**
 * Menubar headless — barra de menús tipo app (Archivo / Editar / Ver), cada uno abre un dropdown.
 * Un solo menú abierto a la vez; con uno abierto, pasar el mouse sobre otro cambia el foco;
 * flechas ←/→ mueven entre menús, Esc cierra. Estructura + contrato; la forma la da el skin.
 *
 * Contrato:
 *   [data-sk="menubar"]                    raíz (role=menubar)
 *   [data-sk="menubar-menu"]               cada menú
 *     [data-part="trigger"] [data-state]   el botón de nivel superior (open|closed)
 *     [data-part="content"]                el dropdown
 *   [data-sk="menubar-item"]               opción del dropdown (role=menuitem)
 */
export function Menubar({ className, children, onKeyDown, ...rest }: MenubarProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const close = () => setOpenId(null)
  useDismissable(openId != null, rootRef, close)

  const triggers = () =>
    Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>('[data-part="trigger"]') ?? [],
    )

  const move = (dir: 1 | -1) => {
    const list = triggers()
    if (list.length === 0) return
    const active = document.activeElement as HTMLElement | null
    let idx = list.findIndex((t) => t === active)
    if (idx === -1) idx = 0
    else idx = (idx + dir + list.length) % list.length
    const next = list[idx]
    next.focus()
    if (openId != null) next.click() // si ya hay uno abierto, seguí abierto en el nuevo
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      move(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      move(-1)
    } else if (e.key === 'Escape' && openId != null) {
      e.preventDefault()
      close()
    }
    onKeyDown?.(e)
  }

  return (
    <Ctx.Provider value={{ openId, setOpen: setOpenId, close }}>
      <div
        ref={rootRef}
        data-sk="menubar"
        role="menubar"
        className={cx('sk-menubar', className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    </Ctx.Provider>
  )
}

export interface MenubarMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Etiqueta del menú de nivel superior. */
  label: ReactNode
  children: ReactNode
}

function MenubarMenu({ label, className, children, ...rest }: MenubarMenuProps) {
  const { openId, setOpen } = useMenubar('Menu')
  const id = useId()
  const open = openId === id

  return (
    <div data-sk="menubar-menu" data-state={open ? 'open' : 'closed'} className={cx('sk-menubar-menu', className)} {...rest}>
      <button
        type="button"
        data-part="trigger"
        data-state={open ? 'open' : 'closed'}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(open ? null : id)}
        onPointerEnter={() => {
          // solo "seguir" el hover si ya hay un menú abierto (comportamiento típico de menubar)
          if (openId != null) setOpen(id)
        }}
      >
        {label}
      </button>
      {open && (
        <div data-part="content" role="menu">
          {children}
        </div>
      )}
    </div>
  )
}

export interface MenubarItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Llamado al elegir la opción; cierra el menú después. */
  onSelect?: () => void
}

function MenubarItem({ className, onSelect, onClick, children, ...rest }: MenubarItemProps) {
  const { close } = useMenubar('Item')
  return (
    <button
      type="button"
      data-sk="menubar-item"
      role="menuitem"
      className={cx('sk-menubar-item', className)}
      onClick={(e) => {
        onClick?.(e)
        onSelect?.()
        close()
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

Menubar.Menu = MenubarMenu
Menubar.Item = MenubarItem
