import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <ComparisonSlider>. Actualizar SIEMPRE que cambie ComparisonSlider.tsx. */
export const comparisonSliderSpec: ComponentSpec = {
  name: 'ComparisonSlider',
  dataSk: 'comparison',
  category: 'Display',
  description:
    'Compara dos capas (antes/después) con un divisor arrastrable que revela una sobre la otra. Drag con mouse/touch o flechas. Ideal para imágenes (edición, tema claro/oscuro). La forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'after', type: 'ReactNode', required: true, description: 'Capa de fondo (después).' },
    { name: 'before', type: 'ReactNode', required: true, description: 'Capa que se revela (antes), recortada por el divisor.' },
    { name: 'defaultPosition', type: 'number', required: false, default: '50', description: 'Posición inicial del divisor (0–100).' },
    { name: 'label', type: 'string', required: false, default: "'Comparar'", description: 'aria-label del divisor.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=comparison]. Expone --sk-comparison-pos (0–100).' },
    { name: 'after', description: 'Capa de fondo (después).' },
    { name: 'before', description: 'Capa recortada (antes).' },
    { name: 'handle', description: 'El divisor (role=slider, arrastrable y focuseable).' },
  ],
  examples: [
    {
      title: 'Antes/después',
      code: '<ComparisonSlider\n  before={<img src="/antes.jpg" alt="Antes" />}\n  after={<img src="/despues.jpg" alt="Después" />}\n/>',
    },
  ],
  usage: [
    'Poné las dos imágenes/capas del MISMO tamaño; el divisor recorta la de "before".',
    'Arrastrá el divisor con el mouse/touch; enfocado, las flechas lo mueven.',
    'Para dos paneles de contenido redimensionables (no una comparación), usá Resizable.',
  ],
  a11y: ['El divisor es role=slider con aria-valuenow/min/max y teclado (flechas, Home/End).'],
}
