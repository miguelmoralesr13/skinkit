import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Rating>. Actualizar SIEMPRE que cambie Rating.tsx. */
export const ratingSpec: ComponentSpec = {
  name: 'Rating',
  dataSk: 'rating',
  category: 'Formulario',
  description:
    'Puntuación con estrellas (1..max), ícono Star de lucide-react. Cada estrella es un botón: llena (fill=currentColor) si i <= value, contorno si no. Interactivo o de solo lectura. El color lo da el CSS.',
  extends: "Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>",
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de las estrellas llenas (del theme).' },
    { name: 'value', type: 'number', required: false, default: '0', description: 'Valor actual (0..max).' },
    { name: 'max', type: 'number', required: false, default: '5', description: 'Cantidad de estrellas.' },
    { name: 'onChange', type: '(value: number) => void', required: false, description: 'Se invoca con el valor elegido.' },
    { name: 'readOnly', type: 'boolean', required: false, description: 'Solo muestra el valor; no se puede cambiar.' },
    { name: 'label', type: 'string', required: false, default: "'Puntuación'", description: 'aria-label del grupo.' },
    { name: 'classNames', type: '{ star?: string }', required: false, description: 'Clases adicionales por sub-parte (star). Aditivo: nunca reemplaza la clase base. La misma clase aplica a todas las estrellas.' },
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
    'El ícono es Star de lucide-react; el componente resuelve fill según [data-filled], el color (currentColor) lo pone el CSS.',
  ],
  a11y: ['role=radiogroup con estrellas role=radio y aria-checked; cada una con aria-label "n de max".'],
}
