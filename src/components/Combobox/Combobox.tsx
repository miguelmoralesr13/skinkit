import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { useDismissable } from '../../lib/useDismissable'
import { useSkinkitMessages } from '../../i18n/context'

export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxClassNames {
  label?: string
  control?: string
  field?: string
  listbox?: string
  option?: string
  empty?: string
  helper?: string
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  label?: ReactNode
  placeholder?: string
  helper?: ReactNode
  error?: boolean
  disabled?: boolean
  emptyText?: string
  id?: string
  className?: string
  classNames?: ComboboxClassNames
}

/**
 * Combobox headless — input de texto con lista desplegable filtrada (autocomplete). Teclado
 * ↑ ↓ para resaltar, Enter para elegir, Esc para cerrar; cierra con click afuera. Sin portal.
 * La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="combobox"]     raíz · [data-error]
 *   [data-part="label"]      etiqueta
 *   [data-part="field"]      el <input role=combobox>
 *   [data-part="listbox"]    lista (role=listbox, solo abierta)
 *   [data-part="option"]     [data-highlighted] [data-selected]  cada opción (role=option)
 *   [data-part="empty"]      mensaje "sin resultados"
 *   [data-part="helper"]     ayuda / error
 */
export function Combobox({
  options,
  value,
  onValueChange,
  label,
  placeholder,
  helper,
  error,
  disabled,
  emptyText: emptyTextProp,
  id,
  className,
  classNames,
}: ComboboxProps) {
  const m = useSkinkitMessages()
  const emptyText = emptyTextProp ?? m.combobox.empty
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const autoId = useId()
  const fieldId = id ?? autoId
  const listId = `${fieldId}-list`
  const helperId = helper ? `${fieldId}-helper` : undefined

  const selected = options.find((o) => o.value === value)

  // Sincroniza el texto con la opción seleccionada cuando está cerrado.
  useEffect(() => {
    if (!open) setQuery(selected?.label ?? '')
  }, [open, selected?.label])

  const filtered =
    query.trim() && query !== selected?.label
      ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
      : options

  const close = () => setOpen(false)
  useDismissable(open, rootRef, close)

  const choose = (opt: ComboboxOption) => {
    onValueChange?.(opt.value)
    setQuery(opt.label)
    setOpen(false)
  }

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
        choose(filtered[active])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div
      ref={rootRef}
      data-sk="combobox"
      data-error={error ? '' : undefined}
      className={cx('sk-combobox', className)}
    >
      {label ? (
        <label
          data-part="label"
          htmlFor={fieldId}
          className={cx('sk-combobox__label', classNames?.label)}
        >
          {label}
        </label>
      ) : null}
      <div data-part="control" className={cx('sk-combobox__control', classNames?.control)}>
        <input
          id={fieldId}
          data-part="field"
          className={cx('sk-combobox__field', classNames?.field)}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={placeholder}
          disabled={disabled}
          value={query}
          aria-describedby={helperId}
          aria-invalid={error || undefined}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {open ? (
          <ul
            data-part="listbox"
            role="listbox"
            id={listId}
            className={cx('sk-combobox__listbox', classNames?.listbox)}
          >
            {filtered.length > 0 ? (
              filtered.map((o, i) => (
                <li
                  key={o.value}
                  data-part="option"
                  role="option"
                  aria-selected={o.value === value}
                  data-highlighted={i === active ? '' : undefined}
                  data-selected={o.value === value ? '' : undefined}
                  className={cx('sk-combobox__option', classNames?.option)}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    choose(o)
                  }}
                >
                  {o.label}
                </li>
              ))
            ) : (
              <li data-part="empty" className={cx('sk-combobox__empty', classNames?.empty)}>
                {emptyText}
              </li>
            )}
          </ul>
        ) : null}
      </div>
      {helper ? (
        <span
          data-part="helper"
          id={helperId}
          className={cx('sk-combobox__helper', classNames?.helper)}
        >
          {helper}
        </span>
      ) : null}
    </div>
  )
}
