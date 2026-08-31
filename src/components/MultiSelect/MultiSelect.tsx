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

/**
 * Clases adicionales por sub-parte, siempre aditivas a la clase base (nunca la reemplazan).
 *
 * OJO — colisión de nombres: `data-part="label"` aparece dos veces en el markup: en el
 * `<label>` del campo (clave `label` acá) y dentro de cada chip seleccionado (clave `tagLabel`
 * acá, porque `tag`/`data-part="tag"` es el chip completo y sus sub-partes internas son
 * `tagLabel`/`tagRemove`). Lo mismo para el chip: `data-part="remove"` es `tagRemove`.
 */
export interface MultiSelectClassNames {
  /** `<label>` del campo (htmlFor el input de búsqueda). */
  label?: string
  /** Caja que contiene los chips + el input de búsqueda (posicionada; contiene el listbox). */
  control?: string
  /** Cada chip de valor seleccionado — la misma clase aplica a TODAS las instancias. */
  tag?: string
  /** Texto del chip (`data-part="label"` dentro de cada chip, distinto del `label` del campo). */
  tagLabel?: string
  /** Botón "×" para quitar un chip (`data-part="remove"` dentro de cada chip). */
  tagRemove?: string
  /** `<input>` de búsqueda. */
  field?: string
  /** `<ul>` de opciones (solo montada cuando está abierta). */
  listbox?: string
  /** Cada `<li>` de opción — la misma clase aplica a TODAS las instancias. */
  option?: string
  /** Indicador visual de check dentro de cada opción. */
  check?: string
  /** `<li>` "sin resultados". */
  empty?: string
  /** Texto de ayuda / error debajo del control. */
  helper?: string
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
  /** Clases por sub-parte (label/control/tag/tagLabel/tagRemove/field/listbox/option/check/empty/helper). Opcional y aditivo. */
  classNames?: MultiSelectClassNames
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
  classNames,
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
        <label data-part="label" htmlFor={id} className={cx('sk-multi-select__label', classNames?.label)}>
          {label}
        </label>
      ) : null}
      <div
        data-part="control"
        className={cx('sk-multi-select__control', classNames?.control)}
        onClick={() => inputRef.current?.focus()}
      >
        {selectedOptions.map((opt) => (
          <span
            key={opt.value}
            data-part="tag"
            data-sk="tag"
            data-variant="neutral"
            className={cx('sk-multi-select__tag', classNames?.tag)}
          >
            <span data-part="label" className={cx('sk-multi-select__tag-label', classNames?.tagLabel)}>
              {opt.label}
            </span>
            {!disabled ? (
              <button
                type="button"
                data-part="remove"
                aria-label={`Quitar ${opt.label}`}
                className={cx('sk-multi-select__tag-remove', classNames?.tagRemove)}
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
          className={cx('sk-multi-select__field', classNames?.field)}
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
            aria-multiselectable="true"
            className={cx('sk-multi-select__listbox', classNames?.listbox)}
          >
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
                    className={cx('sk-multi-select__option', classNames?.option)}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      toggle(o.value)
                      setQuery('')
                    }}
                  >
                    <span
                      data-part="check"
                      aria-hidden="true"
                      className={cx('sk-multi-select__check', classNames?.check)}
                    />
                    {o.label}
                  </li>
                )
              })
            ) : (
              <li data-part="empty" className={cx('sk-multi-select__empty', classNames?.empty)}>
                {emptyText}
              </li>
            )}
          </ul>
        ) : null}
      </div>
      {helper ? (
        <span data-part="helper" className={cx('sk-multi-select__helper', classNames?.helper)}>
          {helper}
        </span>
      ) : null}
    </div>
  )
}
