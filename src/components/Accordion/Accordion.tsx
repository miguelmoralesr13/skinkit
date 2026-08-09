import {
  createContext,
  useContext,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { useAccordion, type AccordionType } from './useAccordion'

interface AccordionCtx {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
}
const AccordionContext = createContext<AccordionCtx | null>(null)

interface ItemCtx {
  value: string
  open: boolean
  triggerId: string
  panelId: string
}
const ItemContext = createContext<ItemCtx | null>(null)

function useAccordionCtx(part: string): AccordionCtx {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error(`skinkit: <Accordion.${part}> debe usarse dentro de <Accordion>`)
  return ctx
}
function useItemCtx(part: string): ItemCtx {
  const ctx = useContext(ItemContext)
  if (!ctx) throw new Error(`skinkit: <Accordion.${part}> debe usarse dentro de <Accordion.Item>`)
  return ctx
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  type?: AccordionType
  defaultValue?: string | string[]
}

/**
 * Accordion headless, compuesto: <Accordion> · <Accordion.Item> · <Accordion.Trigger> ·
 * <Accordion.Panel>. Cero estilo propio. Aporta: estado, ARIA (aria-expanded/controls,
 * role=region) y navegación por teclado entre triggers (↑ ↓ Home End). Enter/Espacio los
 * maneja el <button> nativo del Trigger.
 *
 * Contrato de parts:
 *   [data-sk="accordion"]                        raíz
 *   [data-part="item"]     [data-state]          ítem
 *   [data-part="trigger"]  [data-state]          botón (foco/teclado)
 *   [data-part="label"]                          texto del trigger
 *   [data-part="indicator"]                       adorno abrir/cerrar (chevron, +/−, …)
 *   [data-part="panel"]    [data-state]          contenido colapsable
 */
export function Accordion({
  type = 'single',
  defaultValue,
  className,
  children,
  ...rest
}: AccordionProps) {
  const { isOpen, toggle } = useAccordion(type, defaultValue)
  const rootRef = useRef<HTMLDivElement>(null)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.getAttribute('data-part') !== 'trigger') return

    const triggers = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>('[data-part="trigger"]') ?? [],
    )
    const i = triggers.indexOf(target)
    if (i < 0) return

    let next = -1
    switch (e.key) {
      case 'ArrowDown':
        next = (i + 1) % triggers.length
        break
      case 'ArrowUp':
        next = (i - 1 + triggers.length) % triggers.length
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = triggers.length - 1
        break
      default:
        return
    }
    e.preventDefault()
    triggers[next]?.focus()
  }

  return (
    <div
      ref={rootRef}
      data-sk="accordion"
      data-type={type}
      className={cx('sk-accordion', className)}
      onKeyDown={onKeyDown}
      {...rest}
    >
      <AccordionContext.Provider value={{ isOpen, toggle }}>{children}</AccordionContext.Provider>
    </div>
  )
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

function AccordionItem({ value, className, children, ...rest }: AccordionItemProps) {
  const ctx = useAccordionCtx('Item')
  const open = ctx.isOpen(value)
  const uid = useId()

  return (
    <div
      data-part="item"
      data-state={open ? 'open' : 'closed'}
      className={cx('sk-accordion__item', className)}
      {...rest}
    >
      <ItemContext.Provider
        value={{ value, open, triggerId: `sk-acc-t-${uid}`, panelId: `sk-acc-p-${uid}` }}
      >
        {children}
      </ItemContext.Provider>
    </div>
  )
}

function AccordionTrigger({
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useAccordionCtx('Trigger')
  const item = useItemCtx('Trigger')

  return (
    <button
      type="button"
      data-sk="accordion-trigger"
      data-part="trigger"
      id={item.triggerId}
      aria-expanded={item.open}
      aria-controls={item.panelId}
      data-state={item.open ? 'open' : 'closed'}
      className={cx('sk-accordion__trigger', className)}
      onClick={() => ctx.toggle(item.value)}
      {...rest}
    >
      <span data-part="label">{children}</span>
      <span data-part="indicator" aria-hidden="true" />
    </button>
  )
}

export interface AccordionPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

function AccordionPanel({ className, children, ...rest }: AccordionPanelProps) {
  const item = useItemCtx('Panel')

  return (
    <div
      data-part="panel"
      id={item.panelId}
      role="region"
      aria-labelledby={item.triggerId}
      data-state={item.open ? 'open' : 'closed'}
      hidden={!item.open}
      className={cx('sk-accordion__panel', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

Accordion.Item = AccordionItem
Accordion.Trigger = AccordionTrigger
Accordion.Panel = AccordionPanel
