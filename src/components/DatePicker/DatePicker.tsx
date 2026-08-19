import { useState, type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { Popover } from '../Popover'
import { Calendar } from '../Calendar'

export interface DatePickerProps {
  /** Fecha seleccionada (ISO yyyy-mm-dd). */
  value?: string
  onChange?: (iso: string) => void
  placeholder?: string
  label?: ReactNode
  helper?: ReactNode
  error?: boolean
  disabled?: boolean
  min?: string
  max?: string
  weekStartsOn?: 0 | 1
  locale?: string
  className?: string
  id?: string
}

function fromISO(s?: string): Date | null {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

/**
 * DatePicker headless — campo que abre un <Calendar> en un <Popover> para elegir una fecha.
 * Se cierra al elegir. Construido sobre Popover + Calendar. La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="date-picker"]   raíz · [data-error]
 *   [data-part="label"]       etiqueta
 *   [data-part="trigger"]     el campo (del Popover) que muestra la fecha
 *   [data-part="value"]       texto de la fecha o placeholder ([data-placeholder] si vacío)
 *   [data-part="helper"]      ayuda / error
 *   (adentro reusa los contratos de Popover y Calendar)
 */
export function DatePicker({
  value,
  onChange,
  placeholder = 'Elegir fecha',
  label,
  helper,
  error,
  disabled,
  min,
  max,
  weekStartsOn,
  locale = 'es',
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const parsed = fromISO(value)
  const display = parsed
    ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(parsed)
    : placeholder

  return (
    <div
      data-sk="date-picker"
      data-error={error ? '' : undefined}
      className={cx('sk-date-picker', className)}
    >
      {label ? (
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger id={id} disabled={disabled} aria-label={label ? undefined : 'Elegir fecha'}>
          <span data-part="value" data-placeholder={parsed ? undefined : ''}>
            {display}
          </span>
        </Popover.Trigger>
        <Popover.Content>
          <Calendar
            value={value}
            onChange={(iso) => {
              onChange?.(iso)
              setOpen(false)
            }}
            min={min}
            max={max}
            weekStartsOn={weekStartsOn}
            locale={locale}
          />
        </Popover.Content>
      </Popover>
      {helper ? <span data-part="helper">{helper}</span> : null}
    </div>
  )
}
