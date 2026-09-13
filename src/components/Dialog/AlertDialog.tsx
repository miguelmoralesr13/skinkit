import { type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { Button } from '../Button'
import { Dialog, type DialogSize } from './Dialog'
import { useSkinkitMessages } from '../../i18n/context'

export interface AlertDialogClassNames {
  header?: string
  title?: string
  body?: string
  footer?: string
  actionButton?: string
}

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
  /** Clase adicional para la raíz (se pasa al <Dialog> interno). No reemplaza la clase base. */
  className?: string
  /** Clases adicionales por sub-parte (header/title/body/footer/actionButton). Aditivo. */
  classNames?: AlertDialogClassNames
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
  actionText: actionTextProp,
  tone = 'primary',
  size = 'sm',
  className,
  classNames,
}: AlertDialogProps) {
  const m = useSkinkitMessages()
  const actionText = actionTextProp ?? m.dialog.alertAction
  return (
    <Dialog open={open} onClose={onClose} size={size} className={className}>
      <Dialog.Header className={cx('sk-alert-dialog__header', classNames?.header)}>
        <Dialog.Title className={cx('sk-alert-dialog__title', classNames?.title)}>{title}</Dialog.Title>
        <Dialog.Close />
      </Dialog.Header>
      {description ? (
        <Dialog.Body className={cx('sk-alert-dialog__body', classNames?.body)}>{description}</Dialog.Body>
      ) : null}
      <Dialog.Footer className={cx('sk-alert-dialog__footer', classNames?.footer)}>
        <Button
          variant="filled"
          data-tone={tone}
          onClick={onClose}
          className={cx('sk-alert-dialog__action-button', classNames?.actionButton)}
        >
          {actionText}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}
