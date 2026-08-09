import { type ReactNode } from 'react'
import { Button } from '../Button'
import { Dialog, type DialogSize } from './Dialog'

export type ConfirmTone = 'primary' | 'danger'

export interface ConfirmDialogProps {
  open: boolean
  /** Cierre/cancelación (Esc, overlay, botón cancelar). */
  onClose: () => void
  /** Acción al confirmar. Vos decidís cerrar el diálogo después. */
  onConfirm: () => void
  title: ReactNode
  description?: ReactNode
  confirmText?: string
  cancelText?: string
  /** danger = acción destructiva (botón de confirmar en rojo). */
  tone?: ConfirmTone
  size?: DialogSize
}

/**
 * ConfirmDialog — diálogo de confirmación construido sobre <Dialog>. Pregunta y ofrece
 * cancelar / confirmar. Para acciones destructivas usá tone="danger".
 *
 * Reusa el contrato de parts de Dialog; el botón de confirmar lleva [data-tone] para que
 * el skin lo pinte según la intención.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  tone = 'primary',
  size = 'sm',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size={size}>
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Close />
      </Dialog.Header>
      {description ? <Dialog.Body>{description}</Dialog.Body> : null}
      <Dialog.Footer>
        <Button variant="outlined" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant="filled" data-tone={tone} onClick={onConfirm}>
          {confirmText}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}
