import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Xxx>. Actualizar SIEMPRE que cambie Xxx.tsx. */
export const xxxSpec: ComponentSpec = {
  name: 'Xxx',
  dataSk: 'xxx',
  category: 'Display', // Acción | Formulario | Navegación | Feedback | Display
  description: 'Qué es y para qué sirve, en una o dos frases.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    {
      name: 'variant',
      type: "'a' | 'b'",
      required: false,
      default: "'a'",
      description: 'Qué controla esta prop y cuándo usar cada valor.',
    },
    // …TODAS las props propias…
  ],
  parts: [
    { name: 'root', description: 'El contenedor. Lleva [data-variant].' },
    { name: 'label', description: 'Texto.' },
  ],
  examples: [{ title: 'Básico', code: '<Xxx>Hola</Xxx>' }],
  usage: [
    'Cuándo usarlo.',
    'Qué hacer.',
    'Qué NO hacer.',
  ],
  a11y: [
    // notas de accesibilidad si aplican
  ],
}
