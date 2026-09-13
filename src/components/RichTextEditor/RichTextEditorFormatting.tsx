import { useEditorState } from '@tiptap/react'
import { Toggle } from '../Toggle'
import { Button, type ButtonProps } from '../Button'
import { Select } from '../Select'
import {
  useRichTextEditorCtx,
  useEditorActive,
  type RichTextEditorToggleButtonProps,
} from './RichTextEditor'
import { useSkinkitMessages } from '../../i18n/context'

// Bold/Italic/Underline/Strike/BlockType/Undo/Redo — ver el comentario en RichTextEditor.tsx
// sobre por qué esta familia se reparte en varios archivos por tema. Cada botón es un export
// con nombre; el barrel (index.ts) los cuelga como RichTextEditor.X vía Object.assign — TS no
// infiere una propiedad estática asignada en OTRO archivo del que se declaró la función, así
// que el ensamblado final vive en un solo lugar (index.ts), no acá.

export type RichTextEditorFormattingProps = RichTextEditorToggleButtonProps

export function Bold({ children = 'B', ...rest }: RichTextEditorFormattingProps) {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('Bold')
  const active = useEditorActive('bold')
  return (
    <Toggle
      pressed={active}
      onPressedChange={() => editor?.chain().focus().toggleBold().run()}
      aria-label={m.richTextEditor.bold}
      {...rest}
    >
      {children}
    </Toggle>
  )
}

export function Italic({ children = 'I', ...rest }: RichTextEditorFormattingProps) {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('Italic')
  const active = useEditorActive('italic')
  return (
    <Toggle
      pressed={active}
      onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
      aria-label={m.richTextEditor.italic}
      {...rest}
    >
      {children}
    </Toggle>
  )
}

export function Underline({ children = 'U', ...rest }: RichTextEditorFormattingProps) {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('Underline')
  const active = useEditorActive('underline')
  return (
    <Toggle
      pressed={active}
      onPressedChange={() => editor?.chain().focus().toggleUnderline().run()}
      aria-label={m.richTextEditor.underline}
      {...rest}
    >
      {children}
    </Toggle>
  )
}

export function Strike({ children = 'S', ...rest }: RichTextEditorFormattingProps) {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('Strike')
  const active = useEditorActive('strike')
  return (
    <Toggle
      pressed={active}
      onPressedChange={() => editor?.chain().focus().toggleStrike().run()}
      aria-label={m.richTextEditor.strike}
      {...rest}
    >
      {children}
    </Toggle>
  )
}

const BLOCK_TYPES = ['paragraph', 'h1', 'h2', 'h3'] as const
const BLOCK_TYPE_KEYS = { paragraph: 'paragraph', h1: 'heading1', h2: 'heading2', h3: 'heading3' } as const

export function BlockType() {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('BlockType')
  const current =
    useEditorState({
      editor,
      selector: (ctx) => {
        if (!ctx.editor) return 'paragraph'
        for (const level of [1, 2, 3] as const) {
          if (ctx.editor.isActive('heading', { level })) return `h${level}`
        }
        return 'paragraph'
      },
    }) ?? 'paragraph'

  const onChange = (value: string) => {
    if (!editor) return
    if (value === 'paragraph') editor.chain().focus().setParagraph().run()
    else editor.chain().focus().setHeading({ level: Number(value.slice(1)) as 1 | 2 | 3 }).run()
  }

  return (
    <Select
      aria-label={m.richTextEditor.blockStyle}
      value={current}
      onChange={(e) => onChange(e.target.value)}
    >
      {BLOCK_TYPES.map((t) => (
        <option key={t} value={t}>
          {m.richTextEditor[BLOCK_TYPE_KEYS[t]]}
        </option>
      ))}
    </Select>
  )
}

export interface RichTextEditorHistoryProps extends Omit<ButtonProps, 'variant'> {}

export function Undo({ children = '↶', ...rest }: RichTextEditorHistoryProps) {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('Undo')
  const canUndo = useEditorState({ editor, selector: (ctx) => ctx.editor?.can().undo() ?? false }) ?? false
  return (
    <Button
      type="button"
      variant="ghost"
      disabled={!canUndo}
      onClick={() => editor?.chain().focus().undo().run()}
      aria-label={m.richTextEditor.undo}
      {...rest}
    >
      {children}
    </Button>
  )
}

export function Redo({ children = '↷', ...rest }: RichTextEditorHistoryProps) {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('Redo')
  const canRedo = useEditorState({ editor, selector: (ctx) => ctx.editor?.can().redo() ?? false }) ?? false
  return (
    <Button
      type="button"
      variant="ghost"
      disabled={!canRedo}
      onClick={() => editor?.chain().focus().redo().run()}
      aria-label={m.richTextEditor.redo}
      {...rest}
    >
      {children}
    </Button>
  )
}
