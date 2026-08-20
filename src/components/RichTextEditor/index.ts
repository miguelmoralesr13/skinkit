import { RichTextEditor as RichTextEditorBase } from './RichTextEditor'
import { Bold, Italic, Underline, Strike, BlockType, Undo, Redo } from './RichTextEditorFormatting'
import { BulletList, OrderedList, Blockquote, CodeBlock, HorizontalRule } from './RichTextEditorBlocks'
import { Link } from './RichTextEditorLink'
import { Image } from './RichTextEditorImage'
import { Align } from './RichTextEditorAlign'
import { Color } from './RichTextEditorColor'
import { Table, TableControls } from './RichTextEditorTable'

// RichTextEditor.Toolbar/.Content/.Separator ya vienen colgados como propiedades estáticas
// DESDE RichTextEditor.tsx (mismo archivo → TS infiere el tipo solo). Todo lo demás (Bold,
// BulletList, etc.) vive en archivos hermanos — TS NO infiere una propiedad estática asignada
// en OTRO archivo del que se declaró la función, así que acá se ensamblan con Object.assign
// (que sí tipa bien la fusión). Agregar un botón nuevo en un batch futuro = agregarlo a este
// objeto, no volver a los archivos ya escritos.
export const RichTextEditor = Object.assign(RichTextEditorBase, {
  Bold,
  Italic,
  Underline,
  Strike,
  BlockType,
  Undo,
  Redo,
  BulletList,
  OrderedList,
  Blockquote,
  CodeBlock,
  HorizontalRule,
  Link,
  Image,
  Align,
  Color,
  Table,
  TableControls,
})

export type {
  RichTextEditorProps,
  RichTextEditorToolbarProps,
  RichTextEditorContentProps,
  RichTextEditorToggleButtonProps,
} from './RichTextEditor'
export { DEFAULT_EXTENSIONS, useEditorActive } from './RichTextEditor'
export type { RichTextEditorFormattingProps, RichTextEditorHistoryProps } from './RichTextEditorFormatting'
export type { RichTextEditorBlockToggleProps, RichTextEditorHorizontalRuleProps } from './RichTextEditorBlocks'
export type { RichTextEditorLinkProps } from './RichTextEditorLink'
export type { RichTextEditorImageProps } from './RichTextEditorImage'
export type { RichTextEditorAlignProps } from './RichTextEditorAlign'
export type { RichTextEditorColorProps } from './RichTextEditorColor'
export type { RichTextEditorTableProps, RichTextEditorTableControlsProps } from './RichTextEditorTable'
// El spec NO se re-exporta acá; se registra en src/catalog/index.ts.
