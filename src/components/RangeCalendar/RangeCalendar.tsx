import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { cx } from '../../lib/cx'
import { useSkinkitI18n } from '../../i18n/context'

export interface DateRange {
  start: string | null
  end: string | null
}

export interface RangeCalendarClassNames {
  header?: string
  prev?: string
  next?: string
  title?: string
  weekdays?: string
  weekday?: string
  grid?: string
  day?: string
}

export interface RangeCalendarProps {
  value?: DateRange
  onChange?: (range: DateRange) => void
  min?: string
  max?: string
  weekStartsOn?: 0 | 1
  locale?: string
  className?: string
  /** Clases adicionales por sub-parte (aditivas, nunca reemplazan la clase base). */
  classNames?: RangeCalendarClassNames
}

const pad = (n: number) => String(n).padStart(2, '0')
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
function fromISO(s?: string | null): Date | null {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const sameISO = (d: Date, s?: string | null) => s != null && toISO(d) === s

function buildGrid(view: Date, weekStart: number): Date[] {
  const first = startOfMonth(view)
  const offset = (first.getDay() - weekStart + 7) % 7
  const start = addDays(first, -offset)
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

/**
 * RangeCalendar headless — grilla de mes para elegir un RANGO de fechas (dos clicks: inicio,
 * luego fin). Emite [data-sk="calendar"] + [data-range] para heredar el estilo del Calendar;
 * agrega estados de rango en los días. La forma la da el CSS.
 *
 * Contrato (además del de Calendar):
 *   [data-sk="calendar"][data-range]   raíz
 *   [data-part="day"] [data-range-start] [data-range-end] [data-in-range]   días del rango
 */
export function RangeCalendar({
  value,
  onChange,
  min,
  max,
  weekStartsOn = 0,
  locale: localeProp,
  className,
  classNames,
}: RangeCalendarProps) {
  const { locale: providerLocale, messages: m } = useSkinkitI18n()
  const locale = localeProp ?? providerLocale
  const today = new Date()
  const start = value?.start ?? null
  const end = value?.end ?? null
  const minD = fromISO(min)
  const maxD = fromISO(max)

  const [view, setView] = useState<Date>(startOfMonth(fromISO(start) ?? today))
  const [focused, setFocused] = useState<Date>(fromISO(start) ?? today)
  const gridRef = useRef<HTMLDivElement>(null)
  const navRef = useRef(false)

  useEffect(() => {
    if (!navRef.current) return
    navRef.current = false
    gridRef.current?.querySelector<HTMLElement>(`[data-date="${toISO(focused)}"]`)?.focus()
  }, [focused])

  const monthTitle = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(view)
  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    weekdayFmt.format(new Date(2021, 7, 1 + ((weekStartsOn + i) % 7))),
  )

  const disabled = (d: Date) => (minD != null && d < minD) || (maxD != null && d > maxD)

  const select = (d: Date) => {
    if (disabled(d)) return
    const iso = toISO(d)
    if (!start || (start && end)) {
      onChange?.({ start: iso, end: null })
    } else if (fromISO(iso)! < fromISO(start)!) {
      onChange?.({ start: iso, end: null })
    } else {
      onChange?.({ start, end: iso })
    }
    setFocused(d)
    if (d.getMonth() !== view.getMonth()) setView(startOfMonth(d))
  }

  const moveFocus = (d: Date) => {
    navRef.current = true
    setFocused(d)
    if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) {
      setView(startOfMonth(d))
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next: Date | null = null
    switch (e.key) {
      case 'ArrowLeft': next = addDays(focused, -1); break
      case 'ArrowRight': next = addDays(focused, 1); break
      case 'ArrowUp': next = addDays(focused, -7); break
      case 'ArrowDown': next = addDays(focused, 7); break
      case 'PageUp': next = addMonths(focused, -1); break
      case 'PageDown': next = addMonths(focused, 1); break
      case 'Enter':
      case ' ':
        e.preventDefault()
        select(focused)
        return
      default:
        return
    }
    e.preventDefault()
    moveFocus(next)
  }

  const days = buildGrid(view, weekStartsOn)
  const startD = fromISO(start)
  const endD = fromISO(end)

  return (
    <div data-sk="calendar" data-range="" className={cx('sk-calendar', 'sk-range-calendar', className)}>
      <div data-part="header" className={cx('sk-calendar__header', classNames?.header)}>
        <button
          type="button"
          data-part="prev"
          aria-label={m.calendar.previousMonth}
          className={cx('sk-calendar__prev', classNames?.prev)}
          onClick={() => setView(addMonths(view, -1))}
        >
          ‹
        </button>
        <span data-part="title" className={cx('sk-calendar__title', classNames?.title)}>
          {monthTitle}
        </span>
        <button
          type="button"
          data-part="next"
          aria-label={m.calendar.nextMonth}
          className={cx('sk-calendar__next', classNames?.next)}
          onClick={() => setView(addMonths(view, 1))}
        >
          ›
        </button>
      </div>
      <div
        data-part="weekdays"
        aria-hidden="true"
        className={cx('sk-calendar__weekdays', classNames?.weekdays)}
      >
        {weekdays.map((w, i) => (
          <span key={i} data-part="weekday" className={cx('sk-calendar__weekday', classNames?.weekday)}>
            {w}
          </span>
        ))}
      </div>
      <div
        ref={gridRef}
        data-part="grid"
        role="grid"
        className={cx('sk-calendar__grid', classNames?.grid)}
        onKeyDown={onKeyDown}
      >
        {days.map((d) => {
          const outside = d.getMonth() !== view.getMonth()
          const isStart = sameISO(d, start)
          const isEnd = sameISO(d, end)
          const inRange = startD != null && endD != null && d > startD && d < endD
          return (
            <button
              key={toISO(d)}
              type="button"
              data-part="day"
              data-date={toISO(d)}
              data-today={sameISO(d, toISO(today)) ? '' : undefined}
              data-range-start={isStart ? '' : undefined}
              data-range-end={isEnd ? '' : undefined}
              data-selected={isStart || isEnd ? '' : undefined}
              data-in-range={inRange ? '' : undefined}
              data-outside={outside ? '' : undefined}
              role="gridcell"
              aria-selected={isStart || isEnd}
              aria-label={new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(d)}
              tabIndex={sameISO(d, toISO(focused)) ? 0 : -1}
              disabled={disabled(d)}
              className={cx('sk-calendar__day', classNames?.day)}
              onClick={() => select(d)}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
