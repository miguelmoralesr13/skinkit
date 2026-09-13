import { Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { Button, type ButtonProps } from '../Button'
import { PromptDialog } from '../Dialog'
import { useRichTextEditorCtx } from './RichTextEditor'
import { useSkinkitMessages } from '../../i18n/context'

// .Image — acción de una sola vez (no hay "estado activo" para una imagen puntual, a diferencia
// de un link). Pide la URL por <PromptDialog> e inserta con setImage.

export type RichTextEditorImageProps = Omit<ButtonProps, 'variant'>

export function Image({ children = <ImageIcon size={16} />, ...rest }: RichTextEditorImageProps) {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('Image')
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type="button" variant="ghost" onClick={() => setOpen(true)} aria-label={m.richTextEditor.image} {...rest}>
        {children}
      </Button>
      <PromptDialog
        open={open}
        onClose={() => setOpen(false)}
        title={m.richTextEditor.insertImage}
        label={m.richTextEditor.imageUrl}
        placeholder="https://…"
        confirmText={m.richTextEditor.insert}
        onConfirm={(src) => {
          if (editor && src) editor.chain().focus().setImage({ src }).run()
          setOpen(false)
        }}
      />
    </>
  )
}
