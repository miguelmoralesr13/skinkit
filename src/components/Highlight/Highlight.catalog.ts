import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Highlight>. Actualizar SIEMPRE que cambie Highlight.tsx. */
export const highlightSpec: ComponentSpec = {
  name: 'Highlight',
  dataSk: 'highlight',
  category: 'Display',
  description:
    'Resalta las coincidencias de una búsqueda dentro de un texto (envuelve cada match en <mark>). Case-insensitive; acepta uno o varios términos. El color lo da el skin.',
  extends: 'HTMLAttributes<HTMLSpanElement>',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de acento (del theme).' },    { name: 'text', type: 'string', required: true, description: 'El texto completo.' },
    { name: 'query', type: 'string | string[]', required: true, description: 'Subcadena(s) a resaltar.' },
  ],
  parts: [
    { name: 'root', description: 'El <span> [data-sk=highlight].' },
    { name: 'match', description: 'Cada coincidencia (<mark>).' },
  ],
  examples: [
    { title: 'Resultado', code: '<Highlight text="Componentes headless de React" query="head" />' },
    { title: 'Varios términos', code: '<Highlight text={fila.nombre} query={["react", "css"]} />' },
  ],
  usage: [
    'Ideal en resultados de búsqueda o filtros: pasá el término tipeado como `query`.',
    'El match es case-insensitive; los caracteres especiales de regex se escapan solos.',
    'Si query está vacío, muestra el texto tal cual.',
  ],
}
