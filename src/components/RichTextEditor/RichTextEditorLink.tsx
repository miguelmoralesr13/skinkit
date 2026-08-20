import { useState } from 'react'
import { useEditorState } from '@tiptap/react'
import { Toggle } from '../Toggle'
import { PromptDialog } from '../Dialog'
import { useRichTextEditorCtx, type RichTextEditorToggleButtonProps } from './RichTextEditor'

// .Link — a diferencia de Bold/Italic (toggle in-place), un link necesita un VALOR (la URL), así
// que el trigger abre un <PromptDialog> (reuso directo, ver src/components/Dialog/PromptDialog.tsx)
// en vez de aplicar el mark al toque. Si el cursor ya está sobre un link, lo pre-carga para editar.

export type RichTextEditorLinkProps = RichTextEditorToggleButtonProps

export function Link({ children = '🔗', ...rest }: RichTextEditorLinkProps) {
  const { editor } = useRichTextEditorCtx('Link')
  const [open, setOpen] = useState(false)
  const active = useEditorState({ editor, selector: (ctx) => ctx.editor?.isActive('link') ?? false }) ?? false
  const currentHref =
    useEditorState({
      editor,
      selector: (ctx) => (ctx.editor?.getAttributes('link').href as string | undefined) ?? '',
    }) ?? ''

  return (
    <>
      <Toggle pressed={active} onPressedChange={() => setOpen(true)} aria-label="Link" {...rest}>
        {children}
      </Toggle>
      <PromptDialog
        open={open}
        onClose={() => setOpen(false)}
        title={active ? 'Editar link' : 'Insertar link'}
        label="URL"
        placeholder="https://…"
        defaultValue={currentHref}
        confirmText={active ? 'Actualizar' : 'Insertar'}
        onConfirm={(href) => {
          if (!editor) return
          if (!href) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
          } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
          }
          setOpen(false)
        }}
      />
    </>
  )
}
