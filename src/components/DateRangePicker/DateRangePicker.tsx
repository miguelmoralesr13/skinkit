import { useState, type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { Popover } from '../Popover'
import { RangeCalendar, type DateRange } from '../RangeCalendar'

export interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange) => void
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

function fromISO(s?: string | null): Date | null {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

/**
 * DateRangePicker headless — campo que abre un <RangeCalendar> en un <Popover> para elegir un
 * rango de fechas. Se cierra al completar el rango. Construido sobre Popover + RangeCalendar.
 * Reusa el look de DatePicker (emite [data-sk="date-picker"]). La forma la da el skin.
 *
 * Contrato:
 *   [data-sk="date-picker"][data-range]   raíz · [data-error]
 *   [data-part="label"]     etiqueta
 *   [data-part="trigger"]   el campo (del Popover) con el rango
 *   [data-part="value"]     texto "inicio – fin" o placeholder ([data-placeholder] si vacío)
 *   [data-part="helper"]    ayuda / error
 */
export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Elegir rango',
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
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const start = fromISO(value?.start)
  const end = fromISO(value?.end)
  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })

  let display: string
  if (start && end) display = `${fmt.format(start)} – ${fmt.format(end)}`
  else if (start) display = `${fmt.format(start)} – …`
  else display = placeholder
  const empty = !start

  return (
    <div
      data-sk="date-picker"
      data-range=""
      data-error={error ? '' : undefined}
      className={cx('sk-date-picker', className)}
    >
      {label ? (
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger id={id} disabled={disabled} aria-label={label ? undefined : 'Elegir rango'}>
          <span data-part="value" data-placeholder={empty ? '' : undefined}>
            {display}
          </span>
        </Popover.Trigger>
        <Popover.Content>
          <RangeCalendar
            value={value}
            onChange={(range) => {
              onChange?.(range)
              if (range.start && range.end) setOpen(false)
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
