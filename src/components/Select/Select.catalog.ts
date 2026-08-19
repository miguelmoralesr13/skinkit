import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Select>. Actualizar SIEMPRE que cambie Select.tsx. */
export const selectSpec: ComponentSpec = {
  name: 'Select',
  dataSk: 'select',
  category: 'Formulario',
  description:
    'Selector de una opción de una lista, sobre un <select> nativo (accesible, teclado incluido). Las opciones van como children (<option>). Headless: la forma la da el CSS.',
  extends: 'SelectHTMLAttributes<HTMLSelectElement>',
  props: [
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta del campo (htmlFor cableado).' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Texto de ayuda; en error se pinta con color de error.' },
    { name: 'error', type: 'boolean', required: false, default: 'false', description: 'Marca el campo como inválido ([data-error] + aria-invalid).' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Las <option> (y <optgroup>) del select.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor. Lleva [data-error].' },
    { name: 'label', description: 'La etiqueta.' },
    { name: 'field', description: 'El <select> nativo.' },
    { name: 'helper', description: 'Texto de ayuda / error.' },
  ],
  examples: [
    {
      title: 'Con opciones',
      code: '<Select label="País" defaultValue="mx">\n  <option value="mx">México</option>\n  <option value="ar">Argentina</option>\n</Select>',
    },
    { title: 'En error', code: '<Select label="Plan" error helper="Elegí un plan.">\n  <option value="">—</option>\n</Select>' },
  ],
  usage: [
    'Para elegir UNA opción de una lista media/larga. Para 2–5 opciones visibles, preferí RadioGroup.',
    'Es un <select> nativo: value/defaultValue/onChange/disabled/multiple pasan directo.',
    'Para un placeholder, poné una <option value="" disabled> como primera opción.',
  ],
  a11y: [
    'label ↔ select cableado con htmlFor/id (autogenerado si no pasás id).',
    'error setea aria-invalid; helper se enlaza con aria-describedby.',
  ],
}
