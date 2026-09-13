import { useEditorState } from '@tiptap/react'
import { Button, type ButtonProps } from '../Button'
import { Toolbar, type ToolbarProps } from '../Toolbar'
import { cx } from '../../lib/cx'
import { useRichTextEditorCtx } from './RichTextEditor'
import { useSkinkitMessages } from '../../i18n/context'

// .Table — acción de una sola vez: inserta una tabla 3×3 con encabezado. Una vez el cursor está
// DENTRO de una tabla, .TableControls (un <Toolbar> chico, contextual) aparece para editarla —
// se auto-oculta si el cursor no está sobre una tabla, en vez de deshabilitarse a la vista.

export type RichTextEditorTableProps = Omit<ButtonProps, 'variant'>

export function Table({ children = '⊞', ...rest }: RichTextEditorTableProps) {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('Table')
  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={m.richTextEditor.insertTable}
      onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      {...rest}
    >
      {children}
    </Button>
  )
}

export interface RichTextEditorTableControlsProps extends Omit<ToolbarProps, 'label'> {}

export function TableControls({ className, ...rest }: RichTextEditorTableControlsProps) {
  const m = useSkinkitMessages()
  const { editor } = useRichTextEditorCtx('TableControls')
  const isInTable = useEditorState({ editor, selector: (ctx) => ctx.editor?.isActive('table') ?? false }) ?? false

  if (!isInTable) return null

  return (
    <Toolbar
      data-part="table-controls"
      label={m.richTextEditor.tableControls}
      className={cx('sk-rich-text-editor__table-controls', className)}
      {...rest}
    >
      <Button type="button" variant="ghost" size="sm" disabled={!editor?.can().addRowAfter()} onClick={() => editor?.chain().focus().addRowAfter().run()}>
        {m.richTextEditor.addRow}
      </Button>
      <Button type="button" variant="ghost" size="sm" disabled={!editor?.can().deleteRow()} onClick={() => editor?.chain().focus().deleteRow().run()}>
        {m.richTextEditor.removeRow}
      </Button>
      <Toolbar.Separator />
      <Button type="button" variant="ghost" size="sm" disabled={!editor?.can().addColumnAfter()} onClick={() => editor?.chain().focus().addColumnAfter().run()}>
        {m.richTextEditor.addColumn}
      </Button>
      <Button type="button" variant="ghost" size="sm" disabled={!editor?.can().deleteColumn()} onClick={() => editor?.chain().focus().deleteColumn().run()}>
        {m.richTextEditor.removeColumn}
      </Button>
      <Toolbar.Separator />
      <Button type="button" variant="ghost" size="sm" tone="danger" disabled={!editor?.can().deleteTable()} onClick={() => editor?.chain().focus().deleteTable().run()}>
        {m.richTextEditor.deleteTable}
      </Button>
    </Toolbar>
  )
}
