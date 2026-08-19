import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Code>. Actualizar SIEMPRE que cambie Code.tsx. */
export const codeSpec: ComponentSpec = {
  name: 'Code',
  dataSk: 'code',
  category: 'Display',
  description:
    'Muestra código: inline (<code>) o en bloque (<pre>). En bloque puede traer un botón de copiar (copia el texto del propio bloque). No resalta sintaxis. La forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLElement>',
  props: [
    { name: 'block', type: 'boolean', required: false, description: 'Bloque multilínea (<pre>) en vez de inline (<code>).' },
    { name: 'copyable', type: 'boolean', required: false, description: 'En bloque: muestra un botón de copiar.' },
    { name: 'lang', type: 'string', required: false, description: 'Resalta sintaxis (JS/TS por defecto; "bash"/"py"/"yaml" para comentarios #). Solo en bloque con children string. Los colores salen del theme (var(--sk-code-*)).' },
  ],
  parts: [
    { name: 'root', description: 'El <code> (inline) o <pre> (bloque) [data-sk=code]. Lleva [data-block] en bloque.' },
    { name: 'content', description: 'El <code> dentro del <pre> (solo en bloque).' },
    { name: 'copy', description: 'Botón de copiar (si copyable). Lleva [data-copied] tras copiar.' },
  ],
  examples: [
    { title: 'Inline', code: '<p>Corré <Code>bun dev</Code> para empezar.</p>' },
    { title: 'Bloque resaltado + copiar', code: '<Code block lang="ts" copyable>{`const x = 1`}</Code>' },
  ],
  usage: [
    'Inline (default) para un comando o identificador dentro de texto; `block` para varias líneas.',
    'Pasá `lang` para resaltar sintaxis (highlighter propio, liviano; sin dependencias).',
    'Los colores de sintaxis son tokens del theme (--sk-code-*): cambian con el theme activo, como los "temas" de un editor.',
    'copyable solo aplica en bloque; copia el texto real (no los spans de color).',
  ],
  a11y: ['El botón de copiar cambia su aria-label a "Copiado" tras copiar.'],
}
