import { useState, type ReactNode } from 'react'
import { Button } from '../Button'
import { Popover, type PopoverSide } from '../Popover'

export interface PopconfirmProps {
  /** Pregunta/título de la confirmación. */
  title: ReactNode
  /** Detalle opcional bajo el título. */
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
  /** Estilo de acción peligrosa (el skin pinta el botón de confirmar con --sk-danger). */
  danger?: boolean
  side?: PopoverSide
  /** El disparador (texto/ícono). Se renderiza dentro del botón del Popover. */
  children: ReactNode
}

/**
 * Popconfirm headless — confirmación liviana anclada a un disparador (a diferencia del
 * ConfirmDialog, que es un modal). Compone Popover + Button. La forma la da el skin.
 *
 * Contrato:
 *   [data-sk="popconfirm"]   [data-tone=danger?]   panel dentro del Popover.Content
 *   [data-part="title"] · [data-part="description"] · [data-part="actions"]
 *   [data-part="confirm"] va sobre el <Button> de confirmar (para estilarlo en danger)
 */
export function Popconfirm({
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  danger,
  side = 'top',
  children,
}: PopconfirmProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen} side={side}>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content>
        <div data-sk="popconfirm" data-tone={danger ? 'danger' : undefined}>
          <div data-part="title">{title}</div>
          {description != null && <div data-part="description">{description}</div>}
          <div data-part="actions">
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
