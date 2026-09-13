import {
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { useSkinkitMessages, formatMessage } from '../../i18n/context'

export interface TagInputClassNames {
  /** Etiqueta del campo (data-part="label" del root, NO el label de cada chip). */
  label?: string
  /** Caja que contiene los chips + el input. */
  control?: string
  /** Cada chip (data-part="tag" · data-sk="tag"). La misma clase aplica a todos los chips. */
  tag?: string
  /** Texto dentro de cada chip (data-part="label" anidado en el chip). */
  tagLabel?: string
  /** Botón × de cada chip (data-part="remove" anidado en el chip). */
  tagRemove?: string
  /** El <input> de texto. */
  field?: string
  /** Ayuda / error. */
  helper?: string
}

export interface TagInputProps {
  value?: string[]
  defaultValue?: string[]
  onChange?: (tags: string[]) => void
  label?: ReactNode
  helper?: ReactNode
  placeholder?: string
  disabled?: boolean
  error?: boolean
  /** Máximo de tags (opcional). */
  max?: number
  id?: string
  className?: string
  /** Clases adicionales por parte interna. No reemplaza la clase base. */
  classNames?: TagInputClassNames
}

/**
 * TagInput headless — campo que crea chips: tipear + Enter/coma agrega, Backspace (vacío)
 * borra el último, cada chip se puede quitar. Controlado (value) o no (defaultValue). La
 * forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="tag-input"]   raíz · [data-error]
 *   [data-part="label"]     etiqueta
 *   [data-part="control"]   caja con los tags + input
 *   [data-part="tag"]       cada chip · parts label/remove
 *   [data-part="field"]     el <input> de texto
 *   [data-part="helper"]    ayuda / error
 */
export function TagInput({
  value,
  defaultValue = [],
  onChange,
  label,
  helper,
  placeholder,
  disabled,
  error,
  max,
  id,
  className,
  classNames,
}: TagInputProps) {
  const m = useSkinkitMessages()
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<string[]>(defaultValue)
  const tags = isControlled ? value : internal
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const fieldId = id ?? undefined
  const helperId = helper && fieldId ? `${fieldId}-helper` : undefined

  const setTags = (next: string[]) => {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const addTag = (raw: string) => {
    const t = raw.trim()
    if (!t) return
    if (tags.includes(t)) return
    if (max != null && tags.length >= max) return
    setTags([...tags, t])
  }

  const removeAt = (i: number) => setTags(tags.filter((_, idx) => idx !== i))

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(draft)
      setDraft('')
    } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      removeAt(tags.length - 1)
    }
  }

  return (
    <div
      data-sk="tag-input"
      data-error={error ? '' : undefined}
      className={cx('sk-tag-input', className)}
    >
      {label ? (
        <label
          data-part="label"
          htmlFor={fieldId}
          onClick={() => inputRef.current?.focus()}
          className={cx('sk-tag-input__label', classNames?.label)}
        >
          {label}
        </label>
      ) : null}
      <div
        data-part="control"
        onClick={() => inputRef.current?.focus()}
        className={cx('sk-tag-input__control', classNames?.control)}
      >
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            data-part="tag"
            data-sk="tag"
            data-variant="neutral"
            className={cx('sk-tag-input__tag', classNames?.tag)}
          >
            <span data-part="label" className={cx('sk-tag-input__tag-label', classNames?.tagLabel)}>
              {tag}
            </span>
            {!disabled ? (
              <button
                type="button"
                data-part="remove"
                aria-label={formatMessage(m.tagInput.remove, { tag })}
                onClick={() => removeAt(i)}
                className={cx('sk-tag-input__tag-remove', classNames?.tagRemove)}
              >
                ×
              </button>
            ) : null}
          </span>
        ))}
        <input
          ref={inputRef}
          id={fieldId}
          data-part="field"
          type="text"
          value={draft}
          placeholder={tags.length === 0 ? placeholder : undefined}
          disabled={disabled || (max != null && tags.length >= max)}
          aria-describedby={helperId}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (draft.trim()) {
              addTag(draft)
              setDraft('')
            }
          }}
          className={cx('sk-tag-input__field', classNames?.field)}
        />
      </div>
      {helper ? (
        <span data-part="helper" id={helperId} className={cx('sk-tag-input__helper', classNames?.helper)}>
          {helper}
        </span>
      ) : null}
    </div>
  )
}
