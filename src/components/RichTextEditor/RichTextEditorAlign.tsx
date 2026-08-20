import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-react'
import { useEditorState } from '@tiptap/react'
import { SegmentedControl, type SegmentedControlProps } from '../SegmentedControl'
import { useRichTextEditorCtx } from './RichTextEditor'

// .Align — reusa <SegmentedControl> (selector de UNA opción entre pocas, exactamente la
// semántica de alineación de texto) en vez de inventar 4 botones toggle independientes.

const ALIGNMENTS = [
  { value: 'left', label: <AlignLeft size={16} /> },
  { value: 'center', label: <AlignCenter size={16} /> },
  { value: 'right', label: <AlignRight size={16} /> },
  { value: 'justify', label: <AlignJustify size={16} /> },
]

export interface RichTextEditorAlignProps extends Omit<SegmentedControlProps, 'value' | 'onValueChange'> {}

export function Align({ label = 'Alineación', ...rest }: RichTextEditorAlignProps) {
  const { editor } = useRichTextEditorCtx('Align')
  const current =
    useEditorState({
      editor,
      // El nodo activo puede ser paragraph O heading (TextAlign está configurado para ambos,
      // ver buildExtensions en RichTextEditor.tsx) — se chequean los dos, gana el que responda.
      selector: (ctx) => {
        if (!ctx.editor) return 'left'
        const p = ctx.editor.getAttributes('paragraph').textAlign as string | undefined
        const h = ctx.editor.getAttributes('heading').textAlign as string | undefined
        return p ?? h ?? 'left'
      },
    }) ?? 'left'

  return (
    <SegmentedControl
      label={label}
      value={current}
      onValueChange={(value) => editor?.chain().focus().setTextAlign(value).run()}
      {...rest}
    >
      {ALIGNMENTS.map((a) => (
        <SegmentedControl.Item key={a.value} value={a.value} aria-label={a.value}>
          {a.label}
        </SegmentedControl.Item>
      ))}
    </SegmentedControl>
  )
}
