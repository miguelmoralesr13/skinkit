import {
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'

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
}: TagInputProps) {
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
        <label data-part="label" htmlFor={fieldId} onClick={() => inputRef.current?.focus()}>
          {label}
        </label>
      ) : null}
      <div data-part="control" onClick={() => inputRef.current?.focus()}>
        {tags.map((tag, i) => (
          <span key={`${tag}-${i}`} data-part="tag" data-sk="tag" data-variant="neutral">
            <span data-part="label">{tag}</span>
            {!disabled ? (
              <button
                type="button"
                data-part="remove"
                aria-label={`Quitar ${tag}`}
                onClick={() => removeAt(i)}
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
        />
      </div>
      {helper ? (
        <span data-part="helper" id={helperId}>
          {helper}
        </span>
      ) : null}
    </div>
  )
}
