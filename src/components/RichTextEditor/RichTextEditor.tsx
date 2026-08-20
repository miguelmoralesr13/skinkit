import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useEditor, useEditorState, EditorContent, type Editor, type AnyExtension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import ImageExtension from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle, Color } from '@tiptap/extension-text-style'
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import { cx } from '../../lib/cx'
import { Toolbar, type ToolbarProps } from '../Toolbar'
import { Prose } from '../Prose'
import type { ToggleProps } from '../Toggle'

/** Props compartidas por todos los botones de marca/nodo tipo toggle (Bold, BulletList, etc.)
 * — un <Toggle> sin `pressed`/`onPressedChange`, porque esos los calcula cada botón contra el
 * estado del editor. Definido una sola vez acá para que Formatting.tsx y Blocks.tsx no
 * dupliquen el mismo tipo con nombres distintos. */
export type RichTextEditorToggleButtonProps = Omit<ToggleProps, 'pressed' | 'onPressedChange'>

// Familia compuesta con ~20 sub-componentes, repartidos en varios archivos hermanos
// (RichTextEditorFormatting/Blocks/Align/Color/Link/Image/Table.tsx) — Dialog/Accordion los
// concentran en un solo archivo porque tienen ≤5 partes; acá se divide por tema para que cada
// archivo se quede chico y legible. Cada archivo hermano exporta sus botones CON NOMBRE (no los
// cuelga como `RichTextEditor.X` ahí mismo — TS no infiere una propiedad estática asignada en
// otro archivo del que se declaró la función); el ensamblado final (`RichTextEditor.Bold`, etc.
// vía `Object.assign`) vive en el barrel, `index.ts`.

interface RichTextEditorCtx {
  editor: Editor | null
}
const RichTextEditorContext = createContext<RichTextEditorCtx | null>(null)

export function useRichTextEditorCtx(part: string): RichTextEditorCtx {
  const ctx = useContext(RichTextEditorContext)
  if (!ctx) throw new Error(`skinkit: <RichTextEditor.${part}> debe usarse dentro de <RichTextEditor>`)
  return ctx
}

/**
 * Lee un slice reactivo del estado del editor (¿está activo este mark/nodo en la selección
 * actual?). Usa `useEditorState` de Tiptap en vez de leer `editor.isActive(...)` directo en el
 * render — así el botón se re-renderiza exactamente cuando cambia la selección, ni más ni menos.
 */
export function useEditorActive(command: string, attributes?: Record<string, unknown>): boolean {
  const { editor } = useRichTextEditorCtx('useEditorActive')
  return (
    useEditorState({
      editor,
      selector: (ctx) => (ctx.editor ? ctx.editor.isActive(command, attributes) : false),
    }) ?? false
  )
}

function buildExtensions(placeholder?: string): AnyExtension[] {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      link: { openOnClick: false, autolink: true },
    }),
    Placeholder.configure({ placeholder: placeholder ?? '' }),
    ImageExtension,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TextStyle,
    Color,
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
  ]
}

/** Set por defecto: TODO lo que trae esta familia — StarterKit
 * (bold/italic/underline/strike/headings/listas/blockquote/code block/hr/undo-redo/link) +
 * Placeholder + Image + TextAlign + Color (vía TextStyle) + Table. "Completo" (pedido del
 * usuario) significa que el default trae TODO listo para usar, no que haya que armar la lista
 * de extensiones a mano por botón — la prop `extensions` sigue disponible para RECORTAR o
 * reemplazar el set, no es un requisito para sumar funcionalidad. Exportado para que
 * un consumidor pueda partir de acá y agregar/sacar extensiones (`extensions` prop). */
export const DEFAULT_EXTENSIONS: AnyExtension[] = buildExtensions()

export interface RichTextEditorProps {
  /** HTML inicial. No controlado (como Editable): el editor maneja su estado interno; usá
   * `onChange` si necesitás leer el HTML actualizado. */
  content?: string
  onChange?: (html: string) => void
  editable?: boolean
  /** Lista completa de extensiones Tiptap. Si se omite, usa DEFAULT_EXTENSIONS (o el set con
   * `placeholder` si se pasó esa prop). Pasala para agregar Link/Image/Table/Align/Color o
   * cualquier extensión propia — los sub-componentes de esta familia asumen que sus marks/nodos
   * están registrados; si el botón correspondiente no hace nada, revisá que su extensión esté acá. */
  extensions?: AnyExtension[]
  placeholder?: string
  /** false (default) evita mismatches de hidratación en SSR (Next/Remix/etc) — cuesta un flash
   * mínimo en apps 100% cliente. Ver la guía de Tiptap v3 sobre `immediatelyRender`. */
  immediatelyRender?: boolean
  className?: string
  children: ReactNode
}

/**
 * RichTextEditor headless, compuesto — envuelve Tiptap (ProseMirror): selección, undo/redo,
 * paste sanitization y serialización los resuelve Tiptap; acá sólo se aporta estructura, el
 * contrato data-sk/data-part, y la integración con el resto de skinkit (el toolbar reusa
 * <Toolbar>, los botones de marca reusan <Toggle>, el contenido se envuelve en <Prose> para
 * heredar toda su tipografía sin CSS nuevo).
 *
 * Vive en el subpath `skinkit/editor` (arrastra Tiptap — peerDependencies opcionales, igual que
 * DynamicForm en `skinkit/form`) — no se exporta desde el core `skinkit`.
 *
 * Contrato:
 *   [data-sk="rich-text-editor"]      raíz
 *   [data-part="toolbar"]             <RichTextEditor.Toolbar> (= <Toolbar>)
 *   [data-part="content"]             <RichTextEditor.Content> (envuelve <Prose>+EditorContent)
 */
export function RichTextEditor({
  content,
  onChange,
  editable = true,
  extensions,
  placeholder,
  immediatelyRender = false,
  className,
  children,
}: RichTextEditorProps) {
  const resolvedExtensions = useMemo(
    () => extensions ?? buildExtensions(placeholder),
    [extensions, placeholder],
  )

  // El overload de useEditor no puede reflejar un boolean dinámico para immediatelyRender (una
  // firma exige el literal `false`, la otra cualquier otra cosa) — caemos siempre en `Editor |
  // null`, que es el tipo real en runtime para cualquier valor de immediatelyRender.
  const editor = useEditor({
    extensions: resolvedExtensions,
    content,
    editable,
    immediatelyRender,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  }) as Editor | null

  return (
    <div data-sk="rich-text-editor" className={cx('sk-rich-text-editor', className)}>
      <RichTextEditorContext.Provider value={{ editor }}>{children}</RichTextEditorContext.Provider>
    </div>
  )
}

export interface RichTextEditorToolbarProps extends ToolbarProps {}

function RichTextEditorToolbar({ className, ...rest }: RichTextEditorToolbarProps) {
  return <Toolbar data-part="toolbar" className={cx('sk-rich-text-editor__toolbar', className)} {...rest} />
}

export interface RichTextEditorContentProps {
  className?: string
}

function RichTextEditorContent({ className }: RichTextEditorContentProps) {
  const { editor } = useRichTextEditorCtx('Content')
  return (
    <div data-part="content">
      <Prose className={cx('sk-rich-text-editor__prose', className)}>
        <EditorContent editor={editor} />
      </Prose>
    </div>
  )
}

RichTextEditor.Toolbar = RichTextEditorToolbar
RichTextEditor.Content = RichTextEditorContent
RichTextEditor.Separator = Toolbar.Separator
