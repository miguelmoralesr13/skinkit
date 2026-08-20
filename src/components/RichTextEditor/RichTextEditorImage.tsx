import { useState } from 'react'
import { Button, type ButtonProps } from '../Button'
import { PromptDialog } from '../Dialog'
import { useRichTextEditorCtx } from './RichTextEditor'

// .Image — acción de una sola vez (no hay "estado activo" para una imagen puntual, a diferencia
// de un link). Pide la URL por <PromptDialog> e inserta con setImage.

export type RichTextEditorImageProps = Omit<ButtonProps, 'variant'>

export function Image({ children = '🖼', ...rest }: RichTextEditorImageProps) {
  const { editor } = useRichTextEditorCtx('Image')
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type="button" variant="ghost" onClick={() => setOpen(true)} aria-label="Imagen" {...rest}>
        {children}
      </Button>
      <PromptDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Insertar imagen"
        label="URL de la imagen"
        placeholder="https://…"
        confirmText="Insertar"
        onConfirm={(src) => {
          if (editor && src) editor.chain().focus().setImage({ src }).run()
          setOpen(false)
        }}
      />
    </>
  )
}
