import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from 'react'
import { cx } from '../../lib/cx'
import { useDismissable } from '../../lib/useDismissable'

export type PopoverSide = 'bottom' | 'top' | 'left' | 'right'

interface PopoverCtx {
  open: boolean
  setOpen: (v: boolean) => void
  close: () => void
  triggerId: string
  contentId: string
}
const PopoverContext = createContext<PopoverCtx | null>(null)

function usePopoverCtx(part: string): PopoverCtx {
  const ctx = useContext(PopoverContext)
  if (!ctx) throw new Error(`skinkit: <Popover.${part}> debe usarse dentro de <Popover>`)
  return ctx
}

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  side?: PopoverSide
  /** Abierto (controlado). Usalo con onOpenChange. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Popover headless, compuesto: <Popover> · <Popover.Trigger> · <Popover.Content>. Contenido
 * flotante arbitrario que abre al click. Sin portal. Cierra con Esc o
 * click afuera. La forma/posición ([data-side]) las da el CSS.
 *
 * Contrato:
 *   [data-sk="popover"]     [data-side]  raíz (envuelve trigger + content)
 *   [data-part="trigger"]   [data-state] el disparador (open|closed)
 *   [data-part="content"]   role=dialog  el panel flotante (solo cuando abre)
 */
export function Popover({
  side = 'bottom',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...rest
}: PopoverProps) {
  const isControlled = openProp !== undefined
  const [internal, setInternal] = useState(defaultOpen)
  const open = isControlled ? openProp : internal
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerId = useId()
  const contentId = useId()

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternal(next)
    onOpenChange?.(next)
  }
  const close = () => setOpen(false)

  useDismissable(open, rootRef, close)

  return (
    <div
      ref={rootRef}
      data-sk="popover"
      data-side={side}
      className={cx('sk-popover', className)}
      {...rest}
    >
      <PopoverContext.Provider value={{ open, setOpen, close, triggerId, contentId }}>
        {children}
      </PopoverContext.Provider>
    </div>
  )
}

function PopoverTrigger({ className, children, onClick, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = usePopoverCtx('Trigger')
  return (
    <button
      type="button"
      data-part="trigger"
      data-state={ctx.open ? 'open' : 'closed'}
      id={ctx.triggerId}
      aria-haspopup="dialog"
      aria-expanded={ctx.open}
      aria-controls={ctx.open ? ctx.contentId : undefined}
      className={cx('sk-popover__trigger', className)}
      onClick={(e) => {
        onClick?.(e)
        ctx.setOpen(!ctx.open)
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

function PopoverContent({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const ctx = usePopoverCtx('Content')
  if (!ctx.open) return null
  return (
    <div
      data-part="content"
      role="dialog"
      id={ctx.contentId}
      aria-labelledby={ctx.triggerId}
      className={cx('sk-popover__content', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

Popover.Trigger = PopoverTrigger
Popover.Content = PopoverContent
