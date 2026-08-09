import {
  Children,
  createContext,
  useContext,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'

interface TreeCtx {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
  setOpen: (value: string, open: boolean) => void
}
const TreeContext = createContext<TreeCtx | null>(null)

function useTreeCtx(part: string): TreeCtx {
  const ctx = useContext(TreeContext)
  if (!ctx) throw new Error(`skinkit: <Tree.${part}> debe usarse dentro de <Tree>`)
  return ctx
}

export interface TreeProps extends HTMLAttributes<HTMLUListElement> {
  defaultExpanded?: string[]
  label?: string
}

/**
 * Tree headless, compuesto: <Tree> · <Tree.Item>. Árbol jerárquico expandible. El estado de
 * expansión está centralizado (por `value`), así el teclado del root controla todo:
 * ↑ ↓ mueven, → expande / entra, ← colapsa, Enter/Espacio alterna. La forma la da el skin.
 *
 * Contrato:
 *   [data-sk="tree"]          raíz (role=tree)
 *   [data-part="item"]        cada nodo (role=treeitem) · [data-state] si tiene hijos
 *   [data-part="row"]         fila clickeable del nodo
 *   [data-part="indicator"]   flecha expandir/colapsar (solo con hijos)
 *   [data-part="label"]       texto del nodo
 *   [data-part="group"]       <ul role=group> de los hijos (solo si expandido)
 */
export function Tree({ defaultExpanded = [], label, className, children, ...rest }: TreeProps) {
  const [open, setOpenState] = useState<Set<string>>(() => new Set(defaultExpanded))
  const rootRef = useRef<HTMLUListElement>(null)

  const isOpen = (value: string) => open.has(value)
  const setOpen = (value: string, next: boolean) =>
    setOpenState((prev) => {
      const s = new Set(prev)
      if (next) s.add(value)
      else s.delete(value)
      return s
    })
  const toggle = (value: string) => setOpen(value, !open.has(value))

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement
    if (target.getAttribute('data-part') !== 'row') return
    const rows = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[data-part="row"]') ?? [])
    const i = rows.indexOf(target)
    if (i < 0) return
    const value = target.dataset.value ?? ''
    const hasChildren = target.getAttribute('aria-expanded') != null

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        rows[Math.min(i + 1, rows.length - 1)]?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        rows[Math.max(i - 1, 0)]?.focus()
        break
      case 'ArrowRight':
        e.preventDefault()
        if (hasChildren && !open.has(value)) setOpen(value, true)
        else if (hasChildren) rows[i + 1]?.focus()
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (hasChildren && open.has(value)) setOpen(value, false)
        break
      case 'Enter':
      case ' ':
        if (hasChildren) {
          e.preventDefault()
          toggle(value)
        }
        break
      default:
    }
  }

  return (
    <ul
      ref={rootRef}
      data-sk="tree"
      role="tree"
      aria-label={label}
      className={cx('sk-tree', className)}
      onKeyDown={onKeyDown}
      {...rest}
    >
      <TreeContext.Provider value={{ isOpen, toggle, setOpen }}>{children}</TreeContext.Provider>
    </ul>
  )
}

export interface TreeItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'onToggle'> {
  value: string
  label: ReactNode
  /** Ícono/adorno antes del label. */
  icon?: ReactNode
}

function TreeItem({ value, label, icon, className, children, ...rest }: TreeItemProps) {
  const ctx = useTreeCtx('Item')
  const hasChildren = Children.count(children) > 0
  const open = ctx.isOpen(value)

  return (
    <li
      data-part="item"
      data-state={hasChildren ? (open ? 'open' : 'closed') : undefined}
      role="treeitem"
      aria-expanded={hasChildren ? open : undefined}
      className={cx('sk-tree__item', className)}
      {...rest}
    >
      <div
        data-part="row"
        data-value={value}
        tabIndex={0}
        onClick={() => hasChildren && ctx.toggle(value)}
      >
        {hasChildren ? <span data-part="indicator" aria-hidden="true" /> : <span data-part="indicator" data-leaf="" aria-hidden="true" />}
        {icon != null ? (
          <span data-part="icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span data-part="label">{label}</span>
      </div>
      {hasChildren && open ? (
        <ul data-part="group" role="group">
          {children}
        </ul>
      ) : null}
    </li>
  )
}

Tree.Item = TreeItem
