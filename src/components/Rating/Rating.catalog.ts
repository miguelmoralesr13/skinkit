import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Rating>. Actualizar SIEMPRE que cambie Rating.tsx. */
export const ratingSpec: ComponentSpec = {
  name: 'Rating',
  dataSk: 'rating',
  category: 'Formulario',
  description:
    'Puntuación con estrellas (1..max). Cada estrella es un botón; el skin las pinta llenas/vacías. Interactivo o de solo lectura. La forma (glyph, color) la da el skin.',
  extends: "Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>",
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de las estrellas llenas (del theme).' },
    { name: 'value', type: 'number', required: false, default: '0', description: 'Valor actual (0..max).' },
    { name: 'max', type: 'number', required: false, default: '5', description: 'Cantidad de estrellas.' },
    { name: 'onChange', type: '(value: number) => void', required: false, description: 'Se invoca con el valor elegido.' },
    { name: 'readOnly', type: 'boolean', required: false, description: 'Solo muestra el valor; no se puede cambiar.' },
    { name: 'label', type: 'string', required: false, default: "'Puntuación'", description: 'aria-label del grupo.' },
  ],
  parts: [
    { name: 'root', description: 'role=radiogroup. Lleva [data-readonly] si aplica.' },
    { name: 'star', description: 'Cada estrella (botón role=radio). Lleva [data-filled] si i <= value.' },
  ],
  examples: [
    { title: 'Interactivo', code: '<Rating value={score} onChange={setScore} />' },
    { title: 'Solo lectura', code: '<Rating value={4} readOnly />' },
  ],
  usage: [
    'Modo controlado: guardá value y actualizalo en onChange.',
    'readOnly para mostrar una calificación ya dada (reseñas).',
    'El glyph (★) es contenido; el color lleno/vacío lo pone el skin vía [data-filled].',
  ],
  a11y: ['role=radiogroup con estrellas role=radio y aria-checked; cada una con aria-label "n de max".'],
}
