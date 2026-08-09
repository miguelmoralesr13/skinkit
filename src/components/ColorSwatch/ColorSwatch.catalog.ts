import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <ColorSwatch>. Actualizar SIEMPRE que cambie ColorSwatch.tsx. */
export const colorSwatchSpec: ComponentSpec = {
  name: 'ColorSwatch',
  dataSk: 'color-swatch',
  category: 'Display',
  description:
    'Muestra un color (chip) clickeable, con estado seleccionado para grupos de selección (paletas, filtros por color). El color va por style; la forma la da el skin.',
  extends: "Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>",
  props: [
    { name: 'color', type: 'string', required: true, description: 'Color CSS a mostrar (ej. "#2f6df6", "tomato", "hsl(...)").' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Tamaño.' },
    { name: 'selected', type: 'boolean', required: false, description: 'Marca la muestra como elegida ([data-selected]).' },
  ],
  parts: [{ name: 'root', description: 'El <button> [data-sk=color-swatch]. Lleva [data-size], [data-selected]; expone --sk-swatch.' }],
  examples: [
    { title: 'Paleta', code: '{colores.map(c => <ColorSwatch key={c} color={c} selected={c === sel} onClick={() => setSel(c)} />)}' },
    { title: 'Solo muestra', code: '<ColorSwatch color="#2f6df6" />' },
  ],
  usage: [
    'El `color` es contenido (arbitrario del usuario), por eso va por style — no es un token del theme.',
    'Para una paleta seleccionable, renderizá varios y manejá el `selected` con tu estado.',
    'Es un botón: pasá aria-label si el color necesita nombre para lectores.',
  ],
  a11y: ['Es <button> con aria-pressed=selected y title=color; agregá aria-label con el nombre del color si aplica.'],
}
