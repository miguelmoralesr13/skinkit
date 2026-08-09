import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'

export type HoverCardSide = 'bottom' | 'top' | 'left' | 'right'

interface HoverCardCtx {
  open: boolean
  contentId: string
  onEnter: () => void
  onLeave: () => void
}
const HoverCardContext = createContext<HoverCardCtx | null>(null)

function useHoverCardCtx(part: string): HoverCardCtx {
  const ctx = useContext(HoverCardContext)
  if (!ctx) throw new Error(`skinkit: <HoverCard.${part}> debe usarse dentro de <HoverCard>`)
  return ctx
}

export interface HoverCardProps extends HTMLAttributes<HTMLSpanElement> {
  side?: HoverCardSide
  /** ms hasta abrir al entrar. */
  openDelay?: number
  /** ms hasta cerrar al salir (permite mover el mouse al contenido). */
  closeDelay?: number
  children: ReactNode
}

/**
 * HoverCard headless, compuesto: <HoverCard> · <HoverCard.Trigger> · <HoverCard.Content>.
 * Muestra contenido RICO al pasar el mouse o enfocar (preview de usuario, definición). A
 * diferencia de Tooltip (texto breve) o Popover (click), abre por hover con delays para poder
 * mover el mouse al contenido. Sin portal. La forma la da el skin.
 *
 * Contrato:
 *   [data-sk="hover-card"]   [data-side]   raíz
 *   [data-part="trigger"]    disparador (hover/focus)
 *   [data-part="content"]    [data-state]  la tarjeta flotante (open|closed)
 */
export function HoverCard({
  side = 'bottom',
  openDelay = 200,
  closeDelay = 150,
  className,
  children,
  ...rest
}: HoverCardProps) {
  const [open, setOpen] = useState(false)
  const contentId = useId()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }
  const onEnter = () => {
    clear()
    timer.current = setTimeout(() => setOpen(true), openDelay)
  }
  const onLeave = () => {
    clear()
    timer.current = setTimeout(() => setOpen(false), closeDelay)
  }
  useEffect(() => clear, [])

  return (
    <span
      data-sk="hover-card"
      data-side={side}
      className={cx('sk-hover-card', className)}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={onLeave}
      {...rest}
    >
      <HoverCardContext.Provider value={{ open, contentId, onEnter, onLeave }}>
        {children}
      </HoverCardContext.Provider>
    </span>
  )
}

function HoverCardTrigger({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  const ctx = useHoverCardCtx('Trigger')
  return (
    <span
      data-part="trigger"
      aria-describedby={ctx.open ? ctx.contentId : undefined}
      className={cx('sk-hover-card__trigger', className)}
      {...rest}
    >
      {children}
    </span>
  )
}

function HoverCardContent({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const ctx = useHoverCardCtx('Content')
  if (!ctx.open) return null
  return (
    <div
      data-part="content"
      role="dialog"
      id={ctx.contentId}
      data-state="open"
      className={cx('sk-hover-card__content', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

HoverCard.Trigger = HoverCardTrigger
HoverCard.Content = HoverCardContent
