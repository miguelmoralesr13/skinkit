import {
  createContext,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'

interface DisclosureCtx {
  open: boolean
  toggle: () => void
  triggerId: string
  contentId: string
}
const DisclosureContext = createContext<DisclosureCtx | null>(null)

function useDisclosureCtx(part: string): DisclosureCtx {
  const ctx = useContext(DisclosureContext)
  if (!ctx) throw new Error(`skinkit: <Disclosure.${part}> debe usarse dentro de <Disclosure>`)
  return ctx
}

export interface DisclosureProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Disclosure headless, compuesto: <Disclosure> · <Disclosure.Trigger> · <Disclosure.Content>.
 * Una sección colapsable suelta (como un ítem de Accordion, pero standalone). Controlado o no.
 * ARIA (aria-expanded/controls) incluido; la forma la da el skin.
 *
 * Contrato:
 *   [data-sk="disclosure"]   [data-state]  raíz (open|closed)
 *   [data-part="trigger"]    [data-state]  el botón
 *   [data-part="indicator"]                adorno abrir/cerrar
 *   [data-part="content"]    [data-state]  contenido colapsable (hidden cuando cerrado)
 */
export function Disclosure({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...rest
}: DisclosureProps) {
  const isControlled = openProp !== undefined
  const [internal, setInternal] = useState(defaultOpen)
  const open = isControlled ? openProp : internal
  const triggerId = useId()
  const contentId = useId()

  const toggle = () => {
    const next = !open
    if (!isControlled) setInternal(next)
    onOpenChange?.(next)
  }

  return (
    <div
      data-sk="disclosure"
      data-state={open ? 'open' : 'closed'}
      className={cx('sk-disclosure', className)}
      {...rest}
    >
      <DisclosureContext.Provider value={{ open, toggle, triggerId, contentId }}>
        {children}
      </DisclosureContext.Provider>
    </div>
  )
}

function DisclosureTrigger({
  className,
  children,
  onClick,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useDisclosureCtx('Trigger')
  return (
    <button
      type="button"
      data-part="trigger"
      data-state={ctx.open ? 'open' : 'closed'}
      id={ctx.triggerId}
      aria-expanded={ctx.open}
      aria-controls={ctx.contentId}
      className={cx('sk-disclosure__trigger', className)}
      onClick={(e) => {
        onClick?.(e)
        ctx.toggle()
      }}
      {...rest}
    >
      <span data-part="label">{children}</span>
      <span data-part="indicator" aria-hidden="true" />
    </button>
  )
}

export interface DisclosureContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

function DisclosureContent({ className, children, ...rest }: DisclosureContentProps) {
  const ctx = useDisclosureCtx('Content')
  return (
    <div
      data-part="content"
      id={ctx.contentId}
      role="region"
      aria-labelledby={ctx.triggerId}
      data-state={ctx.open ? 'open' : 'closed'}
      hidden={!ctx.open}
      className={cx('sk-disclosure__content', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

Disclosure.Trigger = DisclosureTrigger
Disclosure.Content = DisclosureContent
