import { useEffect, useState, type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { Button } from '../Button'
import { Input } from '../Input'
import { Dialog, type DialogSize } from './Dialog'
import { useSkinkitMessages } from '../../i18n/context'

export interface PromptDialogClassNames {
  header?: string
  title?: string
  body?: string
  description?: string
  footer?: string
  cancelButton?: string
  confirmButton?: string
}

export interface PromptDialogProps {
  open: boolean
  onClose: () => void
  /** Se invoca con el valor ingresado al confirmar (botón o Enter). */
  onConfirm: (value: string) => void
  title: ReactNode
  description?: ReactNode
  /** Label del campo. */
  label?: ReactNode
  placeholder?: string
  /** Valor inicial (se resetea cada vez que se abre). */
  defaultValue?: string
  confirmText?: string
  cancelText?: string
  size?: DialogSize
  /** Clase adicional para la raíz (se pasa al <Dialog> interno). No reemplaza la clase base. */
  className?: string
  /** Clases adicionales por sub-parte (header/title/body/description/footer/cancelButton/confirmButton). Aditivo. */
  classNames?: PromptDialogClassNames
}

/**
 * PromptDialog — pide un valor de texto. Construido sobre <Dialog> + <Input>. Enter en el
 * campo confirma; el valor viaja en onConfirm(value). Vos decidís cerrar después.
 */
export function PromptDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  label,
  placeholder,
  defaultValue = '',
  confirmText: confirmTextProp,
  cancelText: cancelTextProp,
  size = 'sm',
  className,
  classNames,
}: PromptDialogProps) {
  const m = useSkinkitMessages()
  const cancelText = cancelTextProp ?? m.dialog.cancel
  const confirmText = confirmTextProp ?? m.dialog.promptConfirm
  const [value, setValue] = useState(defaultValue)

  // Resetea el valor cada vez que se abre.
  useEffect(() => {
    if (open) setValue(defaultValue)
  }, [open, defaultValue])

  const submit = () => onConfirm(value)

  return (
    <Dialog open={open} onClose={onClose} size={size} className={className}>
      <Dialog.Header className={cx('sk-prompt-dialog__header', classNames?.header)}>
        <Dialog.Title className={cx('sk-prompt-dialog__title', classNames?.title)}>{title}</Dialog.Title>
        <Dialog.Close />
      </Dialog.Header>
      <Dialog.Body className={cx('sk-prompt-dialog__body', classNames?.body)}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          {description ? (
            <p style={{ marginTop: 0 }} className={cx('sk-prompt-dialog__description', classNames?.description)}>
              {description}
            </p>
          ) : null}
          <Input
            label={label}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
        </form>
      </Dialog.Body>
      <Dialog.Footer className={cx('sk-prompt-dialog__footer', classNames?.footer)}>
        <Button
          variant="outlined"
          onClick={onClose}
          className={cx('sk-prompt-dialog__cancel-button', classNames?.cancelButton)}
        >
          {cancelText}
        </Button>
        <Button onClick={submit} className={cx('sk-prompt-dialog__confirm-button', classNames?.confirmButton)}>
          {confirmText}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}
