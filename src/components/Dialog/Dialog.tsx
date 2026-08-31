import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../lib/cx'
import { useSkinkitColorScheme } from '../../provider/SkinkitProvider'

export type DialogSize = 'sm' | 'md' | 'lg' | 'full'
export type DialogPlacement = 'center' | 'left' | 'right' | 'top' | 'bottom'

export interface DialogClassNames {
  overlay?: string
  panel?: string
}

const FOCUSABLE =
  'a[href],area[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

interface DialogCtx {
  titleId: string
  descId: string
  onClose: () => void
}
const DialogContext = createContext<DialogCtx | null>(null)

function useDialogCtx(part: string): DialogCtx {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error(`skinkit: <Dialog.${part}> debe usarse dentro de <Dialog>`)
  return ctx
}

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Controla si el diálogo está abierto. */
  open: boolean
  /** Se invoca al pedir cierre (Esc, overlay, botón de cierre). */
  onClose: () => void
  size?: DialogSize
  /** Dónde se ancla el panel: center = modal; left/right/top/bottom = drawer/sheet. */
  placement?: DialogPlacement
  /** Cerrar al hacer click en el overlay (default true). */
  closeOnOverlay?: boolean
  /** Cerrar con la tecla Escape (default true). */
  closeOnEsc?: boolean
  /** Clases adicionales por parte interna (overlay/panel). Se agregan, nunca reemplazan la clase base. */
  classNames?: DialogClassNames
}

/**
 * Dialog headless (modal), compuesto: <Dialog> · <Dialog.Header> · <Dialog.Title> ·
 * <Dialog.Body> · <Dialog.Footer> · <Dialog.Close>. Aporta: portal a <body>, overlay,
 * focus trap, cierre con Esc, scroll lock y ARIA (role=dialog, aria-modal). No hace falta
 * reaplicar theming en el portal: los tokens (`--color-sk-*`, `--radius-sk-*`, etc.) viven en
 * `:root` vía Tailwind `@theme`, ya están disponibles en cualquier punto del documento.
 *
 * Contrato de parts:
 *   [data-sk="dialog"]     [data-size] [data-placement]   raíz portalizada
 *                          size: sm|md|lg|full · placement: center|left|right|top|bottom (drawer)
 *   [data-part="overlay"]                   fondo oscuro (cierra al click si closeOnOverlay)
 *   [data-part="panel"]    role=dialog      la tarjeta del modal
 *   [data-part="header"]                    cabecera
 *   [data-part="title"]                     título (h2, aria-labelledby)
 *   [data-part="body"]                      cuerpo (aria-describedby)
 *   [data-part="footer"]                    pie (acciones)
 *   [data-part="close"]                     botón de cierre
 */
export function Dialog({
  open,
  onClose,
  size = 'md',
  placement = 'center',
  closeOnOverlay = true,
  closeOnEsc = true,
  className,
  children,
  classNames,
  ...rest
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()
  const colorScheme = useSkinkitColorScheme()

  useEffect(() => {
    if (!open) return
    const prevActive = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc) {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key === 'Tab') {
        const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
        if (!nodes || nodes.length === 0) {
          e.preventDefault()
          return
        }
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = prevOverflow
      prevActive?.focus?.()
    }
  }, [open, closeOnEsc, onClose])

  if (!open) return null

  const labelledBy = rest['aria-label'] ? undefined : titleId

  return createPortal(
    <div data-skinkit-root="" data-color-scheme={colorScheme} className="skinkit-root">
      <div
        data-sk="dialog"
        data-size={size}
        data-placement={placement}
        className={cx('sk-dialog', className)}
      >
        <div
          data-part="overlay"
          className={cx('sk-dialog__overlay', classNames?.overlay)}
          onClick={closeOnOverlay ? onClose : undefined}
          aria-hidden="true"
        />
        <div
          ref={panelRef}
          data-part="panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          aria-describedby={descId}
          tabIndex={-1}
          className={cx('sk-dialog__panel', classNames?.panel)}
          {...rest}
        >
          <DialogContext.Provider value={{ titleId, descId, onClose }}>
            {children}
          </DialogContext.Provider>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function DialogHeader({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-part="header" className={cx('sk-dialog__header', className)} {...rest}>
      {children}
    </div>
  )
}

function DialogTitle({ className, children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  const ctx = useDialogCtx('Title')
  return (
    <h2 data-part="title" id={ctx.titleId} className={cx('sk-dialog__title', className)} {...rest}>
      {children}
    </h2>
  )
}

function DialogBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const ctx = useDialogCtx('Body')
  return (
    <div data-part="body" id={ctx.descId} className={cx('sk-dialog__body', className)} {...rest}>
      {children}
    </div>
  )
}

function DialogFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-part="footer" className={cx('sk-dialog__footer', className)} {...rest}>
      {children}
    </div>
  )
}

function DialogClose({ className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useDialogCtx('Close')
  return (
    <button
      type="button"
      data-part="close"
      aria-label="Cerrar"
      className={cx('sk-dialog__close', className)}
      onClick={ctx.onClose}
      {...rest}
    >
      {children ?? '×'}
    </button>
  )
}

Dialog.Header = DialogHeader
Dialog.Title = DialogTitle
Dialog.Body = DialogBody
Dialog.Footer = DialogFooter
Dialog.Close = DialogClose
