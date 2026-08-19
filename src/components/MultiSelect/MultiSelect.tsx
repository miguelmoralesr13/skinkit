import {
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { useDismissable } from '../../lib/useDismissable'

export interface MultiSelectOption {
  value: string
  label: string
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  label?: ReactNode
  placeholder?: string
  helper?: ReactNode
  error?: boolean
  disabled?: boolean
  emptyText?: string
  id?: string
  className?: string
}

/**
 * MultiSelect headless — como Combobox pero de VARIOS valores: los elegidos se muestran como
 * chips, con un buscador y una lista para (des)marcar. Teclado ↑↓/Enter/Esc; Backspace (vacío)
 * quita el último. Sin portal. Los chips reusan el contrato de Tag. La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="multi-select"]   raíz · [data-error]
 *   [data-part="label"]     etiqueta
 *   [data-part="control"]   caja con chips + input (posicionada; contiene el listbox)
 *   [data-part="tag"]       ([data-sk=tag]) cada chip · parts label/remove
 *   [data-part="field"]     el <input> de búsqueda
 *   [data-part="listbox"]   lista (role=listbox, solo abierta)
 *   [data-part="option"]    [data-selected] [data-highlighted]  cada opción (role=option)
 *   [data-part="empty"]     sin resultados
 *   [data-part="helper"]    ayuda / error
 */
export function MultiSelect({
  options,
  value,
  defaultValue = [],
  onValueChange,
  label,
  placeholder,
  helper,
  error,
  disabled,
  emptyText = 'Sin resultados',
  id,
  className,
}: MultiSelectProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<string[]>(defaultValue)
  const selected = isControlled ? value : internal
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const close = () => setOpen(false)
  useDismissable(open, rootRef, close)

  const setValue = (next: string[]) => {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const toggle = (v: string) => {
    setValue(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v])
  }

  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  const selectedOptions = selected
    .map((v) => options.find((o) => o.value === v))
    .filter((o): o is MultiSelectOption => o != null)

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) setOpen(true)
      setActive((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && filtered[active]) {
        e.preventDefault()
        toggle(filtered[active].value)
        setQuery('')
      }
    } else if (e.key === 'Backspace' && query === '' && selected.length > 0) {
      setValue(selected.slice(0, -1))
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div
      ref={rootRef}
      data-sk="multi-select"
      data-error={error ? '' : undefined}
      className={cx('sk-multi-select', className)}
    >
      {label ? (
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <div data-part="control" onClick={() => inputRef.current?.focus()}>
        {selectedOptions.map((opt) => (
          <span key={opt.value} data-part="tag" data-sk="tag" data-variant="neutral">
            <span data-part="label">{opt.label}</span>
            {!disabled ? (
              <button
                type="button"
                data-part="remove"
                aria-label={`Quitar ${opt.label}`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggle(opt.value)
                }}
              >
                ×
              </button>
            ) : null}
          </span>
        ))}
        <input
          ref={inputRef}
          id={id}
          data-part="field"
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={selected.length === 0 ? placeholder : undefined}
          disabled={disabled}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {open ? (
          <ul data-part="listbox" role="listbox" aria-multiselectable="true">
            {filtered.length > 0 ? (
              filtered.map((o, i) => {
                const isSel = selected.includes(o.value)
                return (
                  <li
                    key={o.value}
                    data-part="option"
                    role="option"
                    aria-selected={isSel}
                    data-selected={isSel ? '' : undefined}
                    data-highlighted={i === active ? '' : undefined}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      toggle(o.value)
                      setQuery('')
                    }}
                  >
                    <span data-part="check" aria-hidden="true" />
                    {o.label}
                  </li>
                )
              })
            ) : (
              <li data-part="empty">{emptyText}</li>
            )}
          </ul>
        ) : null}
      </div>
      {helper ? <span data-part="helper">{helper}</span> : null}
    </div>
  )
}
