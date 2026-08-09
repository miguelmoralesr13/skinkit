import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { cx } from '../../lib/cx'

interface TabsCtx {
  value: string
  setValue: (value: string) => void
  baseId: string
}
const TabsContext = createContext<TabsCtx | null>(null)

function useTabsCtx(part: string): TabsCtx {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error(`skinkit: <Tabs.${part}> debe usarse dentro de <Tabs>`)
  return ctx
}

export type TabsTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Tab activo (controlado). */
  value?: string
  /** Tab activo inicial (uncontrolled). */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Color de acento del tab activo (del theme). 'primary' (default) no emite data-tone. */
  tone?: TabsTone
}

/**
 * Tabs headless, compuesto: <Tabs> · <Tabs.List> · <Tabs.Tab> · <Tabs.Panel>. Cero estilo
 * propio. Aporta: estado del tab activo, ARIA (role tablist/tab/tabpanel, aria-selected/controls)
 * y roving tabindex con flechas ← → ↑ ↓ Home End dentro de la lista.
 *
 * Contrato de parts:
 *   [data-sk="tabs"]                        raíz
 *   [data-part="list"]   role=tablist       barra de tabs
 *   [data-part="tab"]    [data-state]       cada tab (active | inactive)
 *   [data-part="panel"]  role=tabpanel      contenido del tab activo
 */
export function Tabs({
  value,
  defaultValue,
  onValueChange,
  tone = 'primary',
  className,
  children,
  ...rest
}: TabsProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue ?? '')
  const current = isControlled ? value : internal
  const baseId = useId()

  const setValue = useCallback(
    (v: string) => {
      if (!isControlled) setInternal(v)
      onValueChange?.(v)
    },
    [isControlled, onValueChange],
  )

  return (
    <div
      data-sk="tabs"
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-tabs', className)}
      {...rest}
    >
      <TabsContext.Provider value={{ value: current, setValue, baseId }}>
        {children}
      </TabsContext.Provider>
    </div>
  )
}

function TabsList({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const listRef = useRef<HTMLDivElement>(null)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])') ?? [],
    )
    const i = tabs.indexOf(e.target as HTMLElement)
    if (i < 0) return

    let next = -1
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (i + 1) % tabs.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (i - 1 + tabs.length) % tabs.length
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = tabs.length - 1
        break
      default:
        return
    }
    e.preventDefault()
    const el = tabs[next]
    el?.focus()
    el?.click() // activación automática al mover el foco
  }

  return (
    <div
      ref={listRef}
      data-part="list"
      role="tablist"
      className={cx('sk-tabs__list', className)}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {children}
    </div>
  )
}

export interface TabsTabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

function TabsTab({ value, className, children, ...rest }: TabsTabProps) {
  const ctx = useTabsCtx('Tab')
  const active = ctx.value === value

  return (
    <button
      type="button"
      data-part="tab"
      role="tab"
      id={`${ctx.baseId}-t-${value}`}
      aria-selected={active}
      aria-controls={`${ctx.baseId}-p-${value}`}
      tabIndex={active ? 0 : -1}
      data-state={active ? 'active' : 'inactive'}
      className={cx('sk-tabs__tab', className)}
      onClick={() => ctx.setValue(value)}
      {...rest}
    >
      {children}
    </button>
  )
}

export interface TabsPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

function TabsPanel({ value, className, children, ...rest }: TabsPanelProps) {
  const ctx = useTabsCtx('Panel')
  if (ctx.value !== value) return null

  return (
    <div
      data-part="panel"
      role="tabpanel"
      id={`${ctx.baseId}-p-${value}`}
      aria-labelledby={`${ctx.baseId}-t-${value}`}
      data-state="active"
      className={cx('sk-tabs__panel', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

Tabs.List = TabsList
Tabs.Tab = TabsTab
Tabs.Panel = TabsPanel
