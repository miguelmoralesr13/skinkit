import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { cx } from '../../lib/cx'
import { useSkinkitMessages } from '../../i18n/context'

interface SegmentedCtx {
  value: string
  setValue: (v: string) => void
}
const SegmentedContext = createContext<SegmentedCtx | null>(null)

function useSegmentedCtx(part: string): SegmentedCtx {
  const ctx = useContext(SegmentedContext)
  if (!ctx) throw new Error(`skinkit: <SegmentedControl.${part}> debe usarse dentro de <SegmentedControl>`)
  return ctx
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  label?: string
  /**
   * Opt-in. Cuando las opciones no caben, la franja se desplaza en horizontal (sin partir ni
   * recortar el control) y la opción activa se mantiene siempre visible. Emite `[data-scrollable]`.
   */
  scrollable?: boolean
}

/**
 * SegmentedControl headless — selector de UNA opción entre pocas, en línea (tipo toggle group).
 * Compuesto: <SegmentedControl> · <SegmentedControl.Item>. role=radiogroup, roving tabindex y
 * flechas ← →. La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="segmented"]        raíz (role=radiogroup) · [data-scrollable] con `scrollable`
 *   [data-part="item"]  [data-state]  cada opción (active|inactive) · role=radio
 */
export function SegmentedControl({
  value,
  defaultValue,
  onValueChange,
  label: labelProp,
  scrollable,
  className,
  children,
  ...rest
}: SegmentedControlProps) {
  const m = useSkinkitMessages()
  const label = labelProp ?? m.segmentedControl.label
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue ?? '')
  const current = isControlled ? value : internal
  const rootRef = useRef<HTMLDivElement>(null)

  const setValue = useCallback(
    (v: string) => {
      if (!isControlled) setInternal(v)
      onValueChange?.(v)
    },
    [isControlled, onValueChange],
  )

  // Con `scrollable`, la opción activa se mantiene dentro de la franja (solo desplaza el propio control).
  useEffect(() => {
    const root = rootRef.current
    if (!scrollable || !root) return
    const active = root.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]')
    if (!active) return
    const left = active.offsetLeft
    const right = left + active.offsetWidth
    if (left < root.scrollLeft) root.scrollLeft = left
    else if (right > root.scrollLeft + root.clientWidth) root.scrollLeft = right - root.clientWidth
  }, [scrollable, current])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>('[role="radio"]:not([disabled])') ?? [],
    )
    const i = items.indexOf(e.target as HTMLElement)
    if (i < 0) return
    let next = -1
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (i + 1) % items.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (i - 1 + items.length) % items.length
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = items.length - 1
        break
      default:
        return
    }
    e.preventDefault()
    const el = items[next]
    el?.focus()
    el?.click()
  }

  return (
    <div
      ref={rootRef}
      data-sk="segmented"
      role="radiogroup"
      aria-label={label}
      data-scrollable={scrollable ? '' : undefined}
      className={cx('sk-segmented', className)}
      onKeyDown={onKeyDown}
      {...rest}
    >
      <SegmentedContext.Provider value={{ value: current, setValue }}>
        {children}
      </SegmentedContext.Provider>
    </div>
  )
}

export interface SegmentedItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

function SegmentedItem({ value, className, children, ...rest }: SegmentedItemProps) {
  const ctx = useSegmentedCtx('Item')
  const active = ctx.value === value
  return (
    <button
      type="button"
      data-part="item"
      role="radio"
      aria-checked={active}
      data-state={active ? 'active' : 'inactive'}
      tabIndex={active ? 0 : -1}
      className={cx('sk-segmented__item', className)}
      onClick={() => ctx.setValue(value)}
      {...rest}
    >
      {children}
    </button>
  )
}

SegmentedControl.Item = SegmentedItem
