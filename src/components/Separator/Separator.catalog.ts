import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Separator>. Actualizar SIEMPRE que cambie Separator.tsx. */
export const separatorSpec: ComponentSpec = {
  name: 'Separator',
  dataSk: 'separator',
  category: 'Display',
  description:
    'Línea divisoria entre secciones o ítems, horizontal o vertical. La forma (grosor, color, márgenes) la da el skin; el componente aporta orientación y semántica ARIA.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      required: false,
      default: "'horizontal'",
      description:
        'Dirección de la línea. vertical requiere que el contenedor le dé altura (ej. dentro de un flex row).',
    },
    {
      name: 'decorative',
      type: 'boolean',
      required: false,
      default: 'false',
      description:
        'true = solo visual (role="none", se oculta a lectores). false = separa grupos semánticos (role="separator").',
    },
  ],
  parts: [{ name: 'root', description: 'La línea. Lleva [data-orientation].' }],
  examples: [
    { title: 'Horizontal', code: '<Separator />' },
    { title: 'Vertical', code: '<div style={{ display: "flex", height: 24 }}>\n  <span>A</span>\n  <Separator orientation="vertical" />\n  <span>B</span>\n</div>' },
    { title: 'Decorativo', code: '<Separator decorative />' },
  ],
  usage: [
    'Usá `decorative` cuando la línea es puro adorno; dejá el default cuando separa grupos con significado (mejora la accesibilidad).',
    'La orientación vertical necesita altura del contenedor: no tiene alto propio.',
    'No metas contenido adentro: es una línea, no un contenedor.',
  ],
  a11y: [
    'No-decorativo expone role="separator" (y aria-orientation="vertical" cuando aplica).',
    'Decorativo usa role="none" para no ensuciar el árbol de accesibilidad.',
  ],
}
