import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'

export interface EditableProps {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  /** textarea multilínea en vez de input. */
  multiline?: boolean
  label?: ReactNode
  className?: string
  id?: string
}

/**
 * Editable headless — texto que se edita in-line: se muestra como texto y al click pasa a un
 * campo (Enter/blur guarda, Esc cancela). Controlado. La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="editable"]    raíz · [data-editing] [data-empty]
 *   [data-part="label"]     etiqueta (opcional)
 *   [data-part="preview"]   el texto clickeable (modo lectura)
 *   [data-part="field"]     el input/textarea (modo edición)
 */
export function Editable({
  value,
  onChange,
  placeholder = 'Vacío',
  disabled,
  multiline,
  label,
  className,
  id,
}: EditableProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) {
      setDraft(value)
      const el = inputRef.current
      el?.focus()
      el?.select?.()
    }
  }, [editing, value])

  const commit = () => {
    setEditing(false)
    if (draft !== value) onChange?.(draft)
  }
  const cancel = () => setEditing(false)

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      cancel()
    } else if (e.key === 'Enter' && (!multiline || e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      commit()
    }
  }

  const startEdit = () => {
    if (!disabled) setEditing(true)
  }

  const Field = multiline ? 'textarea' : 'input'

  return (
    <div
      data-sk="editable"
      data-editing={editing ? '' : undefined}
      data-empty={!value ? '' : undefined}
      className={cx('sk-editable', className)}
    >
      {label ? (
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      {editing ? (
        <Field
          ref={inputRef}
          id={id}
          data-part="field"
          value={draft}
          disabled={disabled}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
        />
      ) : (
        <div
          data-part="preview"
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={startEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              startEdit()
            }
          }}
        >
          {value || placeholder}
        </div>
      )}
    </div>
  )
}
