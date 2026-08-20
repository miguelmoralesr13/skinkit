import { useEditorState } from '@tiptap/react'
import { Toggle } from '../Toggle'
import { Button, type ButtonProps } from '../Button'
import { Select } from '../Select'
import {
  useRichTextEditorCtx,
  useEditorActive,
  type RichTextEditorToggleButtonProps,
} from './RichTextEditor'

// Bold/Italic/Underline/Strike/BlockType/Undo/Redo — ver el comentario en RichTextEditor.tsx
// sobre por qué esta familia se reparte en varios archivos por tema. Cada botón es un export
// con nombre; el barrel (index.ts) los cuelga como RichTextEditor.X vía Object.assign — TS no
// infiere una propiedad estática asignada en OTRO archivo del que se declaró la función, así
// que el ensamblado final vive en un solo lugar (index.ts), no acá.

export type RichTextEditorFormattingProps = RichTextEditorToggleButtonProps

export function Bold({ children = 'B', ...rest }: RichTextEditorFormattingProps) {
  const { editor } = useRichTextEditorCtx('Bold')
  const active = useEditorActive('bold')
  return (
    <Toggle
      pressed={active}
      onPressedChange={() => editor?.chain().focus().toggleBold().run()}
      aria-label="Negrita"
      {...rest}
    >
      {children}
    </Toggle>
  )
}

export function Italic({ children = 'I', ...rest }: RichTextEditorFormattingProps) {
  const { editor } = useRichTextEditorCtx('Italic')
  const active = useEditorActive('italic')
  return (
    <Toggle
      pressed={active}
      onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
      aria-label="Cursiva"
      {...rest}
    >
      {children}
    </Toggle>
  )
}

export function Underline({ children = 'U', ...rest }: RichTextEditorFormattingProps) {
  const { editor } = useRichTextEditorCtx('Underline')
  const active = useEditorActive('underline')
  return (
    <Toggle
      pressed={active}
      onPressedChange={() => editor?.chain().focus().toggleUnderline().run()}
      aria-label="Subrayado"
      {...rest}
    >
      {children}
    </Toggle>
  )
}

export function Strike({ children = 'S', ...rest }: RichTextEditorFormattingProps) {
  const { editor } = useRichTextEditorCtx('Strike')
  const active = useEditorActive('strike')
  return (
    <Toggle
      pressed={active}
      onPressedChange={() => editor?.chain().focus().toggleStrike().run()}
      aria-label="Tachado"
      {...rest}
    >
      {children}
    </Toggle>
  )
}

const BLOCK_TYPES = [
  { value: 'paragraph', label: 'Párrafo' },
  { value: 'h1', label: 'Título 1' },
  { value: 'h2', label: 'Título 2' },
  { value: 'h3', label: 'Título 3' },
]

export function BlockType() {
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
      aria-label="Estilo de bloque"
      value={current}
      onChange={(e) => onChange(e.target.value)}
    >
      {BLOCK_TYPES.map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </Select>
  )
}

export interface RichTextEditorHistoryProps extends Omit<ButtonProps, 'variant'> {}

export function Undo({ children = '↶', ...rest }: RichTextEditorHistoryProps) {
  const { editor } = useRichTextEditorCtx('Undo')
  const canUndo = useEditorState({ editor, selector: (ctx) => ctx.editor?.can().undo() ?? false }) ?? false
  return (
    <Button
      type="button"
      variant="ghost"
      disabled={!canUndo}
      onClick={() => editor?.chain().focus().undo().run()}
      aria-label="Deshacer"
      {...rest}
    >
      {children}
    </Button>
  )
}

export function Redo({ children = '↷', ...rest }: RichTextEditorHistoryProps) {
  const { editor } = useRichTextEditorCtx('Redo')
  const canRedo = useEditorState({ editor, selector: (ctx) => ctx.editor?.can().redo() ?? false }) ?? false
  return (
    <Button
      type="button"
      variant="ghost"
      disabled={!canRedo}
      onClick={() => editor?.chain().focus().redo().run()}
      aria-label="Rehacer"
      {...rest}
    >
      {children}
    </Button>
  )
}
