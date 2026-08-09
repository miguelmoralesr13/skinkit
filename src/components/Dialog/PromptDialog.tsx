import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '../Button'
import { Input } from '../Input'
import { Dialog, type DialogSize } from './Dialog'

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
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  size = 'sm',
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue)

  // Resetea el valor cada vez que se abre.
  useEffect(() => {
    if (open) setValue(defaultValue)
  }, [open, defaultValue])

  const submit = () => onConfirm(value)

  return (
    <Dialog open={open} onClose={onClose} size={size}>
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Close />
      </Dialog.Header>
      <Dialog.Body>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          {description ? <p style={{ marginTop: 0 }}>{description}</p> : null}
          <Input
            label={label}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
        </form>
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="outlined" onClick={onClose}>
          {cancelText}
        </Button>
        <Button onClick={submit}>{confirmText}</Button>
      </Dialog.Footer>
    </Dialog>
  )
}
