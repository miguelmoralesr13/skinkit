import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <ScrollArea>. Actualizar SIEMPRE que cambie ScrollArea.tsx. */
export const scrollAreaSpec: ComponentSpec = {
  name: 'ScrollArea',
  dataSk: 'scroll-area',
  category: 'Display',
  description:
    'Región con scroll y barra estilizada por el skin (scrollbar-color / ::-webkit-scrollbar), manteniendo el scroll nativo (rueda, teclado, touch). Solo cambia el look de la barra.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'orientation', type: "'vertical' | 'horizontal' | 'both'", required: false, default: "'vertical'", description: 'Eje(s) con scroll.' },
    { name: 'maxHeight', type: 'number | string', required: false, description: 'Alto máximo (número = px) para el scroll vertical.' },
  ],
  parts: [{ name: 'root', description: 'Viewport con overflow [data-sk=scroll-area]. Lleva [data-orientation].' }],
  examples: [
    { title: 'Lista larga', code: '<ScrollArea maxHeight={240}>\n  {items.map(i => <div key={i}>{i}</div>)}\n</ScrollArea>' },
    { title: 'Horizontal', code: '<ScrollArea orientation="horizontal"> … </ScrollArea>' },
  ],
  usage: [
    'Para contener contenido largo con una barra consistente entre navegadores.',
    'Vertical necesita `maxHeight` para tener algo que scrollear; horizontal, contenido más ancho que el viewport.',
    'Es scroll nativo estilizado: no reimplementa el scroll (no rompe accesibilidad ni touch).',
  ],
}
