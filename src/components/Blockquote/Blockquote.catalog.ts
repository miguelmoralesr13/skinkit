import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Blockquote>. Actualizar SIEMPRE que cambie Blockquote.tsx. */
export const blockquoteSpec: ComponentSpec = {
  name: 'Blockquote',
  dataSk: 'blockquote',
  category: 'Display',
  description:
    'Cita en bloque con autor/fuente opcional. Semántica <figure>/<blockquote>/<figcaption>. La forma (barra lateral, comillas, tipografía) la da el skin.',
  extends: 'HTMLAttributes<HTMLElement>',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de acento (del theme).' },    { name: 'author', type: 'ReactNode', required: false, description: 'Autor o fuente de la cita.' },
    { name: 'cite', type: 'string', required: false, description: 'URL de la fuente (atributo cite del <blockquote>).' },
    { name: 'children', type: 'ReactNode', required: false, description: 'El texto de la cita.' },
  ],
  parts: [
    { name: 'root', description: 'El <figure> [data-sk=blockquote].' },
    { name: 'quote', description: 'La cita (<blockquote>).' },
    { name: 'author', description: 'Autor/fuente (<figcaption>, opcional).' },
  ],
  examples: [
    { title: 'Con autor', code: '<Blockquote author="Dieter Rams">Menos, pero mejor.</Blockquote>' },
    { title: 'Solo cita', code: '<Blockquote>El color sale del theme; la forma, del skin.</Blockquote>' },
  ],
  usage: [
    'Para destacar una cita textual con su fuente.',
    'Pasá la URL de origen en `cite` (semántico, no visible).',
    'Las comillas decorativas y la barra lateral las pone el skin.',
  ],
  a11y: ['Usa <figure>/<blockquote>/<figcaption> nativos.'],
}
