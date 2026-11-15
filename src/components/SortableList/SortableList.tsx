import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { formatMessage, useSkinkitMessages } from '../../i18n/context'

/** Devuelve una copia con el elemento de `from` movido a `to` (índices acotados). */
export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  const next = list.slice()
  if (from < 0 || from >= next.length) return next
  const target = Math.min(Math.max(to, 0), next.length - 1)
  const [it] = next.splice(from, 1)
  next.splice(target, 0, it)
  return next
}

export interface SortableListItemContext {
  /** Posición 0-based actual. */
  index: number
  total: number
  dragging: boolean
}

export interface SortableListProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  value: T[]
  /** Recibe la lista completa nueva (reordenada, con un elemento quitado…). */
  onChange: (next: T[]) => void
  /** Contenido de cada elemento. Si dibujas campos, usa `getKey` estable (no el índice). */
  renderItem: (item: T, ctx: SortableListItemContext) => ReactNode
  /** Clave estable por elemento. Por omisión `item.id` si existe; si no, el índice (no recomendado al reordenar). */
  getKey?: (item: T, index: number) => string | number
  /** Nombre accesible de cada elemento para los botones. Por omisión «elemento N». */
  itemLabel?: (item: T, index: number) => string
  /** Muestra «Agregar» y lo invoca; tú decides qué elemento nuevo añadir a `value`. */
  onAdd?: () => void
  /** Texto del botón agregar. */
  addLabel?: ReactNode
  /** Permite quitar elementos. */
  removable?: boolean
  /** No deja quitar por debajo de este número. */
  minItems?: number
  /** Nombre accesible de la lista. */
  label?: string
  /** Contenido cuando no hay elementos. */
  empty?: ReactNode
  disabled?: boolean
}

/**
 * SortableList headless — lista editable y reordenable (pasos de un procedimiento, tareas de una
 * plantilla): agregar, quitar y reordenar con arrastre, con botones Subir/Bajar y con teclado
 * (Alt+↑/↓ sobre el asa). La numeración se recalcula sola (<ol>) y cada cambio se anuncia en una
 * región aria-live. El arrastre es HTML5 (ratón/lápiz); en táctil mueven los botones Subir/Bajar.
 *
 * Contrato:
 *   [data-sk="sortable-list"]    raíz
 *   [data-part="list"]           <ol>
 *   [data-part="item"]           <li> · [data-dragging] · [data-over]
 *   [data-part="index"]          número de posición
 *   [data-part="content"]        lo que dibuja renderItem
 *   [data-part="actions"]        grupo de botones
 *   [data-part="handle"]         asa de arrastre (button)
 *   [data-part="move-up"] [data-part="move-down"] [data-part="remove"]   botones
 *   [data-part="add"]            botón agregar
 *   [data-part="empty"]          vacío
 *   [data-part="status"]         región aria-live (oculta)
 */
function SortableListInner<T>(
  {
    value,
    onChange,
    renderItem,
    getKey,
    itemLabel,
    onAdd,
    addLabel,
    removable = true,
    minItems = 0,
    label,
    empty,
    disabled,
    className,
    ...rest
  }: SortableListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const m = useSkinkitMessages()
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [status, setStatus] = useState('')
  const listRef = useRef<HTMLOListElement>(null)
  // Tras reordenar, React mueve el <li> en el DOM y el navegador puede soltar el foco: se devuelve al mismo botón.
  const pendingFocus = useRef<{ index: number; part: string } | null>(null)
  useEffect(() => {
    const p = pendingFocus.current
    if (!p) return
    pendingFocus.current = null
    listRef.current?.children[p.index]?.querySelector<HTMLElement>(`[data-part="${p.part}"]`)?.focus()
  }, [value])
  const total = value.length
  const nameOf = (item: T, i: number) => (itemLabel ? itemLabel(item, i) : formatMessage(m.sortableList.item, { n: i + 1 }))
  const keyOf = (item: T, i: number) => {
    if (getKey) return getKey(item, i)
    const id = (item as { id?: unknown } | null)?.id
    return typeof id === 'string' || typeof id === 'number' ? id : i
  }

  const move = (from: number, to: number, part?: string) => {
    if (disabled || to < 0 || to >= total || from === to) return
    if (part) pendingFocus.current = { index: to, part }
    onChange(moveItem(value, from, to))
    setStatus(formatMessage(m.sortableList.moved, { item: nameOf(value[from], from), to: to + 1, total }))
  }
  const remove = (i: number) => {
    if (disabled || total <= minItems) return
    setStatus(formatMessage(m.sortableList.removed, { item: nameOf(value[i], i) }))
    onChange(value.filter((_, k) => k !== i))
  }
  const onHandleKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (!e.altKey) return
    if (e.key === 'ArrowUp') { e.preventDefault(); move(i, i - 1, 'handle') }
    if (e.key === 'ArrowDown') { e.preventDefault(); move(i, i + 1, 'handle') }
  }

  return (
    <div ref={ref} data-sk="sortable-list" data-disabled={disabled ? '' : undefined} className={cx('sk-sortable-list', className)} {...rest}>
      {total === 0 ? (
        <div data-part="empty">{empty ?? m.sortableList.empty}</div>
      ) : (
        <ol ref={listRef} data-part="list" aria-label={label}>
          {value.map((item, i) => {
            const name = nameOf(item, i)
            return (
              <li
                key={keyOf(item, i)}
                data-part="item"
                data-dragging={dragIndex === i ? '' : undefined}
                data-over={overIndex === i && dragIndex !== null && dragIndex !== i ? '' : undefined}
                onDragOver={(e) => {
                  if (dragIndex === null) return
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'move'
                  if (overIndex !== i) setOverIndex(i)
                }}
                onDrop={(e) => {
                  if (dragIndex === null) return
                  e.preventDefault()
                  move(dragIndex, i)
                  setDragIndex(null)
                  setOverIndex(null)
                }}
              >
                <span data-part="index" aria-hidden="true">
                  {i + 1}
                </span>
                <div data-part="content">{renderItem(item, { index: i, total, dragging: dragIndex === i })}</div>
                <div data-part="actions">
                  <button
                    type="button"
                    data-part="handle"
                    draggable={!disabled}
                    disabled={disabled}
                    aria-label={formatMessage(m.sortableList.dragHandle, { item: name })}
                    onKeyDown={(e) => onHandleKey(e, i)}
                    onDragStart={(e) => {
                      setDragIndex(i)
                      e.dataTransfer.effectAllowed = 'move'
                      e.dataTransfer.setData('text/plain', String(i))
                      const li = e.currentTarget.closest('li')
                      if (li) e.dataTransfer.setDragImage(li, 0, 0)
                    }}
                    onDragEnd={() => {
                      setDragIndex(null)
                      setOverIndex(null)
                    }}
                  >
                    <span aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    data-part="move-up"
                    disabled={disabled}
                    aria-disabled={i === 0 || undefined}
                    aria-label={formatMessage(m.sortableList.moveUp, { item: name })}
                    onClick={() => move(i, i - 1, 'move-up')}
                  >
                    <span aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    data-part="move-down"
                    disabled={disabled}
                    aria-disabled={i === total - 1 || undefined}
                    aria-label={formatMessage(m.sortableList.moveDown, { item: name })}
                    onClick={() => move(i, i + 1, 'move-down')}
                  >
                    <span aria-hidden="true" />
                  </button>
                  {removable ? (
                    <button
                      type="button"
                      data-part="remove"
                      disabled={disabled || total <= minItems}
                      aria-label={formatMessage(m.sortableList.remove, { item: name })}
                      onClick={() => remove(i)}
                    >
                      <span aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ol>
      )}
      {onAdd ? (
        <button type="button" data-part="add" disabled={disabled} onClick={onAdd}>
          {addLabel ?? m.sortableList.add}
        </button>
      ) : null}
      <span data-sk="visually-hidden" data-part="status" role="status" aria-live="polite">
        {status}
      </span>
    </div>
  )
}

export const SortableList = forwardRef(SortableListInner) as <T>(
  props: SortableListProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => ReturnType<typeof SortableListInner>
