import { Toggle } from '../Toggle'
import { Button, type ButtonProps } from '../Button'
import {
  useRichTextEditorCtx,
  useEditorActive,
  type RichTextEditorToggleButtonProps,
} from './RichTextEditor'
import { useSkinkitMessages } from '../../i18n/context'

// BulletList/OrderedList/Blockquote/CodeBlock (toggle, activos según dónde esté el cursor) +
// HorizontalRule (acción de una sola vez, no tiene estado "activo"). Ver el comentario en
// RichTextEditorFormatting.tsx: cada botón es un export con nombre, el ensamblado final
// (RichTextEditor.X = X) vive en el barrel (index.ts) vía Object.assign.

export type RichTextEditorBlockToggleProps = RichTextEditorToggleButtonProps

export function BulletList({ children = '•', ...rest }: RichTextEditorBlockToggleProps) {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('BulletList')
  const active = useEditorActive('bulletList')
  return (
    <Toggle
      pressed={active}
      onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}
      aria-label={m.richTextEditor.bulletList}
      {...rest}
    >
      {children}
    </Toggle>
  )
}

export function OrderedList({ children = '1.', ...rest }: RichTextEditorBlockToggleProps) {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('OrderedList')
  const active = useEditorActive('orderedList')
  return (
    <Toggle
      pressed={active}
      onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}
      aria-label={m.richTextEditor.orderedList}
      {...rest}
    >
      {children}
    </Toggle>
  )
}

export function Blockquote({ children = '"', ...rest }: RichTextEditorBlockToggleProps) {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('Blockquote')
  const active = useEditorActive('blockquote')
  return (
    <Toggle
      pressed={active}
      onPressedChange={() => editor?.chain().focus().toggleBlockquote().run()}
      aria-label={m.richTextEditor.blockquote}
      {...rest}
    >
      {children}
    </Toggle>
  )
}

export function CodeBlock({ children = '</>', ...rest }: RichTextEditorBlockToggleProps) {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('CodeBlock')
  const active = useEditorActive('codeBlock')
  return (
    <Toggle
      pressed={active}
      onPressedChange={() => editor?.chain().focus().toggleCodeBlock().run()}
      aria-label={m.richTextEditor.codeBlock}
      {...rest}
    >
      {children}
    </Toggle>
  )
}

export interface RichTextEditorHorizontalRuleProps extends Omit<ButtonProps, 'variant'> {}

export function HorizontalRule({ children = '―', ...rest }: RichTextEditorHorizontalRuleProps) {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('HorizontalRule')
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => editor?.chain().focus().setHorizontalRule().run()}
      aria-label={m.richTextEditor.horizontalRule}
      {...rest}
    >
      {children}
    </Button>
  )
}
