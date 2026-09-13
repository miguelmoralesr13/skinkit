import { Link as LinkIcon } from 'lucide-react'
import { useState } from 'react'
import { useEditorState } from '@tiptap/react'
import { Toggle } from '../Toggle'
import { PromptDialog } from '../Dialog'
import { useRichTextEditorCtx, type RichTextEditorToggleButtonProps } from './RichTextEditor'
import { useSkinkitMessages } from '../../i18n/context'

// .Link — a diferencia de Bold/Italic (toggle in-place), un link necesita un VALOR (la URL), así
// que el trigger abre un <PromptDialog> (reuso directo, ver src/components/Dialog/PromptDialog.tsx)
// en vez de aplicar el mark al toque. Si el cursor ya está sobre un link, lo pre-carga para editar.

export type RichTextEditorLinkProps = RichTextEditorToggleButtonProps

export function Link({ children = <LinkIcon size={16} />, ...rest }: RichTextEditorLinkProps) {
  const m = useSkinkitMessages()
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
      <Toggle pressed={active} onPressedChange={() => setOpen(true)} aria-label={m.richTextEditor.link} {...rest}>
        {children}
      </Toggle>
      <PromptDialog
        open={open}
        onClose={() => setOpen(false)}
        title={active ? m.richTextEditor.editLink : m.richTextEditor.insertLink}
        label={m.richTextEditor.linkUrl}
        placeholder="https://…"
        defaultValue={currentHref}
        confirmText={active ? m.richTextEditor.update : m.richTextEditor.insert}
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
