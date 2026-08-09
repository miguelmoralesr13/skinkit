import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../lib/cx'
import { useSkinkit } from '../../provider/SkinkitProvider'

export interface CommandItem {
  id: string
  label: string
  /** Sección (opcional) para agrupar. */
  group?: string
  /** Términos extra para el filtrado. */
  keywords?: string
  /** Atajo mostrado a la derecha (ej. "⌘K"). */
  shortcut?: ReactNode
  icon?: ReactNode
  disabled?: boolean
  onSelect?: () => void
}

export interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CommandItem[]
  placeholder?: string
  emptyText?: string
  label?: string
  className?: string
}

/**
 * CommandMenu headless — paleta de comandos (⌘K): overlay + búsqueda + lista filtrada y
 * agrupada. Teclado ↑ ↓ navegan, Enter ejecuta, Esc cierra. Portaliza a <body> y reaplica
 * theme/skin. La forma la da el skin.
 *
 * Contrato:
 *   [data-sk="command-menu"]   raíz portalizada
 *   [data-part="overlay"]      fondo (cierra al click)
 *   [data-part="panel"]        la caja
 *   [data-part="input"]        buscador
 *   [data-part="list"]         resultados (role=listbox)
 *   [data-part="group"]        sección · [data-part="group-label"]
 *   [data-part="item"]         [data-active]  cada comando (role=option)
 *   [data-part="shortcut"]     atajo a la derecha
 *   [data-part="empty"]        mensaje sin resultados
 */
export function CommandMenu({
  open,
  onOpenChange,
  items,
  placeholder = 'Buscar comando…',
  emptyText = 'Sin resultados',
  label = 'Comandos',
  className,
}: CommandMenuProps) {
  const { theme, skin } = useSkinkit()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      const t = window.setTimeout(() => inputRef.current?.focus(), 0)
      return () => window.clearTimeout(t)
    }
  }, [open])

  if (!open) return null

  const q = query.trim().toLowerCase()
  const filtered = q
    ? items.filter(
        (it) =>
          it.label.toLowerCase().includes(q) || (it.keywords ?? '').toLowerCase().includes(q),
      )
    : items

  const sections = new Map<string, CommandItem[]>()
  for (const it of filtered) {
    const g = it.group ?? ''
    if (!sections.has(g)) sections.set(g, [])
    sections.get(g)!.push(it)
  }
  const flat = [...sections.values()].flat()

  const run = (it?: CommandItem) => {
    if (!it || it.disabled) return
    it.onSelect?.()
    onOpenChange(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(flat[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onOpenChange(false)
    }
  }

  let idx = -1

  return createPortal(
    <div data-skinkit-root="" data-theme={theme} data-skin={skin} className="skinkit-root">
      <div data-sk="command-menu" className={cx('sk-command-menu', className)}>
        <div data-part="overlay" aria-hidden="true" onClick={() => onOpenChange(false)} />
        <div data-part="panel" role="dialog" aria-modal="true" aria-label={label}>
          <input
            ref={inputRef}
            data-part="input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="sk-cmd-list"
            aria-autocomplete="list"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
          />
          <ul data-part="list" id="sk-cmd-list" role="listbox">
            {flat.length === 0 ? (
              <li data-part="empty">{emptyText}</li>
            ) : (
              [...sections.entries()].map(([group, its]) => (
                <li key={group || '_'} data-part="group">
                  {group ? <div data-part="group-label">{group}</div> : null}
                  <ul>
                    {its.map((it) => {
                      idx += 1
                      const i = idx
                      return (
                        <li
                          key={it.id}
                          data-part="item"
                          role="option"
                          aria-selected={i === active}
                          data-active={i === active ? '' : undefined}
                          data-disabled={it.disabled ? '' : undefined}
                          onMouseEnter={() => setActive(i)}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            run(it)
                          }}
                        >
                          {it.icon != null ? (
                            <span data-part="icon" aria-hidden="true">
                              {it.icon}
                            </span>
                          ) : null}
                          <span data-part="label">{it.label}</span>
                          {it.shortcut != null ? (
                            <span data-part="shortcut">{it.shortcut}</span>
                          ) : null}
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  )
}
