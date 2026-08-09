import { type ReactNode } from 'react'
import { Button } from '../Button'
import { Dialog, type DialogSize } from './Dialog'

export interface AlertDialogProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  /** Texto del único botón de acuse. */
  actionText?: string
  /** danger = pinta el botón en rojo (para avisos de error). */
  tone?: 'primary' | 'danger'
  size?: DialogSize
}

/**
 * AlertDialog — aviso de un solo botón (acuse de recibo). Construido sobre <Dialog>.
 * Más simple que ConfirmDialog: no hay cancelar, solo aceptar. Para informar algo que el
 * usuario debe ver sí o sí antes de seguir.
 */
export function AlertDialog({
  open,
  onClose,
  title,
  description,
  actionText = 'Entendido',
  tone = 'primary',
  size = 'sm',
}: AlertDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size={size}>
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Close />
      </Dialog.Header>
      {description ? <Dialog.Body>{description}</Dialog.Body> : null}
      <Dialog.Footer>
        <Button variant="filled" data-tone={tone} onClick={onClose}>
          {actionText}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}
