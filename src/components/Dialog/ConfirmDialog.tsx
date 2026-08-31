import { type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { Button } from '../Button'
import { Dialog, type DialogSize } from './Dialog'

export type ConfirmTone = 'primary' | 'danger'

export interface ConfirmDialogClassNames {
  header?: string
  title?: string
  body?: string
  footer?: string
  cancelButton?: string
  confirmButton?: string
}

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
  /** Clase adicional para la raíz (se pasa al <Dialog> interno). No reemplaza la clase base. */
  className?: string
  /** Clases adicionales por sub-parte (header/title/body/footer/cancelButton/confirmButton). Aditivo. */
  classNames?: ConfirmDialogClassNames
}

/**
 * ConfirmDialog — diálogo de confirmación construido sobre <Dialog>. Pregunta y ofrece
 * cancelar / confirmar. Para acciones destructivas usá tone="danger".
 *
 * Reusa el contrato de parts de Dialog; el botón de confirmar lleva [data-tone] para que
 * el CSS lo pinte según la intención.
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
  className,
  classNames,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size={size} className={className}>
      <Dialog.Header className={cx('sk-confirm-dialog__header', classNames?.header)}>
        <Dialog.Title className={cx('sk-confirm-dialog__title', classNames?.title)}>{title}</Dialog.Title>
        <Dialog.Close />
      </Dialog.Header>
      {description ? (
        <Dialog.Body className={cx('sk-confirm-dialog__body', classNames?.body)}>{description}</Dialog.Body>
      ) : null}
      <Dialog.Footer className={cx('sk-confirm-dialog__footer', classNames?.footer)}>
        <Button
          variant="outlined"
          onClick={onClose}
          className={cx('sk-confirm-dialog__cancel-button', classNames?.cancelButton)}
        >
          {cancelText}
        </Button>
        <Button
          variant="filled"
          data-tone={tone}
          onClick={onConfirm}
          className={cx('sk-confirm-dialog__confirm-button', classNames?.confirmButton)}
        >
          {confirmText}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}
