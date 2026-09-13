import { useEditorState } from '@tiptap/react'
import { cx } from '../../lib/cx'
import { useRichTextEditorCtx } from './RichTextEditor'
import { useSkinkitMessages } from '../../i18n/context'

// .Color — a diferencia de Link/Image, no hace falta un <PromptDialog>: el propio navegador ya
// trae un selector de color nativo (<input type="color">), la misma convención que usa el panel
// de personalización del playground. Sin selección de texto no tiene sobre qué aplicar el color,
// pero el input queda igual disponible (setColor aplica al próximo texto que se escriba).

export interface RichTextEditorColorProps {
  className?: string
  'aria-label'?: string
}

export function Color({ className, 'aria-label': ariaLabelProp }: RichTextEditorColorProps) {
  const m = useSkinkitMessages()
  const ariaLabel = ariaLabelProp ?? m.richTextEditor.textColor
  const { editor } = useRichTextEditorCtx('Color')
  const current =
    useEditorState({
      editor,
      selector: (ctx) => (ctx.editor?.getAttributes('textStyle').color as string | undefined) ?? '#000000',
    }) ?? '#000000'

  return (
    <input
      type="color"
      data-part="color"
      className={cx('sk-rich-text-editor__color', className)}
      aria-label={ariaLabel}
      value={current}
      onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
    />
  )
}
