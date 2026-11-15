import {
  useEffect,
  type ReactNode,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { cx } from '../../lib/cx'
import { useSkinkitI18n } from '../../i18n/context'

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

/** Contexto que recibe `renderDay` para pintar el contenido de cada día. */
export interface CalendarDayContext {
  date: Date
  /** Fecha ISO yyyy-mm-dd. */
  iso: string
  /** Número del día del mes. */
  day: number
  /** Estado de `marks` para este día, si lo tiene. */
  state?: string
  selected: boolean
  today: boolean
  outside: boolean
  disabled: boolean
}

/** Props comunes de `<Calendar>`; la selección depende de `mode`. */
export interface CalendarBaseProps {
  /** Límites (ISO). Días fuera del rango quedan deshabilitados. */
  min?: string
  max?: string
  /** 0 = domingo (default), 1 = lunes. */
  weekStartsOn?: 0 | 1
  /** Locale para nombres de mes/día. Default: el `locale` del SkinkitProvider (`es` si no hay). */
  locale?: string
  className?: string
  /** Clases adicionales por sub-parte (aditivas, nunca reemplazan la clase base). */
  classNames?: CalendarClassNames
  /**
   * Opt-in. Marcas por día: mapa `{ 'yyyy-mm-dd': 'estado' }`. Cada día marcado emite
   * `[data-state="estado"]` (el CSS pinta un punto; el estado se estiliza por consumidor).
   */
  marks?: Record<string, string>
  /** Texto accesible por estado de `marks`: se agrega al `aria-label` del día (el color no es el único canal). */
  markLabels?: Record<string, string>
  /** Opt-in. Contenido propio de cada día (reemplaza al número). */
  renderDay?: (ctx: CalendarDayContext) => ReactNode
}

export interface CalendarSingleProps extends CalendarBaseProps {
  /** `single` (default): una sola fecha. */
  mode?: 'single'
  /** Fecha seleccionada (ISO yyyy-mm-dd). */
  value?: string
  onChange?: (iso: string) => void
}

export interface CalendarMultipleProps extends CalendarBaseProps {
  /** Selección de días sueltos: toque/Enter/Espacio alterna; arrastrar pinta o borra varios. */
  mode: 'multiple'
  /** Fechas seleccionadas (ISO), controlado. */
  value?: string[]
  defaultValue?: string[]
  /** Recibe la lista completa, ordenada. */
  onChange?: (isos: string[]) => void
}

export type CalendarProps = CalendarSingleProps | CalendarMultipleProps

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
export function Calendar(props: CalendarProps) {
  const {
    min,
    max,
    weekStartsOn = 0,
    locale: localeProp,
    className,
    classNames,
    marks,
    markLabels,
    renderDay,
  } = props
  const multiple = props.mode === 'multiple'
  const { locale: providerLocale, messages: m } = useSkinkitI18n()
  const locale = localeProp ?? providerLocale
  const today = new Date()

  // Selección: una fecha (single) o un conjunto de fechas (multiple, controlado o no).
  const [internalMulti, setInternalMulti] = useState<string[]>(
    props.mode === 'multiple' ? (props.defaultValue ?? []) : [],
  )
  const multiControlled = props.mode === 'multiple' && props.value !== undefined
  const multiValue: string[] = props.mode === 'multiple' ? (multiControlled ? props.value! : internalMulti) : []
  const multiSet = new Set(multiValue)
  // Copia de trabajo durante un arrastre: los pointermove llegan antes de que el padre re-renderice.
  const liveRef = useRef<Set<string>>(multiSet)
  liveRef.current = multiSet
  const selected = fromISO(props.mode === 'multiple' ? multiValue[0] : props.value)
  const minD = fromISO(min)
  const maxD = fromISO(max)

  const [view, setView] = useState<Date>(startOfMonth(selected ?? today))
  const [focused, setFocused] = useState<Date>(selected ?? today)
  const gridRef = useRef<HTMLDivElement>(null)
  const navRef = useRef(false)
  // Arrastre en modo multiple: 'add' pinta, 'remove' borra; `handled` evita doble toggle pointer+click.
  const dragRef = useRef<{ mode: 'add' | 'remove'; last: string } | null>(null)
  const handledRef = useRef(false)

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

  const emitMulti = (set: Set<string>) => {
    const next = Array.from(set).sort()
    liveRef.current = new Set(next)
    if (!multiControlled) setInternalMulti(next)
    if (props.mode === 'multiple') props.onChange?.(next)
  }

  const select = (d: Date) => {
    if (disabled(d)) return
    if (props.mode === 'multiple') {
      const next = new Set(liveRef.current)
      const iso = toISO(d)
      if (next.has(iso)) next.delete(iso)
      else next.add(iso)
      emitMulti(next)
    } else {
      props.onChange?.(toISO(d))
    }
    setFocused(d)
    if (d.getMonth() !== view.getMonth()) setView(startOfMonth(d))
  }

  const paint = (iso: string, mode: 'add' | 'remove') => {
    const d = fromISO(iso)
    if (!d || disabled(d)) return
    const next = new Set(liveRef.current)
    if (mode === 'add') next.add(iso)
    else next.delete(iso)
    if (next.size !== liveRef.current.size) emitMulti(next)
  }

  const onDayPointerDown = (e: PointerEvent<HTMLButtonElement>, d: Date) => {
    if (!multiple || e.button !== 0 || disabled(d)) return
    const iso = toISO(d)
    const mode = liveRef.current.has(iso) ? 'remove' : 'add'
    dragRef.current = { mode, last: iso }
    handledRef.current = true
    window.addEventListener('pointerup', endDrag, { once: true })
    window.addEventListener('pointercancel', endDrag, { once: true })
    paint(iso, mode)
    setFocused(d)
  }

  const endDrag = () => {
    if (!dragRef.current) return
    dragRef.current = null
    // El click que sigue al pointerup ya está resuelto; se libera tras ese turno.
    setTimeout(() => {
      handledRef.current = false
    }, 0)
  }

  const onGridPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-date]')
    const iso = el?.getAttribute('data-date')
    if (!iso || iso === drag.last) return
    // Un movimiento rápido puede saltarse celdas: se pintan también los días entre la última y la actual.
    const from = fromISO(drag.last)
    const to = fromISO(iso)
    drag.last = iso
    if (!from || !to) return paint(iso, drag.mode)
    const step = from <= to ? 1 : -1
    const next = new Set(liveRef.current)
    for (let d = addDays(from, step); toISO(d) !== toISO(addDays(to, step)); d = addDays(d, step)) {
      const di = toISO(d)
      if (disabled(d)) continue
      if (drag.mode === 'add') next.add(di)
      else next.delete(di)
    }
    if (next.size !== liveRef.current.size) emitMulti(next)
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
        if (multiple) {
          // El navegador puede disparar además un click al soltar Espacio: se marca como ya atendido.
          handledRef.current = true
          setTimeout(() => {
            handledRef.current = false
          }, 0)
        }
        select(focused)
        return
      default:
        return
    }
    e.preventDefault()
    moveFocus(next)
  }

  const days = buildGrid(view, weekStartsOn)
  const dayFmt = new Intl.DateTimeFormat(locale, { dateStyle: 'long' })

  return (
    <div data-sk="calendar" className={cx('sk-calendar', className)}>
      <div data-part="header" className={cx('sk-calendar__header', classNames?.header)}>
        <button
          type="button"
          data-part="prev"
          className={cx('sk-calendar__prev', classNames?.prev)}
          aria-label={m.calendar.previousMonth}
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
          aria-label={m.calendar.nextMonth}
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
        {...(multiple
          ? {
              'aria-multiselectable': true,
              'data-mode': 'multiple',
              onPointerMove: onGridPointerMove,
            }
          : {})}
        onKeyDown={onKeyDown}
      >
        {days.map((d) => {
          const iso = toISO(d)
          const outside = d.getMonth() !== view.getMonth()
          const isSelected = multiple ? multiSet.has(iso) : selected != null && sameDay(d, selected)
          const isToday = sameDay(d, today)
          const isDisabled = disabled(d)
          const state = marks?.[iso]
          const stateLabel = state != null ? markLabels?.[state] : undefined
          const label = dayFmt.format(d)
          return (
            <button
              key={iso}
              type="button"
              data-part="day"
              className={cx('sk-calendar__day', classNames?.day)}
              data-date={iso}
              data-today={isToday ? '' : undefined}
              data-selected={isSelected ? '' : undefined}
              data-outside={outside ? '' : undefined}
              data-state={state}
              role="gridcell"
              aria-selected={isSelected}
              aria-label={stateLabel ? `${label}, ${stateLabel}` : label}
              tabIndex={sameDay(d, focused) ? 0 : -1}
              disabled={isDisabled}
              onPointerDown={multiple ? (e) => onDayPointerDown(e, d) : undefined}
              onClick={() => {
                if (multiple && handledRef.current) return
                select(d)
              }}
            >
              {renderDay
                ? renderDay({
                    date: d,
                    iso,
                    day: d.getDate(),
                    state,
                    selected: isSelected,
                    today: isToday,
                    outside,
                    disabled: isDisabled,
                  })
                : d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
