import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../lib/cx'
import { useSkinkitColorScheme } from '../../provider/SkinkitProvider'
import { useSkinkitMessages } from '../../i18n/context'

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

export interface CommandMenuClassNames {
  /** Fondo (cierra al click). */
  overlay?: string
  /** La caja (role=dialog). */
  panel?: string
  /** Buscador (role=combobox). */
  input?: string
  /** `<ul>` de resultados (role=listbox). */
  list?: string
  /** Mensaje sin resultados. */
  empty?: string
  /** Cada sección — la misma clase aplica a TODAS las instancias. */
  group?: string
  /** `data-part="group-label"` dentro de cada sección con nombre. */
  groupLabel?: string
  /** Cada comando (role=option) — la misma clase aplica a TODAS las instancias. */
  item?: string
  /** Ícono del item (`data-part="icon"` anidado en cada item). */
  icon?: string
  /** Texto del item (`data-part="label"` anidado en cada item). */
  label?: string
  /** Atajo a la derecha (`data-part="shortcut"` anidado en cada item). */
  shortcut?: string
}

export interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CommandItem[]
  placeholder?: string
  emptyText?: string
  label?: string
  className?: string
  classNames?: CommandMenuClassNames
}

/**
 * CommandMenu headless — paleta de comandos (⌘K): overlay + búsqueda + lista filtrada y
 * agrupada. Teclado ↑ ↓ navegan, Enter ejecuta, Esc cierra. Portaliza a <body>; los tokens
 * viven en :root, así que el look se mantiene igual dentro del portal. El colorScheme forzado
 * en SkinkitProvider SÍ necesita replicarse a mano acá (useSkinkitColorScheme) porque un portal
 * no hereda color-scheme del [data-skinkit-root] original.
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
 *
 * `classNames` permite personalizar cada parte (overlay, panel, input, list, empty, group,
 * groupLabel, item, icon, label, shortcut) sin perder el `sk-command-menu__*` de base.
 */
export function CommandMenu({
  open,
  onOpenChange,
  items,
  placeholder: placeholderProp,
  emptyText: emptyTextProp,
  label: labelProp,
  className,
  classNames,
}: CommandMenuProps) {
  const m = useSkinkitMessages()
  const label = labelProp ?? m.commandMenu.label
  const emptyText = emptyTextProp ?? m.commandMenu.empty
  const placeholder = placeholderProp ?? m.commandMenu.placeholder
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const colorScheme = useSkinkitColorScheme()

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
    <div data-skinkit-root="" data-color-scheme={colorScheme} className="skinkit-root">
      <div data-sk="command-menu" className={cx('sk-command-menu', className)}>
        <div
          data-part="overlay"
          aria-hidden="true"
          onClick={() => onOpenChange(false)}
          className={cx('sk-command-menu__overlay', classNames?.overlay)}
        />
        <div
          data-part="panel"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className={cx('sk-command-menu__panel', classNames?.panel)}
        >
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
            className={cx('sk-command-menu__input', classNames?.input)}
          />
          <ul
            data-part="list"
            id="sk-cmd-list"
            role="listbox"
            className={cx('sk-command-menu__list', classNames?.list)}
          >
            {flat.length === 0 ? (
              <li data-part="empty" className={cx('sk-command-menu__empty', classNames?.empty)}>
                {emptyText}
              </li>
            ) : (
              [...sections.entries()].map(([group, its]) => (
                <li
                  key={group || '_'}
                  data-part="group"
                  className={cx('sk-command-menu__group', classNames?.group)}
                >
                  {group ? (
                    <div
                      data-part="group-label"
                      className={cx('sk-command-menu__group-label', classNames?.groupLabel)}
                    >
                      {group}
                    </div>
                  ) : null}
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
                          className={cx('sk-command-menu__item', classNames?.item)}
                        >
                          {it.icon != null ? (
                            <span
                              data-part="icon"
                              aria-hidden="true"
                              className={cx('sk-command-menu__icon', classNames?.icon)}
                            >
                              {it.icon}
                            </span>
                          ) : null}
                          <span
                            data-part="label"
                            className={cx('sk-command-menu__label', classNames?.label)}
                          >
                            {it.label}
                          </span>
                          {it.shortcut != null ? (
                            <span
                              data-part="shortcut"
                              className={cx('sk-command-menu__shortcut', classNames?.shortcut)}
                            >
                              {it.shortcut}
                            </span>
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
