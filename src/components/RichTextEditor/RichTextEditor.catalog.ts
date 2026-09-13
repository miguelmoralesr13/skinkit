import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <RichTextEditor>. Actualizar SIEMPRE que cambie RichTextEditor.tsx o
 * cualquiera de sus archivos hermanos (Formatting/Blocks/Align/Color/Link/Image/Table). */
export const richTextEditorSpec: ComponentSpec = {
  name: 'RichTextEditor',
  dataSk: 'rich-text-editor',
  category: 'Formulario',
  description:
    'Editor de texto enriquecido (WYSIWYG) tipo Word: negrita/cursiva/subrayado, títulos, listas, alineación, color, links, imágenes y tablas. Envuelve Tiptap (ProseMirror) — selección, undo/redo, pegado y serialización los resuelve Tiptap. Se importa desde el subpath `skinkit/editor` (arrastra Tiptap, peerDependencies opcionales); el core `skinkit` sigue cero-deps.',
  props: [
    { name: 'content', type: 'string', required: false, description: 'HTML inicial. No controlado.' },
    { name: 'onChange', type: '(html: string) => void', required: false, description: 'Se llama con el HTML actualizado en cada cambio.' },
    { name: 'editable', type: 'boolean', required: false, default: 'true', description: 'false = solo lectura (sigue mostrando el contenido con el estilo de Prose).' },
    { name: 'extensions', type: 'AnyExtension[]', required: false, description: 'Lista completa de extensiones Tiptap; por defecto DEFAULT_EXTENSIONS (que ya trae TODO). Usala para RECORTAR el set o sumar extensiones propias, no hace falta para que ningún botón funcione.' },
    { name: 'placeholder', type: 'string', required: false, description: 'Texto cuando el editor está vacío.' },
    { name: 'immediatelyRender', type: 'boolean', required: false, default: 'false', description: 'true renderiza el editor en el primer render (solo apps 100% cliente); false evita mismatches de hidratación en SSR.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=rich-text-editor].' },
    { name: 'toolbar', description: '<RichTextEditor.Toolbar> — es <Toolbar> por dentro, [data-part=toolbar]. Agrupá los botones que quieras adentro, en el orden que quieras.' },
    { name: 'content', description: '<RichTextEditor.Content> — [data-part=content], envuelve <Prose> + el contenido editable de Tiptap.' },
    { name: 'Bold / Italic / Underline / Strike', description: '<Toggle> de marca de texto. pressed refleja la selección actual.' },
    { name: 'BlockType', description: '<Select> Párrafo/Título 1/2/3 — cambia el tipo de bloque del nodo actual.' },
    { name: 'Undo / Redo', description: '<Button variant="ghost"> — disabled automático cuando no hay historial en esa dirección.' },
    { name: 'BulletList / OrderedList / Blockquote / CodeBlock', description: '<Toggle> de nodo (lista/cita/código).' },
    { name: 'HorizontalRule', description: '<Button> — inserción de una sola vez, no tiene estado activo.' },
    { name: 'Align', description: '<SegmentedControl> con 4 opciones (left/center/right/justify) — aplica sobre paragraph o heading, el que esté activo.' },
    { name: 'Color', description: '<input type="color"> nativo — aplica al texto seleccionado (o al próximo que se escriba).' },
    { name: 'Link', description: '<Toggle> + <PromptDialog> pidiendo la URL. Reabrir sobre un link existente lo pre-carga para editar; URL vacía lo quita.' },
    { name: 'Image', description: '<Button> + <PromptDialog> pidiendo la URL de la imagen.' },
    { name: 'Table', description: '<Button> — inserta una tabla 3×3 con fila de encabezado.' },
    { name: 'TableControls', description: '<RichTextEditor.TableControls> — [data-part=table-controls], un <Toolbar> chico con +/− fila, +/− columna y eliminar tabla. Se renderiza en null cuando el cursor no está dentro de una tabla — montalo siempre, se auto-oculta.' },
  ],
  examples: [
    {
      title: 'Básico',
      code: "import { RichTextEditor } from 'skinkit/editor'\n\n<RichTextEditor content={html} onChange={setHtml} placeholder=\"Escribí algo…\">\n  <RichTextEditor.Toolbar>\n    <RichTextEditor.Bold />\n    <RichTextEditor.Italic />\n  </RichTextEditor.Toolbar>\n  <RichTextEditor.Content />\n</RichTextEditor>",
    },
    {
      title: 'Completo — todos los botones',
      code: "import { RichTextEditor } from 'skinkit/editor'\n\n<RichTextEditor content={html} onChange={setHtml}>\n  <RichTextEditor.Toolbar>\n    <RichTextEditor.BlockType />\n    <RichTextEditor.Separator />\n    <RichTextEditor.Bold />\n    <RichTextEditor.Italic />\n    <RichTextEditor.Underline />\n    <RichTextEditor.Strike />\n    <RichTextEditor.Separator />\n    <RichTextEditor.BulletList />\n    <RichTextEditor.OrderedList />\n    <RichTextEditor.Blockquote />\n    <RichTextEditor.CodeBlock />\n    <RichTextEditor.HorizontalRule />\n    <RichTextEditor.Separator />\n    <RichTextEditor.Align />\n    <RichTextEditor.Color />\n    <RichTextEditor.Separator />\n    <RichTextEditor.Link />\n    <RichTextEditor.Image />\n    <RichTextEditor.Table />\n    <RichTextEditor.Separator />\n    <RichTextEditor.Undo />\n    <RichTextEditor.Redo />\n  </RichTextEditor.Toolbar>\n  <RichTextEditor.TableControls />\n  <RichTextEditor.Content />\n</RichTextEditor>",
    },
  ],
  usage: [
    "Importalo SIEMPRE desde 'skinkit/editor' (no desde 'skinkit'); requiere los paquetes @tiptap/* instalados (ver README).",
    'Los botones de la barra (Bold/Italic/Link/Table/etc.) son sub-componentes de esta misma familia — ver la lista de `parts` arriba, no tienen ficha propia (igual que Accordion.Item).',
    'DEFAULT_EXTENSIONS ya trae TODO (StarterKit + Placeholder + Image + Align + Color + Table) — no hace falta armar `extensions` a mano para usar cualquier botón. Usá `extensions` solo para RECORTAR el set o agregar extensiones propias.',
    'Montá <RichTextEditor.TableControls /> siempre que uses <RichTextEditor.Table />: se auto-oculta cuando el cursor no está en una tabla, no necesita lógica condicional del lado del consumidor.',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `richTextEditor` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ richTextEditor: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: [
    'El área editable es un contenedor contentEditable nativo (ProseMirror); Tiptap maneja el rol implícito y la navegación por teclado del documento.',
    'Los botones de formato son <Toggle> (aria-pressed) o <Button>; el picker de color es un <input type="color"> nativo.',
  ],
}
