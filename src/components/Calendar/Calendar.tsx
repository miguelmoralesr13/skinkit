import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { cx } from '../../lib/cx'

export interface CalendarClassNames {
  header?: string
  prev?: string
  next?: string
  title?: string
  weekdays?: string
  weekday?: string
  grid?: string
  day?: string
}

export interface CalendarProps {
  /** Fecha seleccionada (ISO yyyy-mm-dd). */
  value?: string
  onChange?: (iso: string) => void
  /** Límites (ISO). Días fuera del rango quedan deshabilitados. */
  min?: string
  max?: string
  /** 0 = domingo (default), 1 = lunes. */
  weekStartsOn?: 0 | 1
  /** Locale para nombres de mes/día (default 'es'). */
  locale?: string
  className?: string
  /** Clases adicionales por sub-parte (aditivas, nunca reemplazan la clase base). */
  classNames?: CalendarClassNames
}

const pad = (n: number) => String(n).padStart(2, '0')
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
function fromISO(s?: string): Date | null {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const sameDay = (a: Date, b: Date) => toISO(a) === toISO(b)

/** 42 días (6 semanas) que cubren el mes de `view`. */
function buildGrid(view: Date, weekStart: number): Date[] {
  const first = startOfMonth(view)
  const offset = (first.getDay() - weekStart + 7) % 7
  const start = addDays(first, -offset)
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

/**
 * Calendar headless — grilla de un mes para elegir una fecha. Navegación de mes, estados
 * today/selected/outside/disabled y teclado (flechas, Home/End, RePág/AvPág, Enter). Los
 * nombres salen de Intl (locale). La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="calendar"]        raíz
 *   [data-part="header"]        mes/año + navegación
 *   [data-part="prev"/"next"]   navegar mes
 *   [data-part="title"]         "agosto 2026"
 *   [data-part="weekdays"]      fila de nombres de día
 *   [data-part="grid"]          grilla (role=grid)
 *   [data-part="day"]           [data-today] [data-selected] [data-outside]  cada día
 */
export function Calendar({
  value,
  onChange,
  min,
  max,
  weekStartsOn = 0,
  locale = 'es',
  className,
  classNames,
}: CalendarProps) {
  const today = new Date()
  const selected = fromISO(value)
  const minD = fromISO(min)
  const maxD = fromISO(max)

  const [view, setView] = useState<Date>(startOfMonth(selected ?? today))
  const [focused, setFocused] = useState<Date>(selected ?? today)
  const gridRef = useRef<HTMLDivElement>(null)
  const navRef = useRef(false)

  useEffect(() => {
    if (!navRef.current) return
    navRef.current = false
    const el = gridRef.current?.querySelector<HTMLElement>(`[data-date="${toISO(focused)}"]`)
    el?.focus()
  }, [focused])

  const monthTitle = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(view)
  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const weekdays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2021, 7, 1 + ((weekStartsOn + i) % 7)) // 2021-08-01 fue domingo
    return weekdayFmt.format(d)
  })

  const disabled = (d: Date) => (minD != null && d < minD) || (maxD != null && d > maxD)

  const moveFocus = (d: Date) => {
    navRef.current = true
    setFocused(d)
    if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) {
      setView(startOfMonth(d))
    }
  }

  const select = (d: Date) => {
    if (disabled(d)) return
    onChange?.(toISO(d))
    setFocused(d)
    if (d.getMonth() !== view.getMonth()) setView(startOfMonth(d))
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next: Date | null = null
    switch (e.key) {
      case 'ArrowLeft': next = addDays(focused, -1); break
      case 'ArrowRight': next = addDays(focused, 1); break
      case 'ArrowUp': next = addDays(focused, -7); break
      case 'ArrowDown': next = addDays(focused, 7); break
      case 'Home': next = addDays(focused, -((focused.getDay() - weekStartsOn + 7) % 7)); break
      case 'End': next = addDays(focused, 6 - ((focused.getDay() - weekStartsOn + 7) % 7)); break
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

  return (
    <div data-sk="calendar" className={cx('sk-calendar', className)}>
      <div data-part="header" className={cx('sk-calendar__header', classNames?.header)}>
        <button
          type="button"
          data-part="prev"
          className={cx('sk-calendar__prev', classNames?.prev)}
          aria-label="Mes anterior"
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
          className={cx('sk-calendar__next', classNames?.next)}
          aria-label="Mes siguiente"
          onClick={() => setView(addMonths(view, 1))}
        >
          ›
        </button>
      </div>
      <div data-part="weekdays" className={cx('sk-calendar__weekdays', classNames?.weekdays)} aria-hidden="true">
        {weekdays.map((w, i) => (
          <span key={i} data-part="weekday" className={cx('sk-calendar__weekday', classNames?.weekday)}>
            {w}
          </span>
        ))}
      </div>
      <div
        ref={gridRef}
        data-part="grid"
        className={cx('sk-calendar__grid', classNames?.grid)}
        role="grid"
        onKeyDown={onKeyDown}
      >
        {days.map((d) => {
          const outside = d.getMonth() !== view.getMonth()
          const isSelected = selected != null && sameDay(d, selected)
          const isToday = sameDay(d, today)
          const isDisabled = disabled(d)
          return (
            <button
              key={toISO(d)}
              type="button"
              data-part="day"
              className={cx('sk-calendar__day', classNames?.day)}
              data-date={toISO(d)}
              data-today={isToday ? '' : undefined}
              data-selected={isSelected ? '' : undefined}
              data-outside={outside ? '' : undefined}
              role="gridcell"
              aria-selected={isSelected}
              aria-label={new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(d)}
              tabIndex={sameDay(d, focused) ? 0 : -1}
              disabled={isDisabled}
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
