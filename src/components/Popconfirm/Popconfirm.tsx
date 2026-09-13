import { useState, type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { Button } from '../Button'
import { Popover, type PopoverSide } from '../Popover'
import { useSkinkitMessages } from '../../i18n/context'

/** Clases adicionales por sub-parte (title/description/actions/confirm). Aditivo: nunca reemplaza la clase base. */
export interface PopconfirmClassNames {
  title?: string
  description?: string
  actions?: string
  confirm?: string
}

export interface PopconfirmProps {
  /** Pregunta/título de la confirmación. */
  title: ReactNode
  /** Detalle opcional bajo el título. */
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
  /** Estilo de acción peligrosa (el CSS pinta el botón de confirmar con --sk-danger). */
  danger?: boolean
  side?: PopoverSide
  /** El disparador (texto/ícono). Se renderiza dentro del botón del Popover. */
  children: ReactNode
  /** Clase adicional para la raíz ([data-sk="popconfirm"]). No reemplaza la clase base. */
  className?: string
  /** Clases adicionales por sub-parte. No reemplazan las clases base. */
  classNames?: PopconfirmClassNames
}

/**
 * Popconfirm headless — confirmación liviana anclada a un disparador (a diferencia del
 * ConfirmDialog, que es un modal). Compone Popover + Button. La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="popconfirm"]   [data-tone=danger?]   panel dentro del Popover.Content
 *   [data-part="title"] · [data-part="description"] · [data-part="actions"]
 *   [data-part="confirm"] va sobre el <Button> de confirmar (para estilarlo en danger)
 */
export function Popconfirm({
  title,
  description,
  confirmLabel: confirmLabelProp,
  cancelLabel: cancelLabelProp,
  onConfirm,
  onCancel,
  danger,
  side = 'top',
  children,
  className,
  classNames,
}: PopconfirmProps) {
  const m = useSkinkitMessages()
  const cancelLabel = cancelLabelProp ?? m.popconfirm.cancel
  const confirmLabel = confirmLabelProp ?? m.popconfirm.confirm
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen} side={side}>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content>
        <div
          data-sk="popconfirm"
          data-tone={danger ? 'danger' : undefined}
          className={cx('sk-popconfirm', className)}
        >
          <div data-part="title" className={cx('sk-popconfirm__title', classNames?.title)}>
            {title}
          </div>
          {description != null && (
            <div data-part="description" className={cx('sk-popconfirm__description', classNames?.description)}>
              {description}
            </div>
          )}
          <div data-part="actions" className={cx('sk-popconfirm__actions', classNames?.actions)}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                onCancel?.()
                setOpen(false)
              }}
            >
              {cancelLabel}
            </Button>
            <Button
              size="sm"
              data-part="confirm"
              className={cx('sk-popconfirm__confirm', classNames?.confirm)}
              onClick={() => {
                onConfirm?.()
                setOpen(false)
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </Popover.Content>
    </Popover>
  )
}
